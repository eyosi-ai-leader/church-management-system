// src/components/pages/contact/ContactInfo.jsx

import {SectionContainer} from "@/components/shared/SectionContainer";

export default function ContactInfo({ data }) {
  return (
    <section className="py-16">
      <SectionContainer>
        <div className="grid md:grid-cols-3 gap-6">

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Address
            </h3>

            <p className="mt-3 text-slate-600">
              {data.address}
            </p>
          </div>


          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Phone
            </h3>

            <p className="mt-3 text-slate-600">
              {data.phone}
            </p>
          </div>


          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Email
            </h3>

            <p className="mt-3 text-slate-600">
              {data.email}
            </p>
          </div>

        </div>
      </SectionContainer>
    </section>
  );
}