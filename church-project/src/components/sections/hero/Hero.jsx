import HeroContent from "./HeroContent";
import HeroMedia from "./HeroMedia";

const Hero = () => {
  return (
    <section className="relative bg-surface">
      <div className="mx-auto grid min-h-[85vh] w-full max-w-[1600px] grid-cols-1 lg:grid-cols-2">
        <HeroContent />
        <div className="relative hidden min-h-[420px] lg:block">
          <HeroMedia />
        </div>
      </div>
    </section>
  );
};

export default Hero;