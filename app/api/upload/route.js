import cloudinary from "@/config/cloudinary";
import { auth } from "@/app/auth";
import {checkActionRateLimit} from "@/lib/action-ratelimit";

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await checkActionRateLimit(`upload-${session.user.id}`);

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const MAX_BYTES = 8 * 1024 * 1024; // 8MB
  const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

  if (!ALLOWED.has(file.type))
    return Response.json({ error: "Unsupported File Type" }, { status: 415 });
  if (file.size > MAX_BYTES)
    return Response.json({ error: "File Size is Too Large" }, { status: 413 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "Contractry/Portfolio",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1200, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
    context: { user_id: session.user.id },
  });

  return Response.json({ url: result.secure_url, publicId: result.public_id });
}
