import { PageHero } from "@/components/shared/PageHero";

export default function MinistryHero({ ministry }) {
  return (
    <PageHero
      title={ministry.title}
      description={ministry.shortDescription}
      image={ministry.image}
      breadcrumb={[
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Ministries",
          href: "/ministries",
        },
        {
          label: ministry.title,
        },
      ]}
    />
  );
}