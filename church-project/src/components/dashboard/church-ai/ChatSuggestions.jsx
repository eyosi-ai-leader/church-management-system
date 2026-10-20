
"use client";

const suggestions = [
  {
    title: "Ministry trends",
    prompt: "Show me membership trends for the Outreach Ministry.",
  },
  {
    title: "Recommendations",
    prompt: "Recommend practical ways to improve ministry participation.",
  },
  {
    title: "Member information",
    prompt: "Help me find a church member and view their permitted information.",
  },
  {
    title: "Church overview",
    prompt: "Summarize the latest church membership statistics.",
  },
];

export default function ChatSuggestions({ onSelect, disabled }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {suggestions.map((item) => (
        <button
          key={item.title}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(item.prompt)}
          className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/50 disabled:opacity-50"
        >
          <p className="text-sm font-semibold text-slate-900">
            {item.title}
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {item.prompt}
          </p>
        </button>
      ))}
    </div>
  );
}
