
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function AIInsight() {
  const [insight, setInsight] = useState("");
  const [generatedAt, setGeneratedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInsight = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to generate church insights."
        );
      }

      setInsight(result.insight || "");
      setGeneratedAt(result.generatedAt || "");
    } catch (err) {
      setError(err.message || "Unable to load insights.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInsight();
  }, [loadInsight]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Sparkles size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold">
                  Church AI Insight
                </p>

                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-300">
                  AI-powered
                </span>
              </div>

              <h3 className="mt-2 text-lg font-semibold">
                Membership intelligence
              </h3>

              {loading ? (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                  <RefreshCw size={15} className="animate-spin" />
                  Analyzing the latest church statistics...
                </div>
              ) : error ? (
                <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-300">
                  <AlertCircle size={17} className="mt-1 shrink-0" />
                  <p>{error}</p>
                </div>
              ) : (
                <div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
                  {insight}
                </div>
              )}

              {!loading && !error && generatedAt && (
                <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={14} />
                  Generated from verified CHMS statistics ·{" "}
                  {new Date(generatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={loadInsight}
            disabled={loading}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Analyzing..." : "Refresh insight"}
          </button>
        </div>
      </div>
    </section>
  );
}
