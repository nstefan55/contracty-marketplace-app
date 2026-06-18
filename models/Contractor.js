import { Schema, model, models } from "mongoose";

const contractorSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/devslulj5/image/upload/v1777836733/default-image_yywmnk.png" ||
        "/images/default-image.png",
    },
    trade: {
      type: String,
      enum: [
        "General Contractor",
        "Electrician",
        "Plumber",
        "HVAC Technician",
        "Handyman",
        "Roofer",
        "Landscaper",
        "Mason",
        "Carpenter",
        "Concrete & Paving",
        "Painter",
        "Tiler",
        "Flooring Specialist",
        "Window & Door Specialist",
      ],
      required: true,
    },
    bio: String,
    phone: String,
    email: String,
    serviceArea: {
      lat: Number,
      lng: Number,
      radiusKm: { type: Number, default: 20 },
      address: String,
      postcode: String,
    },
    certifications: [String],
    priceRange: {
      hourly: { min: Number, max: Number },
      project: { min: Number, max: Number },
      currency: { type: String, default: "EUR" },
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

contractorSchema.index({ owner: 1 }, { unique: true });
contractorSchema.index({ trade: 1, available: 1 });

export default models.Contractor || model("Contractor", contractorSchema);
