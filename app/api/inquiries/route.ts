import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const seedListingId = String(formData.get("seedListingId") || "");
  const senderName = String(formData.get("senderName") || "").trim();
  const senderEmail = String(formData.get("senderEmail") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!seedListingId || !senderName || !senderEmail || !message) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const listing = await prisma.seedListing.findUnique({
    where: { id: seedListingId }
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  await prisma.inquiry.create({
    data: {
      senderName,
      senderEmail,
      message,
      seedListingId: listing.id,
      recipientId: listing.ownerId
    }
  });

  return NextResponse.redirect(new URL(`/seeds/${listing.id}`, request.url));
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await prisma.inquiry.findMany({
    where: { recipientId: user.id },
    include: { seedListing: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(inquiries);
}
