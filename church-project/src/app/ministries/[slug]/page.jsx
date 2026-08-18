import { notFound } from "next/navigation";

import ministries from "@/data/ministries";
import { MinistryDetailsPage } from "@/components/pages/ministry-details";


export async function generateStaticParams() {
  return ministries.map((ministry) => ({
    slug: ministry.slug,
  }));
}


export async function generateMetadata({ params }) {
  const { slug } = await params;

  const ministry = ministries.find(
    (item) => item.slug === slug
  );


  if (!ministry) {
    return {
      title: "Ministry Not Found",
    };
  }


  return {
    title: `${ministry.title} | Church Platform`,
    description: ministry.shortDescription,
  };
}


export default async function MinistryPage({ params }) {

  const { slug } = await params;


  const ministry = ministries.find(
    (item) => item.slug === slug
  );


  if (!ministry) {
    notFound();
  }


  return (
    <MinistryDetailsPage ministry={ministry} />
  );
}