
import mongoose, { Schema } from "mongoose";

const TokenSchema = new Schema(
  {
    jti: {
      type: String,
      required: [true, "JWT ID is required"],
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    expiresIn: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
  },
  {
    timestamps: true,
  },
);

TokenSchema.index(
  { expiresIn: 1 },
  { expireAfterSeconds: 0 },
);

const TokenModel = mongoose.model("Token", TokenSchema);

export default TokenModel;
