import WelcomeActions from "./WelcomeActions";
import welcome from "@/data/welcome";

export default function WelcomeContent() {
  return (
    <div className="w-full lg:w-1/2">
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">
        {welcome.subtitle}
      </span>

      <h2
        id="welcome-heading"
        className="mt-4 text-4xl font-bold leading-tight text-gray-900 md:text-5xl"
      >
        {welcome.title}
      </h2>

      <p className="mt-6 text-lg leading-8 text-gray-600">
        {welcome.description}
      </p>

      <WelcomeActions />
    </div>
  );
}