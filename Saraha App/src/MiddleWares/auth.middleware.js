import { TokenTypeEnum } from "../Utils/enums/user.enum.js";
import { ForbiddenException } from "../Utils/response/error.response.js";
import { decodedToken } from "../Utils/tokens/token.js";

export const authentication = ({ tokenType = TokenTypeEnum.ACCESS }) => {
  return async (req, res, next) => {
    const { user, decoded } = await decodedToken({
      authorization: req.headers.authorization,
      tokenType,
    });
    req.user = user;
    req.decoded = decoded;

    return next();
  };
};

export const authorization = ({ accessRoles = [] }) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role))
      throw ForbiddenException({ message: "Unauthorized Access" });
    return next();
  };
};