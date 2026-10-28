import { findByIdAndUpdate } from "../../DB/database.repository.js";
import { successResponse } from "../../Utils/response/success.response.js";
import UserModel from "../../DB/Models/user.model.js";
export const getProfile = async (req, res) => {
  successResponse({
    res,
    message: "Profile retrieved successfully",
    data: { user: req.user },
  });
};



export const uploadProfilePic = async (req, res) => {
const user= await findByIdAndUpdate(UserModel, req.user._id, {
    $set: {
      ProfilePicture: req.file.finalPath,
    },
  }, { new: true });

  successResponse({
    res,
    message: "Profile picture uploaded successfully",
    data: { user: user },
  });
};


export const uploadCoverPic = async (req, res) => {
  const user= await findByIdAndUpdate(UserModel, req.user._id, {
    $set: {
      coverPicture: req.files?.map((file) => file.finalPath),
    },
  }, { new: true });

  successResponse({
    res,
    message: "Cover picture uploaded successfully",
    data: { user: user },
  });
};