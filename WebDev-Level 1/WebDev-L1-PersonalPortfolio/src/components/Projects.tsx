import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  Film, 
  Building2, 
  GraduationCap, 
  Play, 
  Search, 
  Users, 
  BedDouble, 
  Database,
  Code,
  Layers,
  CheckCircle2,
  Tv,
  Check
} from 'lucide-react';
import { PORTFOLIO_DATA, ProjectItem } from '../data/portfolio';
import { MotionReveal } from './MotionReveal';
import { TiltCard } from './TiltCard';

interface ProjectsProps {
  onOpenDetails: (projectId: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onOpenDetails }) => {
  const { projects } = PORTFOLIO_DATA;
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

  const filteredProjects = projects.filter(p => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'web') return p.category.includes('Web') || p.category.includes('Full-Stack');
    if (filterCategory === 'desktop') return p.category.includes('Desktop') || p.category.includes('Java');
    if (filterCategory === 'database') return p.category.includes('Database') || p.tags.includes('Relational Database');
    return true;
  });

  const renderAbstractMockup = (type: 'netflix' | 'hotel' | 'school' | 'gradexpert') => {
    switch (type) {
      case 'netflix':
        return (
          <div className="w-full h-44 sm:h-52 bg-[#090412] rounded-2xl p-3.5 sm:p-4 border border-purple-500/20 flex flex-col justify-between relative overflow-hidden group/mockup">
            {/* Crimson/Purple Ambient Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-600/25 blur-3xl pointer-events-none group-hover/mockup:bg-rose-600/40 transition-colors" />
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold font-heading text-rose-500 tracking-wider">NETFLIX CLONE</span>
                <span className="text-[10px] text-purple-300/70 font-mono hidden sm:inline">React + Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-slate-300 flex items-center gap-1 border border-white/10">
                  <Search className="w-2.5 h-2.5 text-slate-400" />
                  <span>Browse</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-[9px] text-white font-bold">R</div>
              </div>
            </div>

            {/* Featured Stream Banner */}
            <div className="my-auto p-3 rounded-xl bg-gradient-to-r from-purple-950/90 via-rose-950/60 to-purple-950/90 border border-purple-500/20 flex items-center justify-between shadow-lg transform group-hover/mockup:scale-[1.02] transition-transform">
              <div>
                <div className="text-[9px] font-mono text-rose-300 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Streaming Engine
                </div>
                <div className="text-xs font-bold text-white">Full-Stack Movie Hub</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Authentication • Search • Responsive</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/80 group-hover/mockup:scale-110 group-hover/mockup:bg-rose-500 transition-all cursor-pointer">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
            </div>

            {/* Media Carousel Row */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {['Action', 'Sci-Fi', 'Drama', 'Top 10'].map((genre, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveMediaIndex(i)}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center text-[9px] font-mono transition-all cursor-pointer ${
                    activeMediaIndex === i 
                      ? 'bg-rose-950/80 border border-rose-500/50 text-rose-200' 
                      : 'bg-[#160c2b] border border-purple-500/15 text-purple-300 hover:border-purple-400/40'
                  }`}
                >
                  <Film className="w-3 h-3 text-purple-400/80 mb-0.5" />
                  <span className="truncate max-w-[90%]">{genre}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'hotel':
        return (
          <div className="w-full h-44 sm:h-52 bg-[#090412] rounded-2xl p-3.5 sm:p-4 border border-purple-500/20 flex flex-col justify-between relative overflow-hidden group/mockup">
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/25 blur-3xl pointer-events-none group-hover/mockup:bg-purple-600/40 transition-colors" />
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-purple-500/15 pb-2">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-bold text-slate-200">Hotel Management</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-400/30">
                Java Desktop OOP
              </span>
            </div>

            {/* Occupancy Dashboard Grid */}
            <div className="grid grid-cols-3 gap-2 my-auto">
              <div className="p-2.5 rounded-xl bg-[#160d33] border border-purple-500/20 group-hover/mockup:border-purple-400/40 transition-colors">
                <div className="text-[9px] font-mono text-slate-400">Occupancy</div>
                <div className="text-xs font-bold text-purple-300 mt-0.5">28 / 32 Rooms</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#160d33] border border-purple-500/20 group-hover/mockup:border-emerald-400/40 transition-colors">
                <div className="text-[9px] font-mono text-slate-400">Available</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">4 Suites</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#160d33] border border-purple-500/20 group-hover/mockup:border-cyan-400/40 transition-colors">
                <div className="text-[9px] font-mono text-slate-400">Billing Logic</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">Auto-Invoice</div>
              </div>
            </div>

            {/* Room Matrix Status */}
            <div className="p-2.5 rounded-xl bg-[#120826] border border-purple-500/15 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-3 h-3 text-purple-400" /> Room #204 Deluxe
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Modular OOP Service
              </span>
            </div>
          </div>
        );

      case 'school':
        return (
          <div className="w-full h-44 sm:h-52 bg-[#080410] rounded-2xl p-3.5 sm:p-4 border border-purple-500/20 flex flex-col justify-between relative overflow-hidden group/mockup">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-600/20 blur-3xl pointer-events-none group-hover/mockup:bg-cyan-600/35 transition-colors" />
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-purple-500/15 pb-2">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">School Admin System</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                MySQL + Java
              </span>
            </div>

            {/* Attendance & Timetable Stats */}
            <div className="my-auto space-y-2">
              <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-[#160d33] border border-purple-500/15 group-hover/mockup:border-purple-400/30 transition-colors">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" /> Student Attendance & Records
                </span>
                <span className="font-mono text-emerald-400 font-bold">Normalized 3NF</span>
              </div>
              <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-[#160d33] border border-purple-500/15 group-hover/mockup:border-cyan-400/30 transition-colors">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" /> Class Scheduling Logic
                </span>
                <span className="font-mono text-cyan-300 font-bold">Conflict-Free</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-purple-500/15">
              <span>Relational RDBMS</span>
              <span className="text-purple-300">Java OOP Architecture</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Glass Section Container */}
        <MotionReveal animation="fade-in-up" duration={0.9}>
          <div className="rounded-[32px] p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-[#110724]/90 via-[#0d061b]/95 to-[#080413]/95 border border-purple-500/25 shadow-[0_20px_60px_rgba(15,7,34,0.7)] relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
              <MotionReveal animation="drop-in" delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-400/40 text-xs text-purple-300 font-mono mb-3 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>PORTFOLIO WORK</span>
                </div>
              </MotionReveal>

              <MotionReveal animation="wipe-right" delay={0.25}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  My Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">Projects</span>
                </h2>
              </MotionReveal>

              <MotionReveal animation="blur-in" delay={0.4}>
                <p className="mt-3 text-sm sm:text-base text-slate-300">
                  Full-stack applications, desktop OOP architectures, and database systems engineered with production standards.
                </p>
              </MotionReveal>
            </div>

            {/* Project Category Filter Pills */}
            <MotionReveal animation="pop" delay={0.5}>
              <div className="flex justify-center items-center gap-2 mb-10 pb-4">
                {[
                  { id: 'all', label: 'All Projects' },
                  { id: 'web', label: 'Full-Stack Web' },
                  { id: 'desktop', label: 'Java OOP Desktop' },
                  { id: 'database', label: 'Relational DB' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterCategory(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                      filterCategory === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_5px_15px_rgba(124,58,237,0.4)] border border-purple-400/40 transform scale-105'
                        : 'bg-[#150c33]/80 text-slate-300 hover:text-white border border-purple-500/20 hover:bg-[#1f1245]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </MotionReveal>

            {/* 3-Column Project Cards Grid with 3D Tilt & Alternating Entrance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProjects.map((proj, pIdx) => (
                <MotionReveal
                  key={proj.id}
                  animation="flip-up"
                  delay={0.15 + pIdx * 0.14}
                  className="h-full"
                >
                  <TiltCard maxRotation={6} spotlightColor="rgba(168, 85, 247, 0.2)" className="h-full">
                    <div
                      className="h-full rounded-3xl p-5 sm:p-6 border border-purple-500/20 bg-gradient-to-b from-[#150c33]/90 to-[#0b061a]/95 flex flex-col justify-between group hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-950/70 transition-all duration-300 relative shadow-xl"
                    >
                      <div>
                        {/* Mockup Preview Visual */}
                        <div className="mb-5 overflow-hidden rounded-2xl border border-purple-500/20 group-hover:border-purple-400/40 transition-colors">
                          {renderAbstractMockup(proj.mockupType)}
                        </div>

                        {/* Category & Title */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono text-purple-300 font-semibold px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/25">
                            {proj.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                          {proj.title}
                        </h3>

                        <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {proj.description}
                        </p>

                        {/* Staggered Technology Tags */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {proj.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 text-[11px] rounded-lg bg-[#1a0f3d] text-purple-200 border border-purple-500/20 font-mono transition-all duration-200 group-hover:border-purple-400/30 hover:scale-105 hover:bg-purple-900/40"
                              style={{ transitionDelay: `${idx * 40}ms` }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card CTA with glowing hover */}
                      <div className="mt-6 pt-4 border-t border-purple-500/15">
                        <button
                          onClick={() => onOpenDetails(proj.id)}
                          className="w-full py-3 px-4 rounded-xl bg-[#1c1042] hover:bg-gradient-to-r hover:from-purple-600 hover:to-violet-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-purple-500/25 hover:border-transparent transition-all shadow-md group/btn cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <span>Inspect Architecture</span>
                          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>

                    </div>
                  </TiltCard>
                </MotionReveal>
              ))}
            </div>

          </div>
        </MotionReveal>

      </div>
    </section>
  );
};
