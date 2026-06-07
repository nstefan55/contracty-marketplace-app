import "dotenv/config";
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const SEED_DOMAIN = "@contracty-seed.dev";

// ─── Inline schemas ───────────────────────────────────────────────────────────

const User = models.User || model("User", new Schema({ email: String }, { strict: false }));
const Contractor = models.Contractor || model("Contractor", new Schema({ owner: Schema.Types.ObjectId, trade: String, name: String, slug: String, serviceArea: { city: String } }, { strict: false }));

const portfolioSchema = new Schema(
  {
    contractor: { type: Schema.Types.ObjectId, ref: "Contractor", required: true, index: true },
    title: { type: String, required: true },
    description: String,
    images: [String],
    projectType: String,
    location: { street: String, city: String, state: String, zipcode: String },
    completedAt: Date,
  },
  { timestamps: true },
);
const Portfolio = models.Portfolio || model("Portfolio", portfolioSchema);

// ─── Trade portfolio templates ────────────────────────────────────────────────
// Each trade has exactly 6 project templates

const PORTFOLIO_TEMPLATES = {
  Electrician: [
    { title: "Complete Home Rewiring – 4-Bed Detached", description: "Full rewire of a 1970s detached house including new consumer unit, upgraded earthing, and installation of smart home wiring infrastructure. All circuits tested and certified.", projectType: "Residential Rewire" },
    { title: "Solar PV & Battery Storage System", description: "14-panel rooftop solar installation with 10kWh battery storage and smart monitoring app. System offsets approximately 70% of the household's energy consumption.", projectType: "Solar Installation" },
    { title: "Smart Home Automation Fit-Out", description: "Whole-house smart lighting, motorised blinds, multi-room audio, and automated security system integrated through a single app. Works with voice assistants.", projectType: "Smart Home" },
    { title: "EV Charging Station – Residential & Commercial", description: "Installation of three 22kW commercial EV chargers in an office car park plus two home 7.4kW wallbox chargers for residential clients. OZEV grant applications handled.", projectType: "EV Charging" },
    { title: "Commercial Office Electrical Fit-Out", description: "New 200A three-phase supply, server room UPS wiring, structured cabling, and emergency lighting throughout a 600m² office refurbishment.", projectType: "Commercial Fit-Out" },
    { title: "Consumer Unit Upgrade & Periodic Inspection", description: "Old fuse board replaced with a modern RCBO-protected consumer unit. Full periodic inspection report issued. All defects rectified same day.", projectType: "Consumer Unit" },
  ],
  Plumber: [
    { title: "Full Bathroom Design & Installation", description: "Complete design and fit of a luxury en-suite — freestanding bath, walk-in rainfall shower, twin vanity, heated towel rail, and underfloor heating. Delivered in 8 days.", projectType: "Bathroom Installation" },
    { title: "Complete Central Heating System Replacement", description: "Old gravity-fed system stripped out and replaced with a modern sealed pressurised system, new radiators throughout, and a high-efficiency combi boiler. Carbon savings measured.", projectType: "Heating System" },
    { title: "Kitchen Replumb & Appliance Connection", description: "Full kitchen replumb including new supply and waste runs to an island unit, dishwasher, American fridge-freezer, and instant hot water tap.", projectType: "Kitchen Plumbing" },
    { title: "Underfloor Heating – Ground Floor Extension", description: "Wet UFH manifold system installed across 65m² of a single-storey extension. Zoned controls per room and integrated with the existing boiler.", projectType: "Underfloor Heating" },
    { title: "Emergency Leak Repair & Pipe Rerouting", description: "Located and repaired a concealed leak under a concrete screed floor. Pipe rerouted through the wall cavity to avoid recurrence. Minimum disruption to the homeowner.", projectType: "Leak Repair" },
    { title: "Rainwater Harvesting System", description: "2,000-litre underground tank with pump system installed to supply garden irrigation and toilet flushing. WRAS-compliant installation.", projectType: "Rainwater Harvesting" },
  ],
  "General Contractor": [
    { title: "Single-Storey Rear Extension – 35m²", description: "Full-width kitchen-diner extension including structural steelwork, lantern roof, underfloor heating, and bifold doors. Managed from planning application to snagging.", projectType: "Extension" },
    { title: "Victorian Terrace Full Renovation", description: "Whole-house renovation of a 4-bed Victorian terrace: structural repairs, replastering, new electrics, heating, kitchen, two bathrooms, and full internal fit-out.", projectType: "Full Renovation" },
    { title: "Loft Conversion – Dormer with En-Suite", description: "Full dormer loft conversion adding a double bedroom with en-suite and home office. Structural engineering managed in-house. Building regs sign-off obtained.", projectType: "Loft Conversion" },
    { title: "Commercial Restaurant Fit-Out", description: "Design and build of a 60-cover restaurant including commercial kitchen extraction, specialist flooring, custom bar construction, and mood lighting system.", projectType: "Commercial Fit-Out" },
    { title: "New Build Garden Studio & Gym", description: "Detached studio built to residential specification with structural insulated panels, concrete base, full electrics, plumbing, and bespoke interior fit-out.", projectType: "New Build" },
    { title: "Open-Plan Kitchen & Living Room Conversion", description: "Structural wall removed with RSJ installed, creating a 60m² open-plan space. New kitchen, oak flooring throughout, and remodelled staircase.", projectType: "Structural Remodel" },
  ],
  Carpenter: [
    { title: "Fitted Bedroom Suite – 4 Rooms", description: "Bespoke floor-to-ceiling wardrobes in four bedrooms using solid oak fronts with soft-close mechanisms, integrated lighting, and pull-out drawer inserts.", projectType: "Fitted Furniture" },
    { title: "Bespoke Kitchen Cabinetry", description: "Handmade Shaker-style kitchen in painted MDF with solid oak worktops, integrated appliances, and bespoke larder units. Six-week build and install.", projectType: "Kitchen Cabinetry" },
    { title: "Oak Hardwood Flooring – Whole House", description: "18mm solid oak flooring laid throughout a four-bedroom house. Floor levelled, fitted, and finished with three coats of hardwax oil.", projectType: "Flooring" },
    { title: "Floating Staircase with Glass Balustrade", description: "Bespoke open-tread oak staircase with structural glass panels. Designed to maximise light flow through the hallway. Engineering approved.", projectType: "Staircase" },
    { title: "Garden Timber Deck & Pergola", description: "30m² hardwood deck with inset planters and a pergola structure for climbing plants. Hidden fixings throughout for a clean aesthetic.", projectType: "External Carpentry" },
    { title: "Home Library & Study Joinery", description: "Floor-to-ceiling bookshelves and rolling library ladder fitted in a home study. Custom under-desk filing units and cable management built in.", projectType: "Custom Joinery" },
  ],
  Painter: [
    { title: "Full Interior Repaint – 5-Bed House", description: "Complete repaint of a large detached house including all walls, ceilings, woodwork, and radiators. Colour scheme developed in consultation with the client.", projectType: "Interior Painting" },
    { title: "Exterior Masonry Repaint – Period Property", description: "Three-storey Victorian façade prepared, repaired, and repainted in high-quality masonry paint. Scaffolding managed by our team. 7-year guarantee.", projectType: "Exterior Painting" },
    { title: "Venetian Plaster Feature Walls", description: "Four feature walls finished in Italian Marmorino Venetian plaster. Burnished to a high sheen. A striking alternative to standard painted walls.", projectType: "Decorative Finish" },
    { title: "Kitchen Cabinet Repainting & Refresh", description: "Existing kitchen cabinets sanded, primed, and spray-finished in Farrow & Ball Mole's Breath. New brushed brass hardware fitted. Cost-effective kitchen transformation.", projectType: "Cabinet Repainting" },
    { title: "Commercial Office Redecoration", description: "Weekend redecoration of 1,200m² of open-plan office space. Minimal business disruption. All works completed by Monday morning as agreed.", projectType: "Commercial Painting" },
    { title: "Children's Room Mural & Specialist Finishes", description: "Hand-painted jungle mural in a nursery covering two walls. Glow-in-the-dark star ceiling finish in the adjacent bedroom. Bespoke and memorable.", projectType: "Mural & Specialist" },
  ],
  Roofer: [
    { title: "Full Re-Roof in Welsh Slate", description: "Complete strip and re-roof of a detached house in reclaimed Welsh slate. New breathable membrane, battens, and all lead flashings replaced. 10-year guarantee.", projectType: "Re-Roofing" },
    { title: "Flat Roof Replacement – Cold-Applied System", description: "1,200mm SBS modified bitumen membrane system applied to a flat roof extension. Drainage outlets redesigned to eliminate pooling. 20-year product warranty.", projectType: "Flat Roof" },
    { title: "Green Sedum Roof – Garden Studio", description: "40mm sedum blanket installed on a garden studio. Waterproofing layer, drainage board, filter fleece, growing medium, and pre-grown sedum all installed.", projectType: "Green Roof" },
    { title: "Chimney Restoration & Flashing Replacement", description: "Two chimney stacks repointed in matching mortar, lead flashings replaced, new pots fitted, and cowls added. Water ingress resolved immediately.", projectType: "Chimney Repair" },
    { title: "Velux Window Installation – Loft Conversion", description: "Five Velux centre-pivot windows installed in a loft conversion including thermal collars and blackout blinds. All flashing kits installed to specification.", projectType: "Roof Windows" },
    { title: "Dry Verge & Ridge System Replacement", description: "Entire property re-ridged and dry verge units installed to replace old mortar bedding. The roof is now maintenance-free at all verges and ridges.", projectType: "Roof Maintenance" },
  ],
  "HVAC Technician": [
    { title: "Air Source Heat Pump Installation – 4-Bed House", description: "11kW Mitsubishi Ecodan heat pump installed replacing an old gas boiler. Fully integrated with existing radiators (upsized where necessary) and smart thermostat.", projectType: "Heat Pump" },
    { title: "Multi-Split Air Conditioning – Residential", description: "Five-room multi-split system with concealed pipework. Individual temperature control per room, quiet inverter units, and 5-year parts warranty.", projectType: "Air Conditioning" },
    { title: "Whole-House MVHR Ventilation System", description: "Mechanical ventilation with heat recovery installed in a new build. Continuous background ventilation with 85% heat recovery. Air quality monitored via app.", projectType: "Ventilation" },
    { title: "Commercial Kitchen Extraction & Make-Up Air", description: "8,000m³/h extraction canopy with gas interlock and UV filtration. Make-up air unit supplies conditioned fresh air to the kitchen environment.", projectType: "Commercial HVAC" },
    { title: "Underfloor Heating – Retrofit Ground Floor", description: "Low-profile electric UFH mats installed under new floor tiles across the ground floor. Compatible with an existing heat pump and smart control system.", projectType: "Underfloor Heating" },
    { title: "Smart Zoning & Building Controls Upgrade", description: "Six-zone heating and cooling control system retrofitted to a large commercial building. Energy consumption reduced by 30% in the first year post-installation.", projectType: "Smart Controls" },
  ],
  Tiler: [
    { title: "Large-Format Porcelain Bathroom – Full Project", description: "120×60cm rectified porcelain tiles throughout a master bathroom including shower enclosure, feature niche, and floor with underfloor heating. Zero lippage across all surfaces.", projectType: "Bathroom Tiling" },
    { title: "Herringbone Floor – Hall, Kitchen & Diner", description: "75×150mm porcelain tiles in a classic herringbone pattern across 80m². Laser-set layout with consistent 2mm grout joints throughout.", projectType: "Floor Tiling" },
    { title: "Natural Limestone Kitchen & Breakfast Bar", description: "Honed Jura limestone tiles on walls and floor of an open-plan kitchen. Impregnating sealer applied with instructions for ongoing maintenance.", projectType: "Natural Stone" },
    { title: "Swimming Pool Surround & Wet Room", description: "Anti-slip mosaic tiles to pool surround and associated shower and changing areas. Tanking membrane applied beneath all wet area tiling.", projectType: "Pool & Wet Room" },
    { title: "Victorian Encaustic Entrance Hall", description: "Authentic Victorian encaustic cement tiles in a geometric pattern. Lime mortar bed used to preserve movement and compatibility with the original structure.", projectType: "Period Restoration" },
    { title: "Roof Terrace in Porcelain Pavers", description: "600×600mm outdoor porcelain pavers on adjustable pedestal system. Level finish on an uneven substrate with 5mm shadow gap joints throughout.", projectType: "External Tiling" },
  ],
  Mason: [
    { title: "Dry Stone Boundary Wall Restoration", description: "160m of traditional dry stone wall rebuilt using original stone. Matching cope stones sourced locally. A heritage skill applied to practical landscaping.", projectType: "Stone Wall" },
    { title: "Inglenook Fireplace & Chimney Breast", description: "Full inglenook construction in reclaimed hand-made brick. Structural steel lintel, clay flue liner, and Cotswold stone hearth. HETAS approved installation.", projectType: "Fireplace" },
    { title: "Stone Façade Restoration – Period Property", description: "Façade of a 1890s stone villa repointed in natural hydraulic lime. Three failed concrete patches removed and replaced with matching stone and lime mortar.", projectType: "Restoration" },
    { title: "Garden Feature Wall & Raised Beds", description: "Coursed Yorkstone garden wall and matching raised beds constructed from reclaimed dressed stone. Feature circular insets with contrasting flint panels.", projectType: "Landscaping" },
    { title: "Structural Underpinning & Foundation Repair", description: "Mass concrete underpinning to six bays of a semi-detached house with a cracked foundation. Specialist lime render reapplied over all repaired sections.", projectType: "Structural" },
    { title: "Stone Water Feature – Courtyard Garden", description: "Multi-tiered natural stone water feature with recirculating pump concealed within a base plinth. Limestone rock-face finish with moss planting in the joints.", projectType: "Water Feature" },
  ],
  Landscaper: [
    { title: "Complete Garden Redesign – Suburban Plot", description: "600m² rear garden redesigned from scratch. Structural planting, curved lawn, sandstone terrace, raised timber beds, and a pergola seating area.", projectType: "Garden Design" },
    { title: "Automated Drip Irrigation System", description: "Subterranean irrigation system with soil moisture sensors installed across a large garden. Controlled by a smart app with weather-based adjustments.", projectType: "Irrigation" },
    { title: "Drought-Tolerant Mediterranean Garden", description: "Full planting scheme in Stipa grasses, Lavender, Agapanthus, and succulents. Gravel mulch, drip irrigation, and zero regular watering needed after establishment.", projectType: "Planting Scheme" },
    { title: "Rooftop Terrace Garden", description: "600mm-deep structural planting on a city rooftop. Wind-resilient species, lightweight growing medium, and a built-in drip system. Private green sanctuary.", projectType: "Roof Garden" },
    { title: "Wildflower Meadow Establishment", description: "1,200m² former lawn seeded with a regional wildflower mix. Paths mown through. Supports pollinators and significantly reduces maintenance costs year-on-year.", projectType: "Wildflower Meadow" },
    { title: "Formal Walled Kitchen Garden", description: "Raised vegetable beds, fruit cage, trained fruit trees on brick walls, and a glasshouse. Full irrigation and composting system integrated.", projectType: "Kitchen Garden" },
  ],
  "Concrete & Paving": [
    { title: "Pattern-Imprinted Concrete Driveway", description: "180m² imprinted concrete driveway in Ashlar slate pattern with antique oak release colour. Sub-base compacted to SuDS standards, drainage channel installed.", projectType: "Driveway" },
    { title: "Polished Concrete Internal Floor", description: "Ground, honed, and polished concrete floor in an open-plan kitchen-diner. Integral coloured chips added and sealed with polyurethane topcoat.", projectType: "Interior Concrete" },
    { title: "Block Paving Courtyard & Paths", description: "Natural limestone setts laid in a fan pattern across a formal courtyard. Edged in steel strips with infilled gravel margins.", projectType: "Block Paving" },
    { title: "Reinforced Concrete Retaining Wall", description: "1.8m reinforced concrete retaining wall 40m in length. Fully engineered design, weepholes installed, and drainage aggregate backfilled.", projectType: "Retaining Wall" },
    { title: "Resin-Bound Driveway & Pedestrian Area", description: "SUDS-compliant resin-bound aggregate driveway in 12mm buff limestone. Fully permeable, no pooling, and low maintenance over the long term.", projectType: "Resin-Bound" },
    { title: "Commercial Lorry Yard – Heavy-Duty Concrete", description: "1,500m² reinforced RC40 concrete lorry yard. Joint positions designed by a structural engineer. No cracking after two years of HGV use.", projectType: "Commercial Concrete" },
  ],
  "Flooring Specialist": [
    { title: "Solid Oak Flooring – Whole House", description: "22mm wide-plank solid oak laid throughout a 4-bed house. Floors levelled with self-levelling compound and finished with Rubio Monocoat hardwax oil.", projectType: "Hardwood Flooring" },
    { title: "Antique Parquet Restoration", description: "Original 1930s parquet floor cleaned of old varnish, repaired where damaged, filled, and refinished with three coats of satin lacquer.", projectType: "Floor Restoration" },
    { title: "Herringbone Engineered Oak – Open Plan", description: "Engineered herringbone oak laid across a 120m² open-plan living area over underfloor heating. Expansion gap concealed with bespoke skirting profile.", projectType: "Engineered Flooring" },
    { title: "Commercial LVT – Retail & Office", description: "4,000m² of luxury vinyl tile installed across a mixed commercial development. Rapid installation programme completed over a single weekend.", projectType: "Commercial LVT" },
    { title: "Karndean Opus – Kitchen & Utility", description: "Waterproof Karndean LVT in a stone effect laid in a chevron pattern for a kitchen-diner and utility room. Seamless through two doorways.", projectType: "LVT Flooring" },
    { title: "Period Property – Reclaimed Timber Boards", description: "Reclaimed Victorian floorboards resized, de-nailed, and re-laid in a period property. Hand-finished with natural Danish oil for an authentic aged look.", projectType: "Reclaimed Timber" },
  ],
  Handyman: [
    { title: "New Home Punch List – 27 Tasks", description: "Comprehensive snag list completed on a new-build home including door adjustments, missing fixtures, sealant work, and touch-up painting.", projectType: "New Home Snag" },
    { title: "Flat-Pack Furniture Assembly – Full House", description: "Complete flat-pack assembly for a new home: 12 pieces of furniture across 5 rooms in one day. All items level, aligned, and stable.", projectType: "Furniture Assembly" },
    { title: "TV & Lighting Installation", description: "Four TVs mounted with concealed cabling and HDMI connection through the wall. Smart LED strip lighting installed in three rooms.", projectType: "Mounting & Lighting" },
    { title: "Garden & Exterior Maintenance Day", description: "Gate locks replaced, fence panels repaired, shed door rehung, external tap fitted, and outdoor lighting positioned and tested.", projectType: "Exterior Maintenance" },
    { title: "Bathroom Accessory Fit-Out", description: "Towel rail, toilet roll holder, mirror, shelving, and cabinet all installed in a freshly decorated bathroom. All items level and secured into studs.", projectType: "Bathroom Fixtures" },
    { title: "Pre-Tenancy Property Refresh", description: "Full property refresh for a landlord: touch-up painting, door handle replacement, blind fitting, appliance connection, and deep clean supervision.", projectType: "Property Refresh" },
  ],
  "Window & Door Specialist": [
    { title: "Triple-Glazed Window Replacement – Whole House", description: "All 14 windows replaced with A-rated triple-glazed PVC units. U-value improved from 2.8 to 0.7 W/m²K. FENSA certificate issued.", projectType: "Window Replacement" },
    { title: "Aluminium Bi-Fold Doors – 5.4m Opening", description: "Seven-panel aluminium bi-fold doors in RAL 7016 anthracite grey. Integrated threshold and external decking level for a seamless transition.", projectType: "Bi-Fold Doors" },
    { title: "Heritage Sash Window Restoration", description: "Eight original Victorian sash windows fully restored. Draught strips fitted, weights rebalanced, and reglazed with period-correct glass where needed.", projectType: "Sash Restoration" },
    { title: "Composite Front Door & Frame", description: "Bespoke composite door with multi-point lock, two sidelights in privacy glass, and a smart lock integrated with the home security system.", projectType: "Front Door" },
    { title: "Roof Light Installation – Kitchen Extension", description: "Three-pane modular roof light installed over a flat-roof kitchen extension. Thermally broken aluminium frame, toughened glass, and solar-control coating.", projectType: "Roof Light" },
    { title: "Commercial Aluminium Shopfront", description: "Full aluminium shopfront with powder-coated frames, integrated security shutter, and double-glazed display windows. Planning permission managed by our team.", projectType: "Commercial Glazing" },
  ],
};

