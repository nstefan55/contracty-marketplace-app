import { Schema, model, models } from "mongoose";

const portfolioSchema = new Schema(
  {
    contractor: {
      type: Schema.Types.ObjectId,
      ref: "Contractor",
      required: true,
      index: true,
    },
    title: { type: String, required: true },

    description: {
      type: String,
    },

    images: [String],

    projectType: { type: String },

    location: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
    },
    completedAt: Date,
  },
  { timestamps: true },
);

export default models.Portfolio || model("Portfolio", portfolioSchema);
