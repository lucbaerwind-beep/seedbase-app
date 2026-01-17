import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ensureUniqueSlug } from "@/lib/slug";

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supplier = await prisma.supplierCompany.findUnique({
    where: { ownerId: user.id },
    include: { varieties: true }
  });

  if (!supplier) {
    return NextResponse.json({ error: "Supplier profile missing" }, { status: 404 });
  }

  if (supplier.varieties.length >= 5) {
    return NextResponse.json({ error: "Variety limit reached" }, { status: 400 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const crop = String(formData.get("crop") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const type = String(formData.get("type") || "HYBRID");
  const description = String(formData.get("description") || "").trim();
  const growingCycle = String(formData.get("growingCycle") || "").trim();
  const availability = String(formData.get("availability") || "").trim();
  const minOrderNote = String(formData.get("minOrderNote") || "").trim();
  const traits = parseList(String(formData.get("traits") || ""));
  const markets = parseList(String(formData.get("markets") || ""));
  const imageUrls = parseList(String(formData.get("imageUrls") || ""));
  const status = String(formData.get("status") || "PUBLISHED");

  if (!name || !crop || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existingSlugs = await prisma.variety.findMany({ select: { slug: true } });
  const slug = ensureUniqueSlug(name, new Set(existingSlugs.map((item) => item.slug)));

  const tagConnections = traits.length
    ? await Promise.all(
        traits.map(async (trait) => {
          const slugValue = trait.toLowerCase().replace(/\s+/g, "-");
          return prisma.tag.upsert({
            where: { slug: slugValue },
            update: {},
            create: { name: trait, slug: slugValue }
          });
        })
      )
    : [];

  await prisma.variety.create({
    data: {
      name,
      slug,
      crop,
      category,
      type: type === "OPEN_POLLINATED" ? "OPEN_POLLINATED" : "HYBRID",
      description: description || null,
      growingCycle: growingCycle || null,
      availability: availability || null,
      minOrderNote: minOrderNote || null,
      traits,
      markets,
      imageUrls,
      status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
      supplierId: supplier.id,
      tags: {
        connect: tagConnections.map((tag) => ({ id: tag.id }))
      }
    }
  });

  return NextResponse.redirect(new URL("/dashboard/varieties", request.url));
}
