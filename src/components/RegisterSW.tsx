"use client";

import { useEffect } from "react";

/** Registers /public/sw.js so Labologics installs as a PWA. */
export default function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline support is a bonus — the app works without it.
      });
    }
  }, []);
  return null;
}
