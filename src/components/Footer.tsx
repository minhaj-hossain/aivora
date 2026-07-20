import React from "react";
import { ActiveView } from "../types";
import { Sparkles, Mail, ShieldAlert, Github, Twitter, Linkedin, Heart } from "lucide-react";

interface FooterProps {
  setView: (view: ActiveView) => void;
}

export default function Footer({ setView }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/40 py-16 text-on-surface-variant font-sans select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Logo & Description */}
          <div className="md:col-span-2 lg:col-span-1 space-y-4 text-left">
            <button 
              onClick={() => setView("home")} 
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity select-none"
            >
              <img 
                alt="Aivora Logo" 
                className="h-8 w-8 object-contain" 
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida/AP1WRLuHWJcwMtrYHoLGsTp_dOS1kJgs2u3cHrOhtfSkGUsFZrHf9cv-V25TX03BzxTg_0emSq59rcmiSBFYFqqSZATx3_H_4cjttGZQiZO_z4TeOQoU_DZ3EcXMwj7SmWm_VYw6YSQz30QXmbl99_m7pVKx4Z5f8Vk7CuCsDD9wixSQ2rlZGoXGUmY21WfMuDKcEJIzfGBE60Her-4DI-9bfdaJ09oNotW6hpYUhxmbi9Wxmod6Hnwopbds4Qs"
              />
              <span className="text-xl font-bold font-display text-primary tracking-tight">
                Aivora
              </span>
            </button>
            <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs font-sans">
              Elevating cognitive work through intelligent structure, collaborative boards, and advanced reasoning infrastructure.
            </p>
          </div>

          {/* Product links */}
          <div className="text-left">
            <h4 className="font-bold font-display text-primary mb-6 text-xs uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => setView("home")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Platform
                </button>
              </li>
              <li>
                <button onClick={() => setView("explore")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Templates
                </button>
              </li>
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Integrations
                </button>
              </li>
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Enterprise
                </button>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div className="text-left">
            <h4 className="font-bold font-display text-primary mb-6 text-xs uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  News
                </button>
              </li>
            </ul>
          </div>

          {/* Resources links */}
          <div className="text-left">
            <h4 className="font-bold font-display text-primary mb-6 text-xs uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Documentation
                </button>
              </li>
              <li>
                <button onClick={() => setView("explore")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Templates
                </button>
              </li>
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Community
                </button>
              </li>
              <li>
                <button onClick={() => setView("contact")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div className="text-left">
            <h4 className="font-bold font-display text-primary mb-6 text-xs uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setView("about")} className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-sans font-medium">
                  Security
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/30 gap-4 text-left">
          <p className="text-xs text-on-surface-variant font-sans">
            &copy; {currentYear} Aivora AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
