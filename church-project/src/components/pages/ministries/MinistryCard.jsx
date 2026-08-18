import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Card } from "@/components/shared/Card";
import Button from "@/components/shared/Button";

export default function MinistryCard({ ministry }) {
  return (
    <Card className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-72 overflow-hidden">
        <Image
          src={ministry.image}
          alt={ministry.title}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />

        <div className="absolute bottom-6 left-6">
          <h3 className="text-2xl font-bold text-white">
            {ministry.title}
          </h3>
        </div>
      </div>

      <div className="flex h-[220px] flex-col justify-between p-8">
        <p className="leading-8 text-slate-600">
          {ministry.shortDescription}
        </p>

        <Link href={`/ministries/${ministry.slug}`}>
          <Button className="w-full justify-center">
            Learn More

            <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </Card>
  );
}