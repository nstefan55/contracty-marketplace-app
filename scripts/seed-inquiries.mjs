import "dotenv/config";
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const SEED_DOMAIN = "@contracty-seed.dev";

// ─── Inline schemas ───────────────────────────────────────────────────────────

const User = models.User || model("User", new Schema({ email: String, role: String, name: String }, { strict: false }));
const Contractor = models.Contractor || model("Contractor", new Schema({ owner: Schema.Types.ObjectId, trade: String, name: String, slug: String, serviceArea: Object }, { strict: false }));

const inquirySchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contractor: { type: Schema.Types.ObjectId, ref: "Contractor", required: true },
    projectType: { type: String, required: true },
    budget: String,
    timeline: String,
    siteAddress: String,
    description: { type: String, required: true, maxlength: 1000 },
    replies: [],
    status: { type: String, enum: ["new", "read", "replied", "closed"], default: "new" },
  },
  { timestamps: true },
);
const Inquiry = models.Inquiry || model("Inquiry", inquirySchema);

// ─── Trade-specific inquiry templates ────────────────────────────────────────
// Each trade has 20 descriptions (one per homeowner, cycled round-robin)

const INQUIRY_TEMPLATES = {
  Electrician: [
    { desc: "We have an old fuse box from the 1980s that keeps tripping and I'm concerned it's no longer safe. I'd like a full inspection and a quote to replace the consumer unit. The house is a 3-bed semi.", projectType: "Consumer Unit Upgrade", budget: "€800–€1,500", timeline: "Within 1 month" },
    { desc: "Looking to install an EV charger in my garage for a new electric car. I'd like a 7.4kW unit ideally. Can you advise on the best location and cabling route from the consumer unit?", projectType: "EV Charger Installation", budget: "€600–€1,000", timeline: "Within 2 weeks" },
    { desc: "I want to add smart home lighting throughout my house — dimmer switches in every room, motion sensors in hallways, and automated outdoor lighting. Total of 12 rooms.", projectType: "Smart Home Lighting", budget: "€2,000–€4,000", timeline: "Within 2 months" },
    { desc: "We're renovating our kitchen and need all the circuits upgraded: new dedicated circuits for the hob, oven, and dishwasher, plus additional sockets. Can you look at this as part of the kitchen project?", projectType: "Kitchen Electrical", budget: "€500–€900", timeline: "Within 3 weeks" },
    { desc: "Planning to install 12 solar panels on my south-facing roof with battery storage. I'd like to understand the grid connection requirements and whether my consumer unit needs upgrading first.", projectType: "Solar & Battery", budget: "€8,000–€12,000", timeline: "Within 3 months" },
    { desc: "Periodic electrical inspection due — the house is 25 years old and I've never had one done. Also need all the bathroom circuits checked as we're adding a heated towel rail.", projectType: "Periodic Inspection", budget: "€300–€500", timeline: "Within 1 month" },
    { desc: "I need outdoor sockets and weatherproof lighting for a patio area and shed. Ideally supply from a dedicated circuit so the main house isn't affected if anything trips.", projectType: "Outdoor Electrics", budget: "€600–€1,200", timeline: "Within 6 weeks" },
    { desc: "We have a commercial office being refitted and need complete electrical works: new distribution board, structured cabling, emergency lighting, and external signage wiring.", projectType: "Commercial Fit-Out", budget: "€5,000–€10,000", timeline: "Within 2 months" },
    { desc: "Intermittent power cuts in two rooms only. Suspect a bad connection somewhere but the previous electrician couldn't locate it. Need fault-finding and remediation.", projectType: "Fault Finding", budget: "€200–€600", timeline: "As soon as possible" },
    { desc: "Installing a hot tub in the garden and need a dedicated 32A circuit installed from the consumer unit with a waterproof isolator switch at the unit.", projectType: "Hot Tub Supply", budget: "€500–€900", timeline: "Within 3 weeks" },
    { desc: "Full rewire of a 4-bed detached house built in 1965. Current wiring is rubber-insulated and no earth bonding in bathrooms. Need the full job including a new consumer unit.", projectType: "Full Rewire", budget: "€4,000–€7,000", timeline: "Within 2 months" },
    { desc: "Data cabling and network points in every room of a new build. Looking for Cat6 to a central patch panel in the hallway cupboard with WiFi access points in three locations.", projectType: "Data & Network", budget: "€1,000–€2,000", timeline: "Within 6 weeks" },
    { desc: "We need security cameras, door entry panel, and motion-activated lighting wired up at a newly purchased property. Happy to use your recommended equipment.", projectType: "Security Systems", budget: "€1,500–€3,000", timeline: "Within 1 month" },
    { desc: "Kitchen island needs four double sockets, USB charging points, and a pop-up socket unit in the worktop. The island will be in the centre of the room so cable routing will need planning.", projectType: "Kitchen Island Sockets", budget: "€400–€700", timeline: "Within 1 month" },
    { desc: "Installing underfloor heating mats in a new bathroom and want them connected to a programmable thermostat and integrated with the smart home system already in place.", projectType: "UFH Controls", budget: "€300–€600", timeline: "Within 3 weeks" },
    { desc: "We're converting a basement into a habitable room and need complete electrical installation: lighting, sockets, ventilation fan, and a dedicated circuit run from upstairs.", projectType: "Basement Electrics", budget: "€1,500–€2,500", timeline: "Within 2 months" },
    { desc: "Fire alarm system upgrade needed in a four-floor apartment block. The current system is outdated and failed the last safety inspection. Needs an L2 system installed.", projectType: "Fire Alarm", budget: "€3,000–€6,000", timeline: "Within 6 weeks" },
    { desc: "Home cinema room being set up in the loft — need dedicated circuit, dimmable lighting, projector feed, multiple HDMI and power points, and acoustic ventilation connection.", projectType: "Home Cinema", budget: "€800–€1,500", timeline: "Within 2 months" },
    { desc: "Looking for a regular annual service contract for our commercial premises covering consumer unit inspection, testing of emergency lighting, and PAT testing for all equipment.", projectType: "Maintenance Contract", budget: "€500–€1,000/year", timeline: "Ongoing" },
    { desc: "New workshop building needs electrical supply run from the house consumer unit: 32A supply, distribution board in the workshop, lighting, sockets, and a 16A outlet for machinery.", projectType: "Workshop Electrics", budget: "€1,200–€2,200", timeline: "Within 6 weeks" },
  ],
  Plumber: [
    { desc: "Complete bathroom refit — currently a plain white suite from the 1990s. We want a walk-in shower, freestanding bath, wall-hung toilet and vanity, and heated towel rail. Looking for a full supply and fit.", projectType: "Bathroom Refit", budget: "€5,000–€9,000", timeline: "Within 2 months" },
    { desc: "Our boiler is 18 years old and breaks down every winter. Ready to replace it with a new combi boiler. The house is a 3-bed terrace. Would also want all radiators power flushed.", projectType: "Boiler Replacement", budget: "€2,500–€4,000", timeline: "Within 1 month" },
    { desc: "Water pressure has been low throughout the house for over a year. We have a combi boiler so not sure if it's a pipe restriction or something at the boiler. Need diagnosis and fix.", projectType: "Low Water Pressure", budget: "€300–€800", timeline: "As soon as possible" },
    { desc: "Kitchen extension nearly done and we need the sink, dishwasher, and a boiling water tap all connected. Also want an outdoor tap at the back of the house.", projectType: "Kitchen Plumbing", budget: "€600–€1,200", timeline: "Within 3 weeks" },
    { desc: "Wet room being created from an existing bathroom. Need full tanking, drain installation, shower valve and glass screen plumbing, and a new towel rail connected to the central heating.", projectType: "Wet Room", budget: "€2,000–€4,500", timeline: "Within 6 weeks" },
    { desc: "Emergency — water pooling under the floorboards in the hallway. Suspect a slow leak from a joint under the floor. Can you attend within 48 hours to investigate?", projectType: "Emergency Leak", budget: "Open — emergency", timeline: "ASAP" },
    { desc: "We want to add a downstairs toilet in a cupboard under the stairs. It's next to the soil stack which should make it simpler. Looking for complete installation.", projectType: "Cloakroom WC", budget: "€1,800–€3,500", timeline: "Within 2 months" },
    { desc: "Underfloor heating being installed in a new kitchen extension. We have a combi boiler — can it support the UFH or will we need a separate circuit? Please survey and quote.", projectType: "Underfloor Heating", budget: "€1,500–€3,000", timeline: "Within 6 weeks" },
    { desc: "Both our upstairs bathroom and en-suite need new showers — one enclosure and one wet room walk-in. Would prefer the same installer to complete both at the same time.", projectType: "Twin Shower Installation", budget: "€2,500–€4,500", timeline: "Within 2 months" },
    { desc: "Roof terrace garden needs a water supply and drainage point installed for an outdoor tap and a plant irrigation connection. No current supply above ground floor.", projectType: "Outdoor Water Supply", budget: "€400–€900", timeline: "Within 1 month" },
    { desc: "Old radiators throughout the house are heating unevenly — some rooms very hot, others cold. Want the system balanced properly and two radiators replaced with modern ones.", projectType: "Heating Balance & Radiators", budget: "€500–€1,000", timeline: "Within 3 weeks" },
    { desc: "Planning to install a rainwater harvesting tank for garden irrigation. We have a large garden and currently spend a lot on hosepipe. Interested in underground storage with pump.", projectType: "Rainwater Harvesting", budget: "€2,000–€4,000", timeline: "Within 3 months" },
    { desc: "Blocked shower drain that keeps backing up. Also the bath drain is slow. Suspect a partial blockage in the shared soil pipe. Can you investigate and clear?", projectType: "Drain Clearance", budget: "€150–€350", timeline: "Within 1 week" },
    { desc: "Installing a new en-suite in the loft conversion. Currently no plumbing above ground floor. Need a full run from the ground-floor mains supply up to the loft.", projectType: "Loft En-Suite Plumbing", budget: "€3,000–€5,500", timeline: "Within 2 months" },
    { desc: "Swimming pool equipment room needs plumbing: circulation pump connections, solar heating manifold, backwash drain, and fill valve. Prefer someone with pool experience.", projectType: "Pool Plumbing", budget: "€2,000–€4,000", timeline: "Within 3 months" },
    { desc: "New build property and the builder's plumbing quality is poor — two leaks found at joints within the first year. Want an independent plumber to inspect and make good.", projectType: "Snagging & Repairs", budget: "€800–€1,500", timeline: "Within 1 month" },
    { desc: "Landlord looking for annual gas safety certificate and boiler service across three rental properties. Ideally all on the same day. Properties are all within 5km of each other.", projectType: "Landlord Gas Safety", budget: "€150–€250 per property", timeline: "Within 1 month" },
    { desc: "House has galvanised steel supply pipes which are corroding and causing discoloured water. Want them replaced with copper throughout. 3-bed detached, two floors.", projectType: "Pipework Replacement", budget: "€2,500–€4,500", timeline: "Within 2 months" },
    { desc: "Water softener installation wanted — we have very hard water and it's affecting appliances and shower screens. Looking for whole-house treatment and advice on maintenance.", projectType: "Water Softener", budget: "€800–€1,500", timeline: "Within 6 weeks" },
    { desc: "En-suite shower thermostat has failed and the mixer valve is dripping. Also the toilet fill valve is noisy at night. Looking for a combined visit to fix all three.", projectType: "General Repairs", budget: "€300–€600", timeline: "Within 2 weeks" },
  ],
  "General Contractor": [
    { desc: "We want to build a single-storey rear extension of approximately 30m² to create a kitchen-diner. We have planning permission already. Looking for a full project quote including groundworks, structure, and fit-out.", projectType: "Kitchen Extension", budget: "€60,000–€90,000", timeline: "Start within 3 months" },
    { desc: "Terraced house requiring full internal renovation: new kitchen, two bathrooms, replastering throughout, new flooring, and full redecoration. We'll be moving out during works.", projectType: "Full Renovation", budget: "€40,000–€70,000", timeline: "Start within 2 months" },
    { desc: "Loft conversion into a double bedroom with en-suite and a Juliet balcony. Dormer extension preferred. Please advise on planning requirements and provide a full quote.", projectType: "Loft Conversion", budget: "€35,000–€55,000", timeline: "Start within 3 months" },
    { desc: "Commercial café space fit-out — floor area of 90m². Requires structural partition walls, new flooring, kitchen extraction, bar construction, and full decoration.", projectType: "Commercial Fit-Out", budget: "€80,000–€140,000", timeline: "Start within 6 weeks" },
    { desc: "Detached garage conversion to a home gym and office. Currently plain concrete floor, bare block walls. We want insulation, flooring, heating, electrics, and plastering.", projectType: "Garage Conversion", budget: "€15,000–€25,000", timeline: "Start within 2 months" },
    { desc: "Period semi-detached needing a side-return extension to widen the ground floor. The side passage is about 2.5m wide. We want a full wraparound if possible.", projectType: "Side-Return Extension", budget: "€50,000–€80,000", timeline: "Start within 4 months" },
    { desc: "Basement conversion from storage to a habitable cinema room. Tanking will likely be required. Existing staircase will stay but we need the whole space finished.", projectType: "Basement Conversion", budget: "€30,000–€55,000", timeline: "Start within 3 months" },
    { desc: "New build garden studio with office and shower room — approximately 35m². We want it built to the same standard as the main house, not a basic timber kit.", projectType: "Garden Studio", budget: "€50,000–€80,000", timeline: "Start within 3 months" },
    { desc: "Heritage barn conversion — planning already approved. Approximately 200m². Looking for a contractor experienced with listed buildings and traditional construction methods.", projectType: "Barn Conversion", budget: "€250,000–€400,000", timeline: "Start within 6 months" },
    { desc: "Restaurant and café area refurbishment — 120m² space. New flooring, replastering, decorating, bar rebuild, and commercial kitchen works in coordination with a separate kitchen fit-out contractor.", projectType: "Restaurant Refurb", budget: "€90,000–€150,000", timeline: "Start within 2 months" },
    { desc: "Two-bedroom apartment full refurbishment as a rental investment: new kitchen, bathroom, flooring, electrics, plumbing, and decoration. Tight programme needed.", projectType: "Apartment Refurb", budget: "€25,000–€40,000", timeline: "Start within 1 month" },
    { desc: "House extension to create a bedroom and wet room on the ground floor for an elderly relative. Access requirements including step-free shower and wider doorways are essential.", projectType: "Accessible Extension", budget: "€35,000–€55,000", timeline: "Start within 3 months" },
    { desc: "Full roof terrace construction on a city apartment block. Structural assessment completed and approved. Waterproofing, drainage, pergola, and planting required.", projectType: "Roof Terrace", budget: "€40,000–€70,000", timeline: "Start within 3 months" },
    { desc: "Render and general repairs to the exterior of a detached house: repointing, new render on rear elevation, fascias replaced, and external decoration throughout.", projectType: "Exterior Renovation", budget: "€15,000–€25,000", timeline: "Start within 6 weeks" },
    { desc: "Converting a redundant retail unit to a residential flat above a commercial ground floor. Planning permission granted. Full conversion and fit-out required.", projectType: "Commercial-to-Residential", budget: "€80,000–€130,000", timeline: "Start within 3 months" },
    { desc: "New school classroom building — prefabricated modular preferred for speed. 60m² with WC facilities, heating, ventilation, and IT infrastructure.", projectType: "Modular Classroom", budget: "€80,000–€120,000", timeline: "Start within 4 months" },
    { desc: "Full renovation of a holiday let cottage: both bathrooms, kitchen, new flooring, replastering, and complete decoration. The cottage must be available for the summer season.", projectType: "Holiday Let Renovation", budget: "€30,000–€50,000", timeline: "Complete by end of April" },
    { desc: "Swimming pool building including pool shell, plant room, and surrounding terrace. The pool is 10×4m. We want a turnkey package including all trades coordination.", projectType: "Swimming Pool", budget: "€80,000–€130,000", timeline: "Start within 3 months" },
    { desc: "New sports hall for a community club: 600m² steel portal frame building with insulation, suspended ceiling, specialist sports flooring, and full M&E.", projectType: "Sports Hall", budget: "€400,000–€600,000", timeline: "Start within 6 months" },
    { desc: "Old farmhouse requiring complete structural renovation. Some sections of wall are failing and roof needs replacing. Difficult access. Want a contractor comfortable with rural properties.", projectType: "Farmhouse Restoration", budget: "€150,000–€250,000", timeline: "Start within 4 months" },
  ],
  Carpenter: [
    { desc: "Four bedrooms need fitted wardrobes — two doubles and two singles. Ideally floor to ceiling, with a mix of hanging space, shelves, and drawers. Prefer a painted finish.", projectType: "Fitted Wardrobes", budget: "€4,000–€8,000", timeline: "Within 2 months" },
    { desc: "Bespoke kitchen cabinets to a design I already have. Shaker style in painted MDF with solid oak worktops and a full-height larder unit. Kitchen area is 12m².", projectType: "Kitchen Cabinetry", budget: "€8,000–€14,000", timeline: "Within 3 months" },
    { desc: "Existing staircase is dated and noisy. Looking to replace the treads in solid oak, add a glass and oak balustrade, and refinish the newel post to match.", projectType: "Staircase Renovation", budget: "€3,500–€6,000", timeline: "Within 2 months" },
    { desc: "Engineered oak flooring to be laid across the ground floor — approximately 80m². Old carpet to be lifted and any squeaky subfloor boards fixed first.", projectType: "Floor Laying", budget: "€3,000–€5,500", timeline: "Within 6 weeks" },
    { desc: "Study needs a full built-in library: floor-to-ceiling bookshelves on three walls, a built-in desk with cable management, and a rolling library ladder system.", projectType: "Home Library", budget: "€5,000–€9,000", timeline: "Within 3 months" },
    { desc: "Hardwood garden deck needed — approximately 40m² with steps down to lawn, inset planters at two corners, and built-in bench seating along one side.", projectType: "Garden Decking", budget: "€4,000–€7,500", timeline: "Within 2 months" },
    { desc: "Period sash windows in poor condition — some stuck, all draughty. Looking for a carpenter who can service and repair rather than replace to keep the period character.", projectType: "Sash Window Repair", budget: "€1,500–€3,000", timeline: "Within 6 weeks" },
    { desc: "Garden room interior fit-out — the shell is built. Need cladding to the internal walls, a built-in day bed with storage beneath, and a kitchenette unit with a sink.", projectType: "Garden Room Interior", budget: "€3,000–€6,000", timeline: "Within 2 months" },
    { desc: "Solid oak flooring throughout a 3-bed semi needs sanding and refinishing — it's 30 years old and quite scratched. Want a new oil finish rather than lacquer.", projectType: "Floor Restoration", budget: "€1,500–€3,000", timeline: "Within 1 month" },
    { desc: "New door linings and internal doors throughout a full house renovation — 12 doors in total including a fire door to the kitchen. Ironmongery to be supplied by us.", projectType: "Internal Doors", budget: "€2,500–€4,500", timeline: "Within 2 months" },
    { desc: "Built-in storage solutions for a small flat: under-stairs cupboard optimised, hallway with built-in coat storage and bench, and a bedroom with full-height wardrobes.", projectType: "Built-In Storage", budget: "€3,000–€5,500", timeline: "Within 2 months" },
    { desc: "Timber frame pergola structure over the patio — approximately 6×4m. Want solid posts and beams with a slatted roof, all in pressure-treated timber.", projectType: "Pergola", budget: "€2,000–€4,000", timeline: "Within 6 weeks" },
    { desc: "Media wall in the living room: alcove TV recess, surround shelving, and a log store below. Looking for clean lines and concealed cable routing.", projectType: "Media Wall", budget: "€1,500–€3,000", timeline: "Within 6 weeks" },
    { desc: "Bespoke window seat in the bay window with storage lift-up lid underneath. The seat should be about 1.8m long with scatter cushion upholstery fitted over the top.", projectType: "Window Seat", budget: "€800–€1,800", timeline: "Within 1 month" },
    { desc: "Outbuilding conversion to a woodworking workshop: workbenches built to measure, wall-mounted tool storage, and a timber frame partition wall to separate storage.", projectType: "Workshop Fit-Out", budget: "€2,500–€5,000", timeline: "Within 2 months" },
    { desc: "Children's bedroom with a cabin bed incorporating a desk, shelving, and a slide. Must be structurally robust and pass a load test. Painted finish in colours to be agreed.", projectType: "Cabin Bed", budget: "€1,500–€3,000", timeline: "Within 6 weeks" },
    { desc: "Floating oak shelves across an entire living room wall — about 5 linear metres at two heights. Invisible fixings and perfect level critical as the wall is the focal point.", projectType: "Floating Shelving", budget: "€800–€1,500", timeline: "Within 1 month" },
    { desc: "Garden office pod clad in vertical timber boarding. The shell is in place — need the external cladding, decking, and a canopy above the entrance.", projectType: "Garden Office Cladding", budget: "€2,500–€4,500", timeline: "Within 6 weeks" },
    { desc: "Bathroom vanity unit — a bespoke fitted double vanity with an undermount basin. Must include knee-hole space in the centre and a shaving/makeup mirror above.", projectType: "Vanity Unit", budget: "€1,200–€2,500", timeline: "Within 6 weeks" },
    { desc: "Loft hatch replacement and a pull-down loft ladder installed. The existing hatch is too small and the ladder is broken. We want a larger hatch with insulation over it.", projectType: "Loft Access", budget: "€400–€800", timeline: "Within 2 weeks" },
  ],
  Painter: [
    { desc: "We've just moved into a 4-bed detached house and want the whole interior repainted before we bring our furniture in. Current colours are mismatched. Happy for colour advice.", projectType: "Full Interior Repaint", budget: "€3,500–€6,000", timeline: "Within 1 month" },
    { desc: "Exterior of a Victorian terrace needs repainting. Render, woodwork, soffits, and fascias all need attention. The render has some hairline cracks to be filled first.", projectType: "Exterior Repaint", budget: "€2,500–€5,000", timeline: "Within 6 weeks" },
    { desc: "Feature wall in the living room — we've seen Venetian plaster effects and love the look. The wall is about 4m wide. Can you do this and advise on colour and sheen level?", projectType: "Decorative Feature Wall", budget: "€600–€1,500", timeline: "Within 1 month" },
    { desc: "Kitchen cabinets are solid wood and in good condition but the colour is outdated. Would like them spray-painted in Farrow & Ball Railings with new brushed brass knobs.", projectType: "Cabinet Repainting", budget: "€800–€1,800", timeline: "Within 1 month" },
    { desc: "New build house needs first fix painting done — bare plaster throughout, ceilings, and all woodwork. We're happy with a standard finish but want the walls to be mist-coated properly first.", projectType: "New Build Painting", budget: "€3,000–€5,500", timeline: "Within 6 weeks" },
    { desc: "Office space of 250m² needs redecorating over a weekend to minimise disruption to the business. Two feature walls in brand colour, rest in white.", projectType: "Commercial Redecoration", budget: "€2,000–€4,000", timeline: "Specific weekend date" },
    { desc: "Nursery and two children's bedrooms need redecorating. Open to themed mural on one wall in the nursery. Should be fun, durable, and safe paint products.", projectType: "Children's Rooms", budget: "€800–€1,800", timeline: "Within 6 weeks" },
    { desc: "All external timber on the house — windows, doors, garage door, and garden gate — need rubbing down and repainting. About 14 windows and 3 doors.", projectType: "Exterior Woodwork", budget: "€1,500–€3,000", timeline: "Within 6 weeks" },
    { desc: "Period Victorian hallway with original coving, ceiling rose, and panelled doors. Want the details picked out properly in contrasting colours. Advice on period-correct colours appreciated.", projectType: "Period Hall Decoration", budget: "€800–€1,500", timeline: "Within 1 month" },
    { desc: "Rental property between tenancies — quick, durable repaint needed throughout. Budget conscious — clean white everywhere is fine, just needs to be neat and done fast.", projectType: "Rental Property Repaint", budget: "€1,200–€2,000", timeline: "Within 2 weeks" },
    { desc: "Garage floor needs an epoxy paint coating. It's currently bare concrete and quite dusty. Want a mid-grey with anti-slip additive and a gloss finish.", projectType: "Garage Floor Coating", budget: "€300–€700", timeline: "Within 1 month" },
    { desc: "Large open-plan living area with a vaulted ceiling — about 9m high at the peak. Walls are a warm white but we want the ceiling in a deep contrast colour.", projectType: "High-Ceiling Room", budget: "€800–€1,500", timeline: "Within 1 month" },
    { desc: "Staircase and landing repaint — bannisters in gloss white, spindles in a contrasting dark colour, walls in a light neutral. Three flights of stairs in an older house.", projectType: "Staircase Decoration", budget: "€600–€1,200", timeline: "Within 6 weeks" },
    { desc: "Summer house and fences repainted with a weatherproof treatment. The garden structure is timber and the fences are horizontal board. About 80 linear metres.", projectType: "Garden Structures", budget: "€600–€1,200", timeline: "Within 1 month" },
    { desc: "Newly plastered extension needs painting: two coats on walls, ceilings, all new woodwork including skirting, door casings, and internal window reveals.", projectType: "New Extension Painting", budget: "€1,200–€2,200", timeline: "Within 6 weeks" },
    { desc: "Restaurant being refreshed — the existing dark colour scheme feels tired. Looking for a lighter, more contemporary feel without a full refit.", projectType: "Restaurant Refresh", budget: "€2,000–€4,500", timeline: "Within 1 month" },
    { desc: "Balcony railings and external metal frame structures need sandblasting and repainting with a suitable primer and topcoat. Three balconies on a residential building.", projectType: "Metal Painting", budget: "€800–€1,500", timeline: "Within 6 weeks" },
    { desc: "Limewash finish on the internal walls of a rural stone cottage — we want the traditional look that suits the building's age and character.", projectType: "Limewash Finish", budget: "€1,000–€2,000", timeline: "Within 2 months" },
    { desc: "Master bedroom redecorated with a luxury feel: full-height textured wallpaper on one wall, deep paint colour on the others, and all woodwork in a satin finish.", projectType: "Master Bedroom Deco", budget: "€700–€1,400", timeline: "Within 1 month" },
    { desc: "Community hall needs fresh decoration throughout for the first time in 10 years. Budget is limited — NHS charity involved. Advice on cost-effective materials appreciated.", projectType: "Community Hall", budget: "€1,500–€3,000", timeline: "Within 2 months" },
  ],
  Roofer: [
    { desc: "We have a water stain appearing on the bedroom ceiling after heavy rain. Not sure if it's the roof or a flashing. Would like you to inspect and advise before the winter season.", projectType: "Roof Inspection & Repair", budget: "€500–€2,000", timeline: "Within 2 weeks" },
    { desc: "Planning a full re-roof — the existing tiles are original 1960s concrete and beginning to break. Interested in clay tiles or natural slate. Please survey and quote.", projectType: "Full Re-Roof", budget: "€15,000–€30,000", timeline: "Within 3 months" },
    { desc: "Flat roof extension is 12 years old and showing signs of cracking. Had two repairs that didn't last. Looking for a proper replacement with a long guarantee.", projectType: "Flat Roof Replacement", budget: "€3,000–€6,000", timeline: "Within 6 weeks" },
    { desc: "Chimney has visible cracking and the flashing is lifting. Last winter we got some damp in the chimney breast. Need pointing, flashing, and an inspection of the stack.", projectType: "Chimney Repair", budget: "€800–€2,500", timeline: "Within 1 month" },
    { desc: "Considering a green sedum roof on a newly built garden studio. Want to understand the build-up, weight loading, and maintenance requirements before confirming.", projectType: "Green Roof", budget: "€2,500–€5,000", timeline: "Within 3 months" },
    { desc: "Four velux windows needed in a loft conversion currently under construction. Want them installed correctly before plastering begins. Advice on size and position appreciated.", projectType: "Velux Installation", budget: "€2,000–€4,000", timeline: "Within 4 weeks" },
    { desc: "Ridge tiles are loose and some have blown off in the last storm. Dry ridge system replacement preferred to avoid the same maintenance issue long term.", projectType: "Ridge & Verge", budget: "€800–€2,000", timeline: "Within 3 weeks" },
    { desc: "Solar panels being installed next month and the roofer wants confirmation the roof structure is sound and tiles are in good enough condition. Need an independent inspection report.", projectType: "Pre-Solar Inspection", budget: "€200–€400", timeline: "Within 2 weeks" },
    { desc: "Old concrete garage roof covering is crumbling. Want it replaced with either a new flat roof system or box-profile steel sheeting. Which would you recommend?", projectType: "Garage Roof Replacement", budget: "€1,500–€3,500", timeline: "Within 6 weeks" },
    { desc: "Guttering is pulling away from the fascia and overflows in heavy rain. While you're there I'd also want the moss and debris cleared from the roof.", projectType: "Guttering & Maintenance", budget: "€400–€900", timeline: "Within 1 month" },
    { desc: "Listed building with clay pantile roof — a section of approximately 20m² was damaged in a storm. Need an experienced roofer who understands conservation requirements.", projectType: "Listed Building Repair", budget: "€2,000–€5,000", timeline: "Within 1 month" },
    { desc: "New pitched roof required over a rear extension that currently has a temporary EPDM cover. Extension is 28m². Want to match the main house style.", projectType: "Extension Roof", budget: "€8,000–€14,000", timeline: "Within 2 months" },
    { desc: "Leadwork on two bay window roofs is cracked and shrinking. Water has been getting through for at least one season. Need replacement lead draping and step flashing.", projectType: "Leadwork Repair", budget: "€600–€1,500", timeline: "Within 3 weeks" },
    { desc: "Thinking of converting the existing roof to a warm roof insulation system to improve the U-value. Looking for advice on whether to lift tiles or insulate from below.", projectType: "Roof Insulation", budget: "€4,000–€9,000", timeline: "Within 3 months" },
    { desc: "Hip roof re-felt needed — the old underfelt is torn in places and we occasionally get debris blowing in. Not looking for a full re-tile, just the felt replacement.", projectType: "Re-Felting", budget: "€1,500–€3,500", timeline: "Within 2 months" },
    { desc: "Flat roof terrace waterproofing has failed — it blisters in summer and cracks in winter. We'd like a liquid membrane system applied over the existing substrate.", projectType: "Terrace Waterproofing", budget: "€1,500–€3,000", timeline: "Within 6 weeks" },
    { desc: "Roof inspection required on a property purchase — we're buying a Victorian terrace and want an independent assessment of the roof condition before exchanging contracts.", projectType: "Pre-Purchase Survey", budget: "€200–€400", timeline: "Within 1 week" },
    { desc: "Asbestos cement garage roof sheets need removal and disposal by a licensed contractor and replacement with a new covering. Safety and documentation are essential.", projectType: "Asbestos Roof Removal", budget: "€2,000–€5,000", timeline: "Within 2 months" },
    { desc: "Four rooflights are leaking around the frames after 15 years. Looking for advice on whether to reseal or replace, and which modern product to specify.", projectType: "Rooflight Repair", budget: "€800–€2,500", timeline: "Within 6 weeks" },
    { desc: "Communal roof on a block of six flats needs full replacement. We have a residents' association managing the project and a reserve fund available.", projectType: "Block of Flats Re-Roof", budget: "€30,000–€50,000", timeline: "Within 3 months" },
  ],
  "HVAC Technician": [
    { desc: "Our 15-year-old gas boiler died last winter. We're interested in switching to an air source heat pump. The house has underfloor heating downstairs but standard radiators upstairs.", projectType: "Heat Pump Installation", budget: "€8,000–€14,000", timeline: "Within 2 months" },
    { desc: "Four-room multi-split air conditioning system for a 3-bed apartment. We want individual control per room and as quiet as possible for the bedrooms. Concealed pipework preferred.", projectType: "Air Conditioning", budget: "€4,000–€7,000", timeline: "Within 6 weeks" },
    { desc: "Commercial kitchen that gets extremely hot in summer. Need a proper extraction canopy, make-up air supply, and a split unit for the chef's station. Current setup is inadequate.", projectType: "Commercial Kitchen HVAC", budget: "€6,000–€12,000", timeline: "Within 2 months" },
    { desc: "New build house — architect has specified an MVHR system. We need someone to install and commission the unit, all the ductwork, and the room terminals.", projectType: "MVHR Ventilation", budget: "€3,000–€5,000", timeline: "Within 6 weeks" },
    { desc: "Heating system is old and inefficient — some rooms never get warm. Looking for a full boiler service and system balance, or if the boiler is beyond repair, a replacement.", projectType: "Heating Service & Balance", budget: "€500–€3,000", timeline: "Within 1 month" },
    { desc: "Server room in an office needs dedicated precision cooling. Currently at risk of overheating in summer. Need a unit sized for the load with remote monitoring capability.", projectType: "Server Room Cooling", budget: "€3,000–€6,000", timeline: "Within 1 month" },
    { desc: "Bathroom extractor fans in four apartments are inadequate — condensation and mould in every one. Want upgraded axial fans with humidity sensing and timer control.", projectType: "Ventilation Upgrade", budget: "€800–€1,800", timeline: "Within 6 weeks" },
    { desc: "We want smart thermostatic controls fitted throughout the house — multi-zone heating with individual room control via an app. Currently have a single thermostat.", projectType: "Smart Heating Controls", budget: "€1,500–€3,000", timeline: "Within 6 weeks" },
    { desc: "Ground floor underfloor heating is unresponsive in two zones — likely a manifold or actuator fault. Also the flow rate display on the manifold shows red for one circuit.", projectType: "UFH Fault Repair", budget: "€300–€800", timeline: "Within 2 weeks" },
    { desc: "Home gym being built in the garage. Currently no heating or ventilation. Need a unit heater or fan coil and a ventilation solution for when equipment is in use.", projectType: "Gym Heating & Ventilation", budget: "€1,500–€3,000", timeline: "Within 6 weeks" },
    { desc: "Annual maintenance contract for HVAC systems in a 10-room commercial office including two fan coil units, one rooftop packaged unit, and quarterly filter changes.", projectType: "Maintenance Contract", budget: "€1,500–€2,500/year", timeline: "Ongoing" },
    { desc: "Air conditioning in the bedroom is making a noise at startup and the unit is 9 years old. Suspect the compressor may be starting to fail. Please diagnose.", projectType: "AC Fault Diagnosis", budget: "€200–€800", timeline: "Within 2 weeks" },
    { desc: "Loft room is converted but gets very hot in summer due to poor insulation and no ventilation. Looking for the most cost-effective solution to make it habitable year-round.", projectType: "Loft Thermal Comfort", budget: "€2,000–€5,000", timeline: "Within 2 months" },
    { desc: "Wet underfloor heating circuit won't heat up despite the manifold showing flow. Suspect an airlock or stuck actuator. Also the buffer tank seems to be overheating.", projectType: "UFH Commissioning Issue", budget: "€300–€700", timeline: "Within 2 weeks" },
    { desc: "School building needs its old fan coil units replaced — 14 units in total across 7 classrooms. Must be done in summer holiday period to avoid disruption.", projectType: "Fan Coil Replacement", budget: "€20,000–€35,000", timeline: "July–August" },
    { desc: "Office recently refurbished and the new suspended ceiling has covered over the existing diffusers. Need the ductwork rerouted to new positions above the ceiling.", projectType: "Ductwork Modification", budget: "€1,500–€3,500", timeline: "Within 6 weeks" },
    { desc: "F-Gas leak suspected in the air conditioning — unit is low on refrigerant each season. Need leak detection and repair before a full re-gas.", projectType: "Refrigerant Leak Repair", budget: "€400–€1,000", timeline: "Within 2 weeks" },
    { desc: "Swimming pool plant room needs a dehumidification unit — the pool hall is at 90% RH in winter and causing structural damage. Looking for an industrial pool dehumidifier.", projectType: "Pool Dehumidification", budget: "€4,000–€8,000", timeline: "Within 2 months" },
    { desc: "Flat has excessive condensation — mould appearing in corners despite good heating. Want an assessment of the ventilation strategy and a remedial solution.", projectType: "Condensation Survey", budget: "€200–€600", timeline: "Within 1 month" },
    { desc: "New office fit-out needs fresh air ventilation, cooling, and heating. 200m² open plan. Energy efficient solution preferred — possibly a VRF system with heat recovery.", projectType: "VRF System", budget: "€15,000–€25,000", timeline: "Within 3 months" },
  ],
  Tiler: [
    { desc: "Master bathroom refit — about 12m². Looking for large-format porcelain tiles throughout including a large wetroom-style shower enclosure. No separate tray — fully recessed drain.", projectType: "Master Bathroom", budget: "€2,500–€5,000", timeline: "Within 6 weeks" },
    { desc: "Kitchen floor and the continuous hallway beyond — about 35m² in total. Want a large-format light stone-effect porcelain to make both spaces feel connected.", projectType: "Kitchen Floor", budget: "€1,800–€3,500", timeline: "Within 1 month" },
    { desc: "Pool surround and adjacent shower area need tiling in a non-slip mosaic. Approximately 60m² of pool surround and 15m² of shower. Substrate is already waterproofed.", projectType: "Pool Surround", budget: "€3,000–€6,000", timeline: "Within 2 months" },
    { desc: "Original Victorian encaustic tiles in the hallway are damaged in one section. Want the damaged section reproduced in matching encaustic tiles and the rest restored.", projectType: "Heritage Tile Restoration", budget: "€800–€2,500", timeline: "Within 1 month" },
    { desc: "Feature wall in the living room — we've bought some beautiful handmade terracotta tiles and want them laid in a running bond across a 4×2.5m wall.", projectType: "Feature Wall", budget: "€600–€1,500", timeline: "Within 1 month" },
    { desc: "Roof terrace to be tiled in 600×600 outdoor porcelain on pedestals for a level deck above an uneven waterproofed substrate. About 25m².", projectType: "Roof Terrace", budget: "€2,000–€4,000", timeline: "Within 6 weeks" },
    { desc: "En-suite shower in a loft conversion — compact space about 2m² floor area. Want wall-to-wall large tiles with a thermostatic shower valve niche and a concealed drain.", projectType: "Shower Enclosure", budget: "€800–€2,000", timeline: "Within 6 weeks" },
    { desc: "New build house — all bathrooms, en-suites, and kitchen floor to be tiled. Five wet rooms in total. Tiles have been selected already, just need an installation quote.", projectType: "New Build Tiling", budget: "€5,000–€9,000", timeline: "Within 2 months" },
    { desc: "Herringbone floor tile pattern across an open-plan kitchen-diner — approximately 50m². I know this is more labour intensive. Looking for a quality tiler who has done this before.", projectType: "Herringbone Floor", budget: "€3,000–€5,500", timeline: "Within 2 months" },
    { desc: "Old bathroom tiles cracked and need replacing — 8m² of floor and 20m² of wall. The wall tiles have movement so the substrate may need attention first.", projectType: "Bathroom Re-Tile", budget: "€1,500–€3,500", timeline: "Within 6 weeks" },
    { desc: "Swimming pool interior is being resurfaced and the owner wants the waterline tiles replaced. About 40 linear metres of decorative mosaic band tiles.", projectType: "Pool Waterline Tiles", budget: "€1,500–€3,500", timeline: "Within 2 months" },
    { desc: "Utility room and boot room floor to be tiled in a durable, easy-clean ceramic. Currently bare concrete screed. About 15m² with a couple of step edges.", projectType: "Utility Room", budget: "€600–€1,200", timeline: "Within 1 month" },
    { desc: "Underfloor heating being laid in a kitchen — need the tiles fitted over the UFH correctly with appropriate flexible adhesive and grout. About 20m².", projectType: "Tiles Over UFH", budget: "€1,000–€2,000", timeline: "Within 6 weeks" },
    { desc: "The grout in the main bathroom shower has blackened despite cleaning. Want the old grout raked out and replaced throughout the shower enclosure with an anti-mould product.", projectType: "Regrout", budget: "€300–€700", timeline: "Within 2 weeks" },
    { desc: "External steps and path to the front door need non-slip tiling — currently smooth concrete. About 15m² including the step nosings.", projectType: "External Steps", budget: "€800–€1,800", timeline: "Within 1 month" },
    { desc: "Decorative splash-back behind an AGA cooker — we've chosen a hand-painted Dutch Delft tile pattern and want it laid precisely as a panel, approx 1.5m×0.8m.", projectType: "Decorative Splashback", budget: "€400–€900", timeline: "Within 1 month" },
    { desc: "Commercial hotel bathroom refurb — 12 bathrooms to be retiled in a matching scheme. Looking for a tiler who can work during off-peak periods to minimise room downtime.", projectType: "Hotel Bathrooms", budget: "€12,000–€22,000", timeline: "Rolling programme" },
    { desc: "New shower niche being created in an existing tiled bathroom. Need the niche cut out, waterproofed, and tiled to match the existing tiles as closely as possible.", projectType: "Shower Niche", budget: "€300–€700", timeline: "Within 2 weeks" },
    { desc: "Outdoor kitchen and dining terrace floor in a natural stone — travertine or similar. Approximately 40m². Must be sealed against wine and food staining.", projectType: "Outdoor Kitchen", budget: "€2,500–€5,000", timeline: "Within 2 months" },
    { desc: "Yoga studio floor needs a warm-looking, clean tile that's also grip-safe for bare feet. About 60m². Underfloor heating already present beneath the screed.", projectType: "Yoga Studio Floor", budget: "€2,500–€4,500", timeline: "Within 6 weeks" },
  ],
  Mason: [
    { desc: "Garden boundary wall on three sides of the property — approximately 50m total. We have a mix of established stone walls and concrete blocks that need to look consistent.", projectType: "Boundary Wall", budget: "€8,000–€15,000", timeline: "Within 3 months" },
    { desc: "Inglenook fireplace being reinstated in a period farmhouse — the opening was blocked in the 1970s. Want the original fireback rebuilt and a working hearth restored.", projectType: "Fireplace Restoration", budget: "€3,000–€7,000", timeline: "Within 2 months" },
    { desc: "Stone farmhouse facade repointing — the mortar has weathered out and some sections are hollow. Want lime mortar used to be compatible with the old stone.", projectType: "Lime Repointing", budget: "€5,000–€12,000", timeline: "Within 3 months" },
    { desc: "Retaining wall at the bottom of the garden has started to lean. About 1.5m high and 15m long. Need advice on whether to rebuild or underpin.", projectType: "Retaining Wall", budget: "€6,000–€14,000", timeline: "Within 3 months" },
    { desc: "Period property with a badly rendered exterior. The cement render is trapping moisture and causing damp. Want it removed and replaced with a breathable lime render.", projectType: "Lime Render", budget: "€8,000–€18,000", timeline: "Within 3 months" },
    { desc: "Stone water feature for a formal garden — a tiered fountain with a recirculating pump. Looking for natural limestone construction, approximately 1.5m tall.", projectType: "Water Feature", budget: "€3,000–€7,000", timeline: "Within 2 months" },
    { desc: "Underpinning needed for a rear extension foundation — there's settlement cracking in the walls above. We have a structural engineer's report specifying the method.", projectType: "Underpinning", budget: "€10,000–€20,000", timeline: "Within 2 months" },
    { desc: "Brick garden wall needs repointing and some sections rebuilt where the freeze-thaw has damaged the joints. About 20m of wall in total.", projectType: "Brick Repointing", budget: "€1,500–€3,500", timeline: "Within 6 weeks" },
    { desc: "Heritage conservation project — stone mullion windows in a Grade-listed property need stone repairs and lime mortar repointing. Conservation officer involved.", projectType: "Listed Building Conservation", budget: "€4,000–€10,000", timeline: "Within 3 months" },
    { desc: "Garden terracing required on a sloped plot — three terraces each retained by a low stone wall. Want natural stone to match the existing cottage construction.", projectType: "Garden Terracing", budget: "€6,000–€12,000", timeline: "Within 3 months" },
    { desc: "New build extension requires exposed brickwork on the external face. The architect has specified handmade bricks — need a mason experienced in this type of work.", projectType: "Feature Brickwork", budget: "€4,000–€9,000", timeline: "Within 2 months" },
    { desc: "Cellar walls are damp. Looking for a tanking solution — either a cavity drain membrane system or a tanking render. Want to convert the basement to a habitable room.", projectType: "Basement Tanking", budget: "€5,000–€12,000", timeline: "Within 3 months" },
    { desc: "Restoration of a Victorian chimney stack — several courses need rebuilding and the lead flashing is failing. Grade II listed, so lime mortar and matching brick required.", projectType: "Chimney Restoration", budget: "€2,500–€6,000", timeline: "Within 2 months" },
    { desc: "Stone steps from garden terrace down to lawn — seven steps, approx 2m wide in dressed sandstone. Need to match the terrace paving already laid.", projectType: "Stone Steps", budget: "€2,000–€5,000", timeline: "Within 2 months" },
    { desc: "Old stone arch over a gateway has dropped. Several keystones have shifted. Want it carefully repaired using hydraulic lime to restore it to its original profile.", projectType: "Arch Repair", budget: "€1,500–€4,000", timeline: "Within 2 months" },
    { desc: "New pizza oven and BBQ structure in the garden — reinforced brick-built base, rendered exterior, and a vaulted brick arch above the fire chamber.", projectType: "Outdoor Kitchen", budget: "€3,000–€6,000", timeline: "Within 2 months" },
    { desc: "Front wall and gate pillars need rebuilding — they were damaged by a vehicle. Looking for work that matches the existing Edwardian red brick style.", projectType: "Wall Rebuild", budget: "€2,000–€5,000", timeline: "Within 6 weeks" },
    { desc: "Commercial building with a parapet wall showing efflorescence and spalling brickwork. Looking for remediation and preventive treatment to avoid long-term structural damage.", projectType: "Parapet Repair", budget: "€4,000–€9,000", timeline: "Within 2 months" },
    { desc: "Derelict outbuilding being converted — stone walls need structural assessment and repair before the roof goes on. Some walls may need internal stitching or pinning.", projectType: "Outbuilding Structural Repair", budget: "€8,000–€20,000", timeline: "Within 3 months" },
    { desc: "Natural stone flagging for an entrance courtyard — about 80m² in reclaimed Yorkshire stone. Sub-base to be specified and compacted by the mason.", projectType: "Stone Flagging", budget: "€8,000–€18,000", timeline: "Within 3 months" },
  ],
  Landscaper: [
    { desc: "Our garden is completely overgrown after years of neglect. We'd like a full redesign and planting from scratch — the plot is about 300m² on a gentle slope.", projectType: "Full Garden Redesign", budget: "€8,000–€18,000", timeline: "Within 3 months" },
    { desc: "We want a drip irrigation system installed that waters automatically. The garden has a mix of raised beds, shrubs, and lawn. Smart controller with a weather sensor preferred.", projectType: "Irrigation System", budget: "€2,000–€5,000", timeline: "Within 2 months" },
    { desc: "Looking for a Mediterranean-style planting scheme that uses very little water. We spend too much time on lawn maintenance and want to simplify.", projectType: "Low-Maintenance Planting", budget: "€3,000–€7,000", timeline: "Within 3 months" },
    { desc: "Roof terrace of a city apartment needs planting. About 50m². Must be wind-resilient and low-maintenance. Looking for an architectural planting scheme with some year-round colour.", projectType: "Roof Terrace Garden", budget: "€4,000–€9,000", timeline: "Within 2 months" },
    { desc: "Back garden needs a lawn area for children to play on plus a seating terrace. Currently just rough grass. We'd like sandstone paving and a good-quality seeded lawn.", projectType: "Family Garden", budget: "€5,000–€12,000", timeline: "Within 3 months" },
    { desc: "We want to establish a wildflower meadow on about 800m² of a rural property. Currently rough grassland. Advice on soil preparation and seed mix appreciated.", projectType: "Wildflower Meadow", budget: "€2,000–€5,000", timeline: "Within 2 months" },
    { desc: "Formal walled kitchen garden being established at a country house. Raised beds, espalier fruit trees, glasshouse, and a cutting flower section wanted.", projectType: "Kitchen Garden", budget: "€8,000–€20,000", timeline: "Within 3 months" },
    { desc: "Newly built extension has left the garden as a building site. Need clearance, levelling, topsoil, lawn, and basic planting borders to a simple design.", projectType: "Post-Build Garden Restoration", budget: "€4,000–€9,000", timeline: "Within 2 months" },
    { desc: "We'd like a pond and water garden as a wildlife feature. About 4×3m with marginal planting, a bog garden adjacent, and a natural stone edge.", projectType: "Wildlife Pond", budget: "€3,000–€7,000", timeline: "Within 2 months" },
    { desc: "Commercial hotel grounds maintenance contract. 2 acres including formal lawns, rose beds, hedging, and seasonal bedding. Year-round contract preferred.", projectType: "Grounds Maintenance", budget: "€800–€1,500/month", timeline: "Ongoing contract" },
    { desc: "Courtyard of about 40m² needs a complete transformation — currently concrete. Would like raised planters, gravel areas, specimen plants, and atmospheric lighting.", projectType: "Courtyard Garden", budget: "€4,000–€9,000", timeline: "Within 2 months" },
    { desc: "Sloped garden with significant erosion risk. Looking for a planting solution that stabilises the slope and adds interest. No desire for retaining walls.", projectType: "Slope Planting", budget: "€2,500–€6,000", timeline: "Within 3 months" },
    { desc: "Show garden at a local horticultural society event — 8×8m plot. Theme is 'sustainable garden'. Looking for a designer-builder who can create something award-worthy.", projectType: "Show Garden", budget: "€6,000–€15,000", timeline: "Specific show date" },
    { desc: "New planting borders alongside a long driveway — about 80m linear. Shrubs for year-round structure with spring bulbs and summer perennials for colour.", projectType: "Driveway Planting", budget: "€3,000–€7,000", timeline: "Within 2 months" },
    { desc: "Outdoor yoga and meditation space within the garden — a circular lawn with screening hedging, a water feature, and simple stone path. Peaceful and low-maintenance.", projectType: "Wellness Garden", budget: "€5,000–€12,000", timeline: "Within 3 months" },
    { desc: "Children's play area to be landscaped — we want it safe, fun, and surrounded by planting. Existing play equipment staying. Safety surface and sensory planting.", projectType: "Children's Play Area", budget: "€3,000–€7,000", timeline: "Within 2 months" },
    { desc: "Community garden project — 400m² previously derelict plot to be transformed with raised vegetable beds, fruit trees, compost area, and seating. Charity budget.", projectType: "Community Garden", budget: "€8,000–€15,000", timeline: "Within 3 months" },
    { desc: "Herb and vegetable garden in raised beds for a country farmhouse. Approximately 8 raised beds, a cold frame, and a composting bay. Practical and attractive.", projectType: "Vegetable Garden", budget: "€2,500–€5,500", timeline: "Within 2 months" },
    { desc: "Formal garden restoration at a period property — original layout documented. Topiary hedging needs reshaping, rose beds replanted, and lawns restored.", projectType: "Historic Garden Restoration", budget: "€8,000–€20,000", timeline: "Within 3 months" },
    { desc: "Beekeeping area to be incorporated into the garden with bee-friendly planting, a simple shelter structure, and easy mowing access around the hives.", projectType: "Bee Garden", budget: "€2,000–€4,500", timeline: "Within 2 months" },
  ],
  "Concrete & Paving": [
    { desc: "New imprinted concrete driveway for a 3-car front — approximately 80m². Currently block paving that's subsided and weedy. Interested in a slate pattern with a two-tone colour.", projectType: "Imprinted Concrete Driveway", budget: "€6,000–€12,000", timeline: "Within 2 months" },
    { desc: "Rear patio in resin-bound gravel — approximately 50m². Currently a cracked concrete slab. Want it to drain well and look modern. Permeable preferred for planning reasons.", projectType: "Resin-Bound Patio", budget: "€4,000–€8,000", timeline: "Within 2 months" },
    { desc: "Reinforced concrete retaining wall along the rear boundary — 1.8m high, approximately 25m long. We have an engineer's drawing specifying rebar and concrete grade.", projectType: "Retaining Wall", budget: "€10,000–€20,000", timeline: "Within 3 months" },
    { desc: "Industrial unit yard needs a new heavy-duty concrete slab — currently rolled hardcore. 800m² for forklift and HGV use. Joints and drainage to be designed properly.", projectType: "Industrial Slab", budget: "€40,000–€70,000", timeline: "Within 3 months" },
    { desc: "Polished concrete floor throughout an open-plan apartment renovation — about 90m². Looking for an aggregate mix with a high-sheen burnished finish.", projectType: "Polished Concrete", budget: "€7,000–€14,000", timeline: "Within 3 months" },
    { desc: "Block paving driveway has sunk in one area and the sand has washed away. About 30m² needs lifting, re-compacting, and relaying. Rest of drive is fine.", projectType: "Block Paving Repair", budget: "€800–€2,000", timeline: "Within 6 weeks" },
    { desc: "Outbuilding base needs a concrete slab — 6×8m, 150mm thick. Currently just soil. The building is a heavy timber-framed garage.", projectType: "Concrete Base", budget: "€2,000–€4,000", timeline: "Within 6 weeks" },
    { desc: "Path from the house to the rear gate — approximately 30m long and 1.2m wide. Looking at either block paving or exposed aggregate concrete. Advice welcome.", projectType: "Garden Path", budget: "€1,500–€3,500", timeline: "Within 1 month" },
    { desc: "Swimming pool surrounds need replacing — old ceramic tiles have lifted and are a safety hazard. About 80m² in non-slip concrete-effect porcelain on a structural screed.", projectType: "Pool Surround Paving", budget: "€6,000–€12,000", timeline: "Within 2 months" },
    { desc: "Front garden transformation — remove existing lawn and create a resin-bound driveway with two parking spaces and a planted border. Planning officer agreed no consent needed.", projectType: "Front Garden Driveway", budget: "€3,500–€7,000", timeline: "Within 2 months" },
    { desc: "Agricultural yard resurfacing — 2,000m² of loose hardcore to be stabilised and surfaced for dairy farming operations. Drainage critical to avoid effluent issues.", projectType: "Agricultural Yard", budget: "€30,000–€60,000", timeline: "Within 3 months" },
    { desc: "Natural stone patio adjoining a new orangery — to be laid on a proper concrete sub-base, not just a sand bed. About 60m² in Kandla grey sandstone.", projectType: "Natural Stone Patio", budget: "€5,000–€10,000", timeline: "Within 2 months" },
    { desc: "Concrete screed needed in a new extension prior to underfloor heating installation — 65m² of liquid screed at 65mm depth. Pump truck required.", projectType: "Liquid Screed", budget: "€2,000–€4,000", timeline: "Within 6 weeks" },
    { desc: "Multi-storey car park deck needs resurfacing — epoxy resin and anti-carbonation coating required. About 1,200m² per deck, four decks. Safety lines to be repainted.", projectType: "Car Park Deck", budget: "€80,000–€150,000", timeline: "Within 3 months" },
    { desc: "Cobbled courtyard restoration — original granite sett cobbles have settled unevenly. Want them lifted, relevelled on a concrete bed, and pointed with a brushed mortar.", projectType: "Cobbled Courtyard", budget: "€4,000–€8,000", timeline: "Within 2 months" },
    { desc: "School playground resurfacing — 600m² of old tarmac needs removal and replacement. Coloured markings and some textured play zones included in the brief.", projectType: "School Playground", budget: "€30,000–€55,000", timeline: "Summer holidays" },
    { desc: "Stepped terrace in the garden — five steps down to a lower lawn with a 4m-wide landing between each step. Concrete structure faced in natural stone.", projectType: "Stepped Terracing", budget: "€5,000–€10,000", timeline: "Within 3 months" },
    { desc: "Exposed aggregate concrete driveway to match an existing path that was laid 5 years ago. About 60m². The aggregate mix must be the same as the existing.", projectType: "Exposed Aggregate", budget: "€4,000–€8,000", timeline: "Within 2 months" },
    { desc: "Bus depot refurbishment — 3,000m² of concrete maintenance pit areas need grinding and epoxy resurfacing to resist oil penetration.", projectType: "Industrial Resurfacing", budget: "€80,000–€150,000", timeline: "Within 4 months" },
    { desc: "Basement floor slab needs a new DPM and 75mm power-float concrete topping to create a level, damp-proof floor for a wine cellar conversion.", projectType: "Basement Floor", budget: "€2,000–€4,500", timeline: "Within 2 months" },
  ],
  "Flooring Specialist": [
    { desc: "We want solid oak flooring throughout the ground floor — hall, living room, and kitchen-diner — approximately 90m². Currently carpet and vinyl. Old floor to be lifted first.", projectType: "Hardwood Floor Install", budget: "€6,000–€11,000", timeline: "Within 2 months" },
    { desc: "Original 1930s parquet floor was covered in the 1980s and has just been uncovered. It needs sanding back, some board replacements, and refinishing.", projectType: "Parquet Restoration", budget: "€2,500–€5,000", timeline: "Within 6 weeks" },
    { desc: "Herringbone-pattern engineered oak across an open-plan ground floor — 120m². The floor is over underfloor heating so the product and adhesive must be compatible.", projectType: "Herringbone Engineered", budget: "€8,000–€14,000", timeline: "Within 2 months" },
    { desc: "Rental flat needs all flooring replaced ahead of new tenancy — laminate in two bedrooms, LVT in kitchen and bathroom, carpet in the living room. About 75m² total.", projectType: "Rental Refurb Flooring", budget: "€2,500–€5,000", timeline: "Within 1 month" },
    { desc: "Office floor 400m² needs commercial LVT — heavy traffic product with acoustic backing. Current floor is a concrete screed that may need levelling first.", projectType: "Commercial LVT", budget: "€10,000–€20,000", timeline: "Within 2 months" },
    { desc: "Hallway and landing carpet replaced in a period house — about 50m² including stair carpet with rods. Looking for a quality wool Axminster if possible.", projectType: "Carpet & Stair Carpet", budget: "€2,500–€5,000", timeline: "Within 6 weeks" },
    { desc: "Self-levelling screed needed across two rooms before LVT installation — the subfloor is uneven after old tiles were removed. Total 45m².", projectType: "Floor Levelling", budget: "€800–€1,800", timeline: "Within 6 weeks" },
    { desc: "Reclaimed Victorian pine floorboards throughout a terrace house — a mix of gapping, squeaking, and worn finish. Want them fully restored rather than replaced.", projectType: "Victorian Board Restoration", budget: "€2,500–€5,500", timeline: "Within 2 months" },
    { desc: "Gym floor for a commercial fitness centre — 300m² of rubber flooring in varying thickness for different zones. Installation to follow the approved plan.", projectType: "Gym Rubber Flooring", budget: "€6,000–€12,000", timeline: "Within 2 months" },
    { desc: "Holiday cottage complete flooring replacement — flagstone-effect LVT downstairs, carpet upstairs. Needs to be durable and easy to clean between guests.", projectType: "Holiday Let Flooring", budget: "€3,500–€6,500", timeline: "Within 1 month" },
    { desc: "Newly built open-plan ground floor — 160m² of wide-plank solid oak flooring to be laid directly onto concrete with DPM. Architect has specified a UV-oil finish.", projectType: "New Build Hardwood", budget: "€12,000–€20,000", timeline: "Within 3 months" },
    { desc: "Two bedrooms have creaky and gapping floorboards — they're original pine and we don't want to replace them. Can they be lifted, properly refixed, and gaps filled?", projectType: "Floor Repair", budget: "€800–€2,000", timeline: "Within 6 weeks" },
    { desc: "Restaurant floor — about 180m² of stone-effect rectified porcelain on a concrete screed. High foot traffic, easy cleaning and slip rating are the priorities.", projectType: "Restaurant Flooring", budget: "€7,000–€14,000", timeline: "Within 2 months" },
    { desc: "Luxury shower room floor in micro-cement finish — slip-resistant texture and colour to complement the wall tiling. About 8m², continuous with the walls.", projectType: "Micro-Cement Floor", budget: "€1,500–€3,500", timeline: "Within 6 weeks" },
    { desc: "Stair refurbishment — carpeted stairs to be replaced with painted risers and solid oak treads. Twelve steps plus a landing. Nosing profile to match the ground floor oak.", projectType: "Stair Flooring", budget: "€1,500–€3,500", timeline: "Within 6 weeks" },
    { desc: "Warehouse being converted to loft apartments — concrete floors to be levelled, DPM applied, and finished in polished concrete. Six apartments, 60m² each.", projectType: "Loft Apartment Floors", budget: "€20,000–€40,000", timeline: "Within 3 months" },
    { desc: "Utility room and boot room need waterproof LVT that can be easily wiped clean. Currently old ceramic tiles with cracked grout. Total 20m².", projectType: "Utility Room LVT", budget: "€600–€1,400", timeline: "Within 1 month" },
    { desc: "Original oak block floor in a Victorian school hall needs restoration — it's been hidden under vinyl for 40 years. Want to understand the condition and restoration options.", projectType: "School Hall Restoration", budget: "€4,000–€10,000", timeline: "Within 3 months" },
    { desc: "New floor in a home studio — cork acoustic underlay with engineered oak on top. Sound isolation from the room below is critical.", projectType: "Studio Flooring", budget: "€2,000–€4,000", timeline: "Within 6 weeks" },
    { desc: "Entrance lobby of a commercial building — 50m² in large-format polished marble-effect porcelain. The substrate is a structural slab. Floor to impress arriving visitors.", projectType: "Prestige Entrance Lobby", budget: "€4,000–€9,000", timeline: "Within 2 months" },
  ],
  Handyman: [
    { desc: "We've just moved into a new house and have a long list of small jobs: a dozen picture frames and shelves to hang, two door handles to replace, and a toilet cistern that's running constantly.", projectType: "New Home Jobs", budget: "€150–€350", timeline: "Within 2 weeks" },
    { desc: "Six pieces of flat-pack furniture to assemble — two wardrobes, a bookcase, a TV unit, and two bedside tables. Can you come with the right tools?", projectType: "Flat-Pack Assembly", budget: "€120–€250", timeline: "Within 1 week" },
    { desc: "TV needs mounting on a brick wall with the HDMI and power cable routed through the wall to a console unit. Also want the router and cables tidied behind the desk.", projectType: "TV Mount & Cable Tidy", budget: "€80–€200", timeline: "Within 1 week" },
    { desc: "Several jobs accumulated: a sticking door, a towel rail that's come away from the wall, a dripping outside tap, and four smoke alarms to install.", projectType: "Household Repairs", budget: "€100–€250", timeline: "Within 2 weeks" },
    { desc: "Garden gate doesn't close properly and the latch is broken. Also the side passage has a loose fence post and a missing panel. Small jobs but important for security.", projectType: "Garden Security Repairs", budget: "€150–€350", timeline: "Within 1 week" },
    { desc: "Bathroom accessories all to be fitted — towel rail, toilet roll holder, robe hooks, mirror, glass shelf, and a heated towel rail connection to existing plumbing.", projectType: "Bathroom Accessories", budget: "€100–€250", timeline: "Within 1 week" },
    { desc: "Ten venetian blinds across the house to be fitted and a curtain pole in the bay window. All the blinds are ready, just need someone competent with a drill.", projectType: "Blind & Curtain Fitting", budget: "€80–€200", timeline: "Within 1 week" },
    { desc: "Loft hatch sticks and won't close properly. Also the loft ladder has a broken step. Minor jobs but we need them fixed before winter to keep the heat in.", projectType: "Loft Hatch & Ladder", budget: "€80–€200", timeline: "Within 2 weeks" },
    { desc: "Six door hinges have stripped the screw holes and doors are sagging. Also three door handles are loose. All internal doors in a 4-bed house.", projectType: "Door Hardware Repairs", budget: "€100–€200", timeline: "Within 1 week" },
    { desc: "Decking boards are cracking and two are rotten — approximately 10 boards to replace out of 40. Also the decking needs a pressure wash and oil treatment.", projectType: "Decking Repair", budget: "€200–€500", timeline: "Within 1 month" },
    { desc: "Outdoor security light needs repositioning and a new PIR sensor fitting. Also want a doorbell camera installed and connected to our existing WiFi.", projectType: "External Lighting & Doorbell", budget: "€100–€250", timeline: "Within 2 weeks" },
    { desc: "Garage shelving — want a full wall of heavy-duty shelving built using timber uprights and scaffold boards. Approximately 6m wide and 5 shelves high.", projectType: "Garage Shelving", budget: "€200–€500", timeline: "Within 1 month" },
    { desc: "Conservatory is cold and draughty — the door doesn't seal and the window handles are broken. Looking for someone to draught-proof and fix the fittings.", projectType: "Conservatory Repairs", budget: "€150–€350", timeline: "Within 2 weeks" },
    { desc: "Child safety gates to be fitted at both top and bottom of the stairs. Two baby locks on kitchen cupboards and a fireguard secured to the wall.", projectType: "Child Safety", budget: "€80–€180", timeline: "Within 1 week" },
    { desc: "Small repair jobs in a rented property before the tenants move in: repaint scuffs on 4 walls, a cracked bathroom tile replaced, and a kitchen drawer that won't close.", projectType: "Pre-Tenancy Repairs", budget: "€150–€350", timeline: "Within 1 week" },
    { desc: "Shed needs a new hasp lock, the door latch is broken, and there's a gap at the bottom letting in mice. Also want hooks and shelves added inside.", projectType: "Shed Maintenance", budget: "€80–€200", timeline: "Within 2 weeks" },
    { desc: "Two flat-pack garden furniture sets to assemble — a 6-seater dining set and a modular sofa. Also need the parasol base filled and parasol put up.", projectType: "Garden Furniture Assembly", budget: "€100–€200", timeline: "Within 1 week" },
    { desc: "Kitchen tap washer is worn and drips constantly at night. Also the kitchen extractor filter is blocked and the pull-out drawer under the hob sticks.", projectType: "Kitchen Maintenance", budget: "€100–€200", timeline: "Within 1 week" },
    { desc: "Internal door to the utility room needs a catflap cutting and fitting. Also the dog gate in the hall needs moving and refitting to a narrower doorway.", projectType: "Pet Modifications", budget: "€80–€180", timeline: "Within 2 weeks" },
    { desc: "Property inspection list from the letting agent — 14 items including touch-up painting, re-grouting round the bath, fixing a loose socket, and adjusting two stiff doors.", projectType: "Letting Agent Inspection List", budget: "€200–€450", timeline: "Within 1 week" },
  ],
  "Window & Door Specialist": [
    { desc: "All 12 windows in a 1990s house need replacing — they're single-glazed aluminium and terrible for heat retention. Interested in white UPVC double or triple glazed units.", projectType: "Full Window Replacement", budget: "€8,000–€15,000", timeline: "Within 2 months" },
    { desc: "Four-panel aluminium bi-fold door to replace a set of old French doors — 3.2m opening into the garden. Want anthracite grey to match the window frames.", projectType: "Bi-Fold Doors", budget: "€3,500–€6,500", timeline: "Within 2 months" },
    { desc: "Front door feels insecure and draughty. Looking for a composite door with multi-point locking, a side panel glazed, and a matching letterbox.", projectType: "Composite Front Door", budget: "€1,800–€3,500", timeline: "Within 6 weeks" },
    { desc: "Victorian sash windows in a listed building need full restoration — weights to be rebalanced, new draught seals, and glass replaced where cracked.", projectType: "Sash Window Restoration", budget: "€3,000–€7,000", timeline: "Within 3 months" },
    { desc: "Flat roof extension needs three roof lights to bring in natural light. Currently dark and cave-like. Thermally broken aluminium units with solar-control glass preferred.", projectType: "Roof Lights", budget: "€4,000–€8,000", timeline: "Within 2 months" },
    { desc: "Bedroom window condensation is severe — the sealed unit has failed and the glass is permanently misted. Need the sealed units replaced in six windows.", projectType: "Sealed Unit Replacement", budget: "€600–€1,800", timeline: "Within 6 weeks" },
    { desc: "Aluminium sliding patio doors — 2.4m wide — for a rear extension. Thermally broken, low threshold, and with built-in handles that lock at multiple points.", projectType: "Sliding Patio Doors", budget: "€2,500–€5,000", timeline: "Within 2 months" },
    { desc: "Internal glazed screen between a hallway and living room. Approximately 2×2m with a large fixed pane and a narrow door. Frameless or slim-frame aluminium preferred.", projectType: "Internal Glazed Partition", budget: "€1,500–€3,500", timeline: "Within 2 months" },
    { desc: "Stable door needed for the back of the property — split door with a secure bolt on the upper half. Traditional painted timber with black ironmongery.", projectType: "Stable Door", budget: "€800–€2,000", timeline: "Within 6 weeks" },
    { desc: "Large picture window to be installed in the living room replacing two smaller openings. We want maximum view and light — no vertical bar between lights.", projectType: "Picture Window", budget: "€1,800–€4,000", timeline: "Within 2 months" },
    { desc: "Garage door replacement — current up-and-over is at end of life. Looking for an insulated sectional door with remote operation and a side-hung personal door alongside it.", projectType: "Garage Door", budget: "€1,500–€3,500", timeline: "Within 6 weeks" },
    { desc: "Six windows in an upstairs flat are draughty wooden casements. Would like uPVC direct replacements that look similar — white with mock sash lines.", projectType: "Window Replacement", budget: "€3,000–€6,000", timeline: "Within 2 months" },
    { desc: "Conservatory roof is cold in winter and hot in summer — looking to replace the polycarbonate with an insulated solid-pan roof system and upgrade the windows in the same project.", projectType: "Conservatory Roof & Windows", budget: "€5,000–€12,000", timeline: "Within 3 months" },
    { desc: "Commercial shopfront — existing timber shopfront is rotten and insecure. Looking for an aluminium replacement with a full-width display window and a central entrance door.", projectType: "Commercial Shopfront", budget: "€4,000–€9,000", timeline: "Within 2 months" },
    { desc: "Security upgrades needed at a ground-floor flat: laminated glass in all accessible windows, multi-point locks on the front door, and a door bar on the rear door.", projectType: "Security Glazing", budget: "€1,500–€3,000", timeline: "Within 6 weeks" },
    { desc: "Aluminium curtain-wall glazing system for a new-build architectural project — 12m of structural glazing at ground floor. Architect specifications available.", projectType: "Curtain Wall Glazing", budget: "€25,000–€50,000", timeline: "Within 3 months" },
    { desc: "Tilt-and-turn windows needed throughout a new-build apartment — 8 windows of varying sizes in white aluminium. Must meet current Part L requirements.", projectType: "New Build Windows", budget: "€5,000–€10,000", timeline: "Within 2 months" },
    { desc: "Period cottage with single-pane leaded light windows — planning department won't allow UPVC. Looking for double-glazed timber casements with matching leaded lights.", projectType: "Period Double Glazing", budget: "€4,000–€9,000", timeline: "Within 3 months" },
    { desc: "Smart home integration needed — motorised window openers on five Velux windows, linked to a rain sensor and the home automation system.", projectType: "Automated Windows", budget: "€2,000–€4,500", timeline: "Within 6 weeks" },
    { desc: "Fire escape window in a second-floor bedroom must be replaced — needs to comply with minimum 0.33m² openable area and be easily operable for escape.", projectType: "Fire Escape Window", budget: "€600–€1,500", timeline: "Within 1 month" },
  ],
};

