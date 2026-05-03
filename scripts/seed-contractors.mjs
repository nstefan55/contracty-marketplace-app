import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

// Fake owner IDs — replace with real User _ids after seeding users
const OWNER_IDS = [
  "6650000000000000000000a1",
  "6650000000000000000000a2",
  "6650000000000000000000a3",
  "6650000000000000000000a4",
  "6650000000000000000000a5",
  "6650000000000000000000a6",
  "6650000000000000000000a7",
  "6650000000000000000000a8",
];

const CONTRACTOR_IDS = [
  new mongoose.Types.ObjectId("6650000000000000000000b1"),
  new mongoose.Types.ObjectId("6650000000000000000000b2"),
  new mongoose.Types.ObjectId("6650000000000000000000b3"),
  new mongoose.Types.ObjectId("6650000000000000000000b4"),
  new mongoose.Types.ObjectId("6650000000000000000000b5"),
  new mongoose.Types.ObjectId("6650000000000000000000b6"),
  new mongoose.Types.ObjectId("6650000000000000000000b7"),
  new mongoose.Types.ObjectId("6650000000000000000000b8"),
];

export const mockContractors = [
  {
    _id: CONTRACTOR_IDS[0],
    owner: new mongoose.Types.ObjectId(OWNER_IDS[0]),
    name: "Marko Horvat",
    slug: "marko-horvat-general-contractor",
    profileImage:
      "https://res.cloudinary.com/devslulj5/image/upload/v1777836754/profile-1_lnyaxc.jpg",
    trade: "General Contractor",
    bio: "Full-service general contractor with 18 years of experience across residential and commercial builds. Known for transparent pricing and on-time delivery. Managed projects from €20k bathroom renovations to €500k new builds.",
    phone: "+385 91 234 5678",
    email: "marko.horvat@example.com",
    serviceArea: {
      lat: 45.815,
      lng: 15.982,
      radiusKm: 40,
      address: "Zagreb, Croatia",
      postcode: "10000",
    },
    certifications: ["ISO 9001", "HGK Certified Contractor", "OSHA Safety"],
    priceRange: {
      hourly: { min: 35, max: 60 },
      project: { min: 5000, max: 500000 },
      currency: "EUR",
    },
    yearsExperience: 18,
    available: true,
    featured: true,
    verified: true,
    averageRating: 3.5,
    reviewCount: 34,
    viewCount: 412,
  },
  {
    _id: CONTRACTOR_IDS[1],
    owner: new mongoose.Types.ObjectId(OWNER_IDS[1]),
    name: "Ivan Perić Elektro",
    slug: "ivan-peric-electrician",
    profileImage:
      "https://res.cloudinary.com/devslulj5/image/upload/v1777836755/profile-2_g6edtm.jpg",
    trade: "Electrician",
    bio: "Licensed electrician specialising in smart home installations, fuse board upgrades, and EV charger fitting. Available for both emergency callouts and planned projects across Split and Dalmatia.",
    phone: "+385 98 765 4321",
    email: "ivan.peric@example.com",
    serviceArea: {
      lat: 43.508,
      lng: 16.44,
      radiusKm: 30,
      address: "Split, Croatia",
      postcode: "21000",
    },
    certifications: [
      "HEP Licensed Electrician",
      "NICEIC Approved",
      "KNX Partner",
    ],
    priceRange: {
      hourly: { min: 30, max: 55 },
      project: { min: 200, max: 50000 },
      currency: "EUR",
    },
    yearsExperience: 12,
    available: true,
    featured: true,
    verified: true,
    averageRating: 4.2,
    reviewCount: 51,
    viewCount: 638,
  },
  {
    _id: CONTRACTOR_IDS[2],
    owner: new mongoose.Types.ObjectId(OWNER_IDS[2]),
    name: "Tomislav Voda d.o.o.",
    slug: "tomislav-voda-plumber",
    trade: "Plumber",
    bio: "Family plumbing business since 1998. Bathroom installations, boiler replacements, leak detection, and underfloor heating. We carry our own parts van so most jobs are done in a single visit.",
    phone: "+385 92 111 2222",
    email: "tomislav.voda@example.com",
    serviceArea: {
      lat: 45.327,
      lng: 14.442,
      radiusKm: 25,
      address: "Rijeka, Croatia",
      postcode: "51000",
    },
    certifications: [
      "Licensed Plumber – Croatia",
      "Viessmann Certified Installer",
    ],
    priceRange: {
      hourly: { min: 28, max: 50 },
      project: { min: 300, max: 30000 },
      currency: "EUR",
    },
    yearsExperience: 26,
    available: true,
    featured: false,
    verified: true,
    averageRating: 4.7,
    reviewCount: 29,
    viewCount: 221,
  },
  {
    _id: CONTRACTOR_IDS[3],
    owner: new mongoose.Types.ObjectId(OWNER_IDS[3]),
    name: "Klimatika Josip",
    slug: "klimatika-josip-hvac",
    trade: "HVAC Technician",
    bio: "Air conditioning installation, servicing, and repair. Also handle heat pumps and ventilation systems for residential and small commercial clients. Mitsubishi and Daikin authorised installer.",
    phone: "+385 95 333 4444",
    email: "josip.klima@example.com",
    serviceArea: {
      lat: 45.555,
      lng: 18.695,
      radiusKm: 50,
      address: "Osijek, Croatia",
      postcode: "31000",
    },
    certifications: [
      "F-Gas Certified",
      "Mitsubishi Diamond Partner",
      "Daikin D1 Partner",
    ],
    priceRange: {
      hourly: { min: 32, max: 58 },
      project: { min: 800, max: 80000 },
      currency: "EUR",
    },
    yearsExperience: 14,
    available: false,
    featured: false,
    verified: true,
    averageRating: 4.6,
    reviewCount: 22,
    viewCount: 189,
  },
  {
    _id: CONTRACTOR_IDS[4],
    owner: new mongoose.Types.ObjectId(OWNER_IDS[4]),
    name: "Ante Majstor",
    slug: "ante-majstor-handyman",
    trade: "Handyman",
    bio: "No job too small. Flat-pack assembly, TV mounting, door hanging, tiling, patching, painting — if it needs fixing around the house, I do it. Quick response, honest pricing, no call-out fee.",
    phone: "+385 99 555 6666",
    email: "ante.majstor@example.com",
    serviceArea: {
      lat: 43.508,
      lng: 16.44,
      radiusKm: 15,
      address: "Split, Croatia",
      postcode: "21000",
    },
    certifications: [],
    priceRange: {
      hourly: { min: 20, max: 35 },
      project: { min: 50, max: 5000 },
      currency: "EUR",
    },
    yearsExperience: 8,
    available: true,
    featured: false,
    verified: false,
    averageRating: 4.5,
    reviewCount: 17,
    viewCount: 143,
  },
  {
    _id: CONTRACTOR_IDS[5],
    owner: new mongoose.Types.ObjectId(OWNER_IDS[5]),
    name: "Krovišta Matija",
    slug: "krovista-matija-roofer",
    trade: "Roofer",
    bio: "Full roofing services: new roofs, re-roofing, repairs, guttering, and flat roof waterproofing. Work on pitched tile roofs and modern flat roofs with EPDM or TPO membranes.",
    phone: "+385 91 777 8888",
    email: "matija.krov@example.com",
    serviceArea: {
      lat: 45.815,
      lng: 15.982,
      radiusKm: 60,
      address: "Zagreb, Croatia",
      postcode: "10000",
    },
    certifications: ["IKO Certified Installer", "Bramac Partner", "HGK Member"],
    priceRange: {
      hourly: { min: 30, max: 55 },
      project: { min: 2000, max: 150000 },
      currency: "EUR",
    },
    yearsExperience: 21,
    available: true,
    featured: false,
    verified: true,
    averageRating: 4.7,
    reviewCount: 19,
    viewCount: 267,
  },
  {
    _id: CONTRACTOR_IDS[6],
    owner: new mongoose.Types.ObjectId(OWNER_IDS[6]),
    name: "Green Space – Nikola Zeleni",
    slug: "green-space-nikola-zeleni-landscaper",
    profileImage:
      "https://res.cloudinary.com/devslulj5/image/upload/v1777836755/profile-3_cbwr92.jpg",
    trade: "Landscaper",
    bio: "Garden design, landscaping, and maintenance. From complete garden transformations to regular lawn care. Also install irrigation systems and outdoor lighting. Portfolio includes private gardens, hotel grounds, and public spaces.",
    phone: "+385 98 999 0000",
    email: "nikola.zeleni@example.com",
    serviceArea: {
      lat: 45.327,
      lng: 14.442,
      radiusKm: 35,
      address: "Rijeka, Croatia",
      postcode: "51000",
    },
    certifications: [
      "RHS Level 3 Horticulture",
      "Rainbird Certified Irrigation Installer",
    ],
    priceRange: {
      hourly: { min: 25, max: 45 },
      project: { min: 500, max: 60000 },
      currency: "EUR",
    },
    yearsExperience: 10,
    available: true,
    featured: true,
    verified: true,
    averageRating: 4.8,
    reviewCount: 28,
    viewCount: 354,
  },
  {
    _id: CONTRACTOR_IDS[7],
    owner: new mongoose.Types.ObjectId(OWNER_IDS[7]),
    name: "Podovi Stjepan",
    slug: "podovi-stjepan-flooring",
    trade: "Flooring Specialist",
    bio: "Hardwood, engineered, LVT, and laminate flooring supply and installation. Also handle sanding and refinishing of existing hardwood floors. 15 years fitting floors in Zagreb and surroundings.",
    phone: "+385 91 456 7890",
    email: "stjepan.podovi@example.com",
    serviceArea: {
      lat: 45.815,
      lng: 15.982,
      radiusKm: 30,
      address: "Zagreb, Croatia",
      postcode: "10000",
    },
    certifications: ["Kahrs Certified Installer", "Bona Certified Craftsman"],
    priceRange: {
      hourly: { min: 25, max: 45 },
      project: { min: 800, max: 40000 },
      currency: "EUR",
    },
    yearsExperience: 15,
    available: true,
    featured: false,
    verified: true,
    averageRating: 4.8,
    reviewCount: 41,
    viewCount: 298,
  },
];

