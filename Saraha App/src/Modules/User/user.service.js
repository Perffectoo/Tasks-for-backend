import { deleteOne, findByIdAndUpdate ,findOneAndUpdate} from "../../DB/database.repository.js";
import { successResponse } from "../../Utils/response/success.response.js";
import { NotfoundException, ForbiddenException } from "../../Utils/response/error.response.js";
import UserModel from "../../DB/Models/user.model.js";
import { roleEnum } from "../../Utils/enums/user.enum.js";


export const getProfile = async (req, res) => {
  successResponse({
    res,
    message: "Profile retrieved successfully",
    data: { user: req.user },
  });
};

export const uploadProfilePic = async (req, res) => {
  const user = await findByIdAndUpdate(
    UserModel,
    req.user._id,
    {
      $set: {
        ProfilePicture: req.file.finalPath,
      },
    },
    { new: true },
  );

  successResponse({
    res,
    message: "Profile picture uploaded successfully",
    data: { user: user },
  });
};

export const uploadCoverPic = async (req, res) => {
  const user = await findByIdAndUpdate(
    UserModel,
    req.user._id,
    {
      $set: {
        coverPicture: req.files?.map((file) => file.finalPath),
      },
    },
    { new: true },
  );

  successResponse({
    res,
    message: "Cover picture uploaded successfully",
    data: { user: user },
  });
};

export const freezeAccount = async (req, res) => {
  const { userId } = req.params;
  const targetUserId = userId || req.user._id;

  if (
    targetUserId.toString() !== req.user._id.toString() &&
    req.user.role !== roleEnum.ADMIN
  )
    throw ForbiddenException({
      message: "you are not authorized to freeze this account",
    });

  const updatedUser = await findOneAndUpdate(
    UserModel,{
_id: targetUserId,freezeAt: { $exists: false }
    },
    {
      freezedAt: Date.now(),
      freezedBy: req.user._id,
      freezedByRole: req.user.role,
      $unset: { restoredBy: true, restoredAt: true },
    },
  );

  if (!updatedUser) throw NotfoundException({ message: "User not found" });

  successResponse({
    res,
    message: "Account freezed successfully",
    data: { user: updatedUser },
  });
};


export const restoreAccount = async (req, res) => {
  const { userId } = req.params;
  targetUserId = userId || req.user._id;

  if (!targetUserId) {
    throw new Error("User ID is required");
  }

  const user = await findById( UserModel, {id: targetUserId} );
  if (!user || !user.freezedAt)
    throw NotFoundException("User not found or account is not frozen");

  if (user.freezedByRole === roleEnum.ADMIN) {
    if (req.user.role !== roleEnum.ADMIN) {
      throw ForbiddenException(
        "This account was frozen bu an admin. Only admin can restore it",
      );
    }
  } else {
    if( targetUserId.toString() !== req.user._id.toString() &&
    req.user.role !== roleEnum.ADMIN){
       throw ForbiddenException(
        "you are not authorized to restore this account",
      );
    }
  }

  const updatedUser = await findByIdAndUpdate(
    UserModel,
    targetUserId,
    {
      $unset: { freezedAt: true, freezedBy: true, freezedByRole: true },
      restoredAt: Date.now(),
      restoredBy: req.user._id,
    },
    { new: true },
  ); 

scuccessResponse({
    res,
    message: "Account restored successfully",
    data: { user: updatedUser },
  });
};


export const HardDeleteAccount = async (req, res) => {
  const { userId } = req.params;
const results= await deleteOne(UserModel, { _id: userId });
  if (!results.deletedCount) {
    throw NotfoundException({ message: "User not found" });
  }
  successResponse({
    res,
    message: "Account hard deleted successfully",
  });
}
