"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  services as staticServices,
  testimonials as staticTestimonials,
  faqs as staticFaqs,
  blogPosts as staticBlogPosts,
  whyChooseUs as staticWhyChooseUs,
  pricingPlans as staticPricingPlans,
  processSteps as staticProcessSteps,
} from "@/data/site-data";

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

  useEffect(() => {
    fetch("/api/site-data")
      .then((r) => r.json())
      .then((apiData) => {
        if (apiData && apiData.services) setData(apiData as SiteData);
      })
      .catch(() => {
        // Fallback to static data is already set
      });
  }, []);

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
