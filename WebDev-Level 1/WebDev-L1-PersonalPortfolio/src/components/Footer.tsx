import React from 'react';
import { ArrowUp, Linkedin, Mail, Heart, Sparkles, Code2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-purple-500/15 bg-[#05030a] py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-purple-500/10">
          
          {/* Brand Identity */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-violet-400 p-[1px]">
                <div className="w-full h-full bg-[#0d0918] rounded-[7px] flex items-center justify-center">
                  <span className="font-heading font-extrabold text-xs text-white">RZ</span>
                </div>
              </div>
              <span className="font-heading font-bold text-lg text-white">
                {PORTFOLIO_DATA.personal.name}
              </span>
            </div>
            <p className="text-xs text-purple-300/80 font-mono mt-1">
              {PORTFOLIO_DATA.personal.subtitle}
            </p>
          </div>

          {/* Quick Footer Anchors */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
            <a href="#about" className="hover:text-purple-300 transition-colors">About</a>
            <a href="#education" className="hover:text-purple-300 transition-colors">Education</a>
            <a href="#skills" className="hover:text-purple-300 transition-colors">Skills</a>
            <a href="#featured" className="hover:text-purple-300 transition-colors">GradExpert</a>
            <a href="#projects" className="hover:text-purple-300 transition-colors">Projects</a>
            <a href="#research" className="hover:text-purple-300 transition-colors">Research</a>
            <a href="#contact" className="hover:text-purple-300 transition-colors">Contact</a>
          </div>

          {/* Social Icons & Back to top */}
          <div className="flex items-center gap-3">
            <a
              href={PORTFOLIO_DATA.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#120a24] hover:bg-purple-600/30 border border-purple-500/20 text-slate-300 hover:text-white transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-purple-300" />
            </a>

            <a
              href={`mailto:${PORTFOLIO_DATA.personal.email}`}
              className="p-2 rounded-xl bg-[#120a24] hover:bg-purple-600/30 border border-purple-500/20 text-slate-300 hover:text-white transition-all"
              aria-label="Email"
            >
              <Mail className="w-4 h-4 text-purple-300" />
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white transition-all"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 text-center sm:text-left">
          <div>
            © {currentYear} {PORTFOLIO_DATA.personal.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with React, TypeScript & Tailwind CSS</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
