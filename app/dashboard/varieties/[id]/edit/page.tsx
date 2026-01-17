import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Props = {
  params: { id: string };
};

export default async function EditVarietyPage({ params }: Props) {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Access restricted</h1>
        <p className="text-sm text-slate-600">Please log in to manage your varieties.</p>
      </div>
    );
  }

  const variety = await prisma.variety.findUnique({
    where: { id: params.id },
    include: { supplier: true }
  });

  if (!variety || variety.supplier.ownerId !== user.id) {
    return (
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Variety not found</h1>
        <p className="text-sm text-slate-600">We could not find this variety.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="card space-y-2">
        <h1 className="text-2xl font-semibold">Edit variety</h1>
        <p className="text-sm text-slate-600">Update details and publish changes.</p>
      </section>

      <form className="card space-y-4" method="post" action={`/api/varieties/${variety.id}`}>
        <input type="hidden" name="intent" value="update" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="name">
              Variety name
            </label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="name" name="name" defaultValue={variety.name} required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="crop">
              Crop / species
            </label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="crop" name="crop" defaultValue={variety.crop} required />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="category">
              Category
            </label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="category" name="category" defaultValue={variety.category} required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="type">
              Type
            </label>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="type" name="type" defaultValue={variety.type}>
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
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="growingCycle" name="growingCycle" defaultValue={variety.growingCycle ?? ""} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="availability">
              Availability
            </label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="availability" name="availability" defaultValue={variety.availability ?? ""} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="traits">
            Traits / tags (comma separated)
          </label>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="traits" name="traits" defaultValue={variety.traits.join(", ")} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="markets">
            Target markets (comma separated)
          </label>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="markets" name="markets" defaultValue={variety.markets.join(", ")} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="minOrderNote">
            Minimum order note
          </label>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="minOrderNote" name="minOrderNote" defaultValue={variety.minOrderNote ?? ""} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="imageUrls">
            Image URLs (comma separated)
          </label>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="imageUrls" name="imageUrls" defaultValue={variety.imageUrls.join(", ")} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="description">
            Description
          </label>
          <textarea className="h-32 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="description" name="description" defaultValue={variety.description ?? ""} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500" htmlFor="status">
              Status
            </label>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" id="status" name="status" defaultValue={variety.status}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>
        <button className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white" type="submit">
          Save changes
        </button>
      </form>
    </div>
  );
}
