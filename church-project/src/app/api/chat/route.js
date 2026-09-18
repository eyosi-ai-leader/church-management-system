import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          message: "Invalid chat messages.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(process.env.OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);

      return NextResponse.json(
        {
          message: "AI service request failed.",
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while contacting the AI service.",
      },
      {
        status: 500,
      }
    );
  }
}