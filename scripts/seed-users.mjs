import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model, models } = mongoose;

// ─── Inline schemas (avoids path-alias issues in script context) ─────────────

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    image: { type: String },
    password: { type: String, default: null },
    role: { type: String, enum: ["homeowner", "contractor", "admin", null], default: null },
    emailVerified: { type: Date, default: null },
    needsOnboarding: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    signInToken: { type: String, default: null },
    signInTokenExpiry: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Contractor" }],
  },
  { timestamps: true },
);

const contractorSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    profileImage: { type: String },
    trade: { type: String, required: true },
    bio: String,
    phone: String,
    email: String,
    serviceArea: {
      lat: Number, lng: Number,
      radiusKm: { type: Number, default: 20 },
      address: String, postcode: String,
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

const User = models.User || model("User", userSchema);
const Contractor = models.Contractor || model("Contractor", contractorSchema);

// ─── Seed data ────────────────────────────────────────────────────────────────

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/devslulj5/image/upload/v1777836733/default-image_yywmnk.png";

const SEED_DOMAIN = "@contracty-seed.dev";
const SEED_PASSWORD = "Seed@Contracty2025";

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-");
}

const CONTRACTORS_DATA = [
  {
    name: "Marko Horvat", email: `marko.horvat${SEED_DOMAIN}`,
    trade: "Electrician", city: "Zagreb", postcode: "10000",
    lat: 45.815, lng: 15.9819, years: 12,
    bio: "Licensed master electrician with 12 years of experience in residential and commercial electrical installations. Specialising in smart home systems and solar panel integration.",
    certifications: ["Master Electrician License", "Smart Home Certified Installer", "Solar PV Installation Certificate"],
    hourly: { min: 35, max: 55 }, project: { min: 500, max: 5000 },
    available: true, featured: true, verified: true,
  },
  {
    name: "Ivan Perić", email: `ivan.peric${SEED_DOMAIN}`,
    trade: "Plumber", city: "Split", postcode: "21000",
    lat: 43.5081, lng: 16.4402, years: 8,
    bio: "Experienced plumber covering all aspects of plumbing from emergency repairs to full bathroom installations. Available 7 days a week for urgent call-outs.",
    certifications: ["Licensed Plumber", "Gas Safe Registered"],
    hourly: { min: 30, max: 50 }, project: { min: 400, max: 4000 },
    available: true, featured: false, verified: true,
  },
  {
    name: "Josip Kralj", email: `josip.kralj${SEED_DOMAIN}`,
    trade: "General Contractor", city: "Rijeka", postcode: "51000",
    lat: 45.3271, lng: 14.4422, years: 15,
    bio: "Full-service general contractor managing projects from planning through completion. Residential extensions, renovations, and new builds. Quality guaranteed.",
    certifications: ["Certified General Contractor", "ISO 9001 Quality Management", "Health & Safety Qualified"],
    hourly: { min: 40, max: 65 }, project: { min: 2000, max: 80000 },
    available: true, featured: true, verified: true,
  },
  {
    name: "Stefan Weber", email: `stefan.weber${SEED_DOMAIN}`,
    trade: "Carpenter", city: "Vienna", postcode: "1010",
    lat: 48.2082, lng: 16.3738, years: 10,
    bio: "Precision carpentry and custom woodworking. From fitted kitchens and wardrobes to structural timber framing. Handcrafted quality on every project.",
    certifications: ["Master Carpenter Certificate", "Timber Frame Construction Specialist"],
    hourly: { min: 38, max: 60 }, project: { min: 600, max: 15000 },
    available: true, featured: false, verified: true,
  },
  {
    name: "Ana Novak", email: `ana.novak${SEED_DOMAIN}`,
    trade: "Painter", city: "Ljubljana", postcode: "1000",
    lat: 46.0569, lng: 14.5058, years: 6,
    bio: "Interior and exterior painting with meticulous surface preparation. Specialist in decorative finishes, faux effects, and colour consultation services.",
    certifications: ["Professional Painter & Decorator", "Colour Consultant Certificate"],
    hourly: { min: 25, max: 40 }, project: { min: 300, max: 6000 },
    available: true, featured: false, verified: false,
  },
  {
    name: "Tomislav Vidović", email: `tomislav.vidovic${SEED_DOMAIN}`,
    trade: "Roofer", city: "Zagreb", postcode: "10000",
    lat: 45.815, lng: 15.9819, years: 18,
    bio: "Master roofer with 18 years of experience in all roofing systems — flat, pitched, green roofs, and solar-ready structures. Fully insured with 10-year workmanship guarantee.",
    certifications: ["Master Roofer License", "Flat Roof Waterproofing Specialist", "Green Roof Installer"],
    hourly: { min: 35, max: 55 }, project: { min: 1500, max: 30000 },
    available: true, featured: true, verified: true,
  },
  {
    name: "Luka Blažević", email: `luka.blazevic${SEED_DOMAIN}`,
    trade: "HVAC Technician", city: "Osijek", postcode: "31000",
    lat: 45.5511, lng: 18.6953, years: 9,
    bio: "HVAC installation, service and repair. Air conditioning, heat pumps, underfloor heating systems. Energy-efficient solutions for homes and commercial premises.",
    certifications: ["F-Gas Certified", "Heat Pump Installation Specialist", "Underfloor Heating Installer"],
    hourly: { min: 35, max: 58 }, project: { min: 800, max: 12000 },
    available: true, featured: false, verified: false,
  },
  {
    name: "Maja Jurić", email: `maja.juric${SEED_DOMAIN}`,
    trade: "Tiler", city: "Zadar", postcode: "23000",
    lat: 44.1194, lng: 15.2313, years: 7,
    bio: "Expert tiler specialising in large-format tiles, natural stone, and mosaic work. Bathrooms, kitchens, terraces, and pool surrounds. Clean, precise finishes every time.",
    certifications: ["Certified Tile Installer", "Natural Stone Specialist"],
    hourly: { min: 28, max: 45 }, project: { min: 400, max: 8000 },
    available: true, featured: false, verified: true,
  },
  {
    name: "Roberto Ferretti", email: `roberto.ferretti${SEED_DOMAIN}`,
    trade: "Mason", city: "Trieste", postcode: "34121",
    lat: 45.6495, lng: 13.7768, years: 14,
    bio: "Stone masonry, brickwork, and restoration. Specialist in traditional stone techniques and façade repair. Works on heritage properties and new builds alike.",
    certifications: ["Stone Masonry Certificate", "Heritage Building Restoration", "Structural Masonry Qualification"],
    hourly: { min: 35, max: 52 }, project: { min: 700, max: 25000 },
    available: false, featured: false, verified: true,
  },
  {
    name: "Petra Šimunić", email: `petra.simunic${SEED_DOMAIN}`,
    trade: "Landscaper", city: "Dubrovnik", postcode: "20000",
    lat: 42.6507, lng: 18.0944, years: 5,
    bio: "Full landscaping service — garden design, planting, irrigation, paving, and ongoing maintenance. Sustainable and drought-resistant planting a speciality.",
    certifications: ["Landscape Design Diploma", "Irrigation Systems Certified"],
    hourly: { min: 25, max: 40 }, project: { min: 500, max: 20000 },
    available: true, featured: false, verified: false,
  },
  {
    name: "Boris Knežević", email: `boris.knezevic${SEED_DOMAIN}`,
    trade: "Concrete & Paving", city: "Zagreb", postcode: "10090",
    lat: 45.82, lng: 16.02, years: 11,
    bio: "Driveways, patios, paths, and industrial concrete floors. Decorative concrete, stamped finishes, and reinforced slabs. Reliable, on-time delivery.",
    certifications: ["Concrete Technology Certificate", "Decorative Concrete Installer"],
    hourly: { min: 30, max: 48 }, project: { min: 600, max: 15000 },
    available: true, featured: false, verified: false,
  },
  {
    name: "Sandra Kovačević", email: `sandra.kovacevic${SEED_DOMAIN}`,
    trade: "Flooring Specialist", city: "Split", postcode: "21000",
    lat: 43.508, lng: 16.44, years: 8,
    bio: "Hardwood, engineered wood, laminate, LVT, and vinyl. Supply and install or fit-only service. Free measurement and quote within 48 hours.",
    certifications: ["Flooring Installer Certification", "Hardwood Flooring Specialist"],
    hourly: { min: 28, max: 45 }, project: { min: 500, max: 10000 },
    available: true, featured: false, verified: true,
  },
  {
    name: "Neven Dragičević", email: `neven.dragicevic${SEED_DOMAIN}`,
    trade: "Handyman", city: "Varaždin", postcode: "42000",
    lat: 46.3044, lng: 16.3378, years: 4,
    bio: "Reliable handyman for all small to medium household tasks. Flat-pack assembly, mounting, minor repairs, painting touch-ups, and general maintenance.",
    certifications: ["City & Guilds Multi-Trade", "First Fix & Second Fix Carpentry"],
    hourly: { min: 20, max: 35 }, project: { min: 100, max: 2000 },
    available: true, featured: false, verified: false,
  },
  {
    name: "Darko Matić", email: `darko.matic${SEED_DOMAIN}`,
    trade: "Window & Door Specialist", city: "Karlovac", postcode: "47000",
    lat: 45.4929, lng: 15.5549, years: 13,
    bio: "Supply and installation of PVC, aluminium, and timber windows and doors. Conservatories, bi-fold doors, and bespoke glazing. Energy efficiency ratings available.",
    certifications: ["FENSA Registered Installer", "PVC & Aluminium Systems Certification", "Thermal Performance Specialist"],
    hourly: { min: 32, max: 50 }, project: { min: 400, max: 20000 },
    available: true, featured: false, verified: true,
  },
  {
    name: "Elena Babić", email: `elena.babic${SEED_DOMAIN}`,
    trade: "Electrician", city: "Sisak", postcode: "44000",
    lat: 45.4658, lng: 16.3798, years: 9,
    bio: "Domestic and commercial electrician. EV charger installations, consumer unit upgrades, fault finding, and periodic inspection reports. NICEIC registered.",
    certifications: ["18th Edition Wiring Regulations", "EV Charger Installation Certificate", "PAT Testing Qualification"],
    hourly: { min: 30, max: 50 }, project: { min: 300, max: 4000 },
    available: true, featured: false, verified: false,
  },
  {
    name: "Ante Vukić", email: `ante.vukic${SEED_DOMAIN}`,
    trade: "Plumber", city: "Šibenik", postcode: "22000",
    lat: 43.7337, lng: 15.8933, years: 16,
    bio: "Master plumber with 16 years of experience. Bathroom and kitchen fit-outs, underfloor heating, boiler installation and servicing. 24/7 emergency response.",
    certifications: ["Master Plumber License", "Gas Safe Engineer", "Legionella Risk Assessment"],
    hourly: { min: 35, max: 55 }, project: { min: 600, max: 8000 },
    available: true, featured: true, verified: true,
  },
  {
    name: "Damir Čović", email: `damir.covic${SEED_DOMAIN}`,
    trade: "General Contractor", city: "Mostar", postcode: "88000",
    lat: 43.3438, lng: 17.8078, years: 20,
    bio: "20 years as a general contractor across the Western Balkans. Complete project management from planning permits to handover. Residential, commercial, and hospitality.",
    certifications: ["Certified General Contractor", "Project Management Professional (PMP)", "OSHA Safety Certified"],
    hourly: { min: 45, max: 70 }, project: { min: 5000, max: 200000 },
    available: true, featured: true, verified: false,
  },
  {
    name: "Kristina Lozić", email: `kristina.lozic${SEED_DOMAIN}`,
    trade: "Carpenter", city: "Pula", postcode: "52100",
    lat: 44.8666, lng: 13.8496, years: 7,
    bio: "Bespoke furniture maker and finish carpenter. Custom-built cabinetry, shelving, and interior joinery. Small workshop, personal service, and attention to detail.",
    certifications: ["City & Guilds Carpentry & Joinery", "Bespoke Furniture Making Certificate"],
    hourly: { min: 32, max: 52 }, project: { min: 400, max: 8000 },
    available: true, featured: false, verified: false,
  },
  {
    name: "Zvonimir Pavlović", email: `zvonimir.pavlovic${SEED_DOMAIN}`,
    trade: "Roofer", city: "Vukovar", postcode: "32000",
    lat: 45.3518, lng: 18.9997, years: 11,
    bio: "Roofing contractor covering all pitched and flat roof systems. Re-roofing, new builds, leak investigations, and chimney repairs. Free inspections.",
    certifications: ["Licensed Roofer", "Flat Roof Systems Installer"],
    hourly: { min: 30, max: 48 }, project: { min: 1000, max: 20000 },
    available: false, featured: false, verified: false,
  },
  {
    name: "Marta Tomljanović", email: `marta.tomljanovic${SEED_DOMAIN}`,
    trade: "Painter", city: "Bjelovar", postcode: "43000",
    lat: 45.8988, lng: 16.848, years: 5,
    bio: "Interior painter and decorator with a sharp eye for colour and detail. New builds, repaints, and feature walls. Quick turnaround and fully insured.",
    certifications: ["Painting & Decorating NVQ Level 3"],
    hourly: { min: 22, max: 38 }, project: { min: 200, max: 4000 },
    available: true, featured: false, verified: false,
  },
];

