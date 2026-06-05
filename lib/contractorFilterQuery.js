export default function contractorFilterQuery(sp) {
  const query = {};

  if (sp.serviceArea) {
    const rx = new RegExp(sp.serviceArea, "i");
    query.$or = [{ "serviceArea.address": rx }, { "serviceArea.postcode": rx }];
  }

  if (sp.trade) query.trade = sp.trade;

  if (sp["serviceArea.address"]) {
    query["serviceArea.address"] = new RegExp(sp["serviceArea.address"], "i");
  }

  if (sp["serviceArea.postcode"]) {
    query["serviceArea.postcode"] = sp["serviceArea.postcode"];
  }

  const hMin = sp["priceRange.hourly.min"];
  const hMax = sp["priceRange.hourly.max"];
  if (hMin) query["priceRange.hourly.max"] = { $gte: Number(hMin) };
  if (hMax) query["priceRange.hourly.min"] = { $lte: Number(hMax) };

  const pMin = sp["priceRange.project.min"];
  const pMax = sp["priceRange.project.max"];
  if (pMin) query["priceRange.project.max"] = { $gte: Number(pMin) };
  if (pMax) query["priceRange.project.min"] = { $lte: Number(pMax) };

  const rMin = sp["averageRating.min"];
  const rMax = sp["averageRating.max"];
  if (rMin || rMax) {
    query.averageRating = {};
    if (rMin) query.averageRating.$gte = Number(rMin);
    if (rMax) query.averageRating.$lte = Number(rMax);
  }

  if (sp["yearsExperience.min"]) {
    query.yearsExperience = {
      $gte: Number(sp["yearsExperience.min"]),
    };
  }

  if (sp.available === "true") query.available = true;
  if (sp.verified === "true") query.verified = true;

  return query;
}
