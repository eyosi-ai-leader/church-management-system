import {
  Cross,
  Eye,
  HeartHandshake,
} from "lucide-react";

import { SectionContainer } from "@/components/shared/SectionContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/shared/Card";

const icons = {
  Cross,
  Eye,
  HeartHandshake,
};

export default function MissionVisionValues({ items }) {
  return (
    <SectionContainer className="bg-slate-50">
      <SectionHeader
        badge="Who We Are"
        title="Mission, Vision & Values"
        description="The foundation of everything we do is centered on Christ, guided by Scripture, and driven by a heart to serve others."
        align="center"
      />

      <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = icons[item.icon];

          return (
            <Card
              key={item.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white transition-transform duration-300 group-hover:scale-110">
                <Icon size={30} />
              </div>

              <h3 className="mt-8 text-2xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                {item.description}
              </p>
            </Card>
          );
        })}
      </div>
    </SectionContainer>
  );
}