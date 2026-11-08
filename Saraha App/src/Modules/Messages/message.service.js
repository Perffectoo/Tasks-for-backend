import {
  create,
  find,
  findById,
  findByIdAndUpdate,
  findOneAndUpdate,
  findOne,
} from "../../DB/database.repository.js";
import MessageModel from "../../DB/Models/message.model.js";
import {
  ForbiddenException,
  NotfoundException,
} from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import UserModel from "../../DB/Models/user.model.js";
import { identityRequestStatusEnum } from "../../Utils/enums/messages.enum.js";
import ConversationModel from "../../DB/Models/conversation.model.js";

export const sendMessage = async (req, res) => {
  const { content, receiverId } = req.body;
  const senderId = req.user._id;

  if (!content || !receiverId) {
    throw new Error("Content and receiverId are required");
  }

  const receiver = await findOne(UserModel, {_id: receiverId,freezeAt:{$exists:false}});
  if (!receiver) {
    throw NotfoundException("Receiver not found or account is frozen");
  }
  const message = await create(MessageModel, [
    {
      content,
      senderId: req.user._id,
      receiverId,
      identityRequestStatus: identityRequestStatusEnum.NONE,
    },
  ]);
  return successResponse({
    res,
    message: "Message sent successfully",
    data: { message },
  });
};

export const sendIdentityRequest = async (req, res) => {
  const { messageId } = req.body;
  const { userId } = req.user._id;

  const message = await findById(MessageModel, messageId);

  if (!message) {
    throw NotfoundException("Message not found");
  }
  if (message.receiverId.toString() !== req.user._id.toString()) {
    throw ForbiddenException("Unauthorized access");
  }
  const updatedMessage = await findByIdAndUpdate(
    MessageModel,
    messageId,
    { identityRequestStatus: identityRequestStatusEnum.PENDING },
    { new: true },
  );

  return successResponse({
    res,
    message: "Identity request sent successfully",
    data: {
      messageId: updatedMessage._id,
      status: updatedMessage.identityRequestStatus,
    },
  });
};


export const getIdentityMessages = async (req, res) => {
  const senderId = req.user._id;

  
  const requests = await find(MessageModel, {
    senderId,
    identityRequestStatus: "pending",
  });

  return successResponse({
    res,
    message: "Identity requests fetched successfully",
    data: {
      requests,
    },
  });
}



export const respondIdentityRequest = async (req, res) => {
  const { messageId, status } = req.body;
  const senderId = req.user._id;

  const message = await findById(MessageModel, messageId);

  if (!message) {
    throw NotfoundException("Message not found");
  }

  if (message.senderId.toString() !== senderId.toString()) {
    throw ForbiddenException("Unauthorized access");
  }

  if (message.identityRequestStatus !== identityRequestStatusEnum.PENDING) {
    throw BadRequestException("Identity request is not pending");
  }

  // Create conversation 
  if (status === identityRequestStatusEnum.APPROVED) {
    const existingConversation = await findOne(ConversationModel, {
      originalMessageId: messageId,
    });

    if (!existingConversation) {
      await create(ConversationModel, [
        {
          originalMessageId: messageId,
          senderId: message.senderId,
          receiverId: message.receiverId,
          messages: [],
        },
      ]);
    }
  }

  
  const updatedMessage = await findOneAndUpdate(
    MessageModel,
    {
      _id: messageId,
      senderId,
      identityRequestStatus: identityRequestStatusEnum.PENDING,
    },
    {
      identityRequestStatus: status,
    }
  );

  if (!updatedMessage) {
    throw BadRequestException("Identity request already processed");
  }

  return successResponse({
    res,
    message: "Identity request responded successfully",
    data: {
      messageId: updatedMessage._id,
      status: updatedMessage.identityRequestStatus,
    },
  });
};



export const sendConversationMessage = async (req, res) => {
  const { conversationId, content } = req.body;
  const userId = req.user._id;


  const conversation = await findById(
    ConversationModel,
    conversationId
  );

  if (!conversation) {
    throw NotfoundException("Conversation not found");
  }


  const isSender =
    conversation.senderId.toString() === userId.toString();

  const isReceiver =
    conversation.receiverId.toString() === userId.toString();

  if (!isSender && !isReceiver) {
    throw ForbiddenException("Unauthorized access");
  }


  const updatedConversation = await findByIdAndUpdate(
    ConversationModel,
    conversationId,
    {
      $push: {
        messages: {
          senderId: userId,
          content,
          createdAt: new Date(),
        },
      },
    }
  );

  return successResponse({
    res,
    message: "Conversation message sent successfully",
    data: {
      conversationId: updatedConversation._id,
      messages: updatedConversation.messages,
    },
  });
};



export const getConversationMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  const conversation = await findById(
    ConversationModel,
    conversationId
  );

  if (!conversation) {
    throw NotfoundException("Conversation not found");
  }

  const isSender =
    conversation.senderId.toString() === userId.toString();

  const isReceiver =
    conversation.receiverId.toString() === userId.toString();

  if (!isSender && !isReceiver) {
    throw ForbiddenException("Unauthorized access");
  }

  return successResponse({
    res,
    message: "Conversation messages fetched successfully",
    data: {
      conversationId: conversation._id,
      messages: conversation.messages,
    },
  });
};


export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const result = await deleteOne(MessageModel, {
    _id: messageId,
    $or: [{ senderId: userId }, { receiverId: userId }],
  });

  if (!result) {
    throw NotfoundException("Message not found");
  }

  return successResponse({
    res,
    message: "Message deleted successfully",
    data: {
      messageId: result._id,
    },
  });
};