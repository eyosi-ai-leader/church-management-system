// src/components/pages/contact/PrayerRequest.jsx

import {SectionContainer} from "@/components/shared/SectionContainer";
import ContactForm from "./ContactForm";

export default function PrayerRequest({ data }) {
  return (
    <section className="py-16 bg-slate-50">
      <SectionContainer>
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">
            {data.title}
          </h2>

          <p className="mt-4 text-slate-600">
            {data.description}
          </p>
        </div>

        <ContactForm />
      </SectionContainer>
    </section>
  );
}