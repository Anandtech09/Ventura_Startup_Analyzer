import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto py-16 space-y-8">
      <header className="space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
          Legal · Privacy
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Privacy policy
        </h1>
        <p className="text-xs text-zinc-500">
          Last updated: <span className="font-mono">March 13, 2026</span>
        </p>
      </header>

      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/70 backdrop-blur-2xl p-8 md:p-10">
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="space-y-6 text-sm text-zinc-300 relative z-10">
          <p className="text-zinc-400">
            This Privacy Policy describes how Ventura collects, uses, and protects
            information when you use the platform. We design Ventura as a
            data‑driven strategy surface, not as a data broker.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
                What we collect
              </h2>
              <ul className="space-y-1 text-xs text-zinc-400">
                <li>• Basic account and workspace details you provide.</li>
                <li>• Usage and telemetry needed to keep Ventura reliable.</li>
                <li>• Startup ideas you choose to analyze, stored securely.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
                How we use it
              </h2>
              <ul className="space-y-1 text-xs text-zinc-400">
                <li>• To generate and refine strategic analyses you request.</li>
                <li>• To improve product reliability and signal quality.</li>
                <li>• Never to sell your data to third parties.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
              Your controls
            </h2>
            <p className="text-xs text-zinc-400">
              You can request export or deletion of your Ventura workspace data at
              any time by contacting{" "}
              <span className="font-mono text-zinc-200">
                privacy@ventura.studio
              </span>
              . We respond to reasonable requests within 30 days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;

