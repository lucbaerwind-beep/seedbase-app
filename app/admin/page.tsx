import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Admin access required</h1>
        <p className="text-sm text-slate-600">You do not have permission to view this page.</p>
      </div>
    );
  }

  const [suppliers, varieties] = await Promise.all([
    prisma.supplierCompany.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: true }
    }),
    prisma.variety.findMany({
      orderBy: { createdAt: "desc" },
      include: { supplier: true }
    })
  ]);

  return (
    <div className="space-y-6">
      <section className="card space-y-2">
        <h1 className="text-2xl font-semibold">Admin moderation</h1>
        <p className="text-sm text-slate-600">Approve suppliers and review listings.</p>
      </section>

      <section className="card space-y-4">
        <h2 className="text-xl font-semibold">Supplier approvals</h2>
        <div className="space-y-3">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold">{supplier.name}</p>
                <p className="text-xs text-slate-500">{supplier.owner.email}</p>
                <p className="text-xs text-slate-500">Status: {supplier.approved ? "Approved" : "Pending"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <form method="post" action={`/api/admin/suppliers/${supplier.id}`}>
                  <input type="hidden" name="intent" value="approve" />
                  <button className="rounded-full border border-emerald-600 px-4 py-2 text-xs font-semibold text-emerald-700" type="submit">
                    {supplier.approved ? "Re-approve" : "Approve"}
                  </button>
                </form>
                <form method="post" action={`/api/admin/suppliers/${supplier.id}`}>
                  <input type="hidden" name="intent" value={supplier.featured ? "unfeature" : "feature"} />
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600" type="submit">
                    {supplier.featured ? "Unfeature" : "Feature"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="text-xl font-semibold">Variety moderation</h2>
        <div className="space-y-3">
          {varieties.map((variety) => (
            <div key={variety.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold">{variety.name}</p>
                <p className="text-xs text-slate-500">Supplier: {variety.supplier.name}</p>
                <p className="text-xs text-slate-500">Status: {variety.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <form method="post" action={`/api/admin/varieties/${variety.id}`}>
                  <input type="hidden" name="intent" value="publish" />
                  <button className="rounded-full border border-emerald-600 px-4 py-2 text-xs font-semibold text-emerald-700" type="submit">
                    Publish
                  </button>
                </form>
                <form method="post" action={`/api/admin/varieties/${variety.id}`}>
                  <input type="hidden" name="intent" value="draft" />
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600" type="submit">
                    Move to draft
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
