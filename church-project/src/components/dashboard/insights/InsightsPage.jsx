
"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import AIInsight from "@/components/dashboard/overview/AIInsight";

export default function InsightsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Sparkles size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Church Insights
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              AI-powered analysis of your church membership statistics.
            </p>
          </div>
        </div>
      </header>

      <AIInsight />
    </main>
  );
}
