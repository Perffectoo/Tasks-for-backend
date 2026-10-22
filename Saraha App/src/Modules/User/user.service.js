import { successResponse } from "../../Utils/response/success.response.js";

export const getProfile = async (req, res) => {
  successResponse({
    res,
    message: "Profile retrieved successfully",
    data: { user: req.user },
  });
};



export const uploadProfilePic = async (req, res) => {


  successResponse({
    res,
    message: "Por",
    data: { user: req.user },
  });
};
