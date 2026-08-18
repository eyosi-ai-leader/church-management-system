import {SectionContainer} from "@/components/shared/SectionContainer";
import Button from "@/components/shared/Button";

export default function EventCTA() {
  return (
    <SectionContainer className="py-20">
      <div className="rounded-3xl bg-blue-600 px-8 py-16 text-center text-white shadow-lg md:px-16">
        <h2 className="text-3xl font-bold md:text-4xl">
          We Would Love To Welcome You
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
          Every gathering is an opportunity to worship together, grow in faith,
          and build lasting relationships. We invite you to be part of our
          church family.
        </p>

        <div className="mt-8 flex justify-center">
          <Button className="bg-blue-600 text-white hover:bg-slate-300">
            Plan Your Visit
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}