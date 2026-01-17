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

  if (intent === "publish") {
    await prisma.variety.update({
      where: { id: params.id },
      data: { status: "PUBLISHED" }
    });
  }

  if (intent === "draft") {
    await prisma.variety.update({
      where: { id: params.id },
      data: { status: "DRAFT" }
    });
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}