export const mockPortfolioItems = [
  // Marko Horvat – General Contractor
  {
    contractor: CONTRACTOR_IDS[0],
    title: "Full Home Renovation – Maksimir",
    description:
      "Complete gut renovation of a 120m² apartment. New electrical, plumbing, flooring, and kitchen.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746805/maksimir-stan_pcswb2.jpg",
    ],
    projectType: "Renovation",
    location: { city: "Zagreb", state: "Zagreb County", zipcode: "10000" },
    completedAt: new Date("2024-11-01"),
  },
  {
    contractor: CONTRACTOR_IDS[0],
    title: "New Build – Sesvete",
    description: "250m² family house construction from foundation to handover.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746810/sevete-novi-stan_jrgpeg.jpg",
    ],
    projectType: "New Build",
    location: { city: "Sesvete", state: "Zagreb County", zipcode: "10360" },
    completedAt: new Date("2024-06-15"),
  },
  // Ivan Perić – Electrician
  {
    contractor: CONTRACTOR_IDS[1],
    title: "Smart Home Wiring – Split 3",
    description:
      "Full rewire of a 90m² apartment with KNX smart home system, motorised blinds, and multi-room audio.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746811/smart-room-split_akcfrd.jpg",
    ],
    projectType: "Smart Home",
    location: {
      city: "Split",
      state: "Split-Dalmatia County",
      zipcode: "21000",
    },
    completedAt: new Date("2025-01-20"),
  },
  {
    contractor: CONTRACTOR_IDS[1],
    title: "EV Charger Installation × 12",
    description:
      "Installed 12 Type 2 wallbox chargers in a residential underground garage.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746814/ev-charger-install_rvwv2j.jpg",
    ],
    projectType: "EV Infrastructure",
    location: {
      city: "Split",
      state: "Split-Dalmatia County",
      zipcode: "21000",
    },
    completedAt: new Date("2024-09-10"),
  },
  // Tomislav Voda – Plumber
  {
    contractor: CONTRACTOR_IDS[2],
    title: "Bathroom Renovation – Kantrida",
    description:
      "Full bathroom strip-out and rebuild. Freestanding bath, walk-in shower, heated towel rail, and underfloor heating.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746813/bathroom_renovation_dh4ep9.jpg",
    ],
    projectType: "Bathroom",
    location: {
      city: "Rijeka",
      state: "Primorje-Gorski Kotar County",
      zipcode: "51000",
    },
    completedAt: new Date("2025-02-14"),
  },
  // Klimatika Josip – HVAC
  {
    contractor: CONTRACTOR_IDS[3],
    title: "Multi-Split AC – Office Block",
    description:
      "Design and installation of 8-zone VRF system for a 600m² office building.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746803/hvac_oq65f0.jpg",
    ],
    projectType: "Commercial HVAC",
    location: {
      city: "Osijek",
      state: "Osijek-Baranja County",
      zipcode: "31000",
    },
    completedAt: new Date("2024-08-30"),
  },
  {
    contractor: CONTRACTOR_IDS[3],
    title: "Heat Pump – Detached House",
    description:
      "Air-to-water heat pump installation replacing an old oil boiler, including underfloor heating manifold.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746802/heatpump-2_hvjl8a.avif",
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746801/heatpump-1_ylrjnj.jpg",
    ],
    projectType: "Heat Pump",
    location: {
      city: "Đakovo",
      state: "Osijek-Baranja County",
      zipcode: "31400",
    },
    completedAt: new Date("2025-01-05"),
  },
  // Ante Majstor – Handyman
  {
    contractor: CONTRACTOR_IDS[4],
    title: "Outdoor Decking – Žnjan",
    description:
      "Built a 24m² composite decking area with built-in planters and outdoor lighting.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746805/outdoordeck-1_fg0fpn.jpg",
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746806/outdoordeck-2_q85cza.jpg",
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746807/outdoordeck-3_m6sp4r.jpg",
    ],
    projectType: "Outdoor",
    location: {
      city: "Split",
      state: "Split-Dalmatia County",
      zipcode: "21000",
    },
    completedAt: new Date("2024-07-22"),
  },
  // Krovišta Matija – Roofer
  {
    contractor: CONTRACTOR_IDS[5],
    title: "Full Re-Roof – Samobor",
    description:
      "Stripped and re-laid 280m² clay tile roof on a 1970s family home. New battens, membrane, and ridge tiles.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746807/reroof-1_igmecf.webp",
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746808/reroof-2_vdgzjr.webp",
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746809/reroof-3_vypgrt.jpg",
    ],
    projectType: "Re-Roof",
    location: { city: "Samobor", state: "Zagreb County", zipcode: "10430" },
    completedAt: new Date("2024-10-05"),
  },
  {
    contractor: CONTRACTOR_IDS[5],
    title: "Flat Roof – Commercial Unit",
    description:
      "400m² EPDM flat roof on a warehouse, including new drainage and insulation upgrade.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746797/flatroof-2_vg76gk.jpg",
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746796/flatroof-1_zx64m5.jpg",
    ],
    projectType: "Flat Roof",
    location: {
      city: "Velika Gorica",
      state: "Zagreb County",
      zipcode: "10410",
    },
    completedAt: new Date("2024-05-18"),
  },
  // Green Space Nikola – Landscaper
  {
    contractor: CONTRACTOR_IDS[6],
    title: "Garden Redesign – Opatija Villa",
    description:
      "Full garden redesign for a 600m² coastal villa. Mediterranean planting scheme, stone terracing, and drip irrigation.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746798/garden-redesign-1_jirgpj.jpg",
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746798/garden-redesign-2_k2sj1c.jpg",
    ],
    projectType: "Garden Design",
    location: {
      city: "Opatija",
      state: "Primorje-Gorski Kotar County",
      zipcode: "51410",
    },
    completedAt: new Date("2025-03-10"),
  },
  {
    contractor: CONTRACTOR_IDS[6],
    title: "Artificial Turf & Decking – Kostrena",
    description:
      "Replaced a neglected garden with low-maintenance artificial lawn, composite decking, and raised planters.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746811/art-turf-1_xoq6ky.jpg",
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746812/art-turf-2_ryxscc.jpg",
    ],
    projectType: "Garden Makeover",
    location: {
      city: "Kostrena",
      state: "Primorje-Gorski Kotar County",
      zipcode: "51221",
    },
    completedAt: new Date("2024-04-20"),
  },
  // Podovi Stjepan – Flooring
  {
    contractor: CONTRACTOR_IDS[7],
    title: "Herringbone Oak – Gornji Grad Apartment",
    description:
      "180m² of engineered oak in herringbone pattern. Underfloor heating compatible, matt lacquer finish.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746799/gornji-grad-parket-2_u0bjii.jpg",
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746798/gornji-grad-parket-1_flqoyl.jpg",
    ],
    projectType: "Hardwood Flooring",
    location: { city: "Zagreb", state: "Zagreb County", zipcode: "10000" },
    completedAt: new Date("2025-02-28"),
  },
  {
    contractor: CONTRACTOR_IDS[7],
    title: "LVT Throughout – New Build",
    description:
      "850m² of luxury vinyl tile in a 5-bedroom new build. Waterproof throughout including bathrooms.",
    images: [
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746803/lvt-flooring-1_zy1peh.webp",
      "https://res.cloudinary.com/devslulj5/image/upload/v1777746804/lvt-flooring-2_hik62q.webp",
    ],
    projectType: "LVT",
    location: { city: "Zaprešić", state: "Zagreb County", zipcode: "10290" },
    completedAt: new Date("2024-12-19"),
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;
  const contractors = db.collection("contractors");
  const portfolio = db.collection("portfolios");

  await contractors.deleteMany({ _id: { $in: CONTRACTOR_IDS } });
  await portfolio.deleteMany({ contractor: { $in: CONTRACTOR_IDS } });

  await contractors.insertMany(mockContractors);
  console.log(`Seeded ${mockContractors.length} contractors`);

  await portfolio.insertMany(mockPortfolioItems);
  console.log(`Seeded ${mockPortfolioItems.length} portfolio items`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
