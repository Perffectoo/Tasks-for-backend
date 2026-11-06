import { Router } from "express";
import * as authservice from "./auth.service.js";
import {
  authentication,
  authorization,
} from "../../MiddleWares/auth.middleware.js";
import { roleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";
import * as authvalidation from "./auth.validation.js";
import { validation } from "../../MiddleWares/validation.middleware.js";

const router = Router();

router.post(
  "/signup",
  validation(authvalidation.signupSchema),
  authservice.signup,
);
router.post(
  "/login",
  validation(authvalidation.loginSchema),
  authservice.login,
);
router.patch(
  "/confirm-email",
  validation(authvalidation.confirmEmailSchema),
  authservice.confirmEmail,
);
router.patch(
  "/forget-password",
  validation(authvalidation.forgetPasswordSchema),
  authservice.forgetPassword,
);
router.patch(
  "/reset-password",
  validation(authvalidation.resetPasswordSchema),
  authservice.resetPassword,
);

router.post(
  "/refresh-token",
  validation(authvalidation.refreshToken),
  authentication({ tokenType: TokenTypeEnum.REFRESH }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  authservice.refreshToken,
);

router.post(
  "/logout",
  validation(authvalidation.logoutSchema),
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  authservice.logout,
);

router.post(
  "/logout-with-redis",
  validation(authvalidation.logoutSchema),
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  authservice.logoutWithRedis,
);

router.post(
  "/social-login",
  validation(authvalidation.socialLoginSchema),
   authservice.loginWithGmail,
);




export default router;
