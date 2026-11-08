import mongoose from "mongoose";
import { identityRequestStatusEnum } from "../../Utils/enums/messages.enum.js";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Message content must be at least 1 character long"],
      maxlength: [500, "Message content must be at most 500 characters long"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isfavorite: {
      type: Boolean,
      default: false,
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
messageSchema.index({  receiverId: 1 });
const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;
