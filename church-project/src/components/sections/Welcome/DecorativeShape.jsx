// src/components/sections/welcome/DecorativeShape.jsx

export default function DecorativeShape() {
  return (
    <>
      {/* Primary Gold Circle */}
      <div
        aria-hidden="true"
        className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-amber-400/20 blur-sm"
      />

      {/* Secondary Blue Circle */}
      <div
        aria-hidden="true"
        className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-blue-600/10 blur-md"
      />

      {/* Accent Ring */}
      <div
        aria-hidden="true"
        className="absolute top-10 -right-6 h-20 w-20 rounded-full border-4 border-amber-400/40"
      />
    </>
  );
}