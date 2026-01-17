import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/slug";

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

  const supplier = await prisma.supplierCompany.findUnique({ where: { ownerId: user.id } });
  if (!supplier) {
    return NextResponse.json({ error: "Supplier profile missing" }, { status: 404 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const logoUrl = String(formData.get("logoUrl") || "").trim();
  const cropsFocus = parseList(String(formData.get("cropsFocus") || ""));
  const certifications = parseList(String(formData.get("certifications") || ""));

  if (!name || !country) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const certificationConnections = certifications.length
    ? await Promise.all(
        certifications.map(async (cert) => {
          const slug = slugify(cert);
          return prisma.certification.upsert({
            where: { slug },
            update: { name: cert },
            create: { name: cert, slug }
          });
        })
      )
    : [];

  await prisma.supplierCompany.update({
    where: { id: supplier.id },
    data: {
      name,
      country,
      address: address || null,
      website: website || null,
      email: email || null,
      phone: phone || null,
      description: description || null,
      logoUrl: logoUrl || null,
      cropsFocus,
      certifications: {
        set: [],
        connect: certificationConnections.map((cert) => ({ id: cert.id }))
      }
    }
  });

  return NextResponse.redirect(new URL("/dashboard/company", request.url));
}
