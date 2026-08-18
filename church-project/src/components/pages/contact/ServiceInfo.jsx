// src/components/pages/contact/ServiceInfo.jsx

import {SectionContainer} from "@/components/shared/SectionContainer";

export default function ServiceInfo({ data }) {
  return (
    <section className="py-16 bg-slate-50">
      <SectionContainer>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">
            {data.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {data.services.map((service, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"
            >
              <h3 className="text-xl font-semibold text-slate-900">
                {service.day}
              </h3>

              <p className="mt-2 text-blue-600 font-medium">
                {service.time}
              </p>

              <p className="mt-2 text-slate-600">
                {service.description}
              </p>
            </div>
          ))}

        </div>

      </SectionContainer>
    </section>
  );
}