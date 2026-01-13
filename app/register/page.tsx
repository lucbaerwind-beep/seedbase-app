export default function RegisterPage() {
  return (
    <div className="grid" style={{ gap: 24 }}>
      <section className="card">
        <h1>Create your seed company account</h1>
        <p style={{ color: "var(--muted)" }}>
          Register to list up to five seed varieties and receive direct inquiries from buyers.
        </p>
      </section>
      <form className="card" method="post" action="/api/auth/register">
        <div className="stack">
          <div>
            <label className="label" htmlFor="companyName">
              Company name
            </label>
            <input className="input" id="companyName" name="companyName" required />
          </div>
          <div>
            <label className="label" htmlFor="contactName">
              Contact name
            </label>
            <input className="input" id="contactName" name="contactName" required />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input className="input" id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input className="input" id="password" name="password" type="password" required minLength={8} />
          </div>
          <button className="button" type="submit">
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
