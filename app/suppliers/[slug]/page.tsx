import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = {
  params: { slug: string };
};

export default async function SupplierProfilePage({ params }: Props) {
  const supplier = await prisma.supplierCompany.findUnique({
    where: { slug: params.slug },
    include: {
      varieties: { where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } },
      certifications: true
    }
  });

  if (!supplier || !supplier.approved) {
    notFound();
  }

  await prisma.supplierCompany.update({
    where: { id: supplier.id },
    data: { profileViews: { increment: 1 } }
  });

  return (
    <div className="space-y-8">
      <section className="card space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Supplier profile
            </p>
            <h1 className="text-3xl font-semibold">{supplier.name}</h1>
            <p className="text-sm text-slate-600">{supplier.country}</p>
          </div>
          {supplier.featured && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Featured supplier
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600">{supplier.description ?? "Supplier description coming soon."}</p>
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Contact</p>
            <p>{supplier.email ?? "Email not listed"}</p>
            <p>{supplier.phone ?? "Phone not listed"}</p>
            <p>{supplier.website ?? "Website not listed"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Crops focus</p>
            <p>{supplier.cropsFocus.join(", ") || "General vegetables"}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Certifications</p>
            <p>{supplier.certifications.map((cert) => cert.name).join(", ") || "Not listed"}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Varieties</h2>
            <Link className="text-sm font-semibold text-emerald-700" href={`/varieties?supplier=${supplier.slug}`}>
              View all varieties →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {supplier.varieties.length === 0 ? (
              <p className="text-sm text-slate-600">No published varieties yet.</p>
            ) : (
              supplier.varieties.map((variety) => (
                <Link
                  key={variety.id}
                  href={`/varieties/${variety.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{variety.crop}</p>
                  <h3 className="mt-2 text-lg font-semibold">{variety.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{variety.description ?? "Details coming soon."}</p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Send an inquiry</h2>
          <p className="text-sm text-slate-600">
            Contact the supplier directly. Responses are handled by the company.
          </p>
          <form className="space-y-3" method="post" action="/api/inquiries">
            <input type="hidden" name="supplierId" value={supplier.id} />
            <input type="hidden" name="varietyId" value="" />
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
