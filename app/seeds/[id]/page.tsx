import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

interface SeedDetailPageProps {
  params: { id: string };
}

export default async function SeedDetailPage({ params }: SeedDetailPageProps) {
  const listing = await prisma.seedListing.findUnique({
    where: { id: params.id },
    include: { owner: true }
  });

  if (!listing) {
    notFound();
  }

  return (
    <div className="grid" style={{ gap: 24 }}>
      <section className="card">
        <Link href="/" style={{ color: "var(--primary)", fontSize: 14 }}>
          ← Back to directory
        </Link>
        <h1 style={{ marginTop: 12 }}>{listing.name}</h1>
        <p className="badge" style={{ marginTop: 8 }}>
          {listing.crop}
        </p>
        <p style={{ marginTop: 16 }}>{listing.description}</p>
        {listing.imageUrl && (
          <p style={{ marginTop: 12 }}>
            Image: <a href={listing.imageUrl}>{listing.imageUrl}</a>
          </p>
        )}
        <p style={{ marginTop: 20, color: "var(--muted)" }}>Offered by {listing.owner.companyName}</p>
      </section>

      <form className="card" method="post" action="/api/inquiries">
        <input type="hidden" name="seedListingId" value={listing.id} />
        <h2>Contact the supplier</h2>
        <div className="stack" style={{ marginTop: 16 }}>
          <div>
            <label className="label" htmlFor="senderName">
              Your name
            </label>
            <input className="input" id="senderName" name="senderName" required />
          </div>
          <div>
            <label className="label" htmlFor="senderEmail">
              Email
            </label>
            <input className="input" id="senderEmail" name="senderEmail" type="email" required />
          </div>
          <div>
            <label className="label" htmlFor="message">
              Message
            </label>
            <textarea className="input" id="message" name="message" rows={4} required />
          </div>
          <button className="button" type="submit">
            Send inquiry
          </button>
        </div>
      </form>
    </div>
  );
}
