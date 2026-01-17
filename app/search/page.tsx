import Link from "next/link";
import { prisma } from "@/lib/db";

type SearchParams = {
  q?: string;
};

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const query = searchParams.q?.trim() ?? "";

  const [suppliers, varieties] = await Promise.all([
    prisma.supplierCompany.findMany({
      where: {
        approved: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      },
      take: 6
    }),
    prisma.variety.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      },
      include: { supplier: true },
      take: 6
    })
  ]);

  return (
    <div className="space-y-8">
      <section className="card space-y-2">
        <h1 className="text-3xl font-semibold">Search results</h1>
        <p className="text-sm text-slate-600">
          Showing results for <span className="font-semibold">{query || "all listings"}</span>.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Suppliers</h2>
          <Link className="text-sm font-semibold text-emerald-700" href={`/suppliers?q=${encodeURIComponent(query)}`}>
            View all suppliers →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.length === 0 ? (
            <p className="text-sm text-slate-500">No suppliers matched your search.</p>
          ) : (
            suppliers.map((supplier) => (
              <Link key={supplier.id} href={`/suppliers/${supplier.slug}`} className="card space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{supplier.country}</p>
                <h3 className="text-lg font-semibold">{supplier.name}</h3>
                <p className="text-sm text-slate-600">{supplier.description ?? "Supplier description coming soon."}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Varieties</h2>
          <Link className="text-sm font-semibold text-emerald-700" href={`/varieties?q=${encodeURIComponent(query)}`}>
            View all varieties →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {varieties.length === 0 ? (
            <p className="text-sm text-slate-500">No varieties matched your search.</p>
          ) : (
            varieties.map((variety) => (
              <Link key={variety.id} href={`/varieties/${variety.slug}`} className="card space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{variety.crop}</p>
                <h3 className="text-lg font-semibold">{variety.name}</h3>
                <p className="text-sm text-slate-600">{variety.description ?? "Details coming soon."}</p>
                <p className="text-xs text-slate-500">Supplier: {variety.supplier.name}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
