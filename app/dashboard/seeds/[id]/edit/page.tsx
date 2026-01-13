import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface EditSeedPageProps {
  params: { id: string };
}

export default async function EditSeedPage({ params }: EditSeedPageProps) {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card">
        <h1>Access restricted</h1>
        <p style={{ color: "var(--muted)" }}>
          Please <Link href="/login">log in</Link> to manage listings.
        </p>
      </div>
    );
  }

  const listing = await prisma.seedListing.findFirst({
    where: { id: params.id, ownerId: user.id }
  });

  if (!listing) {
    notFound();
  }

  return (
    <div className="grid" style={{ gap: 24 }}>
      <form className="card" method="post" action={`/api/seeds/${listing.id}`}>
        <input type="hidden" name="action" value="update" />
        <h1>Edit listing</h1>
        <div className="stack" style={{ marginTop: 16 }}>
          <div>
            <label className="label" htmlFor="name">
              Variety name
            </label>
            <input className="input" id="name" name="name" defaultValue={listing.name} required />
          </div>
          <div>
            <label className="label" htmlFor="crop">
              Crop
            </label>
            <input className="input" id="crop" name="crop" defaultValue={listing.crop} required />
          </div>
          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              className="input"
              id="description"
              name="description"
              rows={4}
              defaultValue={listing.description}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="imageUrl">
              Image URL (optional)
            </label>
            <input className="input" id="imageUrl" name="imageUrl" type="url" defaultValue={listing.imageUrl ?? ""} />
          </div>
          <div>
            <label className="label" htmlFor="contactInfo">
              Contact info
            </label>
            <input className="input" id="contactInfo" name="contactInfo" defaultValue={listing.contactInfo} required />
          </div>
          <button className="button" type="submit">
            Update listing
          </button>
        </div>
      </form>
      <form className="card" method="post" action={`/api/seeds/${listing.id}`}>
        <input type="hidden" name="action" value="delete" />
        <h2>Remove listing</h2>
        <p style={{ color: "var(--muted)" }}>Delete this listing to free up a slot.</p>
        <button className="button secondary" type="submit" style={{ marginTop: 12 }}>
          Delete listing
        </button>
      </form>
    </div>
  );
}
