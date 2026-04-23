import { Schema, model, models } from "mongoose";

const portfolioItemSchema = new Schema({
  title: String,
  description: String,
  images: [String],
  projectType: String,
  location: String,
  completedAt: Date,
});

const contractorSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    trade: {
      type: String,
      enum: [
        "electrician",
        "plumber",
        "roofer",
        "carpenter",
        "general-contractor",
        "hvac",
        "painter",
        "landscaper",
        "mason",
        "tiler",
        "glazier",
        "structural-engineer",
      ],
      required: true,
    },
    bio: String,
    phone: String,
    email: String,
    serviceArea: {
      lat: Number,
      lng: Number,
      radiusKm: {
        type: Number,
        default: 20,
      },
      address: String,
      postcode: String,
    },
    portfolio: [portfolioItemSchema],
    certifications: [String],
    priceRange: {
      hourlyMax: Number,
      hourlyMin: Number,
      projectMin: Number,
      projectMax: Number,
      currency: {
        type: String,
        default: "EUR",
      },
    },
    yearsExperience: Number,
    available: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default models.Contractor || model("Contractor", contractorSchema);
