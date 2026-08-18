export default function Card({ as: Component = "div", children, className = "" }) {
  return (
    <Component
      className={`
        rounded-lg
        border border-line
        bg-surface
        p-6
        shadow-card
        overflow-hidden
        transition
        duration-300
        hover:-translate-y-2
        hover:shadow-soft
        ${className}
      `}
    >
      {children}
    </Component>
  );
}