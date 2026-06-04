"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import {
  services as staticServices,
  testimonials as staticTestimonials,
  faqs as staticFaqs,
  blogPosts as staticBlogPosts,
  whyChooseUs as staticWhyChooseUs,
  pricingPlans as staticPricingPlans,
  processSteps as staticProcessSteps,
} from "@/data/site-data";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SiteData {
  services: any[];
  testimonials: any[];
  faqs: any[];
  blogPosts: any[];
  whyChooseUs: any[];
  pricingPlans: any[];
  processSteps: any[];
}

const defaultData: SiteData = {
  services: staticServices,
  testimonials: staticTestimonials,
  faqs: staticFaqs,
  blogPosts: staticBlogPosts,
  whyChooseUs: staticWhyChooseUs,
  pricingPlans: staticPricingPlans,
  processSteps: staticProcessSteps,
};

const SiteDataContext = createContext<SiteData>(defaultData);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData);
  const controllerRef = useRef<AbortController | null>(null);

  // Fetch site data with AbortController to prevent overlapping requests.
  // Re-fetches instantly when user returns to the tab (visibilitychange),
  // plus polls every 30s as a fallback for long sessions.
  const fetchData = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    fetch("/api/site-data", { signal: controller.signal })
      .then((r) => r.json())
      .then((apiData) => {
        if (apiData && apiData.services) setData(apiData as SiteData);
      })
      .catch((err) => {
        // Ignore aborted requests
        if (err?.name !== "AbortError") {
          // Fallback to static data already set
        }
      });
  }, []);

  useEffect(() => {
    fetchData();

    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000);

    // Re-fetch instantly when user returns to the tab
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchData();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      controllerRef.current?.abort();
    };
  }, [fetchData]);

  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  return useContext(SiteDataContext);
}

// Also export individual hooks for convenience
export function useBlogPosts() {
  return useSiteData().blogPosts;
}

export function useServices() {
  return useSiteData().services;
}

export function useTestimonials() {
  return useSiteData().testimonials;
}

export function useFaqs() {
  return useSiteData().faqs;
}
