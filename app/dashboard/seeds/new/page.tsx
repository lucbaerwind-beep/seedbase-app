import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export default async function NewSeedPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card">
        <h1>Access restricted</h1>
        <p style={{ color: "var(--muted)" }}>
          Please <Link href="/login">log in</Link> to add listings.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>Add a seed listing</h1>
      <form className="stack" style={{ marginTop: 16 }} method="post" action="/api/seeds">
        <div>
          <label className="label" htmlFor="name">
            Variety name
          </label>
          <input className="input" id="name" name="name" required />
        </div>
        <div>
          <label className="label" htmlFor="crop">
            Crop
          </label>
          <input className="input" id="crop" name="crop" required />
        </div>
        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea className="input" id="description" name="description" rows={4} required />
        </div>
        <div>
          <label className="label" htmlFor="imageUrl">
            Image URL (optional)
          </label>
          <input className="input" id="imageUrl" name="imageUrl" type="url" />
        </div>
        <div>
          <label className="label" htmlFor="contactInfo">
            Contact info to share with buyers
          </label>
          <input className="input" id="contactInfo" name="contactInfo" required />
        </div>
        <button className="button" type="submit">
          Save listing
        </button>
      </form>
    </div>
  );
}
