import { z } from "zod";
import { generalFields } from "../../Utils/validation/general.fields.js";
import { identityRequestStatusEnum } from "../../Utils/enums/messages.enum.js";

export const sendMessageSchema = {
  body: z.object({
    content: generalFields.content,
    receiverId: generalFields.id,
  }),
};

export const sendIdentityRequestSchema = {
  body: z.strictObject({
    messageId: generalFields.id,
  }),
};

export const respondIdentityRequestSchema = {
  body: z.strictObject({
    messageId: generalFields.id,
    status: z.enum([
      identityRequestStatusEnum.ACCEPTED,
      identityRequestStatusEnum.REJECTED,
    ]),
  }),
};


export const sendConversationMessageSchema = {
  body: z.strictObject({
    conversationId: generalFields.id,
    content: generalFields.content,
  }),
};

export const getConversationMessagesSchema = {
  params: z.strictObject({
    conversationId: generalFields.id,
  }),
};