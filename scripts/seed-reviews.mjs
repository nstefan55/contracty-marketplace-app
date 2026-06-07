import "dotenv/config";
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const SEED_DOMAIN = "@contracty-seed.dev";

// ─── Inline schemas ───────────────────────────────────────────────────────────

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contractor: { type: Schema.Types.ObjectId, ref: "Contractor", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 1000 },
    projectType: String,
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);
reviewSchema.index({ user: 1, contractor: 1 }, { unique: true });

const User = models.User || model("User", new Schema({ email: String, role: String }, { strict: false }));
const Contractor = models.Contractor || model("Contractor", new Schema({ owner: Schema.Types.ObjectId, trade: String, slug: String, averageRating: Number, reviewCount: Number }, { strict: false }));
const Review = models.Review || model("Review", reviewSchema);

// ─── Trade-specific review templates ─────────────────────────────────────────

const REVIEW_TEMPLATES = {
  Electrician: [
    { comment: "Excellent work rewiring the entire ground floor. Clean installation, explained everything clearly, and left the site spotless.", rating: 5 },
    { comment: "Fixed a persistent fault that two other electricians couldn't find. Thorough diagnostic approach and fair pricing.", rating: 5 },
    { comment: "Installed a new consumer unit and EV charger. Very professional, passed inspection first time.", rating: 5 },
    { comment: "Solid work on the kitchen and bathroom circuits. Slight delay on day two but communicated well and finished on time overall.", rating: 4 },
    { comment: "Reliable and knowledgeable. Smart home setup works perfectly. Would hire again.", rating: 5 },
    { comment: "Good quality work. A bit hard to reach by phone initially but once on site was excellent.", rating: 4 },
    { comment: "Installed outdoor lighting and a security system. Neat cable runs, everything labelled properly.", rating: 5 },
    { comment: "Periodic inspection done thoroughly with a clear report. Minor issues flagged and fixed the same day.", rating: 4 },
    { comment: "Replaced all sockets and switches throughout a 4-bed house. Efficient and tidy.", rating: 5 },
    { comment: "Competent work. Would have appreciated a bit more explanation of the finished system.", rating: 3 },
    { comment: "Solar panel connection and battery storage setup done perfectly. Great attention to detail.", rating: 5 },
    { comment: "Emergency callout at 9pm — responded within the hour and resolved the issue. Impressive service.", rating: 5 },
    { comment: "Professional and punctual. Office fit-out completed ahead of schedule.", rating: 5 },
    { comment: "Fault-finding took longer than expected but the end result was correct and priced fairly.", rating: 4 },
    { comment: "Very happy with the new light fittings installation. Clean work and good value.", rating: 4 },
    { comment: "Straightforward job done well. Communication could be better but the work itself was high quality.", rating: 4 },
    { comment: "Comprehensive electrical inspection with a detailed written report. Very professional.", rating: 5 },
    { comment: "Smart home integration was complex but handled confidently. Everything works seamlessly.", rating: 5 },
    { comment: "Fair price, quality work. Came back promptly to address a minor issue after completion.", rating: 4 },
    { comment: "Installed underfloor heating controls and updated the consumer unit. Smooth process throughout.", rating: 5 },
  ],
  Plumber: [
    { comment: "Complete bathroom renovation — outstanding finish. On budget, on time, zero snagging.", rating: 5 },
    { comment: "Emergency leak sorted at midnight. Minimal disruption and a fair call-out charge.", rating: 5 },
    { comment: "New boiler and full central heating system installed. Heating perfectly balanced throughout the house.", rating: 5 },
    { comment: "Fixed a complex leak under the concrete floor. Methodical approach, minimal damage to tiles.", rating: 5 },
    { comment: "Full bathroom fit-out including a walk-in shower. Beautiful work and very tidy.", rating: 5 },
    { comment: "Good work on the kitchen replumb. Quoted one price and stuck to it.", rating: 4 },
    { comment: "Boiler service done quickly and efficiently. Clear explanation of what was checked.", rating: 4 },
    { comment: "Sorted a low water pressure issue that had been plaguing us for years. Very satisfied.", rating: 5 },
    { comment: "Reliable and reasonable pricing. Slight delay getting parts but kept me informed throughout.", rating: 4 },
    { comment: "En-suite installation. Great quality finish on the tiling and plumbing.", rating: 5 },
    { comment: "Replaced all water supply pipes throughout the house. Minimal disruption and a great result.", rating: 5 },
    { comment: "Underfloor heating installation — warm and even heating across all rooms.", rating: 5 },
    { comment: "Professional and polite. Would be happy to recommend to friends and family.", rating: 4 },
    { comment: "Fixed a blocked drain that three other companies had failed to clear. Very impressive.", rating: 5 },
    { comment: "Work was fine but scheduling took longer than originally indicated.", rating: 3 },
    { comment: "New bathroom suite fitted neatly. Minor grout issue resolved immediately when flagged.", rating: 4 },
    { comment: "Gas boiler replaced efficiently. All documentation and certificates provided promptly.", rating: 5 },
    { comment: "Persistent dripping tap finally sorted. Small job done with the same care as a big one.", rating: 4 },
    { comment: "Full central heating powerflush and rebalance. System noticeably more efficient now.", rating: 5 },
    { comment: "Outdoor tap and irrigation connection installed cleanly. Happy with the result.", rating: 4 },
  ],
  "General Contractor": [
    { comment: "House extension delivered on time and on budget. Outstanding project management and quality of finish.", rating: 5 },
    { comment: "Full house renovation coordinated seamlessly. Reliable trades, zero hassle for us.", rating: 5 },
    { comment: "Loft conversion — exceptional quality. Feels like a completely different home.", rating: 5 },
    { comment: "Managed a complex commercial fit-out with multiple subcontractors without a single issue.", rating: 5 },
    { comment: "Garage conversion to habitable room. Planning handled by the contractor, stress-free process.", rating: 5 },
    { comment: "Kitchen extension and open-plan remodel. Stunning result, very happy.", rating: 5 },
    { comment: "Communication was consistently excellent. Any issue flagged and resolved before it became a problem.", rating: 5 },
    { comment: "Large project, tight programme. Delivered to specification with minimal snagging.", rating: 4 },
    { comment: "Complete interior remodel of a 6-room apartment. Trades coordinated perfectly.", rating: 5 },
    { comment: "Bathroom and kitchen upgraded simultaneously. Efficient scheduling minimised time without facilities.", rating: 4 },
    { comment: "New build garden studio. From groundworks to handover — excellent throughout.", rating: 5 },
    { comment: "Project ran slightly over the estimated timeline but quality was never compromised.", rating: 4 },
    { comment: "Detailed specifications, accurate quotes. No hidden costs at final account.", rating: 5 },
    { comment: "Restoration of a period property. Great respect for the original character of the building.", rating: 5 },
    { comment: "Good contractor. Some delays sourcing specific materials but proactive communication.", rating: 4 },
    { comment: "Handled all permits and sign-offs. Invaluable for someone unfamiliar with the process.", rating: 5 },
    { comment: "Porch and driveway project. Clean site, courteous team, excellent finish.", rating: 4 },
    { comment: "Summer house and decking construction. Exactly as designed, very pleased.", rating: 5 },
    { comment: "Whole-house insulation and dry-lining project. Warm and quiet home now.", rating: 4 },
    { comment: "Complex structural work involving steel beams. Handled confidently and safely.", rating: 5 },
  ],
  Carpenter: [
    { comment: "Fitted wardrobes in four bedrooms. Perfect fit, beautiful finish, and great use of awkward space.", rating: 5 },
    { comment: "Bespoke kitchen cabinetry. Every detail thought through — exceeded expectations.", rating: 5 },
    { comment: "Staircase renovation with new treads and handrail. Transformed the hallway completely.", rating: 5 },
    { comment: "Home office built-in desk and shelving. Exactly what I envisioned, flawlessly executed.", rating: 5 },
    { comment: "Oak hardwood floor installed. Perfectly level, tight joints, beautifully finished.", rating: 5 },
    { comment: "Loft room fitted with under-eaves storage. Creative solutions for awkward angles.", rating: 4 },
    { comment: "Solid work but a couple of minor alignment issues. Addressed immediately when pointed out.", rating: 4 },
    { comment: "Sash window restoration — works and looks like new. Great attention to period detail.", rating: 5 },
    { comment: "Deck construction in hardwood. Solid, well-designed, and perfectly weatherproofed.", rating: 5 },
    { comment: "Custom dining table and bench. Beautifully crafted and unique piece of furniture.", rating: 5 },
    { comment: "Internal doors and linings throughout a new build. Consistent high quality on every door.", rating: 4 },
    { comment: "Timber frame garden room constructed to a high standard. Very pleased with the result.", rating: 5 },
    { comment: "Airing cupboard reorganised with new shelving. Small job done to a big standard.", rating: 4 },
    { comment: "Bay window seat with storage. Beautifully fitted and very functional.", rating: 5 },
    { comment: "Pantry unit built into an awkward kitchen alcove. Perfect use of dead space.", rating: 5 },
    { comment: "Good craftsman. Took a little longer than quoted but the quality justified it.", rating: 4 },
    { comment: "Timber cladding on a garden wall. Even, neat, and properly treated.", rating: 4 },
    { comment: "Built-in media wall. Cables concealed neatly, finish is immaculate.", rating: 5 },
    { comment: "TV alcove with floating shelves. Simple brief executed very well.", rating: 4 },
    { comment: "Replacement fascias, soffits, and bargeboards. Clean work and good value for the area.", rating: 4 },
  ],
  Painter: [
    { comment: "Full repaint of a 5-bed house including all woodwork. Immaculate finish and superb colour advice.", rating: 5 },
    { comment: "Living room feature wall with Venetian plaster effect. Stunning result.", rating: 5 },
    { comment: "Exterior repaint in difficult weather window. Finished on time, looks brand new.", rating: 4 },
    { comment: "Detailed cutting-in and zero roller marks. One of the best paint jobs I've seen.", rating: 5 },
    { comment: "Quick turnaround on a rental property between tenancies. Great value.", rating: 4 },
    { comment: "Colour consultation was really helpful. Chose tones I'd never have considered alone.", rating: 5 },
    { comment: "Good work overall. Some masking could have been neater on the skirting.", rating: 3 },
    { comment: "Wallpaper strip and full repaint. Patient work on old walls, great final finish.", rating: 4 },
    { comment: "Painted kitchen cabinets in a two-tone scheme. Looks like new units.", rating: 5 },
    { comment: "Outdoor fences and shed painted with weatherproof treatment. Efficient and tidy.", rating: 4 },
    { comment: "Bathroom with wet area paint — no streaks, no drips, professional result.", rating: 5 },
    { comment: "Nursery with a bespoke mural. Creative, fun, and really well executed.", rating: 5 },
    { comment: "Hallway and staircase — tricky area done with care. Excellent edge work.", rating: 4 },
    { comment: "Office redecoration over a weekend so minimal business disruption.", rating: 4 },
    { comment: "Period coving and ceiling rose picked out in contrasting colours. Beautiful detail.", rating: 5 },
    { comment: "Reliable, tidy, and friendly. Happy to recommend.", rating: 4 },
    { comment: "Exterior masonry paint on a three-storey building. Safe working, quality finish.", rating: 5 },
    { comment: "Lime wash finish on internal walls. Exactly the rustic look we wanted.", rating: 5 },
    { comment: "Garage floor painted with epoxy coating. Durable, clean, and looks great.", rating: 4 },
    { comment: "Skim coat then paint on repaired ceiling. Invisible repair — very impressed.", rating: 5 },
  ],
  Roofer: [
    { comment: "Complete re-roof in natural slate. Immaculate workmanship, watertight from day one.", rating: 5 },
    { comment: "Responded within hours to an emergency leak. Temporary fix overnight, full repair next day.", rating: 5 },
    { comment: "Flat roof replacement with cold-applied system. No more leaks and 20-year guarantee.", rating: 5 },
    { comment: "Chimney repointing and flashing replacement. Solved a leak that had damaged the loft for years.", rating: 5 },
    { comment: "Green roof installation on a garden studio. Beautiful and fully functional.", rating: 5 },
    { comment: "New velux windows installed cleanly, no water ingress from day one.", rating: 4 },
    { comment: "Half-hip re-roof. Scaffold up, job done, scaffold down in four days. Outstanding.", rating: 5 },
    { comment: "Dry verge and ridge system installed. Looks neat and should last decades.", rating: 4 },
    { comment: "Guttering replacement alongside roof repair. Good value for the scope of work.", rating: 4 },
    { comment: "Thorough roof inspection with a written report and photos. Very professional.", rating: 5 },
    { comment: "Ridge tiles repointed and hip tiles re-bedded. No more movement in storms.", rating: 4 },
    { comment: "Shed and outbuilding re-roofed in box-profile steel. Clean finish and quick.", rating: 4 },
    { comment: "Leadwork around a dormer window. Traditional skills on show — very neat.", rating: 5 },
    { comment: "Small job handled with the same professionalism as a large one.", rating: 4 },
    { comment: "Pricing was clear and final invoice matched the quote exactly.", rating: 5 },
    { comment: "Took slightly longer than expected but quality of work was high.", rating: 4 },
    { comment: "Roof and fascia replacement. Both look great and are well-sealed.", rating: 5 },
    { comment: "Complex multi-pitch roof on a Victorian terrace. Expertly managed.", rating: 5 },
    { comment: "Moss treatment and clean. Roof looks years younger and drainage improved.", rating: 4 },
    { comment: "Responsive communication from quote to completion. Would definitely use again.", rating: 5 },
  ],
  "HVAC Technician": [
    { comment: "New air source heat pump system installed throughout the house. Quiet, efficient, warm.", rating: 5 },
    { comment: "Annual service was thorough with a detailed written report. Very professional.", rating: 4 },
    { comment: "Multi-split air conditioning in four rooms. Installed cleanly with concealed pipework.", rating: 5 },
    { comment: "Underfloor heating installed across the ground floor. Even heat distribution.", rating: 5 },
    { comment: "Old boiler replaced with a heat pump. The transition was managed perfectly.", rating: 5 },
    { comment: "Fault diagnosis and repair on a commercial HVAC unit. Back running within hours.", rating: 5 },
    { comment: "Smart thermostat and zoning system installed. Noticeable reduction in energy bills.", rating: 4 },
    { comment: "Ventilation system for a new home office. No condensation issues since installation.", rating: 4 },
    { comment: "Air conditioning serviced and regassed. Works like new again.", rating: 4 },
    { comment: "Solid work but scheduling required some flexibility. Good result overall.", rating: 3 },
    { comment: "Ducted system for a new extension. Integration with the existing system seamless.", rating: 5 },
    { comment: "Heat recovery ventilation (MVHR) system — house is now comfortable year-round.", rating: 5 },
    { comment: "Fast response to a heating failure in winter. Problem diagnosed and fixed same day.", rating: 5 },
    { comment: "Commercial kitchen extraction installed to regulation standard.", rating: 4 },
    { comment: "Energy assessment carried out with useful advice on system optimisation.", rating: 4 },
    { comment: "New system installed competently. Post-install documentation was thorough.", rating: 4 },
    { comment: "Annual maintenance contract — reliable, on time, every visit.", rating: 5 },
    { comment: "Refrigerant leak located and repaired. Honest about what the system needed.", rating: 5 },
    { comment: "Garage workshop heating system. Comfortable working environment now.", rating: 4 },
    { comment: "Air source heat pump and underfloor heating combined project. Complex but faultless.", rating: 5 },
  ],
  Tiler: [
    { comment: "Full bathroom in large-format porcelain. Zero lippage, grout lines laser straight.", rating: 5 },
    { comment: "Kitchen splashback in glass mosaic. Intricate and perfectly aligned.", rating: 5 },
    { comment: "Herringbone floor in the hallway. Takes time to lay correctly — done perfectly.", rating: 5 },
    { comment: "Natural stone bathroom. Sealing and grouting done impeccably.", rating: 5 },
    { comment: "Terrace tiling in rectified porcelain. Level, well-pointed, and beautiful.", rating: 5 },
    { comment: "Good work on a complex shower enclosure with niches and bench.", rating: 4 },
    { comment: "Pool surround tiled in anti-slip ceramic. Safe and smart-looking.", rating: 4 },
    { comment: "Came back to address a minor grout inconsistency without being asked. Impressive.", rating: 5 },
    { comment: "Large kitchen floor — perfectly level and a great choice of grout colour suggested.", rating: 4 },
    { comment: "Consistent quality across a big project. Very happy throughout.", rating: 5 },
    { comment: "Feature wall in bathroom with a pattern tile. Stunning centrepiece.", rating: 5 },
    { comment: "Underfloor heating tiles laid correctly with expansion joints in all the right places.", rating: 4 },
    { comment: "Solid work. A couple of small chips on cut edges that were concealed well.", rating: 3 },
    { comment: "Entrance hall and utility room done in one visit. Very efficient.", rating: 4 },
    { comment: "Outdoor area including steps — complex geometry handled well.", rating: 5 },
    { comment: "Removed old tiles and re-tiled a bathroom in two days. Minimal disruption.", rating: 4 },
    { comment: "Shower tray and wall tiles — waterproof membrane applied correctly underneath.", rating: 5 },
    { comment: "Patterned Victorian-style floor — period accurate and expertly laid.", rating: 5 },
    { comment: "Good preparation work on an uneven substrate before tiling. Result is flat.", rating: 4 },
    { comment: "Competitive pricing, quality finish, clean workspace. Would recommend.", rating: 4 },
  ],
  Mason: [
    { comment: "Stone boundary wall rebuilt to match the original. Indistinguishable from the historic sections.", rating: 5 },
    { comment: "Chimney breast and inglenook fireplace constructed in reclaimed brick. Beautiful.", rating: 5 },
    { comment: "Underpinning and foundation repair carried out safely and to specification.", rating: 5 },
    { comment: "Pointing on a stone farmhouse facade. Correct lime mortar used — visually perfect.", rating: 5 },
    { comment: "Garden wall in local stone — a real feature. Neighbours keep asking who built it.", rating: 5 },
    { comment: "Solid workmanship on a complex retaining wall. No settling after a year.", rating: 4 },
    { comment: "Brick arch over a garage entrance. Technically demanding, executed cleanly.", rating: 5 },
    { comment: "Period facade restoration — respect for the original material was evident.", rating: 5 },
    { comment: "Good work. Some minor mortar staining on adjacent stonework, cleaned up promptly.", rating: 4 },
    { comment: "External steps in natural stone. Level, well-drained, and robust.", rating: 4 },
    { comment: "Structural brickwork for a house extension. Plumb, level, and well-bonded.", rating: 5 },
    { comment: "Heritage conservation pointing project. Lime putty mortar correctly specified and applied.", rating: 5 },
    { comment: "Barbecue and pizza oven base constructed in engineering brick. Rock solid.", rating: 5 },
    { comment: "Flagstone courtyard laid on a proper sub-base. No movement after two winters.", rating: 4 },
    { comment: "Good specialist. Slightly above budget but the quality made it worthwhile.", rating: 4 },
    { comment: "Rendered and painted a garden wall. Smooth finish, sharp corners.", rating: 4 },
    { comment: "Lintel replacement over a window opening. Structural work done carefully.", rating: 5 },
    { comment: "Stone water feature constructed as designed. A real focal point in the garden.", rating: 5 },
    { comment: "Repointing of an exposed chimney stack. Properly matched mortar colour.", rating: 4 },
    { comment: "Basement waterproofing in tanking render. Dry as a bone after two wet winters.", rating: 5 },
  ],
  Landscaper: [
    { comment: "Complete garden redesign and plant scheme. Transformed a jungle into a sanctuary.", rating: 5 },
    { comment: "Irrigation system installed and programmed. Garden now waters itself — brilliant.", rating: 5 },
    { comment: "Lawn laid from scratch with topsoil preparation. Perfect level and great drainage.", rating: 5 },
    { comment: "Drought-resistant planting scheme looks incredible in summer with zero watering.", rating: 5 },
    { comment: "Patio and planting border designed and built. Functional and very attractive.", rating: 5 },
    { comment: "Good ideas in the design phase. Planting mix was creative and well-considered.", rating: 4 },
    { comment: "Annual maintenance contract — garden always looks cared for.", rating: 4 },
    { comment: "Artificial grass and raised beds installed. Low maintenance and looks great.", rating: 4 },
    { comment: "Water feature and pond installation. Pumps well-hidden, plant selection excellent.", rating: 5 },
    { comment: "Small courtyard transformed with containers and lighting. Love spending time there now.", rating: 5 },
    { comment: "Hedge planting and establishment — grew in thicker than expected.", rating: 4 },
    { comment: "Gravel garden with sculptural planting — exactly the low-maintenance look we wanted.", rating: 5 },
    { comment: "Overground vegetable garden with raised beds. Well-built and properly spaced.", rating: 4 },
    { comment: "Slightly over budget on plants but stuck to original labour estimate.", rating: 3 },
    { comment: "Wildflower meadow area seeded and established. Bees and butterflies now visit constantly.", rating: 5 },
    { comment: "Decking and pergola combined with planting. The structure is solid and looks natural.", rating: 4 },
    { comment: "Retaining slope stabilised with terracing and planting. No more erosion.", rating: 5 },
    { comment: "Roof terrace planted with resilient species. Still looking good after two years.", rating: 4 },
    { comment: "Responsive to changes during the project. Flexible approach without extra charges.", rating: 4 },
    { comment: "Post-build garden clearance and establishment. Started from a building site, ended as a garden.", rating: 5 },
  ],
  "Concrete & Paving": [
    { comment: "New driveway in block paving. Edging straight, drainage correct, pattern immaculate.", rating: 5 },
    { comment: "Decorative stamped concrete patio. Completely bespoke and very impressive.", rating: 5 },
    { comment: "Concrete garage floor resurfaced with epoxy screed. Hard-wearing and easy to clean.", rating: 5 },
    { comment: "Reinforced concrete shed base. Level, thick enough, and set properly.", rating: 4 },
    { comment: "Resin-bound driveway — looks great, drains well, very satisfied.", rating: 5 },
    { comment: "Path and steps in concrete. Finished with an anti-slip broom texture.", rating: 4 },
    { comment: "Block paving repairs and sand re-fill. Settled back flush and level.", rating: 4 },
    { comment: "Concrete retaining wall. Well-reinforced and properly cured.", rating: 4 },
    { comment: "Good work overall. Site was left clean at the end of each day.", rating: 4 },
    { comment: "Large car park resurfaced in tarmac. Smooth, even, and well-marked.", rating: 4 },
    { comment: "Pattern-imprinted driveway matched a reference photo perfectly.", rating: 5 },
    { comment: "Concrete path with inset cobble edging. Decorative and practical.", rating: 5 },
    { comment: "Trench and base for outbuilding. Solid foundation, correctly specified.", rating: 5 },
    { comment: "Minor waviness on one section of the driveway, corrected without fuss.", rating: 4 },
    { comment: "Shared driveway resurfacing — neighbours and I are all very happy.", rating: 4 },
    { comment: "Natural stone paving on the rear terrace. Good bedding, level run-off.", rating: 5 },
    { comment: "Cellar tanking slab. No seepage reported after six months.", rating: 5 },
    { comment: "Polished concrete internal floor. Smooth, glossy, and durable.", rating: 5 },
    { comment: "Complex paving around a swimming pool. Non-slip surface, looks elegant.", rating: 5 },
    { comment: "Utility yard in heavy-duty concrete for HGV access. Held up perfectly.", rating: 5 },
  ],
  "Flooring Specialist": [
    { comment: "Engineered oak laid throughout the ground floor. Colour match between rooms perfect.", rating: 5 },
    { comment: "Herringbone parquet restoration — sanded back and refinished beautifully.", rating: 5 },
    { comment: "LVT in a busy commercial kitchen. Well-prepared substrate and excellent seaming.", rating: 5 },
    { comment: "Carpet in bedrooms with quality underlay. Soft, comfortable, and well-fitted.", rating: 4 },
    { comment: "Laminate in rental property — fast installation, durable product chosen well.", rating: 4 },
    { comment: "Advice on product choice was excellent. Went with solid oak — love it.", rating: 5 },
    { comment: "Floor levelling before LVT installation done properly. Zero movement.", rating: 5 },
    { comment: "Small gap appeared near a doorway. Returned within two days and rectified it.", rating: 4 },
    { comment: "Parquet flooring in a dining room. Traditional style, modern finish.", rating: 5 },
    { comment: "Vinyl in a bathroom. Waterproof seams and around fixtures done neatly.", rating: 4 },
    { comment: "Full house refit with consistent flooring throughout. Great project management.", rating: 5 },
    { comment: "Stair nosings and landing edging finished immaculately.", rating: 4 },
    { comment: "Old chipboard subfloor replaced and new engineered floor laid. Solid result.", rating: 5 },
    { comment: "Competitive quote and matched it on delivery. Very straightforward.", rating: 4 },
    { comment: "Carpet tiles in a commercial office. Pattern matched and transition strips neat.", rating: 4 },
    { comment: "Underfloor heating screed levelled and wood floor fitted correctly on top.", rating: 5 },
    { comment: "Old floor lifted, DPM applied, new floor fitted. Three days, no fuss.", rating: 5 },
    { comment: "Beautiful wide-plank oak. Installation took extra care on the uneven substrate.", rating: 5 },
    { comment: "Good quality product supply and professional fitting. Happy customer.", rating: 4 },
    { comment: "Threshold bars and door drops trimmed precisely. Details matter — and they noticed.", rating: 5 },
  ],
  Handyman: [
    { comment: "Knocked out a list of 15 small jobs in one day. Everything done properly.", rating: 5 },
    { comment: "Flat-pack furniture built and TV mounted with cables concealed. Efficient.", rating: 5 },
    { comment: "Fence panels replaced, a door rehung, and curtain poles fitted. All in one visit.", rating: 4 },
    { comment: "Reliable and honest about what was and wasn't within scope. Really appreciated.", rating: 5 },
    { comment: "Bathroom cabinet, towel rail, and mirror fitted. Quick and tidy.", rating: 4 },
    { comment: "Arrived on time, worked quietly and tidied up completely. Would book again.", rating: 5 },
    { comment: "Draught-proofing on windows and doors. Noticeably warmer and quieter house.", rating: 4 },
    { comment: "Back gate lock replaced and garden tap fixed in one visit. Great value.", rating: 4 },
    { comment: "Paint touch-ups after some minor damage. Very careful colour matching.", rating: 4 },
    { comment: "Good work but requested items needed sourcing, adding a day to the job.", rating: 3 },
    { comment: "Decking boards replaced. Old ones removed cleanly, new ones level.", rating: 4 },
    { comment: "Spotlights replaced in the kitchen ceiling. Quick and no mess.", rating: 4 },
    { comment: "Shed assembly from flat-pack. Well-levelled on base with anchors.", rating: 5 },
    { comment: "Shelving in utility room. Straight, strong, and exactly the spacing I asked for.", rating: 5 },
    { comment: "Venetian blinds fitted across six windows. All straight and functioning perfectly.", rating: 5 },
    { comment: "Outdoor security light positioned and set up. Works perfectly on motion.", rating: 4 },
    { comment: "Good general handyman. No job too small, reasonable rate.", rating: 4 },
    { comment: "Ceiling crack filled and painted. Invisible repair on a textured ceiling — impressive.", rating: 5 },
    { comment: "Letterbox and door handle replaced. Simple job, done to a professional standard.", rating: 4 },
    { comment: "Garage shelving system built and secured. Very sturdy and well-planned layout.", rating: 5 },
  ],
  "Window & Door Specialist": [
    { comment: "New triple-glazed windows throughout. Immediate difference in warmth and noise reduction.", rating: 5 },
    { comment: "Bi-fold doors installed perfectly. Open and close smoothly, zero draughts.", rating: 5 },
    { comment: "Front door replacement — composite door fits perfectly and the locking system is reassuring.", rating: 5 },
    { comment: "PVC windows with period-style glazing bars. Look appropriate for the house's age.", rating: 4 },
    { comment: "Timber sash window restoration on a listed building. Conservation area compliant.", rating: 5 },
    { comment: "Roof light installation — no leaks and a real improvement to the room below.", rating: 5 },
    { comment: "Aluminium sliding doors — smooth operation and the thermal break has made a difference.", rating: 4 },
    { comment: "All windows and doors replaced in a week. Minimal disruption and clean work.", rating: 5 },
    { comment: "Energy ratings provided for all new units. Made the choice between products much easier.", rating: 4 },
    { comment: "Minor adjustment needed after installation — sorted during the next working day.", rating: 4 },
    { comment: "French doors to garden installed beautifully. Even on the tricky masonry opening.", rating: 5 },
    { comment: "Good product range and honest advice on which to choose.", rating: 4 },
    { comment: "Tilt-and-turn windows in an apartment. Easy cleaning, secure, and draught-free.", rating: 5 },
    { comment: "Stable door fitted and sealed correctly. Great period look for a rural property.", rating: 5 },
    { comment: "Secure by Design front door with multi-point lock. Peace of mind improved.", rating: 5 },
    { comment: "Patio doors with integrated blinds. Convenient and well-finished around the frame.", rating: 4 },
    { comment: "Conservatory roof replaced with solid insulated panels. Now usable year-round.", rating: 5 },
    { comment: "Garage door replaced with an automated roller door. Works reliably every time.", rating: 4 },
    { comment: "Internal glazed partition installed in an office. Clean look and well-sealed.", rating: 4 },
    { comment: "Good installation, paperwork and certificates issued promptly.", rating: 4 },
  ],
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  console.log("✔ Connected to MongoDB");

  const seedHomeowners = await User.find({ email: { $regex: `${SEED_DOMAIN}$`, $options: "i" }, role: "homeowner" }).lean();
  const seedContractors = await Contractor.find({}).lean();

  // Filter to only seed contractors (those owned by seed users)
  const seedUserIds = new Set((await User.find({ email: { $regex: `${SEED_DOMAIN}$` } }).select("_id").lean()).map((u) => u._id.toString()));
  const seedContractorList = seedContractors.filter((c) => seedUserIds.has(c.owner.toString()));

  if (seedHomeowners.length === 0 || seedContractorList.length === 0) {
    console.error("❌ No seed users found. Run seed-users.mjs first.");
    process.exit(1);
  }

  console.log(`✔ Found ${seedHomeowners.length} homeowners and ${seedContractorList.length} contractors`);

  // Clear existing seed reviews
  const allSeedUserIds = [...seedUserIds].map((id) => new mongoose.Types.ObjectId(id));
  const allSeedContractorIds = seedContractorList.map((c) => c._id);
  await Review.deleteMany({ $or: [{ user: { $in: allSeedUserIds } }, { contractor: { $in: allSeedContractorIds } }] });
  console.log("✔ Cleared existing seed reviews");

  let totalReviews = 0;

  for (const contractor of seedContractorList) {
    const templates = REVIEW_TEMPLATES[contractor.trade] ?? REVIEW_TEMPLATES.Handyman;
    const reviews = seedHomeowners.map((homeowner, i) => ({
      user: homeowner._id,
      contractor: contractor._id,
      rating: templates[i % templates.length].rating,
      comment: templates[i % templates.length].comment,
      projectType: contractor.trade,
      verified: i % 3 !== 0, // ~67% verified
    }));

    await Review.insertMany(reviews, { ordered: false });

    // Update contractor stats
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Contractor.updateOne(
      { _id: contractor._id },
      { averageRating: Math.round(avg * 10) / 10, reviewCount: reviews.length },
    );

    totalReviews += reviews.length;
    process.stdout.write(`  ✔ ${contractor.name} — ${reviews.length} reviews (avg ${avg.toFixed(1)})\n`);
  }

  console.log(`\n✅ Created ${totalReviews} reviews across ${seedContractorList.length} contractors`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
