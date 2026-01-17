export default function ContactPage() {
  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="text-sm text-slate-600">
          Need help with your SEEDBASE listing or have partnership inquiries? Reach out to our team.
        </p>
      </section>
      <section className="card space-y-2">
        <p className="text-sm text-slate-600">Email: support@seedbase.example.com</p>
        <p className="text-sm text-slate-600">Phone: +49 30 0000 0000</p>
        <p className="text-sm text-slate-600">Address: Example Street 12, 10115 Berlin, Germany</p>
      </section>
    </div>
  );
}
