import { Router } from "express";
import * as authservice from "./auth.service.js";
import {
  authentication,
  authorization,
} from "../../MiddleWares/auth.middleware.js";
import { roleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";
const router = Router();

router.post("/signup", authservice.signup);
router.post("/login", authservice.login);
router.post(
  "/refresh-token",
  authentication({ tokenType: TokenTypeEnum.REFRESH }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  authservice.refreshToken,
);

router.post("/social-login", authservice.loginWithGmail);

export default router;
