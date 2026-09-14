import { CommentsModel } from "../../DB/Models/Comments.js";
import { Op } from "sequelize";


// 1. Create a bulk of Comments
export const createComments = async (req, res) => {
  try {
    const comments = req.body;

    const CreateComments = await CommentsModel.bulkCreate(comments);

    return res.status(201).json({
      message: "Comments created successfully",
      comments: CreateComments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while creating comments",
      error: error.message,
    });
  }
};


// 2. Update comment by ID
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await CommentsModel.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const userIdNumber = Number(userId);

    if (comment.userId !== userIdNumber) {
      return res.status(401).json({
        message: "You are not the owner of the comment",
      });
    }

    comment.content = content;

    await comment.save();

    return res.status(200).json({
      message: "Comment updated successfully",
      comment: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while updating comment",
      error: error.message,
    });
  }
};


// 3. Find or Create Comment
export const findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    const [comment, created] = await CommentsModel.findOrCreate({
      where: {
        postId,
        userId,
        content,
      },

      defaults: {
        postId,
        userId,
        content,
      },
    });

    return res.status(200).json({
      message: created
        ? "Comment created successfully"
        : "Comment already exists",
      comment: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while finding or creating comment",
      error: error.message,
    });
  }
};


// 4. Search comments by word and count
export const searchComments = async (req, res) => {
  try {
    const { word } = req.query;

    const comments = await CommentsModel.findAndCountAll({
      where: {
        content: {
          [Op.like]: `%${word}%`,
        },
      },
    });

    return res.status(200).json({
      comments: comments.rows,
      count: comments.count,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while searching comments",
      error: error.message,
    });
  }
};


// 5. Get newest 3 comments for a specific post
export const getNewestComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await CommentsModel.findAll({
      where: {
        postId,
      },

      order: [["createdAt", "DESC"]],

      limit: 3,
    });

    return res.status(200).json({
      comments: comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while getting newest comments",
      error: error.message,
    });
  }
};