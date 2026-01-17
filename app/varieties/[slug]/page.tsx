import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = {
  params: { slug: string };
};

export default async function VarietyDetailPage({ params }: Props) {
  const variety = await prisma.variety.findUnique({
    where: { slug: params.slug },
    include: { supplier: true }
  });

  if (!variety || variety.status !== "PUBLISHED" || !variety.supplier.approved) {
    notFound();
  }

  await prisma.variety.update({
    where: { id: variety.id },
    data: { varietyViews: { increment: 1 } }
  });

  return (
    <div className="space-y-8">
      <section className="card space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{variety.crop}</p>
        <h1 className="text-3xl font-semibold">{variety.name}</h1>
        <p className="text-sm text-slate-600">{variety.description ?? "Details coming soon."}</p>
        <div className="grid gap-4 text-sm text-slate-600 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Type</p>
            <p>{variety.type === "HYBRID" ? "F1 Hybrid" : "Open-pollinated"}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Growing cycle</p>
            <p>{variety.growingCycle ?? "Not specified"}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Availability</p>
            <p>{variety.availability ?? "Seasonal"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Traits</p>
            <p>{variety.traits.join(", ") || "Not specified"}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Markets</p>
            <p>{variety.markets.join(", ") || "Global"}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Minimum order</p>
            <p>{variety.minOrderNote ?? "Contact supplier"}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Supplier</h2>
          <Link className="text-lg font-semibold text-emerald-700" href={`/suppliers/${variety.supplier.slug}`}>
            {variety.supplier.name}
          </Link>
          <p className="text-sm text-slate-600">{variety.supplier.country}</p>
          <p className="text-sm text-slate-600">{variety.supplier.description ?? "Supplier description coming soon."}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            {variety.supplier.cropsFocus.map((crop) => (
              <span key={crop} className="rounded-full border border-slate-200 px-3 py-1">
                {crop}
              </span>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Send an inquiry</h2>
          <p className="text-sm text-slate-600">Ask about pricing, availability, or trial samples.</p>
          <form className="space-y-3" method="post" action="/api/inquiries">
            <input type="hidden" name="supplierId" value={variety.supplierId} />
            <input type="hidden" name="varietyId" value={variety.id} />
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500" htmlFor="name">
                Name
              </label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500" htmlFor="email">
                Email
              </label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500" htmlFor="company">
                Company (optional)
              </label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="company" name="company" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500" htmlFor="country">
                Country
              </label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="country" name="country" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500" htmlFor="message">
                Message
              </label>
              <textarea className="h-28 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="message" name="message" required />
            </div>
            <div className="hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" />
            </div>
            <p className="text-xs text-slate-500">
              CAPTCHA placeholder: integrate reCAPTCHA or hCaptcha for production.
            </p>
            <button className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white" type="submit">
              Send inquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
