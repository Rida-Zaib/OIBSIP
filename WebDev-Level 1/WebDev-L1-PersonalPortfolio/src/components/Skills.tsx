import React, { useState } from 'react';
import { 
  Code2, 
  Globe, 
  Cpu, 
  Database, 
  Wrench, 
  Brain, 
  Sparkles, 
  Search, 
  Terminal, 
  Check, 
  Layers
} from 'lucide-react';
import { PORTFOLIO_DATA, SkillCategory } from '../data/portfolio';
import { TiltCard } from './TiltCard';
import { MotionReveal, MotionStaggerContainer, MotionStaggerItem } from './MotionReveal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const { ref: sectionRef } = useScrollAnimation({ once: true });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return Code2;
      case 'Globe': return Globe;
      case 'Cpu': return Cpu;
      case 'Database': return Database;
      case 'Wrench': return Wrench;
      case 'Brain': return Brain;
      default: return Layers;
    }
  };

  const categories = PORTFOLIO_DATA.skillsCategories;

  const filteredCategories = categories.map(cat => {
    if (selectedCategory !== 'all' && cat.title !== selectedCategory) {
      return null;
    }
    
    const filteredSkills = cat.skills.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.badge && s.badge.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filteredSkills.length === 0 && searchQuery.trim() !== '') {
      return null;
    }

    return {
      ...cat,
      skills: filteredSkills
    };
  }).filter(Boolean) as SkillCategory[];

  const totalSkillCount = categories.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <section id="skills" ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Glass Section Container with Framer Motion Fade-In-Up */}
        <MotionReveal animation="zoom-in" once={true} duration={0.9}>
          <div className="rounded-[32px] p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-[#110724]/90 via-[#0d061b]/95 to-[#080413]/95 border border-purple-500/25 shadow-[0_20px_60px_rgba(15,7,34,0.7)] relative overflow-hidden">
            
            {/* Header with Framer Motion Fade-In-Up */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
              <MotionReveal animation="pop" delay={0.1} once={true}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-400/40 text-xs text-purple-300 font-mono mb-3 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>TECHNICAL ARSENAL</span>
                </div>
              </MotionReveal>

              <MotionReveal animation="clip-up" delay={0.2} once={true}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">Technologies</span>
                </h2>
              </MotionReveal>

              <MotionReveal animation="blur-in" delay={0.35} once={true}>
                <p className="mt-3 text-sm sm:text-base text-slate-300">
                  Languages, frameworks, systems, and engineering practices applied across real applications.
                </p>
              </MotionReveal>
            </div>

            {/* Filter Bar & Search with Slide-In-Down */}
            <MotionReveal animation="drop-in" delay={0.45} once={true}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-purple-500/15">
                
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_5px_15px_rgba(124,58,237,0.4)] border border-purple-400/40 transform scale-105'
                        : 'bg-[#150c33]/80 text-slate-300 hover:text-white border border-purple-500/20 hover:bg-[#1f1245]'
                    }`}
                  >
                    All Skills ({totalSkillCount})
                  </button>
                  {categories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(cat.title)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                        selectedCategory === cat.title
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_5px_15px_rgba(124,58,237,0.4)] border border-purple-400/40 transform scale-105'
                          : 'bg-[#150c33]/80 text-slate-300 hover:text-white border border-purple-500/20 hover:bg-[#1f1245]'
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>

                {/* Quick Search */}
                <div className="relative w-full md:w-64 shrink-0">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search technologies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#150c33]/90 border border-purple-500/25 focus:border-purple-400 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
                  />
                </div>

              </div>
            </MotionReveal>

            {/* Skill Category Cards Grid with Framer Motion Stagger */}
            <MotionStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.09}>
              {filteredCategories.map((category, catIdx) => {
                const IconComp = getCategoryIcon(category.iconName);
                return (
                  <MotionStaggerItem key={catIdx} animation="pop">
                    <TiltCard maxRotation={6} spotlightColor="rgba(168, 85, 247, 0.2)" className="h-full">
                      <div
                        className="h-full rounded-3xl p-6 border border-purple-500/20 bg-gradient-to-b from-[#150c33]/80 to-[#0b061a]/90 relative flex flex-col justify-between group hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-950/60 transition-all duration-300"
                      >
                        <div>
                          {/* Category Header */}
                          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-purple-500/15">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-inner group-hover:scale-110 group-hover:rotate-6 group-hover:bg-purple-900 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300">
                                <IconComp className="w-5 h-5 text-purple-400 group-hover:text-white transition-colors" />
                              </div>
                              <div>
                                <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                                  {category.title}
                                </h3>
                                <p className="text-[11px] text-slate-400 line-clamp-1">
                                  {category.description}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Skills Items */}
                          <div className="space-y-2.5 mt-4">
                            {category.skills.map((skill, sIdx) => {
                              const isHover = hoveredSkill === `${catIdx}-${sIdx}`;
                              return (
                                <div
                                  key={sIdx}
                                  onMouseEnter={() => setHoveredSkill(`${catIdx}-${sIdx}`)}
                                  onMouseLeave={() => setHoveredSkill(null)}
                                  className={`p-3 rounded-xl transition-all duration-200 cursor-default ${
                                    isHover 
                                      ? 'bg-[#261754] border border-purple-400/50 shadow-md transform translate-x-1' 
                                      : 'bg-[#190e38]/70 border border-purple-500/15 hover:border-purple-400/30'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isHover ? 'bg-cyan-400 animate-ping' : 'bg-purple-400'}`} />
                                      <span className="text-xs font-bold text-slate-100">
                                        {skill.name}
                                      </span>
                                    </div>
                                    {skill.badge && (
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-200 border border-purple-400/30">
                                        {skill.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed pl-3.5">
                                    {skill.description}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Footer Count Tag */}
                        <div className="mt-5 pt-3 border-t border-purple-500/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>{category.skills.length} Competencies</span>
                          <span className="text-purple-300 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Production Focus
                          </span>
                        </div>
                      </div>
                    </TiltCard>
                  </MotionStaggerItem>
                );
              })}
            </MotionStaggerContainer>

            {filteredCategories.length === 0 && (
              <div className="text-center py-12 rounded-2xl bg-[#140b2e]/60 border border-purple-500/20">
                <p className="text-sm text-slate-300">
                  No matching skills found for "<span className="text-purple-300 font-mono">{searchQuery}</span>"
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-purple-600 text-xs text-white font-medium hover:bg-purple-500 cursor-pointer"
                >
                  Clear Search Filter
                </button>
              </div>
            )}

          </div>
        </MotionReveal>

      </div>
    </section>
  );
};
