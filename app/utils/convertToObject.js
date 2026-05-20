export function convertToSerializableObject(val) {
  if (val === null || val === undefined) return val;

  if (Array.isArray(val)) {
    return val.map(convertToSerializableObject);
  }

  // ObjectId, Date, etc. — has toJSON, convert to primitive
  if (typeof val === "object" && typeof val.toJSON === "function") {
    const primitive = val.toJSON();
    // Dates serialize to ISO strings via toJSON; ObjectIds to hex strings via toString
    if (typeof primitive === "object") return val.toString();
    return primitive;
  }

  if (typeof val === "object") {
    const result = {};
    for (const key of Object.keys(val)) {
      result[key] = convertToSerializableObject(val[key]);
    }
    return result;
  }

  return val;
}
