import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const [featuredSuppliers, latestVarieties, categories] = await Promise.all([
    prisma.supplierCompany.findMany({
      where: { featured: true, approved: true },
      take: 4,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.variety.findMany({
      where: { status: "PUBLISHED", supplier: { approved: true } },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { supplier: true }
    }),
    prisma.variety.findMany({
      where: { status: "PUBLISHED" },
      distinct: ["category"],
      take: 6,
      select: { category: true }
    })
  ]);

  return (
    <div className="space-y-12">
      <section className="card flex flex-col gap-6 bg-gradient-to-br from-emerald-50 to-white">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Vegetable seed supplier directory
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900">
            Discover trusted seed suppliers and high-performing varieties.
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            SEEDBASE is a B2B discovery platform for seed professionals. Search verified suppliers, compare
            varieties, and send direct inquiries — no marketplace, no commissions.
          </p>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form action="/search" className="flex w-full max-w-xl items-center gap-3">
            <input
              className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              name="q"
              placeholder="Search for tomatoes, disease-resistant varieties, or supplier names..."
            />
            <button className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm">
              Search directory
            </button>
          </form>
          <Link
            className="rounded-full border border-emerald-600 px-5 py-3 text-sm font-semibold text-emerald-700"
            href="/register"
          >
            List up to 5 varieties free
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Featured suppliers</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredSuppliers.length === 0 ? (
              <p className="text-sm text-slate-500">Featured suppliers are being curated now.</p>
            ) : (
              featuredSuppliers.map((supplier) => (
                <Link
                  key={supplier.id}
                  href={`/suppliers/${supplier.slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200"
                >
                  <p className="text-sm font-semibold text-slate-900">{supplier.name}</p>
                  <p className="text-xs text-slate-500">{supplier.country}</p>
                  <p className="mt-3 text-xs text-emerald-700">View profile →</p>
                </Link>
              ))
            )}
          </div>
        </div>
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Popular categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 ? (
              <p className="text-sm text-slate-500">Categories will appear once varieties are listed.</p>
            ) : (
              categories.map((item) => (
                <Link
                  key={item.category}
                  href={`/varieties?category=${encodeURIComponent(item.category)}`}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  {item.category}
                </Link>
              ))
            )}
          </div>
          <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">List up to 5 varieties free</p>
            <p className="mt-2 text-xs text-emerald-700">
              Reach global buyers and distributors looking for premium vegetable seed genetics.
            </p>
          </div>
        </div>
      </section>

      <section className="card space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold">Latest additions</h2>
          <Link className="text-sm font-semibold text-emerald-700" href="/varieties">
            Browse all varieties →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latestVarieties.length === 0 ? (
            <p className="text-sm text-slate-500">Varieties will appear once suppliers publish listings.</p>
          ) : (
            latestVarieties.map((variety) => (
              <Link
                key={variety.id}
                href={`/varieties/${variety.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {variety.crop}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{variety.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{variety.description ?? "Details coming soon."}</p>
                <p className="mt-4 text-xs text-slate-500">Supplier: {variety.supplier.name}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
