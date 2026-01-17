export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h1 className="text-3xl font-semibold">About SEEDBASE</h1>
        <p className="text-sm text-slate-600">
          SEEDBASE is a discovery platform for vegetable seed suppliers and buyers. We help seed companies showcase
          their genetics while making it easy for professional buyers to connect directly.
        </p>
      </section>
      <section className="card space-y-3">
        <h2 className="text-xl font-semibold">Our mission</h2>
        <p className="text-sm text-slate-600">
          Strengthen the global vegetable seed supply chain by providing a trusted, searchable directory with
          transparency on varieties, traits, and supplier expertise.
        </p>
      </section>
    </div>
  );
}
