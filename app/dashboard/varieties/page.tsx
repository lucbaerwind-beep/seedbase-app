import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function VarietiesDashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Access restricted</h1>
        <p className="text-sm text-slate-600">Please log in to manage your varieties.</p>
      </div>
    );
  }

  const supplier = await prisma.supplierCompany.findUnique({
    where: { ownerId: user.id },
    include: { varieties: { orderBy: { updatedAt: "desc" } } }
  });

  if (!supplier) {
    return (
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Supplier profile missing</h1>
        <p className="text-sm text-slate-600">Contact support to restore your supplier profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Variety listings</h1>
          <p className="text-sm text-slate-600">Manage up to five published varieties.</p>
        </div>
        {supplier.varieties.length < 5 && (
          <Link className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white" href="/dashboard/varieties/new">
            Add variety
          </Link>
        )}
      </section>

      <section className="card space-y-4">
        {supplier.varieties.length === 0 ? (
          <p className="text-sm text-slate-600">No varieties yet. Add your first listing.</p>
        ) : (
          <div className="space-y-3">
            {supplier.varieties.map((variety) => (
              <div key={variety.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{variety.crop}</p>
                  <h2 className="text-lg font-semibold">{variety.name}</h2>
                  <p className="text-sm text-slate-500">
                    Status: {variety.status === "PUBLISHED" ? "Published" : "Draft"} · Updated{" "}
                    {variety.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="rounded-full border border-emerald-600 px-4 py-2 text-xs font-semibold text-emerald-700"
                    href={`/dashboard/varieties/${variety.id}/edit`}
                  >
                    Edit
                  </Link>
                  <form method="post" action={`/api/varieties/${variety.id}`}>
                    <input type="hidden" name="intent" value="delete" />
                    <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600" type="submit">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
        {supplier.varieties.length >= 5 && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
            You have reached the maximum of five varieties.
          </p>
        )}
      </section>
    </div>
  );
}
