import * as dbService from "../../DB/database.repository.js";
import {
  BadRequestException,
  ConflictException,
  NotfoundException,
} from "../../Utils/response/error.response.js";

import UserModel from "../../DB/Models/user.model.js";
import { successResponse } from "../../Utils/response/success.response.js";
import { generateHash } from "../../Utils/security/hash.securtiy.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import { compareHash } from "../../Utils/security/hash.securtiy.js";
import { CLIENT_ID, SALAT_ROUNDS } from "../../../Config/config.service.js";
import { decrypt, encrypt } from "../../Utils/security/encryption.security.js";
import { getNewLoginCredentials } from "../../Utils/tokens/token.js";
import { OAuth2Client } from "google-auth-library";
import { ProviderEnum } from "../../Utils/enums/user.enum.js";
import { emailSubect } from "../../Utils/enums/email.enum.js";
import { sendEmail } from "../../Utils/email/nodemailer.emai.js";
import { emailEvent } from "../../Utils/events/email.events.js";
import { generateOTP } from "../../Utils/security/otp.security.js";
import TokenModel from "../../DB/Models/token.model.js";
import { LogOutTypeEnum } from "../../Utils/enums/user.enum.js";

export const signup = async (req, res) => {
  const { email, password, username, phone, gender, role, DOB } = req.body;

  // Check if email already exists
  const user = await dbService.findOne(UserModel, { email });

  if (user) {
    ConflictException("User already exists");
  }
  // hash password ..Perfectto
  const hashedPassword = await generateHash({
    plaintext: password,
    saltRounds: Number(SALAT_ROUNDS),
    algorithm: HashEnum.Argon2,
  });
  const encryptedPassword = await encrypt(phone);
  const otp = generateOTP();

  const hashedOtp = await generateHash({
    plaintext: String(otp),
    algorithm: HashEnum.Argon2,
  });

  // Create new user
  const newUser = await dbService.create(UserModel, [
    {
      email,
      password: hashedPassword,
      username,
      phone: encryptedPassword,
      gender,
      role,
      confirmEmailOTP: hashedOtp,
      DOB,
    },
  ]);

  // await sendEmail

  emailEvent.emit("confirmEmail", {
    to: email,
    firstName: username,
    otp,
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: newUser,
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await dbService.findOneAndUpdate(
    UserModel,
    {
      email,
      confirmEmail: { $exists: true },
    },
    { $unset: { changeCredentialTime: true } },
  );

  if (!user) {
    throw NotfoundException("Invalid email or password");
  }
  const isPasswordValid = await compareHash({
    plaintext: password,
    ciphertext: user.password,
    algorithm: HashEnum.Argon2,
  });
  if (!isPasswordValid)
    throw BadRequestException({ message: "invalid email or password" });

  if (user.phone) user.phone = decrypt(user.phone);

  const token = await getNewLoginCredentials(user);
  return successResponse({
    res,
    statusCode: 200,
    message: "Login successful",
    data: {
      token,
    },
  });
};

export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;

  // 1. Find user
  const user = await dbService.findOne(UserModel, {
    email,
    confirmEmail: { $exists: false },
    confirmEmailOTP: { $exists: true },
  });

  if (!user) {
    throw BadRequestException({
      message: "Invalid account or email already confirmed",
    });
  }

  // 2. Verify OTP
  const isOtpValid = await compareHash({
    plaintext: String(otp),
    ciphertext: user.confirmEmailOTP,
    algorithm: HashEnum.Argon2,
  });

  if (!isOtpValid) {
    throw BadRequestException({
      message: "Invalid OTP",
    });
  }

  // 3. Confirm email
  await dbService.updateOne(
    UserModel,
    { _id: user._id },
    {
      $set: {
        confirmEmail: new Date(),
      },
      $unset: {
        confirmEmailOTP: "",
      },
    },
  );

  // 4. Success response
  return successResponse({
    res,
    statusCode: 200,
    message: "Email confirmed successfully",
  });
};

export const refreshToken = async (req, res) => {
  const tokens = await getNewLoginCredentials(req.user);
  return successResponse({
    res,
    statusCode: 200,
    message: "Token refreshed successfully",
    data: {
      tokens,
    },
  });
};

async function verifyGoogleAccount({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return payload;
}

export const loginWithGmail = async (req, res) => {
  const { idToken } = req.body;

  const { email, picture, given_name, family_name, email_verified } =
    await verifyGoogleAccount({ idToken });

  if (!email_verified)
    throw BadRequestException({ message: "Email not verified" });

  const user = await dbService.findOne(UserModel, { email });
  if (user) {
    if (user.Provider === ProviderEnum.GOOGLE) {
      const tokens = await getNewLoginCredentials(user);
      successResponse({ res, message: "Done", data: { tokens } });
    }
  } else {
    const newUser = await dbService.create(UserModel, [
      {
        firstName: given_name,
        lastName: family_name,
        email,
        ProfilePicture: picture,
        Provider: ProviderEnum.GOOGLE,
      },
    ]);
    successResponse({
      res,
      message: "User created successfully",
      data: { tokens, newUser },
    });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const hashedOtp = await generateHash({
    plaintext: String(otp),
    algorithm: HashEnum.Argon2,
  });
  const user = await dbService.findOneAndUpdate(
    UserModel,
    { email, Provider: ProviderEnum.SYSTEM, confirmEmail: { $exists: true } },
    { forgetPasswordOTP: hashedOtp },
  );

  if (!user) {
    BadRequestException("User not found or email not confirmed");
  }

  emailEvent.emit("forgetPassword", {
    to: email,
    firstName: user.firstName,
    otp,
  });

  successResponse({
    res,
    statusCode: 200,
    message: "Check your inbox for the OTP to reset your password",
  });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await dbService.findOne(UserModel, {
    email,
    Provider: ProviderEnum.SYSTEM,
    confirmEmail: { $exists: true },
    forgetPasswordOTP: { $exists: true },
  });

  if (!user) {
    BadRequestException("User not found or email not confirmed");
  }
  const isOtpValid = await compareHash({
    plaintext: String(otp),
    ciphertext: user.forgetPasswordOTP,
    algorithm: HashEnum.Argon2,
  });

  if (!isOtpValid) {
    BadRequestException("Invalid OTP");
  }

  const hashedPassword = await generateHash({
    plaintext: newPassword,
    saltRounds: Number(SALAT_ROUNDS),
    algorithm: HashEnum.Argon2,
  });

  await dbService.updateOne(
    UserModel,
    {
      email,
    },
    {
      password: hashedPassword,
      $unset: {
        forgetPasswordOTP: true,
      },
    },
  );

  successResponse({
    res,
    statusCode: 200,
    message: "Password reset successfully",
  });
};

export const logout = async (req, res) => {
  const { flag } = req.query;

  switch (flag) {
    case LogOutTypeEnum.Logout: {
      await dbService.create(TokenModel, [
        {
          jti: req.decoded.jti,
          userId: req.user._id,
          expiresIn: new Date(req.decoded.exp * 1000),
        },
      ]);
      break;
    }

    case LogOutTypeEnum.LogOutFromAll: {
      await dbService.updateOne(
        UserModel,
        { _id: req.user._id },
        {
          $set: {
            changeCredentialTime: new Date(),
          },
        },
      );
      break;
    }

    default:
      throw BadRequestException("Invalid logout flag");
  }

  return successResponse({
    res,
    statusCode: 200,
    message: "Logged out successfully",
  });
};
