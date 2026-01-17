export default function ImprintPage() {
  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h1 className="text-3xl font-semibold">Imprint</h1>
        <p className="text-sm text-slate-600">
          This is a placeholder imprint for Germany-compliant disclosure. Replace with legal information before
          production launch.
        </p>
      </section>
      <section className="card space-y-2 text-sm text-slate-600">
        <p>SEEDBASE GmbH</p>
        <p>Example Street 12</p>
        <p>10115 Berlin</p>
        <p>Germany</p>
        <p>Managing Director: Example Name</p>
        <p>Contact: support@seedbase.example.com</p>
        <p>Commercial Register: HRB 000000 B</p>
        <p>VAT ID: DE000000000</p>
      </section>
    </div>
  );
}
