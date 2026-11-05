const DEFAULT_MINUTES = 120;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const pad = (value) => String(value).padStart(2, "0");

/*
 * Event times are "naive": exactly what the church typed, with no
 * time zone attached ("2026-11-08 10:00:00"). All date math below is
 * done in UTC on those numbers, so the server's own time zone never
 * changes what people see.
 */
const parseNaive = (value) => {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(
      String(value || "")
    );

  if (!match) return null;

  return new Date(
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5]),
      Number(match[6] || 0)
    )
  );
};

const formatNaive = (date) =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
    date.getUTCSeconds()
  )}`;

/* The current date and time in the church's own time zone. */
const nowInChurch = () => {
  const zone = process.env.CHURCH_TIMEZONE || "Africa/Addis_Ababa";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type) => parts.find((part) => part.type === type)?.value;

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get(
    "minute"
  )}:${get("second")}`;
};

const durationOf = (event) => {
  const first = parseNaive(event.start_at);
  const firstEnd = event.end_at ? parseNaive(event.end_at) : null;

  return firstEnd ? firstEnd - first : DEFAULT_MINUTES * 60000;
};

/* The last date a finished event (or a finished weekly series) took place. */
const lastOccurrence = (event) => {
  const first = parseNaive(event.start_at);
  const duration = durationOf(event);

  let startMs = first.getTime();

  if (event.repeat_type === "weekly" && event.repeat_until) {
    const until = parseNaive(`${event.repeat_until} 23:59:59`);

    if (until) {
      const weeks = Math.max(
        0,
        Math.floor((until.getTime() - startMs) / WEEK_MS)
      );

      startMs += weeks * WEEK_MS;
    }
  }

  return {
    start: formatNaive(new Date(startMs)),
    end: event.end_at ? formatNaive(new Date(startMs + duration)) : null,
    ended: true,
    ongoing: false,
  };
};

/*
 * The occurrence to show for an event right now:
 *  - a single event: itself
 *  - a weekly event: the current or next date in the series
 *  - a finished event: its last date
 */
const computeOccurrence = (event, nowStr) => {
  const now = parseNaive(nowStr).getTime();
  const first = parseNaive(event.start_at);
  const duration = durationOf(event);

  let startMs = first.getTime();
  let ended = false;

  if (event.repeat_type === "weekly") {
    const weeks = Math.max(
      0,
      Math.ceil((now - startMs - duration) / WEEK_MS)
    );

    startMs += weeks * WEEK_MS;

    if (event.repeat_until) {
      const until = parseNaive(`${event.repeat_until} 23:59:59`);

      if (until && startMs > until.getTime()) ended = true;
    }
  } else if (startMs + duration < now) {
    ended = true;
  }

  if (ended) return lastOccurrence(event);

  const endMs = startMs + duration;

  return {
    start: formatNaive(new Date(startMs)),
    end: event.end_at ? formatNaive(new Date(endMs)) : null,
    ended: false,
    ongoing: startMs <= now && now <= endMs,
  };
};

module.exports = {
  DEFAULT_MINUTES,
  parseNaive,
  formatNaive,
  nowInChurch,
  computeOccurrence,
  lastOccurrence,
};