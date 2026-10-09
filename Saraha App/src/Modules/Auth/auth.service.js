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
import { SALAT_ROUNDS } from "../../../Config/config.service.js";
import { decrypt, encrypt } from "../../Utils/security/encryption.security.js";

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
    algorithm: HashEnum.Bcrypt,
  });
  const encryptedPassword = await encrypt(phone);

  // Create new user
  const newUser = await dbService.create(UserModel, [
    {
      email,
      password: hashedPassword,
      username,
      phone: encryptedPassword,
      gender,
      role,
      DOB,
    },
  ]);

  return successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: newUser,
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await dbService.findOne(UserModel, { email });

  if (!user) {
    throw NotfoundException("Invalid email or password");
  }

  const isMatch = await compareHash({
    plaintext: password,
    ciphertext: user.password,
    algorithm: HashEnum.bycrypt,
  });

if(user.phone)user.phone = decrypt(user.phone);

  if (!isMatch) {
    throw BadRequestException("Invalid email or password");
  }

  return successResponse({
    res,
    statusCode: 200,
    message: "Login successful",
    data: {
      user
    },
  });
};