const HOMEOWNERS_DATA = [
  { name: "Nikola Barić",    email: `nikola.baric${SEED_DOMAIN}`,    city: "Zagreb" },
  { name: "Lucija Filipović", email: `lucija.filipovic${SEED_DOMAIN}`, city: "Split" },
  { name: "Petar Golubić",   email: `petar.golubic${SEED_DOMAIN}`,   city: "Rijeka" },
  { name: "Helena Ivanović", email: `helena.ivanovic${SEED_DOMAIN}`, city: "Osijek" },
  { name: "Dominik Jakšić",  email: `dominik.jaksic${SEED_DOMAIN}`,  city: "Zadar" },
  { name: "Ivana Kolar",     email: `ivana.kolar${SEED_DOMAIN}`,     city: "Dubrovnik" },
  { name: "Stjepan Lončar",  email: `stjepan.loncar${SEED_DOMAIN}`,  city: "Zagreb" },
  { name: "Marina Miletić",  email: `marina.miletic${SEED_DOMAIN}`,  city: "Varaždin" },
  { name: "Goran Nikolić",   email: `goran.nikolic${SEED_DOMAIN}`,   city: "Karlovac" },
  { name: "Nikolina Oršić",  email: `nikolina.orsic${SEED_DOMAIN}`,  city: "Sisak" },
  { name: "Branimir Pejić",  email: `branimir.pejic${SEED_DOMAIN}`,  city: "Split" },
  { name: "Vesna Rogić",     email: `vesna.rogic${SEED_DOMAIN}`,     city: "Zagreb" },
  { name: "Domagoj Šarić",   email: `domagoj.saric${SEED_DOMAIN}`,   city: "Pula" },
  { name: "Mirjana Tomić",   email: `mirjana.tomic${SEED_DOMAIN}`,   city: "Vukovar" },
  { name: "Krešimir Uglešić", email: `kresimir.uglesic${SEED_DOMAIN}`, city: "Bjelovar" },
  { name: "Dora Vlahović",   email: `dora.vlahovic${SEED_DOMAIN}`,   city: "Zagreb" },
  { name: "Miroslav Zorić",  email: `miroslav.zoric${SEED_DOMAIN}`,  city: "Split" },
  { name: "Tatjana Anić",    email: `tatjana.anic${SEED_DOMAIN}`,    city: "Rijeka" },
  { name: "Slavko Benić",    email: `slavko.benic${SEED_DOMAIN}`,    city: "Osijek" },
  { name: "Renata Curić",    email: `renata.curic${SEED_DOMAIN}`,    city: "Zadar" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  console.log("✔ Connected to MongoDB");

  // Clean up existing seed data
  const existingSeedUsers = await User.find({ email: { $regex: `${SEED_DOMAIN}$` } }).select("_id").lean();
  const seedUserIds = existingSeedUsers.map((u) => u._id);

  if (seedUserIds.length > 0) {
    const existingContractors = await Contractor.find({ owner: { $in: seedUserIds } }).select("_id").lean();
    const seedContractorIds = existingContractors.map((c) => c._id);

    // Import inline to avoid circular deps
    const Review = models.Review || model("Review", new Schema({ user: Schema.Types.ObjectId, contractor: Schema.Types.ObjectId }, { strict: false }));
    const Portfolio = models.Portfolio || model("Portfolio", new Schema({ contractor: Schema.Types.ObjectId }, { strict: false }));
    const Inquiry = models.Inquiry || model("Inquiry", new Schema({ sender: Schema.Types.ObjectId, contractor: Schema.Types.ObjectId }, { strict: false }));

    await Review.deleteMany({ $or: [{ user: { $in: seedUserIds } }, { contractor: { $in: seedContractorIds } }] });
    await Portfolio.deleteMany({ contractor: { $in: seedContractorIds } });
    await Inquiry.deleteMany({ $or: [{ sender: { $in: seedUserIds } }, { contractor: { $in: seedContractorIds } }] });
    await Contractor.deleteMany({ owner: { $in: seedUserIds } });
    await User.deleteMany({ email: { $regex: `${SEED_DOMAIN}$` } });
    console.log(`✔ Cleared ${seedUserIds.length} existing seed users and all related data`);
  }

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 12);
  const now = new Date();

  // ── Homeowners ──
  const homeownerDocs = HOMEOWNERS_DATA.map((h) => ({
    name: h.name,
    email: h.email,
    image: DEFAULT_IMAGE,
    password: hashedPassword,
    role: "homeowner",
    emailVerified: now,
    needsOnboarding: false,
  }));

  const insertedHomeowners = await User.insertMany(homeownerDocs);
  console.log(`✔ Created ${insertedHomeowners.length} homeowner users`);

  // ── Contractors ──
  const contractorUserDocs = CONTRACTORS_DATA.map((c) => ({
    name: c.name,
    email: c.email,
    image: DEFAULT_IMAGE,
    password: hashedPassword,
    role: "contractor",
    emailVerified: now,
    needsOnboarding: false,
  }));

  const insertedContractorUsers = await User.insertMany(contractorUserDocs);
  console.log(`✔ Created ${insertedContractorUsers.length} contractor users`);

  // ── Contractor profiles ──
  const contractorProfileDocs = CONTRACTORS_DATA.map((c, i) => ({
    owner: insertedContractorUsers[i]._id,
    name: c.name,
    slug: toSlug(c.name),
    profileImage: DEFAULT_IMAGE,
    trade: c.trade,
    bio: c.bio,
    phone: `+385 ${90 + i} ${100 + i * 7} ${1000 + i * 31}`,
    email: c.email,
    serviceArea: {
      lat: c.lat,
      lng: c.lng,
      radiusKm: 30,
      address: `${c.city}, Croatia`,
      postcode: c.postcode,
    },
    certifications: c.certifications,
    priceRange: {
      hourly: c.hourly,
      project: c.project,
      currency: "EUR",
    },
    yearsExperience: c.years,
    available: c.available,
    featured: c.featured,
    verified: c.verified,
    averageRating: 0,
    reviewCount: 0,
    viewCount: Math.floor(Math.random() * 300) + 20,
  }));

  await Contractor.insertMany(contractorProfileDocs);
  console.log(`✔ Created ${contractorProfileDocs.length} contractor profiles`);

  console.log(`\n✅ Seed complete. All accounts use password: ${SEED_PASSWORD}`);
  console.log(`   Seed email domain: ${SEED_DOMAIN}`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
