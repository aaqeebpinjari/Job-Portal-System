export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-5xl font-extrabold text-slate-900">
          Welcome to <span className="text-blue-600">Job Import Admin</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Automate your job feed imports, manage queue processing, and track
          database updates — all from this modern admin dashboard.
        </p>
      </div>

      <div className="flex flex-wrap gap-5 pt-6 justify-center">
        <a
          href="/import-history"
          className="rounded-lg bg-blue-600 text-white px-8 py-3 font-semibold text-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition"
        >
          View Import History
        </a>
        <a
          href="https://jobicy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-300 px-8 py-3 font-semibold text-lg text-slate-700 hover:bg-slate-100 transition"
        >
          Explore Feeds
        </a>
      </div>

      <div className="mt-12 max-w-4xl bg-white shadow-lg rounded-xl p-6 border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          System Overview
        </h3>
        <p className="text-slate-600 leading-relaxed">
          The system automatically fetches XML job feeds from multiple sources every hour,
          converts them to JSON, queues them using Redis (BullMQ), and stores the final
          data in MongoDB. Admins can review logs and track the import health in real time.
        </p>
      </div>
    </section>
  );
}

