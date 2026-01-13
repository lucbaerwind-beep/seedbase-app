export default function LoginPage() {
  return (
    <div className="grid" style={{ gap: 24 }}>
      <section className="card">
        <h1>Welcome back</h1>
        <p style={{ color: "var(--muted)" }}>Log in to manage your seed listings and inquiries.</p>
      </section>
      <form className="card" method="post" action="/api/auth/login">
        <div className="stack">
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
            <input className="input" id="password" name="password" type="password" required />
          </div>
          <button className="button" type="submit">
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}
