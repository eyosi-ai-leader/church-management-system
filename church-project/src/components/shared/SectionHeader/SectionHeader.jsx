export default function SectionHeader({ subtitle, title, description, align = "center" }) {
  return (
    <div className={`max-w-3xl ${align === "left" ? "text-left" : "mx-auto text-center"}`}>
      {subtitle && (
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          {subtitle}
        </span>
      )}

      <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 text-lg leading-8 text-body">{description}</p>
      )}
    </div>
  );
}