import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const variety = await prisma.variety.findUnique({
    where: { id: params.id },
    include: { supplier: true }
  });

  if (!variety || variety.supplier.ownerId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") || "update");

  if (intent === "delete") {
    await prisma.variety.delete({ where: { id: variety.id } });
    return NextResponse.redirect(new URL("/dashboard/varieties", request.url));
  }

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
  const status = String(formData.get("status") || variety.status);

  if (!name || !crop || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

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

  await prisma.variety.update({
    where: { id: variety.id },
    data: {
      name,
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
      tags: {
        set: [],
        connect: tagConnections.map((tag) => ({ id: tag.id }))
      }
    }
  });

  return NextResponse.redirect(new URL("/dashboard/varieties", request.url));
}
