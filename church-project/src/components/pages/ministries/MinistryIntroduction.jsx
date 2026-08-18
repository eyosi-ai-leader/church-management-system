import { Badge } from "@/components/shared/Badge";
import { SectionContainer } from "@/components/shared/SectionContainer";

export default function MinistryIntroduction({
  introduction,
}) {
  return (
    <SectionContainer>
      <div className="mx-auto max-w-4xl text-center">
        <Badge>
          {introduction.badge}
        </Badge>

        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          {introduction.title}
        </h2>

        <div className="mt-8 space-y-6">
          {introduction.description.map(
            (paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-8 text-slate-600"
              >
                {paragraph}
              </p>
            )
          )}
        </div>
      </div>
    </SectionContainer>
  );
}