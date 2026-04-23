import { Schema, model, models } from "mongoose";

const replySchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const inquirySchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contractor: {
      type: Schema.Types.ObjectId,
      ref: "Contractor",
      required: true,
    },
    projectType: {
      type: String,
      required: true,
    },
    budget: String,
    timeline: String,
    siteAddress: String,
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    replies: [replySchema],
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export default models.Inquiry || model("Inquiry", inquirySchema);
