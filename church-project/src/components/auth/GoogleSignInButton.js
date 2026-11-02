"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Google should be initialized only once per page load.
let initialized = false;
let currentHandler = null;

export default function GoogleSignInButton({
  onCredential,
  onError,
  disabled = false,
}) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    currentHandler = onCredential;

    return () => {
      if (currentHandler === onCredential) currentHandler = null;
    };
  }, [onCredential]);

  const renderButton = useCallback(() => {
    const google = window.google?.accounts?.id;
    const container = containerRef.current;

    if (!google || !container) return;

    if (!initialized) {
      google.initialize({
        client_id: CLIENT_ID,
        callback: (response) => {
          if (response?.credential) currentHandler?.(response.credential);
        },
        ux_mode: "popup",
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      initialized = true;
    }

    container.innerHTML = "";

    google.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: Math.min(400, Math.max(200, container.offsetWidth || 320)),
    });

    setReady(true);
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div
      aria-busy={disabled}
      className={disabled ? "pointer-events-none opacity-60" : ""}
    >
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={renderButton}
        onError={() =>
          onError?.(
            "Google sign-in couldn't load. Check your connection and refresh the page."
          )
        }
      />

      {!ready && (
        <div
          aria-hidden="true"
          className="h-11 w-full animate-pulse rounded-xl bg-slate-100"
        />
      )}

      <div ref={containerRef} className="flex justify-center" />
    </div>
  );
}