import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const listings = await prisma.seedListing.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: true }
  });

  return (
    <div className="stack">
      <section className="card" style={{ marginBottom: 24 }}>
        <h1>Seed varieties from trusted suppliers</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Browse seed varieties and connect directly with seed companies. Create up to five listings to showcase
          your best varieties.
        </p>
      </section>

      <section className="grid grid-3">
        {listings.length === 0 ? (
          <div className="card">
            <p>No seed listings yet. Be the first to add one in your dashboard.</p>
          </div>
        ) : (
          listings.map((listing) => (
            <Link key={listing.id} href={`/seeds/${listing.id}`} className="card">
              <span className="badge">{listing.crop}</span>
              <h3 style={{ margin: "12px 0 6px" }}>{listing.name}</h3>
              <p style={{ color: "var(--muted)", marginBottom: 16 }}>{listing.description}</p>
              <p style={{ fontSize: 13 }}>By {listing.owner.companyName}</p>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
