import {
  JWT_ADMIN_SECRET_ACCESS,
  JWT_ADMIN_SECRET_REFRESH,
  JWT_EXPIRES_IN_ACCESS,
  JWT_EXPIRES_IN_REFRESH,
  JWT_USER_SECRET_ACCESS,
  JWT_USER_SECRET_REFRESH,
} from "../../../Config/config.service.js";
import jwt from "jsonwebtoken";
import { roleEnum, SigntuareEnum, TokenTypeEnum } from "../enums/user.enum.js";
import {
  BadRequestException,
  NotfoundException,
} from "../response/error.response.js";
import { findById } from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
import * as dbService from "../../DB/database.repository.js";

export const generateToken = ({ payload, secretKey, options }) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({ token, secretKey }) => {
  return jwt.verify(token, secretKey);
};

export const getSignature = ({ signatureLevel = SigntuareEnum.USER }) => {
  let signature = { accessSignature: undefined, refreshSignature: undefined };

  switch (signatureLevel) {
    case SigntuareEnum.ADMIN:
      signature.accessSignature = JWT_ADMIN_SECRET_ACCESS;
      signature.refreshSignature = JWT_ADMIN_SECRET_REFRESH;
      break;
    case SigntuareEnum.USER:
      signature.accessSignature = JWT_USER_SECRET_ACCESS;
      signature.refreshSignature = JWT_USER_SECRET_REFRESH;
      break;
    default:
      signature.accessSignature = JWT_USER_SECRET_ACCESS;
      signature.refreshSignature = JWT_USER_SECRET_REFRESH;
  }
  return signature;
};

export const getNewLoginCredentials = async (user) => {
  const signature = await getSignature({
    signatureLevel:
      user.role != roleEnum.ADMIN ? SigntuareEnum.USER : SigntuareEnum.ADMIN,
  });

  console.log(signature);

  const accessToken = generateToken({
    payload: { id: user._id },
    secretKey: signature.accessSignature,
    options: { expiresIn: JWT_EXPIRES_IN_ACCESS },
  });

  const refreshToken = generateToken({
    payload: { id: user._id }, 
    secretKey: signature.refreshSignature,
    options: { expiresIn: JWT_EXPIRES_IN_REFRESH },
  });
  return { accessToken, refreshToken };
};

export const decodedToken = async ({
  authorization,
  tokenType = TokenTypeEnum.ACCESS,
}) => {
  // authorization: Bearer token
  const [Bearer, token] = authorization.split(" ") || [];

  if (!Bearer || !token)
    throw BadRequestException({ message: "invalid token" });

  let signature = await getSignature({
    signatureLevel:
      Bearer === "ADMIN" ? SigntuareEnum.ADMIN : SigntuareEnum.USER,
  });

  // { accessSignature: undefined, refreshSignature: undefined }

  const decoded = verifyToken({
    token,
    secretKey:
      tokenType === TokenTypeEnum.ACCESS
        ? signature.accessSignature
        : signature.refreshSignature,
  });

  const user = await dbService.findById(UserModel, decoded.id);
  if (!user) throw NotfoundException({ message: "user not found" });

  return { user, decoded };
};
