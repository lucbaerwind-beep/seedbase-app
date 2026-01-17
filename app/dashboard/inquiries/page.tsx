import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function InquiryInboxPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Access restricted</h1>
        <p className="text-sm text-slate-600">Please log in to view your inquiries.</p>
      </div>
    );
  }

  const inquiries = await prisma.inquiry.findMany({
    where: { recipientId: user.id },
    orderBy: { createdAt: "desc" },
    include: { variety: true, supplier: true }
  });

  return (
    <div className="space-y-6">
      <section className="card space-y-2">
        <h1 className="text-2xl font-semibold">Inquiry inbox</h1>
        <p className="text-sm text-slate-600">Review and follow up with incoming buyer requests.</p>
      </section>

      <section className="card space-y-4">
        {inquiries.length === 0 ? (
          <p className="text-sm text-slate-600">No inquiries yet.</p>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">{inquiry.senderName}</p>
                    <p className="text-xs text-slate-500">{inquiry.senderEmail}</p>
                    <p className="text-xs text-slate-500">Country: {inquiry.senderCountry}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {inquiry.status === "REPLIED" ? "Replied" : "New"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{inquiry.message}</p>
                <p className="mt-3 text-xs text-slate-500">
                  Variety: {inquiry.variety?.name ?? "General inquiry"} · Supplier: {inquiry.supplier.name}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {inquiry.status === "NEW" && (
                    <form method="post" action={`/api/inquiries/${inquiry.id}`}>
                      <input type="hidden" name="intent" value="mark-replied" />
                      <button className="rounded-full border border-emerald-600 px-4 py-2 text-xs font-semibold text-emerald-700" type="submit">
                        Mark as replied
                      </button>
                    </form>
                  )}
                  <form method="post" action={`/api/inquiries/${inquiry.id}`}>
                    <input type="hidden" name="intent" value="export" />
                    <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600" type="submit">
                      Export CSV
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
