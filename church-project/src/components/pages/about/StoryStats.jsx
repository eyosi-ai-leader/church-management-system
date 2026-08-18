export default function StoryStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {stats.map((item) => (
        <div
          key={item.label}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-blue-600 md:text-4xl">
            {item.number}
          </h3>

          <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}