import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function NewVarietyPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Access restricted</h1>
        <p className="text-sm text-slate-600">Please log in to add varieties.</p>
      </div>
    );
  }

  const supplier = await prisma.supplierCompany.findUnique({ where: { ownerId: user.id } });
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
        <h1 className="text-2xl font-semibold">Add a new variety</h1>
        <p className="text-sm text-slate-600">Complete the details below to publish a new listing.</p>
      </section>

      <form className="card space-y-4" method="post" action="/api/varieties">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="name">
              Variety name
            </label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="crop">
              Crop / species
            </label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="crop" name="crop" required />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="category">
              Category
            </label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="category" name="category" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="type">
              Type
            </label>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="type" name="type">
              <option value="HYBRID">F1 Hybrid</option>
              <option value="OPEN_POLLINATED">Open-pollinated</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="growingCycle">
              Growing cycle
            </label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="growingCycle" name="growingCycle" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="availability">
              Availability
            </label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="availability" name="availability" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="traits">
            Traits / tags (comma separated)
          </label>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="traits" name="traits" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="markets">
            Target markets (comma separated)
          </label>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="markets" name="markets" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="minOrderNote">
            Minimum order note
          </label>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="minOrderNote" name="minOrderNote" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="imageUrls">
            Image URLs (comma separated)
          </label>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="imageUrls" name="imageUrls" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="description">
            Description
          </label>
          <textarea className="h-32 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="description" name="description" />
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white" type="submit">
            Save variety
          </button>
          <button
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
            type="submit"
            name="status"
            value="DRAFT"
          >
            Save as draft
          </button>
        </div>
      </form>
    </div>
  );
}
