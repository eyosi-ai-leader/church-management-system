import { NextResponse } from "next/server";

const API_URL =
  process.env.OPENROUTER_API_URL ||
  "https://openrouter.ai/api/v1/chat/completions";

// "openrouter/free" automatically picks an available free model
const MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

export async function POST(request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is missing. Check .env.local and restart the server.");
      return NextResponse.json(
        { message: "Server is missing the API key." },
        { status: 500 }
      );
    }

    const { messages } = await request.json();

    const upstream = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "CHMS Assistant",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
      }),
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      // This prints the REAL reason in your terminal
      console.error("OpenRouter error:", upstream.status, JSON.stringify(data));
      return NextResponse.json(
        { message: data?.error?.message || "OpenRouter request failed." },
        { status: upstream.status }
      );
    }

    if (!data?.choices?.[0]?.message?.content) {
      console.error("OpenRouter returned no content:", JSON.stringify(data));
      return NextResponse.json(
        { message: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat route crashed:", error);
    return NextResponse.json(
      { message: "Server error in chat route." },
      { status: 500 }
    );
  }
}