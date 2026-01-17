import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function CompanyProfilePage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Access restricted</h1>
        <p className="text-sm text-slate-600">Please log in to edit your company profile.</p>
      </div>
    );
  }

  const supplier = await prisma.supplierCompany.findUnique({
    where: { ownerId: user.id },
    include: { certifications: true }
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
      <section className="card space-y-2">
        <h1 className="text-2xl font-semibold">Company profile</h1>
        <p className="text-sm text-slate-600">Keep your profile accurate so buyers can reach you quickly.</p>
      </section>

      <form className="card space-y-4" method="post" action="/api/company">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="name">
              Company name
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              id="name"
              name="name"
              defaultValue={supplier.name}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="country">
              Country
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              id="country"
              name="country"
              defaultValue={supplier.country}
              required
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="website">
              Website
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              id="website"
              name="website"
              defaultValue={supplier.website ?? ""}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="email">
              Contact email
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              id="email"
              name="email"
              defaultValue={supplier.email ?? ""}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="phone">
              Phone
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              id="phone"
              name="phone"
              defaultValue={supplier.phone ?? ""}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="logoUrl">
              Logo URL
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              id="logoUrl"
              name="logoUrl"
              defaultValue={supplier.logoUrl ?? ""}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="address">
            Address
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            id="address"
            name="address"
            defaultValue={supplier.address ?? ""}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="description">
            Company description
          </label>
          <textarea
            className="h-32 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            id="description"
            name="description"
            defaultValue={supplier.description ?? ""}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="cropsFocus">
            Crops focus (comma separated)
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            id="cropsFocus"
            name="cropsFocus"
            defaultValue={supplier.cropsFocus.join(", ")}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="certifications">
            Certifications (comma separated)
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            id="certifications"
            name="certifications"
            defaultValue={supplier.certifications.map((cert) => cert.name).join(", ")}
          />
        </div>
        <button className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white" type="submit">
          Save profile
        </button>
      </form>
    </div>
  );
}
