import { CarFront } from "lucide-react";

import {Card} from "@/components/shared/Card";

export default function ParkingCard() {
  return (
    <Card className="h-full text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
        <CarFront size={30} />
      </div>

      <h3 className="mt-6 text-2xl font-bold text-gray-900">
        Free Parking
      </h3>

      <p className="mt-4 text-gray-600">
        Spacious parking is available on campus with dedicated
        visitor parking near the main entrance.
      </p>

      <div className="mt-8 rounded-xl bg-yellow-50 p-4">
        <p className="text-sm font-medium text-yellow-700">
          Visitor parking is clearly marked and free every service.
        </p>
      </div>
    </Card>
  );
}