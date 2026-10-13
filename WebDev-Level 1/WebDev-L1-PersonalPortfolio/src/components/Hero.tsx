import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { 
  ArrowRight, 
  Linkedin, 
  Sparkles, 
  Code, 
  Cpu, 
  Database, 
  FileCode, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  Zap, 
  Download, 
  FileText, 
  Brain, 
  Globe, 
  ShieldCheck,
  Compass,
  Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { HERO_SCENES, HeroSceneData } from '../data/heroScenes';
import { motionVariants, TRANSITION_SMOOTH } from '../animations/variants';

interface HeroProps {
  onOpenTerminal?: () => void;
  onOpenCV?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal, onOpenCV }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [parallax, setParallax] = useState({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  const activeScene: HeroSceneData = HERO_SCENES[currentSceneIdx];

  // Screen size check for mobile parallax optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload all 4 hero scene images immediately so they are fully cached
  useEffect(() => {
    HERO_SCENES.forEach((scene) => {
      const img = new Image();
      img.src = scene.image;
    });
  }, []);

  // Cinematic smooth auto-transition between scenes (14s duration) - changes on its own
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSceneIdx((prev) => (prev + 1) % HERO_SCENES.length);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  // Layered 3D Mouse Parallax calculation
  const rafRef = useRef<number | null>(null);
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile || !heroContainerRef.current || rafRef.current !== null) return;
    const { clientX, clientY } = e;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!heroContainerRef.current) return;
      const rect = heroContainerRef.current.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      setParallax({ x: x * 28, y: y * 28, rotX: -y * 12, rotY: x * 12 });
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setParallax({ x: 0, y: 0, rotX: 0, rotY: 0 });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const renderTechIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-4 h-4 text-purple-300" />;
      case 'Brain': return <Brain className="w-4 h-4 text-fuchsia-300" />;
      case 'Code': return <Code className="w-4 h-4 text-cyan-300" />;
      case 'Database': return <Database className="w-4 h-4 text-indigo-300" />;
      case 'FileCode': return <FileCode className="w-4 h-4 text-violet-300" />;
      case 'Layers': return <Layers className="w-4 h-4 text-blue-300" />;
      case 'Globe': return <Globe className="w-4 h-4 text-emerald-300" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-sky-300" />;
      case 'Compass': return <Compass className="w-4 h-4 text-amber-300" />;
      default: return <Sparkles className="w-4 h-4 text-purple-300" />;
    }
  };

  return (
    <section
      id="hero"
      ref={heroContainerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[96vh] pt-28 pb-16 flex items-center justify-center overflow-hidden"
    >
      {/* ============================================================== */}
      {/* LAYER 1: FUTURISTIC ENVIRONMENT BACKGROUND                     */}
      {/* ============================================================== */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[700px] bg-gradient-to-tr ${activeScene.ambientGlow} rounded-full blur-[160px] pointer-events-none -z-10 transition-all duration-1000 ease-out opacity-85`}
        style={{
          transform: isMobile 
            ? 'translate(-50%, -50%)' 
            : `translate3d(calc(-50% + ${parallax.x * 0.4}px), calc(-50% + ${parallax.y * 0.4}px), 0)`,
        }}
      />
      
      {/* Secondary accent atmosphere bloom */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '7s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Main Hero Card Container */}
        <div className="relative rounded-[36px] p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#120826]/95 via-[#0d061c]/95 to-[#080413]/95 border border-purple-500/30 shadow-[0_25px_80px_rgba(15,7,34,0.9)] overflow-hidden transition-all duration-300">
          
          {/* Top Decorative Glass Highlight Line with Shimmer */}
          <div className="absolute top-0 left-12 right-12 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent animate-pulse" />

          {/* ============================================================== */}
          {/* TOP CONTROLS: QUICK SOCIAL & GRADUATION STATUS                */}
          {/* ============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.05 }}
            className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-purple-500/15"
          >
            
            {/* Left: Quick Profile & Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com/in/rida-zaib"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#1c113b]/90 hover:bg-purple-600/60 border border-purple-400/40 flex items-center justify-center text-purple-200 hover:text-white transition-all transform hover:scale-110 shadow-sm"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>

              <a
                href={PORTFOLIO_DATA.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#1c113b]/90 hover:bg-purple-600/60 border border-purple-400/40 flex items-center justify-center text-purple-200 hover:text-white transition-all transform hover:scale-110 shadow-sm"
                aria-label="GitHub Profile"
                title="GitHub Profile"
              >
                <Github className="w-3.5 h-3.5" />
              </a>

              {onOpenTerminal && (
                <button
                  onClick={onOpenTerminal}
                  className="h-8 px-3 rounded-full bg-[#1c113b]/90 hover:bg-purple-600/60 border border-purple-400/40 flex items-center gap-1.5 text-purple-200 hover:text-white transition-all transform hover:scale-105 text-xs font-mono shadow-sm cursor-pointer"
                  title="Interactive Terminal"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CLI</span>
                </button>
              )}

              <div className="ml-1 pl-3 border-l border-purple-500/25 hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-300 font-medium tracking-wide">
                  BS Software Engineering • University of Gujrat Graduate
                </span>
              </div>
            </div>

            {/* Right: Subtle Ambient Progress Indicator */}
            <div className="flex items-center gap-1.5 bg-[#140b2a]/70 px-3.5 py-1.5 rounded-full border border-purple-500/25">
              {HERO_SCENES.map((scene, idx) => (
                <div
                  key={scene.id}
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    currentSceneIdx === idx
                      ? 'w-7 bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 shadow-[0_0_10px_rgba(168,85,247,0.9)]'
                      : 'w-1.5 bg-purple-900/60'
                  }`}
                  title={scene.theme}
                />
              ))}
            </div>

          </motion.div>

          {/* ============================================================== */}
          {/* MAIN HERO SPLIT CONTENT WITH ANIMATED SCENE TRANSITION         */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: Narrative & Dedicated Actions (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left z-10">

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-400/40 text-[11px] text-purple-200 font-mono mb-3 shadow-md backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Open for Engineering & Research Roles</span>
              </div>

              {/* Greeting & Candidate Name */}
              <motion.h1
                initial={{ opacity: 0, y: 26, filter: 'blur(16px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
              >
                Hi, I'm{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-violet-300 to-cyan-200 drop-shadow-[0_0_30px_rgba(168,85,247,0.45)] shimmer-text">
                  {PORTFOLIO_DATA.personal.name}
                </span>
              </motion.h1>

              {/* Animated Scene Subtitle and Dynamic Focus */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScene.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-3.5"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/90 via-violet-900/80 to-purple-950/90 border border-purple-400/50 shadow-lg shadow-purple-950/70">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                      {activeScene.title}
                    </span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm font-mono text-purple-300 tracking-wide">
                    {activeScene.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Narrative Scene Storytelling */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${activeScene.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45 }}
                  className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl"
                >
                  {activeScene.description}
                </motion.p>
              </AnimatePresence>

              {/* PROMINENT DUAL CV ACTIONS & TERMINAL ACCESS */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                
                {/* 1. ACTUAL WORKING DOWNLOAD CV (Generates Rida_Zaib_CV.pdf) */}
                <button
                  onClick={() => import('../utils/generatePdf').then(m => m.downloadRidaZaibCV())}
                  className="btn-glow-interactive px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-sm shadow-[0_10px_28px_rgba(124,58,237,0.5)] hover:shadow-[0_14px_35px_rgba(124,58,237,0.75)] transition-all duration-300 flex items-center gap-2.5 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer group"
                  title="Download Rida_Zaib_CV.pdf directly"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download CV</span>
                </button>

                {/* 2. VIEW CV MODAL PREVIEW */}
                {onOpenCV && (
                  <button
                    onClick={onOpenCV}
                    className="px-5 py-3.5 rounded-2xl bg-[#1c113b]/90 hover:bg-[#281854] border border-purple-400/40 hover:border-purple-300 text-purple-200 hover:text-white font-medium text-sm transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 active:translate-y-0 backdrop-blur-md shadow-md cursor-pointer group"
                    title="View 2-Column Professional CV"
                  >
                    <FileText className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                    <span>View CV</span>
                  </button>
                )}

                {/* 3. TERMINAL CLI ACCESS */}
                {onOpenTerminal && (
                  <button
                    onClick={onOpenTerminal}
                    className="px-4 py-3.5 rounded-2xl bg-[#150d2b] hover:bg-[#20153f] border border-purple-500/25 text-slate-300 hover:text-white font-mono text-xs transition-all flex items-center gap-2 cursor-pointer hover:border-purple-400/40"
                    title="Launch Interactive Terminal"
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CLI</span>
                  </button>
                )}

                <button
                  onClick={() => scrollTo('featured')}
                  className="px-5 py-3.5 rounded-2xl bg-[#150d2b] hover:bg-[#20153f] border border-purple-500/25 text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer hover:border-purple-400/40"
                >
                  <span>Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>

              {/* Dynamic Telemetry Metrics linked to active visual scene */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`metrics-${activeScene.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="mt-10 pt-6 border-t border-purple-500/20 grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg"
                >
                  {activeScene.interactiveTelemetry.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#140b2e]/70 border border-purple-500/20 hover:border-purple-400/50 hover:bg-[#1a0e3a] transition-all group/telemetry"
                    >
                      <div className="text-base sm:text-lg font-bold font-heading text-white group-hover/telemetry:text-purple-200 transition-colors">
                        {item.value}
                      </div>
                      <div className="text-[11px] text-purple-300 font-mono mt-0.5">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{item.subtext}</div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

            </div>

            {/* ============================================================== */}
            {/* RIGHT COLUMN: 4 DISTINCT ANIMATED SCENES WITH MULTI-LAYER DEPTH*/}
            {/* ============================================================== */}
            <div className="lg:col-span-5 flex justify-center items-center relative perspective-[1200px] min-h-[420px]">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScene.id}
                  initial={{ opacity: 0, scale: 0.93, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -16 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full max-w-[390px] sm:max-w-[440px] aspect-square flex items-center justify-center will-change-transform"
                  style={{
                    transform: isMobile 
                      ? 'none' 
                      : `rotateX(${parallax.rotX}deg) rotateY(${parallax.rotY}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  
                  {/* LAYER 1: Dynamic Backlit Aura Halo */}
                  <div
                    className={`absolute inset-2 rounded-full bg-gradient-to-tr ${activeScene.ambientGlow} blur-3xl -z-10 animate-pulse-glow`}
                    style={{
                      transform: isMobile ? 'none' : `translate3d(${-parallax.x * 0.4}px, ${-parallax.y * 0.4}px, -40px)`,
                    }}
                  />

                  {/* LAYER 2: Dual Concentric Holographic Orbital Rings */}
                  <div 
                    className="absolute inset-[-12px] rounded-full border border-purple-500/25 border-dashed animate-spin pointer-events-none -z-10" 
                    style={{ animationDuration: '45s' }} 
                  />
                  <div 
                    className="absolute inset-2 rounded-full border border-cyan-400/20 border-dotted animate-spin pointer-events-none -z-10" 
                    style={{ animationDuration: '32s', animationDirection: 'reverse' }} 
                  />
                  <div className="absolute inset-6 rounded-full border border-violet-500/15 pointer-events-none -z-10" />

                  {/* LAYER 3: DISTINCT 3D CHARACTER ARTWORK (Scene-specific) */}
                  <div
                    className="relative w-[92%] h-[92%] flex items-center justify-center animate-float transition-transform duration-200"
                    style={{
                      transform: isMobile ? 'none' : `translate3d(${parallax.x * 0.6}px, ${parallax.y * 0.6}px, 25px)`,
                    }}
                  >
                    <img
                      src={activeScene.image}
                      alt={`Rida Zaib 3D Developer - Scene ${activeScene.number}: ${activeScene.theme}`}
                      className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(124,58,237,0.65)] select-none pointer-events-none rounded-2xl"
                      loading="eager"
                    />
                  </div>

                  {/* LAYER 4: INDEPENDENT FLOATING TECHNOLOGY ORBITALS */}
                  {activeScene.technologies.map((tech, idx) => (
                    <div
                      key={idx}
                      className={`absolute ${tech.initialPos} px-3.5 py-2 rounded-2xl bg-[#160c33]/95 border border-purple-400/40 shadow-[0_8px_25px_rgba(124,58,237,0.4)] backdrop-blur-xl flex items-center gap-2 animate-float-slow z-30 transition-all duration-300 hover:scale-110 hover:border-purple-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] cursor-pointer group`}
                      style={{
                        transform: isMobile 
                          ? 'none' 
                          : `translate3d(${parallax.x * tech.depthFactor}px, ${-parallax.y * tech.depthFactor}px, 50px)`,
                        animationDelay: `${idx * 0.8}s`,
                      }}
                    >
                      <div className="w-6 h-6 rounded-lg bg-purple-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {renderTechIcon(tech.icon)}
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-purple-300/80 leading-none">{tech.role}</div>
                        <div className="text-xs font-mono font-bold text-white leading-tight flex items-center gap-1">
                          <span>{tech.name}</span>
                          <Sparkles className="w-2.5 h-2.5 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
