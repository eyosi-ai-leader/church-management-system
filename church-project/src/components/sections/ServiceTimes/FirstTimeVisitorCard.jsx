import { HeartHandshake } from "lucide-react";

import {Card} from "@/components/shared/Card";
import Button from "@/components/shared/Button";

export default function FirstTimeVisitorCard() {
  return (
    <Card className="h-full">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
        <HeartHandshake size={30} />
      </div>

      <h3 className="mt-6 text-2xl font-bold text-gray-900">
        First Time Here?
      </h3>

      <p className="mt-4 text-gray-600">
        We'd love to meet you. Our welcome team is ready to help
        you feel at home from the moment you arrive.
      </p>

      <ul className="mt-8 space-y-3 text-gray-600">
        <li>✓ Friendly welcome team</li>
        <li>✓ Free coffee & refreshments</li>
        <li>✓ Children's ministry</li>
        <li>✓ Guided campus tour</li>
      </ul>

      <div className="mt-8">
        <Button>
          Plan Your First Visit
        </Button>
      </div>
    </Card> 
  )
}