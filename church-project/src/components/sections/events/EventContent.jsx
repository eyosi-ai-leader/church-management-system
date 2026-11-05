import {
  formatEventDate,
  formatEventTimeRange,
  repeatLabel,
} from "@/lib/eventFormat";

const EventContent = ({ event }) => {
  const repeat = repeatLabel(event);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {event.category}
        </span>

        {event.ongoing && (
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Happening now
          </span>
        )}
      </div>

      <h3 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
        {event.title}
      </h3>

      <div className="space-y-2 text-sm font-medium text-gray-600">
        <p>
          <span className="font-semibold text-gray-900">Date:</span>{" "}
          {formatEventDate(event.startAt)}
        </p>

        <p>
          <span className="font-semibold text-gray-900">Time:</span>{" "}
          {formatEventTimeRange(event.startAt, event.endAt)}
        </p>

        <p>
          <span className="font-semibold text-gray-900">Location:</span>{" "}
          {event.location}
        </p>

        {repeat && <p className="text-gray-500">{repeat}</p>}
      </div>

      <p className="line-clamp-4 max-w-xl whitespace-pre-line text-base leading-8 text-gray-600">
        {event.description}
      </p>
    </div>
  );
};

export default EventContent;