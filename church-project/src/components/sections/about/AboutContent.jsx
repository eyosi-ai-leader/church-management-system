import Link from "next/link";
import about from "@/data/about";

export default function AboutContent() {
  return (
    <div className="w-full lg:w-1/2">
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">
        {about.subtitle}
      </span>

      <h2
        id="about-heading"
        className="mt-4 text-4xl font-bold leading-tight text-gray-900 md:text-5xl"
      >
        {about.title}
      </h2>

      <p className="mt-6 text-lg leading-8 text-gray-600">
        {about.description}
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-blue-700">
            Our Mission
          </h3>

          <p className="mt-3 text-gray-600 leading-7">
            {about.mission}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-blue-700">
            Our Vision
          </h3>

          <p className="mt-3 text-gray-600 leading-7">
            {about.vision}
          </p>
        </div>
      </div>

      <Link
        href={about.button.href}
        className="mt-10 inline-flex rounded-lg bg-blue-700 px-8 py-4 font-medium text-white transition hover:bg-blue-800"
      >
        {about.button.label}
      </Link>
    </div>
  );
}