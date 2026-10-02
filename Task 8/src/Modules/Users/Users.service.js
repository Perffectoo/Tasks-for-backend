import UserModel from "./../../DB/Models/Users.js";

export const createUser = async (req, res) => {
  try {
    const { Name, email, password, phone, age } = req.body;
    const checkUser = await UserModel.findOne({ email });

    if (checkUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await UserModel.create({
      Name,
      email,
      password,
      phone,
      age,
    });
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await UserModel.findOne({ email, password });

    if (checkUser) {
      return res.status(200).json({
        message: "Login successfully",
        checkUser,
      });
    } else {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error logging in:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { Name, email, phone, age } = req.body;
    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail && checkEmail._id.toString() !== id) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      id,
      { Name, email, phone, age },
      { new: true },
    );

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      user
    });

  } catch (error) {
    console.error("Error deleting user:", error);

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};



export const getUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const User = await UserModel.findById(id);

    if (!User)  {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json({  User });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
