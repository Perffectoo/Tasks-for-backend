
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    originalMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
      unique: true,
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

    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        content: {
          type: String,
          required: true,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model(
  "Conversation",
  conversationSchema
);

export default ConversationModel;
