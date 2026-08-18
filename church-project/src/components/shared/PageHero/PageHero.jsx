import Image from "next/image";
import Link from "next/link";

export default function PageHero({ title, description, image, breadcrumb = [] }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative h-[380px] md:h-[460px] lg:h-[520px]">
        <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-primary-dark/30" />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/80">
              {breadcrumb.map((item, index) => (
                <div key={item.label} className="flex items-center gap-2">
                  {index > 0 && <span className="text-white/50">/</span>}
                  {item.href ? (
                    <Link href={item.href} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-white">{item.label}</span>
                  )}
                </div>
              ))}
            </nav>

            <div className="max-w-3xl">
              <h1 className="font-display text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/85 md:text-xl">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}