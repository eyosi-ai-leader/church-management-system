
"use client";

import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import ChatSuggestions from "./ChatSuggestions";
import { sendChurchAIMessage } from "@/lib/churchAI";



export default function ChurchAIPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(text) {
    const question = text.trim();

    if (!question || loading) return;

    const nextMessages = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const result = await sendChurchAIMessage(nextMessages);

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: result.reply || result.message ||
            "The AI did not return a response.",
        },
      ]);
    } catch (err) {
      setError(err.message || "Unable to contact Church AI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Bot size={25} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Church AI</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ask questions about church information, ministries, and membership.
          </p>
        </div>
      </header>

      <section className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <Sparkles size={18} className="text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Church Intelligence Assistant
            </p>
            <p className="text-xs text-slate-500">
              Ask a question in your own words
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-2xl space-y-5 py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Bot size={28} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  How can I help your church?
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Explore membership statistics, ministry trends, and practical
                  recommendations.
                </p>
              </div>
              <ChatSuggestions
                onSelect={sendMessage}
                disabled={loading}
              />
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[80%] ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}

          {loading && (
            <p className="text-sm text-slate-500">
              Church AI is preparing an answer...
            </p>
          )}

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        <form
          className="border-t border-slate-100 p-3 sm:p-4"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
        >
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask about ministries, members, or church trends..."
              rows={2}
              disabled={loading}
              className="min-h-12 flex-1 resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </section>
    </main>
  );
}
