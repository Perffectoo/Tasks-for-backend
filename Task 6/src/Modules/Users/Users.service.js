import { UsersModel } from "../../DB/Models/Users.js";

export const CreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await UsersModel.findOne({
      where: {
        email
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "email already exists",
      });
    }

    const user = new UsersModel({
      name,
      email,
      password,
      role,
    });

    await user.save();

    return res.status(201).json({
      message: "user created successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while creating user",
      error: error.message,
    });
  }
};

export const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const User = await UsersModel.findByPk(id);
    if (!User) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const UpdateUser = await UsersModel.update(
      {
        name,
        email,
        password,
        role,
      },
      {
        where: {
          id,
        },
      },
    );

    return res.status(200).json({
      message: "user updated successfully",
      user: UpdateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while updating user",
      error: error.message,
    });
  }
};


export const GetUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

const User=await UsersModel.findOne({where:{email}})
  if (!User) {
      return res.status(404).json({
        message: "Email not not found",
      });
    }


      return res.status(201).json({
        message:User ,
      });
    



 } catch (error) {
    return res.status(500).json({
      message: "error occurred while Getting  user by email",
      error: error.message,
    });
  }
};


export const GetUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const User = await UsersModel.findByPk(id);
    if (!User) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(200).json({
      User: User,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occurred while updating user",
      error: error.message,
    });
  }
};
