import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const formData = await request.formData();
  const supplierId = String(formData.get("supplierId") || "");
  const varietyId = String(formData.get("varietyId") || "") || null;
  const senderName = String(formData.get("name") || "").trim();
  const senderEmail = String(formData.get("email") || "").trim();
  const senderCompany = String(formData.get("company") || "").trim();
  const senderCountry = String(formData.get("country") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const honeypot = String(formData.get("website") || "").trim();

  if (honeypot) {
    return NextResponse.json({ error: "Spam detected." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  if (!supplierId || !senderName || !senderEmail || !senderCountry || !message) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const supplier = await prisma.supplierCompany.findUnique({ where: { id: supplierId } });

  if (!supplier || !supplier.approved) {
    return NextResponse.json({ error: "Supplier not found." }, { status: 404 });
  }

  if (varietyId) {
    const variety = await prisma.variety.findUnique({ where: { id: varietyId }, select: { supplierId: true } });
    if (!variety || variety.supplierId !== supplier.id) {
      return NextResponse.json({ error: "Variety not found." }, { status: 404 });
    }
  }

  await prisma.inquiry.create({
    data: {
      senderName,
      senderEmail,
      senderCompany: senderCompany || null,
      senderCountry,
      message,
      supplierId: supplier.id,
      varietyId,
      recipientId: supplier.ownerId
    }
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Inquiry received:", {
      supplier: supplier.name,
      senderName,
      senderEmail,
      senderCompany,
      senderCountry
    });
  }

  let redirectTarget = `/suppliers/${supplier.slug}`;
  if (varietyId) {
    const variety = await prisma.variety.findUnique({ where: { id: varietyId }, select: { slug: true } });
    if (variety?.slug) {
      redirectTarget = `/varieties/${variety.slug}`;
    }
  }
  return NextResponse.redirect(new URL(redirectTarget, request.url));
}
