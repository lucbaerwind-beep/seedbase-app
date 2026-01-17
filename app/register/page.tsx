export default function RegisterPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <section className="card space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Supplier onboarding</p>
        <h1 className="text-3xl font-semibold">Create your supplier account</h1>
        <p className="text-sm text-slate-600">
          List up to five varieties free and showcase your breeding programs to global buyers.
        </p>
      </section>
      <form className="card space-y-4" method="post" action="/api/auth/register">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="companyName">
            Company name
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            id="companyName"
            name="companyName"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="country">
            Country
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            id="country"
            name="country"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500" htmlFor="email">
            Work email
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
            minLength={8}
          />
        </div>
        <button className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white" type="submit">
          Create account
        </button>
        <p className="text-xs text-slate-500">
          Need help? Email <span className="font-semibold text-emerald-700">support@seedbase.example.com</span>.
        </p>
      </form>
    </div>
  );
}
