/*
 * Event times arrive as "2026-11-08 10:00:00": exactly what the church
 * typed, with no time zone. They are formatted here as plain numbers, so
 * the server and every visitor's browser always show the same text.
 */

export const EVENT_CATEGORIES = [
  "Worship",
  "Prayer",
  "Conference",
  "Youth",
  "Children",
  "Outreach",
  "Fellowship",
  "Training",
  "Other",
];

export const VISIBILITY_LABELS = {
  public: "Public",
  members: "Members only",
  ministry: "Ministry only",
};

function parts(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(
    String(value || "")
  );

  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
  };
}

function asDate(value) {
  const p = parts(value);

  return p
    ? new Date(Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute))
    : null;
}

export function formatEventDate(value, options = {}) {
  const date = asDate(value);

  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function formatEventTime(value) {
  const date = asDate(value);

  if (!date) return "";

  return date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatEventTimeRange(start, end) {
  const from = formatEventTime(start);

  if (!end) return from;

  const sameDay = String(start).slice(0, 10) === String(end).slice(0, 10);

  if (sameDay) return `${from} – ${formatEventTime(end)}`;

  return `${from} – ${formatEventDate(end, {
    weekday: undefined,
    year: undefined,
    month: "short",
  })}, ${formatEventTime(end)}`;
}

export function getDayBadge(value) {
  const date = asDate(value);

  if (!date) return { day: "", month: "" };

  return {
    day: String(date.getUTCDate()),
    month: date.toLocaleDateString("en-US", {
      timeZone: "UTC",
      month: "short",
    }),
  };
}

export function repeatLabel(event) {
  if (!event || event.repeatType !== "weekly") return "";

  const date = asDate(event.firstStartAt || event.startAt);

  const weekday = date
    ? date.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "long" })
    : "week";

  const until = event.repeatUntil
    ? ` until ${formatEventDate(`${event.repeatUntil} 00:00:00`, {
        weekday: undefined,
      })}`
    : "";

  return `Repeats every ${weekday}${until}`;
}

export function toDateTimeLocal(value) {
  return String(value || "").slice(0, 16).replace(" ", "T");
}

const pad = (value) => String(value).padStart(2, "0");

function compact(date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate()
  )}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00`;
}

export function googleCalendarUrl(event) {
  const start = asDate(event.startAt);

  if (!start) return "";

  const end = event.endAt
    ? asDate(event.endAt)
    : new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${compact(start)}/${compact(end)}`,
    details: event.description.slice(0, 500),
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}