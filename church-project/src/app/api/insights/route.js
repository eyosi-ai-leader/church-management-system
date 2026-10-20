
import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Please sign in to generate insights." },
        { status: 401 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_API_URL) {
      return NextResponse.json(
        { message: "AI service configuration is missing." },
        { status: 503 }
      );
    }

    // Retrieve facts from the authenticated backend.
    const dashboardResponse = await fetch(
      `${API_URL}/dashboard/overview`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const dashboardResult = await dashboardResponse.json();

    if (!dashboardResponse.ok) {
      return NextResponse.json(
        { message: dashboardResult?.message || "Unable to load church data." },
        { status: dashboardResponse.status }
      );
    }

    const data = dashboardResult?.data;

    // Only church leadership roles can generate organization-wide insights.
    if (!["Admin", "Pastor", "Church Elder"].includes(data?.role)) {
      return NextResponse.json(
        { message: "You do not have permission to view church-wide insights." },
        { status: 403 }
      );
    }

    if (!data?.members || !Array.isArray(data?.memberGrowth)) {
      return NextResponse.json(
        { message: "Required membership statistics are unavailable." },
        { status: 422 }
      );
    }

    // Send aggregate statistics only. Never send names, emails, or profiles.
    const facts = {
      reportDate: new Date().toISOString().slice(0, 10),
      members: {
        total: Number(data.members.total || 0),
        active: Number(data.members.active || 0),
        inactive: Number(data.members.inactive || 0),
        newToday: Number(data.members.newToday || 0),
      },
      membershipGrowth: data.memberGrowth.map((item) => ({
        month: String(item.month),
        cumulativeMembers: Number(item.value || 0),
      })),
    };

    const aiResponse = await fetch(process.env.OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are the CHMS Church Intelligence Assistant. " +
              "Analyze only the supplied, verified aggregate statistics. " +
              "Write a concise, professional church leadership report with " +
              "a short overview, notable observations, and practical next steps. " +
              "Never invent facts, attendance, participation, causes, or ministry data. " +
              "The monthly values are cumulative membership totals, not monthly registrations. " +
              "If the data does not establish a trend, say so. " +
              "Clearly distinguish observations from recommendations. " +
              "Do not identify individual members.",
          },
          {
            role: "user",
            content: `Generate a church membership insight from these database statistics:\n${JSON.stringify(facts)}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 450,
      }),
    });

    const aiResult = await aiResponse.json();

    if (!aiResponse.ok) {
      console.error("OpenRouter insight error:", aiResult);

      return NextResponse.json(
        { message: "The AI service could not generate an insight." },
        { status: 502 }
      );
    }

    const insight = aiResult?.choices?.[0]?.message?.content?.trim();

    if (!insight) {
      return NextResponse.json(
        { message: "The AI returned an empty insight. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      insight,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Dashboard insights error:", error);

    return NextResponse.json(
      { message: "Unable to generate insights right now." },
      { status: 500 }
    );
  }
}
