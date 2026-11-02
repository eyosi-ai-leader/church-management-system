import { Suspense } from "react";

import SetPasswordPage from "@/components/auth/invitation/SetPasswordPage";

export const metadata = {
  title: "Set your password",
  // The link contains a one-time token, so don't send it to other sites.
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SetPasswordPage />
    </Suspense>
  );
}