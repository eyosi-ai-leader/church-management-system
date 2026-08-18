import { CheckCircle2 } from "lucide-react";
import {Card} from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import Link from "next/link";

const JoinSuccess = ({ ministry }) => {
  return (
    <Card className="mx-auto max-w-3xl p-10 text-center">
      <div className="flex flex-col items-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2
            size={42}
            className="text-green-600"
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          Thank You!
        </h2>

        <p className="mt-4 text-lg text-gray-600">
          Your application for the{" "}
          <span className="font-semibold">
            {ministry.title}
          </span>{" "}
          Ministry has been received successfully.
        </p>

        <p className="mt-4 text-gray-600">
          Thank you for your desire to serve God through our church family.
          Our ministry leader will review your application and contact you
          soon.
        </p>

        <p className="mt-6 text-lg font-medium text-primary">
          May God bless you as you continue to grow in faith and service.
        </p>

        <div className="mt-10">
          <Button asChild>
            <Link href="/ministries">
              Back to Ministries
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JoinSuccess;