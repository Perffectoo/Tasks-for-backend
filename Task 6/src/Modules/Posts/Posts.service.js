import { PostsModel } from "../../DB/Models/Posts.js";
import { UsersModel } from "../../DB/Models/Users.js";
import { CommentsModel } from "../../DB/Models/Comments.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const user = await PostsModel.findOne({ where: { title } });

    if (user)
      return res.status(401).json({
        message: "Can not create post with the same title ",
      });

    const CreateUser = new PostsModel({
      title,
      content,
      userId,
    });

    await CreateUser.save();

    return res.status(201).json({
      message: "Post created successfully",
      CreateUser: CreateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while creating post",
      error: error.message,
    });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const blog = await PostsModel.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        message: "Can not find blog with this number",
      });
    }

    const user = await UsersModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "Can not find user with this number",
      });
    }

    const userIdNumber = Number(userId);

    if (blog.userId !== userIdNumber) {
      return res.status(401).json({
        message: "You are not the owner of the post",
      });
    }

    const deletePost = await PostsModel.destroy({
      where: { id },
    });

    return res.status(200).json({
      message: "Post has been deleted",
      delete: deletePost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while deleted post",
      error: error.message,
    });
  }
};



export const getPostsDetails = async (req, res) => {
  try {
    const posts = await PostsModel.findAll({
      attributes: ["id", "title"],

      include: [
        {
          model: UsersModel,
          attributes: ["id", "name"],
        },
        {
          model: CommentsModel,
          attributes: ["id", "content"],
        },
      ],
    });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while getting posts details",
      error: error.message,
    });
  }
};


export const getPostsCommentCount = async (req, res) => {
  try {
    const posts = await PostsModel.findAll({
      attributes: [
        "id",
        "title",
        [
          PostsModel.sequelize.fn(
            "COUNT",
            PostsModel.sequelize.col("Comments.id")
          ),
          "commentsCount",
        ],
      ],

      include: [
        {
          model: CommentsModel,
          attributes: [],
        },
      ],

      group: ["Posts.id"],
    });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while getting comments count",
      error: error.message,
    });
  }
};