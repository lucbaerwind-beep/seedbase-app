import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Access restricted</h1>
        <p className="text-sm text-slate-600">
          Please <Link className="font-semibold text-emerald-700" href="/login">log in</Link> to manage your listings.
        </p>
      </div>
    );
  }

  const supplier = await prisma.supplierCompany.findUnique({
    where: { ownerId: user.id },
    include: { varieties: true, inquiries: { orderBy: { createdAt: "desc" }, take: 3 } }
  });

  if (!supplier) {
    return (
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Supplier profile missing</h1>
        <p className="text-sm text-slate-600">Contact support to restore your supplier profile.</p>
      </div>
    );
  }

  const publishedCount = supplier.varieties.filter((variety) => variety.status === "PUBLISHED").length;
  const totalViews = supplier.varieties.reduce((sum, variety) => sum + variety.varietyViews, 0);

  return (
    <div className="space-y-6">
      <section className="card space-y-2">
        <h1 className="text-2xl font-semibold">Welcome, {supplier.name}</h1>
        <p className="text-sm text-slate-600">
          Manage your company profile, seed varieties, and incoming inquiries in one place.
        </p>
        {!supplier.approved && (
          <p className="rounded-xl bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
            Your profile is pending approval. Listings will appear publicly after admin review.
          </p>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Profile views</p>
          <p className="text-3xl font-semibold">{supplier.profileViews}</p>
        </div>
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Varieties published</p>
          <p className="text-3xl font-semibold">{publishedCount}</p>
        </div>
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Variety views</p>
          <p className="text-3xl font-semibold">{totalViews}</p>
        </div>
      </section>

      <section className="card space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold">Quick actions</h2>
          <span className="text-xs text-slate-500">Listing limit: 5 varieties</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white" href="/dashboard/varieties">
            Manage varieties
          </Link>
          <Link className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700" href="/dashboard/company">
            Edit company profile
          </Link>
          <Link className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600" href="/dashboard/inquiries">
            View inquiry inbox
          </Link>
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="text-xl font-semibold">Latest inquiries</h2>
        {supplier.inquiries.length === 0 ? (
          <p className="text-sm text-slate-600">No inquiries yet. Share your profile to attract buyers.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {supplier.inquiries.map((inquiry) => (
              <div key={inquiry.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold">{inquiry.senderName}</p>
                <p className="text-xs text-slate-500">{inquiry.senderEmail}</p>
                <p className="mt-3 text-sm text-slate-600">{inquiry.message}</p>
                <p className="mt-3 text-xs text-slate-500">
                  Received {inquiry.createdAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
