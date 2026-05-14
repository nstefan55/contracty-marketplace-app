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
    image: {
      type: String,
      default: DEFAULT_PROFILE_IMAGE_URL,
    },
    password: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["homeowner", "contractor", "admin", null],
      default: null,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    needsOnboarding: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    signInToken: {
      type: String,
      default: null,
    },
    signInTokenExpiry: {
      type: Date,
      default: null,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Contractor",
      },
    ],
  },
  { timestamps: true },
);

export default models.User || model("User", userSchema);
