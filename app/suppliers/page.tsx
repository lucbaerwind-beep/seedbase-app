import Link from "next/link";
import { prisma } from "@/lib/db";

type SearchParams = {
  q?: string;
  country?: string;
  crop?: string;
  certification?: string;
  featured?: string;
  hasVarieties?: string;
  sort?: string;
  page?: string;
};

const PAGE_SIZE = 12;

export default async function SuppliersPage({ searchParams }: { searchParams: SearchParams }) {
  const pageValue = Number(searchParams.page ?? "1");
  const page = Number.isNaN(pageValue) || pageValue < 1 ? 1 : pageValue;
  const query = searchParams.q?.trim();
  const country = searchParams.country?.trim();
  const crop = searchParams.crop?.trim();
  const certification = searchParams.certification?.trim();
  const featured = searchParams.featured === "true";
  const hasVarieties = searchParams.hasVarieties === "true";
  const sort = searchParams.sort ?? "relevance";
  const paginationParams = new URLSearchParams();
  if (query) paginationParams.set("q", query);
  if (country) paginationParams.set("country", country);
  if (crop) paginationParams.set("crop", crop);
  if (certification) paginationParams.set("certification", certification);
  if (featured) paginationParams.set("featured", "true");
  if (hasVarieties) paginationParams.set("hasVarieties", "true");
  if (sort) paginationParams.set("sort", sort);

  const whereClause = {
    approved: true,
    ...(featured ? { featured: true } : {}),
    ...(country ? { country } : {}),
    ...(crop ? { cropsFocus: { has: crop } } : {}),
    ...(certification ? { certifications: { some: { slug: certification } } } : {}),
    ...(hasVarieties ? { varieties: { some: { status: "PUBLISHED" } } } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const orderBy =
    sort === "newest"
      ? { createdAt: "desc" }
      : sort === "alphabetical"
        ? { name: "asc" }
        : { updatedAt: "desc" };

  const [suppliers, countries, certifications, totalCount] = await Promise.all([
    prisma.supplierCompany.findMany({
      where: whereClause,
      orderBy,
      include: { varieties: { where: { status: "PUBLISHED" } }, certifications: true },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE
    }),
    prisma.supplierCompany.findMany({
      where: { approved: true },
      distinct: ["country"],
      select: { country: true }
    }),
    prisma.certification.findMany({ orderBy: { name: "asc" } }),
    prisma.supplierCompany.count({ where: whereClause })
  ]);

  return (
    <div className="space-y-8">
      <section className="card space-y-3">
        <h1 className="text-3xl font-semibold">Supplier directory</h1>
        <p className="text-sm text-slate-600">
          Search approved seed suppliers and filter by crop focus, certifications, or country.
        </p>
      </section>

      <section className="card space-y-4">
        <form className="grid gap-4 md:grid-cols-3" method="get">
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            name="q"
            placeholder="Search suppliers..."
            defaultValue={query}
          />
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" name="country" defaultValue={country ?? ""}>
            <option value="">All countries</option>
            {countries.map((item) => (
              <option key={item.country} value={item.country}>
                {item.country}
              </option>
            ))}
          </select>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            name="crop"
            placeholder="Crop focus (e.g., tomato)"
            defaultValue={crop}
          />
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" name="certification" defaultValue={certification ?? ""}>
            <option value="">All certifications</option>
            {certifications.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" name="sort" defaultValue={sort}>
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input type="checkbox" name="featured" value="true" defaultChecked={featured} />
              Featured only
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input type="checkbox" name="hasVarieties" value="true" defaultChecked={hasVarieties} />
              Has varieties
            </label>
          </div>
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white" type="submit">
            Apply filters
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.length === 0 ? (
          <p className="text-sm text-slate-500">No suppliers found. Try adjusting your filters.</p>
        ) : (
          suppliers.map((supplier) => (
            <Link key={supplier.id} href={`/suppliers/${supplier.slug}`} className="card space-y-2 transition hover:border-emerald-200">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{supplier.country}</span>
                {supplier.featured && (
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                    Featured
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold">{supplier.name}</h2>
              <p className="text-sm text-slate-600">{supplier.description ?? "Supplier description coming soon."}</p>
              <p className="text-xs text-slate-500">
                Crop focus: {supplier.cropsFocus.slice(0, 3).join(", ") || "General"}
              </p>
              <p className="text-xs text-emerald-700">{supplier.varieties.length} varieties listed</p>
            </Link>
          ))
        )}
      </section>
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
              href={`/suppliers?${new URLSearchParams({ ...Object.fromEntries(paginationParams), page: String(page - 1) }).toString()}`}
            >
              Previous
            </Link>
          )}
          {page * PAGE_SIZE < totalCount && (
            <Link
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
              href={`/suppliers?${new URLSearchParams({ ...Object.fromEntries(paginationParams), page: String(page + 1) }).toString()}`}
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
