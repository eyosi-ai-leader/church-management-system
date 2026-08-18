import AboutContent from "./AboutContent";
import AboutImage from "./AboutImage";

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-gray-50 py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 px-6 lg:flex-row lg:gap-20">
        <AboutContent />
        <AboutImage />
      </div>
    </section>
  );
}