// ─── City data ────────────────────────────────────────────────────────────────

const CITIES = [
  { city: "Zagreb", state: "Zagreb County", zipcode: "10000" },
  { city: "Split", state: "Split-Dalmatia County", zipcode: "21000" },
  { city: "Rijeka", state: "Primorje-Gorski Kotar County", zipcode: "51000" },
  { city: "Osijek", state: "Osijek-Baranja County", zipcode: "31000" },
  { city: "Zadar", state: "Zadar County", zipcode: "23000" },
  { city: "Dubrovnik", state: "Dubrovnik-Neretva County", zipcode: "20000" },
];

const STREETS = [
  "Ilica 42", "Maksimirska 18", "Vukovarska 7", "Savska cesta 103",
  "Heinzelova 4", "Trnjanska 56", "Horvaćanska 21", "Zvonimirova 88",
  "Draškovićeva 32", "Petrinjska 64", "Gajeva 11", "Jurišićeva 23",
];

// ─── Main ─────────────────────────────────────────────────────────────────────

function randomPastDate(monthsBack) {
  const d = new Date();
  d.setMonth(d.getMonth() - Math.floor(Math.random() * monthsBack) - 1);
  return d;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  console.log("✔ Connected to MongoDB");

  const seedUserIds = new Set((await User.find({ email: { $regex: `${SEED_DOMAIN}$` } }).select("_id").lean()).map((u) => u._id.toString()));
  const seedContractors = (await Contractor.find({}).lean()).filter((c) => seedUserIds.has(c.owner.toString()));

  if (seedContractors.length === 0) {
    console.error("❌ No seed contractors found. Run seed-users.mjs first.");
    process.exit(1);
  }

  // Clear existing seed portfolios
  const seedContractorIds = seedContractors.map((c) => c._id);
  await Portfolio.deleteMany({ contractor: { $in: seedContractorIds } });
  console.log(`✔ Cleared existing seed portfolios for ${seedContractors.length} contractors`);

  let totalPortfolios = 0;

  for (const contractor of seedContractors) {
    const templates = PORTFOLIO_TEMPLATES[contractor.trade] ?? PORTFOLIO_TEMPLATES.Handyman;

    const items = templates.map((t, i) => {
      const cityData = CITIES[i % CITIES.length];
      const slug = contractor.slug ?? "c";
      return {
        contractor: contractor._id,
        title: t.title,
        description: t.description,
        images: [
          `https://picsum.photos/seed/${slug}-p${i}-a/800/600`,
          `https://picsum.photos/seed/${slug}-p${i}-b/800/600`,
          `https://picsum.photos/seed/${slug}-p${i}-c/800/600`,
        ],
        projectType: t.projectType,
        location: {
          street: STREETS[(i * 3 + slug.length) % STREETS.length],
          city: cityData.city,
          state: cityData.state,
          zipcode: cityData.zipcode,
        },
        completedAt: randomPastDate(24),
      };
    });

    await Portfolio.insertMany(items);
    totalPortfolios += items.length;
    process.stdout.write(`  ✔ ${contractor.name} (${contractor.trade}) — ${items.length} portfolio items\n`);
  }

  console.log(`\n✅ Created ${totalPortfolios} portfolio items across ${seedContractors.length} contractors`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
