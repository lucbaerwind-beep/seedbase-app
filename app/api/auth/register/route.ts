import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { ensureUniqueSlug } from "@/lib/slug";

export async function POST(request: Request) {
  const formData = await request.formData();
  const companyName = String(formData.get("companyName") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!companyName || !country || !email || password.length < 8) {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered." }, { status: 409 });
  }

  const existingSlugs = await prisma.supplierCompany.findMany({
    select: { slug: true }
  });
  const slug = ensureUniqueSlug(
    companyName,
    new Set(existingSlugs.map((item) => item.slug))
  );

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      supplier: {
        create: {
          slug,
          name: companyName,
          country,
          cropsFocus: [],
          certifications: { connect: [] }
        }
      }
    }
  });

  createSession(user.id);

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
