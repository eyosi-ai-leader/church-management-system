import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CHURCH_WIDE_ROLES = new Set(["Admin", "Pastor", "Church Elder"]);

function parseJsonSafely(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Calls OpenRouter and retries once if the answer comes back empty
async function generateInsight({ url, key, systemPrompt, userPrompt }) {
  let lastProblem = "Unknown error";

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    let response;

    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key.trim()}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "openrouter/free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          // Reasoning models use many tokens before answering
          max_tokens: 2000,
        }),
        cache: "no-store",
      });
    } catch (error) {
      console.error("OpenRouter connection error:", error?.message);
      return { error: "Unable to connect to the AI provider. Please try again." };
    }

    const result = parseJsonSafely(await response.text());

    if (!result) {
      lastProblem = "The AI provider returned an invalid response.";
      continue;
    }

    if (!response.ok) {
      console.error("OpenRouter insight error:", response.status, JSON.stringify(result));
      lastProblem =
        result.error?.message || "The AI service could not generate an insight.";
      // Rate limits and bad models can differ on the next try
      continue;
    }

    const insight = result?.choices?.[0]?.message?.content?.trim();

    if (insight) {
      return { insight };
    }

    console.error(`Empty insight (attempt ${attempt}):`, {
      model: result?.model,
      finishReason: result?.choices?.[0]?.finish_reason,
    });
    lastProblem = "The AI returned an empty insight. Please try again.";
  }

  return { error: lastProblem };
}

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please sign in to generate insights." },
        { status: 401 }
      );
    }

    const openRouterUrl = process.env.OPENROUTER_API_URL;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterUrl || !openRouterKey) {
      console.error("Insights configuration is incomplete.");
      return NextResponse.json(
        { success: false, message: "AI service configuration is missing." },
        { status: 503 }
      );
    }

    let dashboardResponse;

    try {
      dashboardResponse = await fetch(`${API_URL}/dashboard/overview`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });
    } catch (error) {
      console.error("Insights backend connection error:", error?.message);
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to connect to the dashboard service. Check that the backend is running.",
        },
        { status: 502 }
      );
    }

    const dashboardText = await dashboardResponse.text();
    const dashboardResult = parseJsonSafely(dashboardText);

    if (!dashboardResult) {
      console.error("Dashboard returned invalid JSON:", dashboardText.slice(0, 500));
      return NextResponse.json(
        { success: false, message: "The dashboard service returned an invalid response." },
        { status: 502 }
      );
    }

    if (!dashboardResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            dashboardResult.message || "Unable to load authorized dashboard data.",
        },
        { status: dashboardResponse.status }
      );
    }

    const data = dashboardResult.data;
    const role = data?.role;

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Unable to determine your dashboard role." },
        { status: 403 }
      );
    }

    let facts;
    let instructions;

    if (CHURCH_WIDE_ROLES.has(role)) {
      if (!data.members || !Array.isArray(data.memberGrowth)) {
        return NextResponse.json(
          { success: false, message: "Required church-wide statistics are unavailable." },
          { status: 422 }
        );
      }

      facts = {
        scope: "church-wide",
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

      instructions =
        "Generate a concise church-wide leadership report with an " +
        "overview, notable observations, and practical next steps. " +
        "Monthly values are cumulative membership totals, not monthly " +
        "registrations. Do not invent attendance, causes, participation, " +
        "or missing statistics.";
    } else if (role === "Ministry Leader") {
      if (!Array.isArray(data.ministries)) {
        return NextResponse.json(
          { success: false, message: "Authorized ministry statistics are unavailable." },
          { status: 422 }
        );
      }

      facts = {
        scope: "assigned-ministries-only",
        reportDate: new Date().toISOString().slice(0, 10),
        totalMinistries: data.ministries.length,
        totalActiveRosterAssignments: Number(data.summary?.totalMembers || 0),
        ministries: data.ministries.map((ministry) => {
          const members = Array.isArray(ministry.members) ? ministry.members : [];

          return {
            ministryName: String(ministry.name || "Unnamed ministry"),
            activeRosterCount: members.length,
            memberAssignments: members.length,
            leaderAssignments: members.filter(
              (member) => member.assignmentRole === "Ministry Leader"
            ).length,
          };
        }),
      };

      instructions =
        "Generate insights ONLY about the leader's assigned ministries. " +
        "Discuss active roster sizes, differences between assigned " +
        "ministries, and practical recommendations. Roster counts are " +
        "assignments, not necessarily unique people across ministries. " +
        "Do not claim historical growth, attendance, causes, or participation " +
        "without supporting data. If no active ministries are assigned, " +
        "explain that no ministry statistics are available and recommend " +
        "confirming the leader's assignments.";
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to generate leadership insights.",
        },
        { status: 403 }
      );
    }

    const systemPrompt =
      "You are the CHMS Church Intelligence Assistant. " +
      "Analyze only the supplied verified aggregate data. " +
      "Never invent facts. Clearly distinguish observations " +
      "from recommendations. Do not identify individual members. " +
      "Keep the report under 250 words. " +
      instructions;

    const userPrompt =
      "Generate insights from these authorized statistics:\n" +
      JSON.stringify(facts);

    const result = await generateInsight({
      url: openRouterUrl,
      key: openRouterKey,
      systemPrompt,
      userPrompt,
    });

    if (result.error) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      insight: result.insight,
      scope: facts.scope,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Dashboard insights route error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to generate insights right now." },
      { status: 500 }
    );
  }
}