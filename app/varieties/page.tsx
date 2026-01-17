import Link from "next/link";
import { prisma } from "@/lib/db";

type SearchParams = {
  q?: string;
  crop?: string;
  traits?: string;
  type?: string;
  market?: string;
  supplier?: string;
  sort?: string;
  page?: string;
  category?: string;
};

const PAGE_SIZE = 12;

export default async function VarietiesPage({ searchParams }: { searchParams: SearchParams }) {
  const pageValue = Number(searchParams.page ?? "1");
  const page = Number.isNaN(pageValue) || pageValue < 1 ? 1 : pageValue;
  const query = searchParams.q?.trim();
  const crop = searchParams.crop?.trim();
  const traits = searchParams.traits?.trim();
  const type = searchParams.type?.trim();
  const market = searchParams.market?.trim();
  const supplierSlug = searchParams.supplier?.trim();
  const category = searchParams.category?.trim();
  const sort = searchParams.sort ?? "relevance";
  const paginationParams = new URLSearchParams();
  if (query) paginationParams.set("q", query);
  if (crop) paginationParams.set("crop", crop);
  if (traits) paginationParams.set("traits", traits);
  if (type) paginationParams.set("type", type);
  if (market) paginationParams.set("market", market);
  if (supplierSlug) paginationParams.set("supplier", supplierSlug);
  if (category) paginationParams.set("category", category);
  if (sort) paginationParams.set("sort", sort);

  const whereClause = {
    status: "PUBLISHED",
    supplier: {
      approved: true,
      ...(supplierSlug ? { slug: supplierSlug } : {})
    },
    ...(crop ? { crop } : {}),
    ...(category ? { category } : {}),
    ...(type ? { type } : {}),
    ...(market ? { markets: { has: market } } : {}),
    ...(traits ? { traits: { has: traits } } : {}),
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

  const [varieties, crops, tags, suppliers, totalCount] = await Promise.all([
    prisma.variety.findMany({
      where: whereClause,
      orderBy,
      include: { supplier: true },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE
    }),
    prisma.variety.findMany({
      where: { status: "PUBLISHED" },
      distinct: ["crop"],
      select: { crop: true }
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" }, take: 12 }),
    prisma.supplierCompany.findMany({ where: { approved: true }, orderBy: { name: "asc" } }),
    prisma.variety.count({ where: whereClause })
  ]);

  return (
    <div className="space-y-8">
      <section className="card space-y-3">
        <h1 className="text-3xl font-semibold">Variety directory</h1>
        <p className="text-sm text-slate-600">
          Explore seed varieties across crops, traits, and market regions.
        </p>
      </section>

      <section className="card space-y-4">
        <form className="grid gap-4 md:grid-cols-3" method="get">
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            name="q"
            placeholder="Search varieties..."
            defaultValue={query}
          />
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" name="crop" defaultValue={crop ?? ""}>
            <option value="">All crops</option>
            {crops.map((item) => (
              <option key={item.crop} value={item.crop}>
                {item.crop}
              </option>
            ))}
          </select>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            name="category"
            placeholder="Category (e.g., Roma)"
            defaultValue={category}
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            name="traits"
            placeholder="Trait/tag (e.g., Disease Resistant)"
            defaultValue={traits}
          />
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" name="type" defaultValue={type ?? ""}>
            <option value="">All types</option>
            <option value="HYBRID">F1 Hybrid</option>
            <option value="OPEN_POLLINATED">Open-pollinated</option>
          </select>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            name="market"
            placeholder="Market / region"
            defaultValue={market}
          />
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" name="supplier" defaultValue={supplierSlug ?? ""}>
            <option value="">All suppliers</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.slug}>
                {supplier.name}
              </option>
            ))}
          </select>
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" name="sort" defaultValue={sort}>
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white" type="submit">
            Apply filters
          </button>
        </form>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-400">Popular traits:</span>
          {tags.map((tag) => (
            <Link key={tag.id} href={`/varieties?traits=${encodeURIComponent(tag.name)}`} className="rounded-full border border-slate-200 px-3 py-1">
              {tag.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {varieties.length === 0 ? (
          <p className="text-sm text-slate-500">No varieties found. Try adjusting your filters.</p>
        ) : (
          varieties.map((variety) => (
            <Link key={variety.id} href={`/varieties/${variety.slug}`} className="card space-y-2 transition hover:border-emerald-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{variety.crop}</p>
              <h2 className="text-lg font-semibold">{variety.name}</h2>
              <p className="text-sm text-slate-600">{variety.description ?? "Details coming soon."}</p>
              <p className="text-xs text-slate-500">Supplier: {variety.supplier.name}</p>
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
              href={`/varieties?${new URLSearchParams({ ...Object.fromEntries(paginationParams), page: String(page - 1) }).toString()}`}
            >
              Previous
            </Link>
          )}
          {page * PAGE_SIZE < totalCount && (
            <Link
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
              href={`/varieties?${new URLSearchParams({ ...Object.fromEntries(paginationParams), page: String(page + 1) }).toString()}`}
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
