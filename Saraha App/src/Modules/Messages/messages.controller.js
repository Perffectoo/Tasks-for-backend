import { Router } from "express";
import { authentication, authorization } from "../../MiddleWares/auth.middleware.js";
import { validation } from "../../MiddleWares/validation.middleware.js";
import * as messageService from "./message.service.js";
import {  getConversationMessagesSchema, respondIdentityRequestSchema, sendConversationMessageSchema, sendIdentityRequestSchema, sendMessageSchema } from "./message.validation.js";
import { roleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";

// hossamsherif (sender ) byb3at le hossamsheriff(reciever) ,,,
const router = Router();

router.post(
  "/send-message/:receiverId  ",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  validation(sendMessageSchema),
  messageService.sendMessage,
);

router.post(
  "/send-identity-request",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
    authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
    validation(sendIdentityRequestSchema),
    messageService.sendIdentityRequest,
);

router.get(
  "/get-messages",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  messageService.getIdentityMessages,
);


router.patch(
  "/respond-identity-request",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  validation(respondIdentityRequestSchema),
  messageService.respondIdentityRequest,
);


router.post(
  "/conversation/send-message",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  validation(sendConversationMessageSchema),
  messageService.sendConversationMessage
);

router.get(
  "/conversation/:conversationId/messages",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  validation(getConversationMessagesSchema),
  messageService.getConversationMessages
);

router.delete(
  "/messages/:messageId",
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  messageService.deleteMessage
);
export default router;


