import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication, authorization } from "../../MiddleWares/auth.middleware.js";
import { roleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";
const router = Router();
router.get(
  "/profile",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN] }),
  userService.getProfile,
);



router.patch(
  "/update-profile-pic",
  // authentication({ tokenType: TokenTypeEnum.ACCESS }),
  // authorization({ accessRoles: [roleEnum.ADMIN] }),
  localFileUpload().single("attachments"),
  userService.uploadProfilePic,
);


export default router;
