
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 4000;

export async function POST(request) {
  try {
    const apiUrl = process.env.OPENROUTER_API_URL;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiUrl || !apiKey) {
      console.error("Church AI: OpenRouter environment variables are missing.");

      return NextResponse.json(
        { success: false, message: "Church AI is not configured yet." },
        { status: 503 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request." },
        { status: 400 }
      );
    }

    const { messages } = body;

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > MAX_MESSAGES
    ) {
      return NextResponse.json(
        { success: false, message: "Please send a valid chat conversation." },
        { status: 400 }
      );
    }

    const validMessages = messages.every(
      (message) =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string" &&
        message.content.trim().length > 0 &&
        message.content.length <= MAX_MESSAGE_LENGTH
    );

    if (!validMessages || messages[messages.length - 1].role !== "user") {
      return NextResponse.json(
        { success: false, message: "The chat messages are invalid." },
        { status: 400 }
      );
    }

    const conversation = messages.map(({ role, content }) => ({
      role,
      content: content.trim(),
    }));

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: [
              "You are Church AI, a helpful assistant for a church management system.",
              "Answer questions clearly and respectfully.",
              "You may explain church management concepts and offer practical recommendations.",
              "Do not invent church statistics, member names, ministry records, or other private data.",
              "No church database information has been supplied to you in this request.",
              "If asked for actual church records, explain that the required data connection is not available yet.",
              "Never claim to have changed records, sent messages, or performed actions.",
              "Do not request passwords, authentication tokens, or other secrets.",
            ].join(" "),
          },
          ...conversation,
        ],
        temperature: 0.4,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });

    let data;

    try {
      data = await response.json();
    } catch {
      console.error("Church AI: OpenRouter returned a non-JSON response.");

      return NextResponse.json(
        { success: false, message: "The AI service returned an invalid response." },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error("Church AI provider error:", response.status, data);

      return NextResponse.json(
        {
          success: false,
          message: "The AI service could not answer. Please try again.",
        },
        { status: 502 }
      );
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      return NextResponse.json(
        { success: false, message: "The AI service returned an empty answer." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      reply: reply.trim(),
    });
  } catch (error) {
    console.error("Church AI route error:", error);

    const isTimeout = error?.name === "TimeoutError";

    return NextResponse.json(
      {
        success: false,
        message: isTimeout
          ? "Church AI took too long to respond. Please try again."
          : "Unable to contact Church AI. Please try again.",
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
