// src/components/pages/contact/ContactPage.jsx

import ContactHero from "./ContactHero";
import ContactInfo from "./ContactInfo";
import ServiceInfo from "./ServiceInfo";
import PrayerRequest from "./PrayerRequest";
// import LocationMap from "./LocationMap";
import ContactCTA from "./ContactCTA";

import { contactPage } from "@/data/contactPage";

export default function ContactPage() {
  return (
    <main>
      <ContactHero data={contactPage.hero} />

      <ContactInfo data={contactPage.contactInfo} />

      <ServiceInfo data={contactPage.serviceInfo} />

      <PrayerRequest data={contactPage.prayerForm} />

      {/* <LocationMap data={contactPage.location} /> */}

      {/* <ContactCTA data={contactPage.cta} /> */}
    </main>
  );
}