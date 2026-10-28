import { Router } from "express";
import * as userService from "./user.service.js";
import {
  authentication,
  authorization,
} from "../../MiddleWares/auth.middleware.js";
import { roleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { fileValidation, localFileUpload, validationMagicNumbers } from "../../Utils/enums/multer/local.multer.js";
const router = Router();
router.get(
  "/profile",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN] }),
  userService.getProfile,
);

router.patch(
  "/update-profile-pic",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN] }),
  localFileUpload({
    customPath: "User",
    validation: [...fileValidation.images],
  }).single("attachments"),
  userService.uploadProfilePic,
);

router.patch(
  "/update-Cover-pic",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN] }),
  localFileUpload({
    customPath: "User",
    validation: [...fileValidation.documents],
  }).array("attachments", 10),
  // validationMagicNumbers([fileValidation.documents]),
  userService.uploadCoverPic,
);

export default router;
