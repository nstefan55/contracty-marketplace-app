//*In Next.js, when you fetch data from your database inside a Server Component and pass it to a Client Component, Next.js has to serialize (convert) that data into actual JSON behind the scenes.

//When you query MongoDB using Mongoose, even if you use .lean(), Mongoose still returns certain fields as complex JavaScript objects rather than plain text.

//!If you try to pass these complex objects directly from a Server Component to a Client Component, Next.js will throw a "Warning: Only plain objects can be passed to Client Components" error or fail to render. This function's job is to sanitize the data and convert those complex objects into plain strings.

export function convertToSerializableObject(leanDocument) {
  if (!leanDocument) return leanDocument;
  for (const key of Object.keys(leanDocument)) {
    if (
      leanDocument[key] !== null &&
      leanDocument[key] !== undefined &&
      leanDocument[key].toJSON &&
      leanDocument[key].toString
    ) {
      leanDocument[key] = leanDocument[key].toString();
    }
  }
  return leanDocument;
}
