import mongoose from "mongoose";
import { identityRequestStatusEnum } from "../../Utils/enums/messages.enum.js";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    identityRequestStatus: {
      type: String,
      enum: Object.values(identityRequestStatusEnum),
      default: identityRequestStatusEnum.NONE,
    },
  },
  { timestamps: true },
);

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;