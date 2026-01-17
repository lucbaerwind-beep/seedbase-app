import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiry = await prisma.inquiry.findUnique({ where: { id: params.id } });
  if (!inquiry || inquiry.recipientId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  if (intent === "mark-replied") {
    await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: { status: "REPLIED", repliedAt: new Date() }
    });
    return NextResponse.redirect(new URL("/dashboard/inquiries", request.url));
  }

  if (intent === "export") {
    const sanitize = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv =
      `Name,Email,Company,Country,Message,Status,Created At\n` +
      [
        sanitize(inquiry.senderName),
        sanitize(inquiry.senderEmail),
        sanitize(inquiry.senderCompany ?? ""),
        sanitize(inquiry.senderCountry),
        sanitize(inquiry.message),
        sanitize(inquiry.status),
        sanitize(inquiry.createdAt.toISOString())
      ].join(",") +
      "\n";
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="inquiry-${inquiry.id}.csv"`
      }
    });
  }

  return NextResponse.redirect(new URL("/dashboard/inquiries", request.url));
}
