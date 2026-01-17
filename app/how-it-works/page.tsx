export default function HowItWorksPage() {
  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h1 className="text-3xl font-semibold">How SEEDBASE works</h1>
        <p className="text-sm text-slate-600">
          SEEDBASE connects seed suppliers with buyers through verified profiles, searchable variety listings, and
          direct inquiries.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">1. Discover</p>
          <p className="text-sm text-slate-600">Browse suppliers, filter varieties, and identify partners quickly.</p>
        </div>
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">2. Compare</p>
          <p className="text-sm text-slate-600">Review variety traits, certifications, and market focus.</p>
        </div>
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">3. Inquire</p>
          <p className="text-sm text-slate-600">Send direct inquiries with no platform fees or commissions.</p>
        </div>
      </section>
    </div>
  );
}
