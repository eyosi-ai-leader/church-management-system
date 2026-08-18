"use client";

import { useEffect, useState } from "react";

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export default function useCountdown(targetDate) {
  function calculateTimeLeft() {
    if (!targetDate) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    let target = new Date(targetDate).getTime();
    const now = Date.now();

    // Keep moving the target forward by one week
    // until it is in the future.
    while (target <= now) {
      target += WEEK_IN_MS;
    }

    const difference = target - now;

    return {
      days: String(
        Math.floor(difference / (1000 * 60 * 60 * 24))
      ).padStart(2, "0"),

      hours: String(
        Math.floor((difference / (1000 * 60 * 60)) % 24)
      ).padStart(2, "0"),

      minutes: String(
        Math.floor((difference / (1000 * 60)) % 60)
      ).padStart(2, "0"),

      seconds: String(
        Math.floor((difference / 1000) % 60)
      ).padStart(2, "0"),
    };
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}