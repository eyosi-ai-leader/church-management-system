"use client";

import { useState } from "react";
import {SectionContainer} from "@/components/shared/SectionContainer";
import {SectionHeader} from "@/components/shared/SectionHeader";
import JoinForm from "./JoinForm";
import JoinSuccess from "./JoinSuccess";

const MinistryJoinSection = ({ ministry }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (formData) => {
    // Future API Integration
    // await submitMinistryApplication(formData);

    console.log("Ministry Application:", formData);

    setIsSubmitted(true);
  };

  return (
    <SectionContainer id="join-ministry">
      <SectionHeader
        badge="Serve With Us"
        title={`Join the ${ministry.title} Ministry`}
        description={`We are excited that you are interested in serving through the ${ministry.title} Ministry. Complete the application below, and our ministry leader will contact you after reviewing your submission.`}
        centered
      />

      {isSubmitted ? (
        <JoinSuccess ministry={ministry} />
      ) : (
        <JoinForm
          ministry={ministry}
          onSubmit={handleSubmit}
        />
      )}
    </SectionContainer>
  );
};

export default MinistryJoinSection;