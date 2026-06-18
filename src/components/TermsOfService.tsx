import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto py-16 space-y-8">
      <header className="space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
          Legal · Terms
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Terms of service
        </h1>
        <p className="text-xs text-zinc-500">
          Last updated: <span className="font-mono">March 13, 2026</span>
        </p>
      </header>

      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/70 backdrop-blur-2xl p-8 md:p-10">
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="space-y-6 text-sm text-zinc-300 relative z-10">
          <p className="text-zinc-400">
            These terms govern your use of Ventura. By accessing the product you
            agree to them. We built this tool for founders and operators — please
            use it responsibly.
          </p>

          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
              Use of Ventura
            </h2>
            <ul className="space-y-1 text-xs text-zinc-400">
              <li>• You remain responsible for decisions based on Ventura output.</li>
              <li>• Do not upload data you are not allowed to share.</li>
              <li>• Do not use Ventura for harmful, abusive, or illegal activity.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
              Intellectual property
            </h2>
            <p className="text-xs text-zinc-400">
              The Ventura product experience, UI, and underlying models are owned
              by the Ventura team and its licensors. You own the ideas you bring to
              the platform and non‑generated content you provide.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
              Changes
            </h2>
            <p className="text-xs text-zinc-400">
              We may update these terms as the product evolves. When we make
              material changes we will update the effective date and, where
              reasonable, notify active users in‑product.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;

