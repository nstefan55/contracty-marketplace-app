import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    image: String,
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
  },
  { timestamps: true },
);

export default models.User || model("User", userSchema);
