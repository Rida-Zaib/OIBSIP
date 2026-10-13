import React, { useState, useEffect } from 'react';
import { Linkedin, Mail, Menu, X, Terminal, ArrowUpRight, Sparkles, Download, FileText } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';

interface NavbarProps {
  onOpenTerminal?: () => void;
  onOpenCV?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal, onOpenCV }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'GradExpert', href: '#featured', id: 'featured' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Research', href: '#research', id: 'research' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map(link => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-[#07050d]/85 backdrop-blur-md border-b border-purple-500/15 shadow-lg shadow-purple-950/20'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand / Logo */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-400 p-[1px] shadow-sm shadow-purple-500/30 group-hover:shadow-purple-500/60 transition-shadow">
              <div className="w-full h-full bg-[#0d0918] rounded-[11px] flex items-center justify-center">
                <span className="font-heading font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white">
                  RZ
                </span>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#07050d] animate-pulse" />
            </div>

            <div className="flex flex-col">
              <span className="font-heading font-bold text-base tracking-tight text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                Rida Zaib
                <Sparkles className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="text-[11px] text-purple-300/70 font-mono tracking-wider">
                Software Engineer
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#120c24]/70 p-1.5 rounded-full border border-purple-500/15 backdrop-blur-md shadow-inner shadow-purple-950/30">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-purple-600 to-violet-600 shadow-sm shadow-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {onOpenCV && (
              <button
                onClick={onOpenCV}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-md shadow-purple-900/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer"
                title="Download Structured CV (PDF)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CV</span>
              </button>
            )}

            {onOpenTerminal && (
              <button
                onClick={onOpenTerminal}
                className="p-2 text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/20 rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                title="Open Interactive Terminal"
              >
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-mono text-[11px]">CLI</span>
              </button>
            )}

            <a
              href={PORTFOLIO_DATA.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/30 rounded-lg transition-all"
              aria-label="Rida Zaib LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4 text-purple-300" />
            </a>

            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1a0f3d] hover:bg-[#251557] border border-purple-400/30 hover:border-purple-300 text-purple-200 hover:text-white shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {onOpenCV && (
              <button
                onClick={onOpenCV}
                className="p-2 text-purple-200 bg-purple-950/70 border border-purple-400/40 rounded-lg text-xs flex items-center gap-1"
                title="Download CV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">CV</span>
              </button>
            )}
            {onOpenTerminal && (
              <button
                onClick={onOpenTerminal}
                className="p-2 text-purple-300 bg-purple-950/50 border border-purple-500/20 rounded-lg text-xs"
                title="CLI"
              >
                <Terminal className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/20 text-slate-200 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 px-4 pb-6 pt-2 bg-[#0c0818]/95 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            <div className="pt-3 mt-2 border-t border-purple-500/20 flex flex-col gap-2">
              {onOpenCV && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCV();
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-purple-950/50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV (Official Format)</span>
                </button>
              )}
              <a
                href={PORTFOLIO_DATA.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 text-sm font-medium"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn Profile</span>
              </a>
              <a
                href={`mailto:${PORTFOLIO_DATA.personal.email}`}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1c113b] border border-purple-500/25 text-white text-sm font-medium"
              >
                <Mail className="w-4 h-4 text-purple-300" />
                <span>Send Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
