import pkg from "mongoose";
const { Schema, model, models } = pkg;

const DEFAULT_PROFILE_IMAGE_URL =
  "https://res.cloudinary.com/devslulj5/image/upload/v1777836733/default-image_yywmnk.png";

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    profileImage: {
      type: String,
      default: DEFAULT_PROFILE_IMAGE_URL,
    },
    role: {
      type: String,
      enum: ["client", "contractor", "admin"],
      default: "client",
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Contractor",
      },
    ],
    password: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default models.User || model("User", userSchema);
