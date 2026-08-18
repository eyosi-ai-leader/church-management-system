import { PageHero } from "@/components/shared/PageHero";

export default function MinistriesHero({ hero }) {
  return (
    <PageHero
      title={hero.title}
      description={hero.description}
      image={hero.image}
      breadcrumb={hero.breadcrumb}
    />
  );
}