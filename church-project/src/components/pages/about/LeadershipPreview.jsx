import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { SectionContainer } from "@/components/shared/SectionContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";
import  Button  from "@/components/shared/Button";

export default function LeadershipPreview({ leadership }) {
  return (
    <SectionContainer>
      <SectionHeader
        badge="Leadership"
        title={leadership.title}
        description={leadership.description}
        align="center"
      />

      <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {leadership.members.map((member) => (
          <Card
            key={member.name}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="relative h-80">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-slate-900">
                {member.name}
              </h3>

              <p className="mt-2 text-slate-500">
                {member.role}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <Link href="/ministries">
          <Button>
            Explore Ministries

            <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </SectionContainer>
  );
}