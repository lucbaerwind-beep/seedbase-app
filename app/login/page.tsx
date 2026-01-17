export default function LoginPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <section className="card space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Supplier access</p>
        <h1 className="text-3xl font-semibold">Welcome back to SEEDBASE</h1>
        <p className="text-sm text-slate-600">
          Log in to update your supplier profile, manage varieties, and reply to buyer inquiries.
        </p>
      </section>
      <form className="card space-y-4" method="post" action="/api/auth/login">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            id="email"
            name="email"
            type="email"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="password">
            Password
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            id="password"
            name="password"
            type="password"
            required
          />
        </div>
        <button className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white" type="submit">
          Log in
        </button>
      </form>
    </div>
  );
}