// ─── Statuses to vary ─────────────────────────────────────────────────────────
const STATUSES = ["new", "new", "new", "read", "replied", "closed"];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  console.log("✔ Connected to MongoDB");

  const seedUsers = await User.find({ email: { $regex: `${SEED_DOMAIN}$` } }).lean();
  const seedUserMap = new Map(seedUsers.map((u) => [u._id.toString(), u]));
  const seedUserIds = new Set(seedUserMap.keys());

  const seedHomeowners = seedUsers.filter((u) => u.role === "homeowner");
  const allContractors = await Contractor.find({}).lean();
  const seedContractors = allContractors.filter((c) => seedUserIds.has(c.owner.toString()));

  if (seedHomeowners.length === 0 || seedContractors.length === 0) {
    console.error("❌ No seed users found. Run seed-users.mjs first.");
    process.exit(1);
  }

  console.log(`✔ Found ${seedHomeowners.length} homeowners and ${seedContractors.length} contractors`);

  // Clear existing seed inquiries
  const allSeedUserIds = seedUsers.map((u) => u._id);
  const seedContractorIds = seedContractors.map((c) => c._id);
  await Inquiry.deleteMany({
    $or: [{ sender: { $in: allSeedUserIds } }, { contractor: { $in: seedContractorIds } }],
  });
  console.log("✔ Cleared existing seed inquiries");

  const inquiryDocs = [];

  for (const contractor of seedContractors) {
    const templates = INQUIRY_TEMPLATES[contractor.trade] ?? INQUIRY_TEMPLATES.Handyman;
    const contractorOwner = seedUserMap.get(contractor.owner.toString());
    if (!contractorOwner) continue;

    seedHomeowners.forEach((homeowner, i) => {
      const t = templates[i % templates.length];
      inquiryDocs.push({
        sender: homeowner._id,
        recipient: contractorOwner._id,
        contractor: contractor._id,
        projectType: t.projectType,
        budget: t.budget,
        timeline: t.timeline,
        siteAddress: `${homeowner.city ?? homeowner.name?.split(" ")[1] ?? "Local"}, Croatia`,
        description: t.desc,
        status: STATUSES[i % STATUSES.length],
      });
    });
  }

  // Insert in batches to avoid hitting document limits
  const BATCH = 100;
  for (let i = 0; i < inquiryDocs.length; i += BATCH) {
    await Inquiry.insertMany(inquiryDocs.slice(i, i + BATCH));
    process.stdout.write(`  ✔ Inserted ${Math.min(i + BATCH, inquiryDocs.length)}/${inquiryDocs.length} inquiries\r`);
  }

  console.log(`\n✅ Created ${inquiryDocs.length} inquiries (${seedHomeowners.length} homeowners × ${seedContractors.length} contractors)`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
