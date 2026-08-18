export default function DecorativeShape() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-600/10 blur-2xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-400/20 blur-xl"
      />

      <div
        aria-hidden="true"
        className="absolute top-1/3 -left-6 h-16 w-16 rounded-full border-4 border-blue-600/20"
      />
    </>
  );
}