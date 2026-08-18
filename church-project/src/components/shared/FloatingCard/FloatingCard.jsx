export default function FloatingCard({ children, position = "bottom-right" }) {
  const positions = {
    "bottom-right": "right-6 -bottom-8",
    "bottom-left": "left-6 -bottom-8",
    "top-right": "right-6 -top-8",
  };

  return (
    <div
      className={`
        absolute
        ${positions[position]}
        max-w-xs
        rounded-lg
        bg-surface
        p-6
        shadow-soft
        ring-1
        ring-line
      `}
    >
      {children}
    </div>
  );
}