import React from 'react';
import { Brain, Code2, Globe, Sparkles, MapPin, User, GraduationCap, Compass, Layers, ArrowRight, MessageSquare, CheckCircle } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import avatarImg from '../assets/images/rida_3d_developer_avatar_1790488386095.webp';
import { TiltCard } from './TiltCard';
import { MotionReveal, MotionStaggerContainer, MotionStaggerItem } from './MotionReveal';
import { CountUp } from './MotionExtras';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const About: React.FC = () => {
  const { ref: sectionRef } = useScrollAnimation({ once: true });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const domainCards = [
    {
      title: "Software Engineering",
      tag: "Systems & OOP",
      desc: "Architecting modular, maintainable systems using clean Object-Oriented principles and solid design patterns.",
      icon: Layers,
      accent: "text-purple-400",
      border: "border-purple-500/25",
      bg: "from-purple-950/40 to-transparent",
      spotlight: "rgba(168, 85, 247, 0.25)"
    },
    {
      title: "AI & Machine Learning",
      tag: "Applied NLP",
      desc: "Applying Natural Language Processing and algorithmic grading logic to academic evaluation workflows in GradExpert.",
      icon: Brain,
      accent: "text-fuchsia-400",
      border: "border-fuchsia-500/25",
      bg: "from-fuchsia-950/40 to-transparent",
      spotlight: "rgba(217, 70, 239, 0.25)"
    },
    {
      title: "Full-Stack Development",
      tag: "Modern Web",
      desc: "Building reactive, high-performance web applications with React.js, Node.js, and structured RESTful services.",
      icon: Globe,
      accent: "text-cyan-400",
      border: "border-cyan-500/25",
      bg: "from-cyan-950/40 to-transparent",
      spotlight: "rgba(6, 182, 212, 0.25)"
    },
    {
      title: "Applied Research",
      tag: "Exploration",
      desc: "Investigating the convergence of machine learning, system design, and security for practical computing challenges.",
      icon: Compass,
      accent: "text-violet-400",
      border: "border-violet-500/25",
      bg: "from-violet-950/40 to-transparent",
      spotlight: "rgba(139, 92, 246, 0.25)"
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Glass Section Container with Framer Motion Fade-In-Up */}
        <MotionReveal animation="blur-in" once={true}>
          <div className="rounded-[32px] p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-[#110724]/90 via-[#0d061b]/95 to-[#080413]/95 border border-purple-500/25 shadow-[0_20px_60px_rgba(15,7,34,0.7)] relative overflow-hidden">
            
            {/* Top subtle highlight shimmer */}
            <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* LEFT COLUMN: 3D Developer Character Mascot with Framer Motion Slide-In-Left */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <MotionReveal animation="swing-left" delay={0.15} once={true} className="w-full flex flex-col items-center">
                  <TiltCard maxRotation={10} spotlightColor="rgba(168, 85, 247, 0.25)" className="w-full max-w-[340px]">
                    <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-b from-[#1c103e]/70 to-[#0d071d]/80 border border-purple-500/30 p-4 flex items-center justify-center shadow-2xl shadow-purple-950/80 group">
                      
                      {/* Backlight glow */}
                      <div className="absolute inset-0 bg-purple-600/20 blur-2xl rounded-3xl -z-10 group-hover:bg-purple-600/35 transition-colors duration-500" />
                      
                      {/* Character Image */}
                      <div className="relative w-full h-full flex items-center justify-center animate-float-slow">
                        <img
                          src={avatarImg}
                          alt="Rida Zaib 3D Developer Mascot"
                          className="w-[90%] h-[90%] object-contain rounded-2xl drop-shadow-[0_15px_30px_rgba(124,58,237,0.4)] transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Floating status tag */}
                      <div className="absolute -bottom-3 px-4 py-1.5 rounded-full bg-[#160c33] border border-purple-400/40 shadow-lg text-xs font-mono text-purple-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Open to Opportunities</span>
                      </div>
                    </div>
                  </TiltCard>

                  {/* Quick Info Tags */}
                  <div className="mt-7 flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-[#140b2e] border border-purple-500/20 text-xs font-mono text-purple-300 flex items-center gap-1.5 transition-transform hover:scale-105">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      {PORTFOLIO_DATA.personal.location}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-[#140b2e] border border-purple-500/20 text-xs font-mono text-purple-300 flex items-center gap-1.5 transition-transform hover:scale-105">
                      <Code2 className="w-3.5 h-3.5 text-purple-400" />
                      AI/ML • Full-Stack
                    </span>
                  </div>
                </MotionReveal>
              </div>

              {/* RIGHT COLUMN: About Narrative & Stats Boxes with Framer Motion Slide-In-Right / Fade-In-Up */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                
                {/* Category Pill */}
                <MotionReveal animation="drop-in" delay={0.1} once={true}>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-400/40 text-xs text-purple-300 font-mono mb-4 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    <span>ABOUT ME</span>
                  </div>
                </MotionReveal>

                {/* Section Headline */}
                <MotionReveal animation="wipe-right" delay={0.25} once={true}>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Engineering Ideas Into{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">
                      Reliable Software
                    </span>
                  </h2>
                </MotionReveal>

                {/* Bio description */}
                <MotionReveal animation="blur-in" delay={0.4} once={true}>
                  <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                    {PORTFOLIO_DATA.personal.bio}
                  </p>

                  <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    Passionate about applying software engineering discipline and machine learning fundamentals to solve practical challenges, from automated evaluation systems to enterprise database management.
                  </p>
                </MotionReveal>

                {/* 3 Prominent Stat / Highlights Boxes with Tilt */}
                <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 w-full">
                  <MotionReveal animation="pop" delay={0.3+0.25} once={true}>
                    <TiltCard maxRotation={6} scaleOnHover={1.04} spotlightColor="rgba(168, 85, 247, 0.2)">
                      <div className="p-4 rounded-2xl bg-[#150c33]/80 border border-purple-500/20 text-center hover:border-purple-400/40 transition-colors">
                        <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white"><CountUp to={4} suffix="+" /></div>
                        <div className="text-[11px] sm:text-xs text-purple-300/80 font-mono mt-0.5">Core Projects</div>
                      </div>
                    </TiltCard>
                  </MotionReveal>

                  <MotionReveal animation="pop" delay={0.36+0.25} once={true}>
                    <TiltCard maxRotation={6} scaleOnHover={1.04} spotlightColor="rgba(6, 182, 212, 0.2)">
                      <div className="p-4 rounded-2xl bg-[#150c33]/80 border border-purple-500/20 text-center hover:border-cyan-400/40 transition-colors">
                        <div className="text-2xl sm:text-3xl font-extrabold font-heading text-cyan-300"><CountUp to={6} suffix="+" /></div>
                        <div className="text-[11px] sm:text-xs text-purple-300/80 font-mono mt-0.5">Tech Domains</div>
                      </div>
                    </TiltCard>
                  </MotionReveal>

                  <MotionReveal animation="pop" delay={0.42+0.25} once={true}>
                    <TiltCard maxRotation={6} scaleOnHover={1.04} spotlightColor="rgba(139, 92, 246, 0.2)">
                      <div className="p-4 rounded-2xl bg-[#150c33]/80 border border-purple-500/20 text-center hover:border-purple-400/40 transition-colors">
                        <div className="text-2xl sm:text-3xl font-extrabold font-heading text-purple-300"><CountUp from={2018} to={2026} /></div>
                        <div className="text-[11px] sm:text-xs text-purple-300/80 font-mono mt-0.5">Grad Year</div>
                      </div>
                    </TiltCard>
                  </MotionReveal>
                </div>

                {/* CTA Buttons */}
                <MotionReveal animation="fade-in-up" delay={0.48} once={true}>
                  <div className="mt-8 flex items-center gap-4">
                    <button
                      onClick={() => scrollTo('contact')}
                      className="btn-glow-interactive px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-sm shadow-[0_10px_25px_rgba(124,58,237,0.45)] transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                    >
                      <span>Let's Talk</span>
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => scrollTo('skills')}
                      className="px-5 py-3 rounded-2xl bg-[#140b2e]/80 hover:bg-[#1f1245] border border-purple-500/30 text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <span>Explore Skills</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </MotionReveal>

              </div>

            </div>

            {/* 4 Competency Cards Row underneath with Framer Motion Stagger */}
            <MotionStaggerContainer className="mt-14 pt-10 border-t border-purple-500/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.1}>
              {domainCards.map((card, idx) => {
                const IconComp = card.icon;
                return (
                  <MotionStaggerItem key={idx} animation="flip-up">
                    <TiltCard maxRotation={8} spotlightColor={card.spotlight} className="h-full">
                      <div
                        className={`h-full p-5 rounded-2xl bg-gradient-to-b ${card.bg} border ${card.border} hover:border-purple-400/50 hover:bg-[#180e38] transition-all duration-300 flex flex-col justify-between group shadow-lg`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 rounded-xl bg-[#120826] border border-purple-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-950/80 transition-all">
                              <IconComp className={`w-5 h-5 ${card.accent}`} />
                            </div>
                            <span className="text-[10px] font-mono text-purple-300/80 px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/20">
                              {card.tag}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
                            {card.title}
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    </TiltCard>
                  </MotionStaggerItem>
                );
              })}
            </MotionStaggerContainer>

          </div>
        </MotionReveal>

      </div>
    </section>
  );
};
