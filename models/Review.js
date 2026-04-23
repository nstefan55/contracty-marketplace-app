import { Schema, model, models } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contractor: {
      type: Schema.Types.ObjectId,
      ref: "Contractor",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    projectType: String,
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

reviewSchema.index({ user: 1, contractor: 1 }, { unique: true }); //! One Review per Contractor and User

export default model.Review || model("Review", reviewSchema);
