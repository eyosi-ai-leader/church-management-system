import Link from "next/link";
import welcome from "@/data/welcome";
import Button from "@/components/shared/Button";

export default function WelcomeActions() {
  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <Button
        href={welcome.primaryButton.href}
        variant="primary"
      >
        {welcome.primaryButton.label}
      </Button>

      <Button
        href={welcome.secondaryButton.href}
        variant="secondary"
      >
        {welcome.secondaryButton.label}
      </Button>
    </div>
  );
} 
