import {
  MinistryHero,
  MinistryOverview,
  MinistryActivities,
  MinistryMeetingInfo,
  MinistryLeader,
  MinistryRequirements,
  MinistryJoinSection,
 
} from ".";

export default function MinistryDetailsPage({ ministry }) {
  return (
    <>
      <MinistryHero ministry={ministry} />

      <MinistryOverview ministry={ministry} />

      <MinistryActivities ministry={ministry} />

      <MinistryMeetingInfo ministry={ministry} />

      <MinistryLeader ministry={ministry} />

      <MinistryRequirements ministry={ministry} />

      <MinistryJoinSection ministry={ministry} />

    </>
  );
}