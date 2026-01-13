import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const listings = await prisma.seedListing.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: true }
  });
  return NextResponse.json(listings);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await prisma.seedListing.count({ where: { ownerId: user.id } });
  if (count >= 5) {
    return NextResponse.json({ error: "Listing limit reached." }, { status: 400 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const crop = String(formData.get("crop") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const contactInfo = String(formData.get("contactInfo") || "").trim();

  if (!name || !crop || !description || !contactInfo) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  await prisma.seedListing.create({
    data: {
      name,
      crop,
      description,
      imageUrl: imageUrl || null,
      contactInfo,
      ownerId: user.id
    }
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
