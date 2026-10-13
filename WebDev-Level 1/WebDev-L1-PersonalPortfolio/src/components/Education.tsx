import React from 'react';
import { GraduationCap, Award, BookOpen, Calendar, MapPin, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { MotionReveal } from './MotionReveal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import educationImg from '../assets/images/education_academic_visual_1790564538952.webp';
import { EASING_BEZIER } from '../animations/variants';

export const Education: React.FC = () => {
  const { education } = PORTFOLIO_DATA;
  const { ref: sectionRef } = useScrollAnimation({ once: true });

  const credentials = [
    {
      title: "Bachelor of Science in Software Engineering (BSSE)",
      institution: "University of Gujrat",
      period: "2022 – 2026",
      status: "Completed",
      type: "Degree Program",
      badge: "Accredited",
      description: "Rigorous 4-year engineering curriculum spanning Object-Oriented Software Engineering, Algorithm Design, Artificial Intelligence, and Database Systems with consistent academic performance."
    },
    {
      title: "GradExpert — AI-Powered Automated Grading Engine",
      institution: "University Capstone Project",
      period: "2025 – 2026",
      status: "Final Year Capstone",
      type: "Applied Research Project",
      badge: "Spotlight",
      description: "Architecting an NLP-driven evaluation platform automating subjective and objective student assessment with Python and modern web frameworks."
    }
  ];

  const milestones = [
    {
      year: "2022 – 2023",
      title: "Computational & Algorithmic Foundations",
      desc: "Mastered Python, Java OOP, Discrete Structures, and fundamental Data Structures."
    },
    {
      year: "2023 – 2024",
      title: "Database Systems & Desktop Engineering",
      desc: "Engineered relational database management systems (3NF) and modular Java desktop architectures."
    },
    {
      year: "2024 – 2025",
      title: "Full-Stack Web & Software Architecture",
      desc: "Built reactive web applications using React.js and Node.js with scalable RESTful API contracts."
    },
    {
      year: "2025 – 2026",
      title: "AI, NLP & Capstone Engineering",
      desc: "Delving into machine learning fundamentals and developing the GradExpert AI grading engine."
    }
  ];

  return (
    <section id="education" ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Section Card Container with Framer Motion Fade-In-Up */}
        <MotionReveal animation="fade-in-up" once={true} duration={0.8}>
          <div className="rounded-[32px] p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-[#110724]/90 via-[#0d061b]/95 to-[#080413]/95 border border-purple-500/25 shadow-[0_20px_60px_rgba(15,7,34,0.7)] relative overflow-hidden">
            
            {/* Header with Framer Motion Fade-In-Up */}
            <MotionReveal animation="blur-in" delay={0.15} once={true}>
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-400/40 text-xs text-purple-300 font-mono mb-3 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>ACADEMIC FOUNDATION</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Education & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">Credentials</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-300">
                  My academic path and how my skills grew year by year.
                </p>
              </div>
            </MotionReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Academic Credentials & Coursework (7 cols) with Slide-In-Left */}
              <div className="lg:col-span-7 space-y-5">
                
                {credentials.map((item, idx) => (
                  <MotionReveal key={idx} animation="swing-left" delay={0.2 + idx * 0.15} once={true}>
                    <div
                      className="p-6 rounded-2xl bg-[#140b2e]/80 border border-purple-500/20 hover:border-purple-400/50 hover:bg-[#1a0f3b] transition-all duration-300 relative group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl bg-purple-950/90 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                            {/* Pulsing graduation halo */}
                            <div className="absolute inset-0 rounded-xl bg-purple-500/25 blur-md animate-pulse" />
                            <GraduationCap className="w-6 h-6 text-purple-400 relative z-10 animate-pulse" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase text-purple-300 font-semibold px-2 py-0.5 rounded bg-purple-900/60 border border-purple-400/30">
                                {item.type}
                              </span>
                              <span className="text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {item.status}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-white mt-1 group-hover:text-purple-200 transition-colors">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1.5 text-purple-300">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.institution}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.period}
                        </span>
                      </div>
                    </div>
                  </MotionReveal>
                ))}

                {/* Core Coursework Badges */}
                <MotionReveal animation="fade-in-up" delay={0.42} once={true}>
                  <div className="p-5 rounded-2xl bg-[#120826]/70 border border-purple-500/15">
                    <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      Key Coursework & Focus Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {education.coreSubjects.map((subject, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs rounded-xl bg-[#190e38] text-purple-200 border border-purple-500/20 font-medium"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </MotionReveal>

              </div>

              {/* RIGHT COLUMN: Milestones Timeline + 3D Academic Artwork (5 cols) with Slide-In-Right */}
              <div className="lg:col-span-5">
                <MotionReveal animation="swing-right" delay={0.3} once={true}>
                  <div className="p-6 rounded-2xl bg-[#13092b]/60 border border-purple-500/20 space-y-6">
                    
                    {/* Unique 3D Academic Artwork Banner */}
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-purple-500/25 bg-[#0a0515]">
                      <img 
                        src={educationImg} 
                        alt="3D Software Engineering Academic & Degree Credentials" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d071d] via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-purple-200 font-semibold bg-[#120826]/90 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                          Software Engineering Track
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-mono uppercase text-purple-300 font-semibold mb-5 flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        Curriculum Progression Timeline
                      </h3>

                      <div className="relative pl-6 space-y-5">
                        {/* Self-drawing glowing vertical timeline line */}
                        <motion.div 
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: EASING_BEZIER }}
                          style={{ originY: 0 }}
                          className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-500 via-violet-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" 
                        />

                        {milestones.map((m, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 + idx * 0.15, ease: EASING_BEZIER }}
                            className="relative group"
                          >
                            {/* Animated Dot */}
                            <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-[#0d071d] border-2 border-purple-400 group-hover:border-cyan-400 transition-colors flex items-center justify-center shadow-[0_0_6px_rgba(168,85,247,0.4)]">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:bg-cyan-400 transition-colors animate-ping" style={{ animationDuration: '3s' }} />
                            </div>

                            <div>
                              <div className="text-[11px] font-mono font-bold text-cyan-300 mb-0.5">
                                {m.year}
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                                {m.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                {m.desc}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                  </div>
                </MotionReveal>
              </div>

            </div>

          </div>
        </MotionReveal>

      </div>
    </section>
  );
};
