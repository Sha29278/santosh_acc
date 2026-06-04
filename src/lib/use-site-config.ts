"use client";

import { useState, useEffect } from "react";

const CACHE_KEY = "site_config_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface SiteConfig {
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  siteName?: string;
  logoUrl?: string;
}

const defaults: SiteConfig = {
  contactPhone: "+91 9613461462",
  contactEmail: "info@acctaxsolutions.in",
  address: "Fancy Ali, Jorhat, Assam - 785001",
  siteName: "AccTax Solutions",
  logoUrl: "",
};

let sharedConfig: SiteConfig = defaults;
let lastFetch = 0;
let listeners: Array<() => void> = [];
let initialized = false;

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function fetchConfig() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastFetch < CACHE_TTL) return;

  fetch("/api/site-config")
    .then((r) => r.json())
    .then((data) => {
      if (data && data.siteName) {
        sharedConfig = { ...defaults, ...data };
        lastFetch = Date.now();
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(sharedConfig));
          localStorage.setItem(CACHE_KEY + "_ts", String(lastFetch));
        } catch {}
        notifyListeners();
      }
    })
    .catch(() => {});
}

function initFromCache() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const ts = localStorage.getItem(CACHE_KEY + "_ts");
    if (cached) {
      sharedConfig = { ...defaults, ...JSON.parse(cached) };
      lastFetch = ts ? parseInt(ts, 10) : 0;
    }
  } catch {}
  fetchConfig();
}

export function useSiteConfig(): SiteConfig {
  const [, setTick] = useState(0);

  useEffect(() => {
    initFromCache();
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    fetchConfig();
    return () => {
      listeners = listeners.filter((fn) => fn !== listener);
    };
  }, []);

  return sharedConfig;
}
