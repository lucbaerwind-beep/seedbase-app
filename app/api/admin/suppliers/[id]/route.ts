import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  if (intent === "approve") {
    await prisma.supplierCompany.update({
      where: { id: params.id },
      data: { approved: true }
    });
  }

  if (intent === "feature") {
    await prisma.supplierCompany.update({
      where: { id: params.id },
      data: { featured: true }
    });
  }

  if (intent === "unfeature") {
    await prisma.supplierCompany.update({
      where: { id: params.id },
      data: { featured: false }
    });
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}
