import {
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";

import { Card } from "@/components/shared/Card";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";

export default function MinistryMeetingInfo({ ministry }) {
  return (
    <SectionContainer>
      <SectionHeader
        subtitle="Visit a Gathering"
        title="You're Invited to Join Our Ministry"
        description="Everyone is welcome to attend our ministry gatherings. Come connect, grow in faith, and serve alongside our church family."
        align="center"
      />

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
        <Card className="rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <CalendarDays
              size={30}
              className="text-blue-600"
            />
          </div>

          <h3 className="mt-6 text-xl font-semibold text-slate-900">
            Day
          </h3>

          <p className="mt-3 text-slate-600">
            {ministry.meeting.day}
          </p>
        </Card>

        <Card className="rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Clock3
              size={30}
              className="text-blue-600"
            />
          </div>

          <h3 className="mt-6 text-xl font-semibold text-slate-900">
            Time
          </h3>

          <p className="mt-3 text-slate-600">
            {ministry.meeting.time}
          </p>
        </Card>

        <Card className="rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <MapPin
              size={30}
              className="text-blue-600"
            />
          </div>

          <h3 className="mt-6 text-xl font-semibold text-slate-900">
            Location
          </h3>

          <p className="mt-3 text-slate-600">
            {ministry.meeting.location}
          </p>
        </Card>
      </div>
    </SectionContainer>
  );
}