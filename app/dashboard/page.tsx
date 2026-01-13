import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card">
        <h1>Access restricted</h1>
        <p style={{ color: "var(--muted)" }}>
          Please <Link href="/login">log in</Link> to manage your listings.
        </p>
      </div>
    );
  }

  const listings = await prisma.seedListing.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" }
  });

  const inquiries = await prisma.inquiry.findMany({
    where: { recipientId: user.id },
    orderBy: { createdAt: "desc" },
    include: { seedListing: true }
  });

  return (
    <div className="grid" style={{ gap: 24 }}>
      <section className="card">
        <h1>Welcome, {user.companyName}</h1>
        <p style={{ color: "var(--muted)" }}>Manage your seed listings and review buyer inquiries.</p>
      </section>

      <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Your listings</h2>
          {listings.length < 5 && (
            <Link className="button" href="/dashboard/seeds/new">
              New listing
            </Link>
          )}
        </div>
        {listings.length === 0 ? (
          <p style={{ marginTop: 12 }}>No listings yet. Add your first variety.</p>
        ) : (
          <table className="table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Crop</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td>{listing.name}</td>
                  <td>{listing.crop}</td>
                  <td>{listing.updatedAt.toLocaleDateString()}</td>
                  <td>
                    <Link href={`/dashboard/seeds/${listing.id}/edit`} style={{ color: "var(--primary)" }}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {listings.length >= 5 && (
          <p className="notice" style={{ marginTop: 16 }}>
            You have reached the maximum of five listings. Delete one to add more.
          </p>
        )}
      </section>

      <section className="card">
        <h2>Recent inquiries</h2>
        {inquiries.length === 0 ? (
          <p style={{ marginTop: 12 }}>No inquiries yet.</p>
        ) : (
          <div className="stack" style={{ marginTop: 12 }}>
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="card" style={{ borderStyle: "dashed" }}>
                <p style={{ fontWeight: 600 }}>{inquiry.senderName}</p>
                <p style={{ color: "var(--muted)" }}>{inquiry.senderEmail}</p>
                <p style={{ marginTop: 8 }}>{inquiry.message}</p>
                <p style={{ marginTop: 8, fontSize: 13 }}>
                  Listing: {inquiry.seedListing.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
