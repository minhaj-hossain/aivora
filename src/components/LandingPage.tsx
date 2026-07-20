import React from "react";
import { ActiveView } from "../types";
import HeroSection from "./homepage/HeroSection.tsx";
import TrustedBy from "./homepage/TrustedBy.tsx";
import Workflow from "./homepage/Workflow.tsx";
import CoreCapabilities from "./homepage/CoreCapabilities.tsx";
import UseCases from "./homepage/UseCases.tsx";
import Stats from "./homepage/Stats.tsx";
import Testimonials from "./homepage/Testimonials.tsx";
import FaqSection from "./homepage/FaqSection.tsx";
import CtaBanner from "./homepage/CtaBanner.tsx";

interface LandingPageProps {
  setView: (view: ActiveView) => void;
}

export default function LandingPage({ setView }: LandingPageProps) {
  return (
    <div className="w-full bg-[#f7f9fb] min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection setView={setView} />

      {/* 2. Trusted By Partner Logos */}
      <TrustedBy />

      {/* 3. Three-Step Thinking Workflow */}
      <Workflow />

      {/* 4. Core Bento Capabilities */}
      <CoreCapabilities />

      {/* 5. Professional Use Cases */}
      <UseCases setView={setView} />

      {/* 6. Authoritative Enterprise Stats */}
      <Stats />

      {/* 7. Industry Testimonials */}
      <Testimonials />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Final Call to Action */}
      <CtaBanner setView={setView} />
    </div>
  );
}
