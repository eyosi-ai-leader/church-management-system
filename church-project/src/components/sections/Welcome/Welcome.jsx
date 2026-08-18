// src/components/sections/welcome/Welcome.jsx

import WelcomeImage from "./WelcomeImage";
import WelcomeContent from "./WelcomeContent";

export default function Welcome() {
  return (
    <section
      id="welcome"
      aria-labelledby="welcome-heading"
      className="bg-white py-16 md:py-24 lg:py-32"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 px-6 lg:flex-row lg:gap-20">
        <WelcomeImage />
        <WelcomeContent />
      </div>
    </section>
  );
}