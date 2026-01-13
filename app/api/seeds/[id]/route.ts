import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const listing = await prisma.seedListing.findUnique({
    where: { id: params.id },
    include: { owner: true }
  });
  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(listing);
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const action = String(formData.get("action") || "");

  if (action === "delete") {
    await prisma.seedListing.deleteMany({
      where: { id: params.id, ownerId: user.id }
    });
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (action === "update") {
    const name = String(formData.get("name") || "").trim();
    const crop = String(formData.get("crop") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const imageUrl = String(formData.get("imageUrl") || "").trim();
    const contactInfo = String(formData.get("contactInfo") || "").trim();

    if (!name || !crop || !description || !contactInfo) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    await prisma.seedListing.updateMany({
      where: { id: params.id, ownerId: user.id },
      data: {
        name,
        crop,
        description,
        imageUrl: imageUrl || null,
        contactInfo
      }
    });
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const crop = String(body.crop || "").trim();
  const description = String(body.description || "").trim();
  const imageUrl = String(body.imageUrl || "").trim();
  const contactInfo = String(body.contactInfo || "").trim();

  if (!name || !crop || !description || !contactInfo) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const updated = await prisma.seedListing.updateMany({
    where: { id: params.id, ownerId: user.id },
    data: {
      name,
      crop,
      description,
      imageUrl: imageUrl || null,
      contactInfo
    }
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await prisma.seedListing.deleteMany({
    where: { id: params.id, ownerId: user.id }
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
