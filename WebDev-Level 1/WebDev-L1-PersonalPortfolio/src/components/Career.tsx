import React from 'react';
import { Target, Sparkles, Compass, Rocket, ArrowRight, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { MotionReveal } from './MotionReveal';

export const Career: React.FC = () => {
  return (
    <section id="career" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Glass Section Container */}
        <div className="rounded-[32px] p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-[#110724]/90 via-[#0d061b]/95 to-[#080413]/95 border border-purple-500/25 shadow-[0_20px_60px_rgba(15,7,34,0.7)] relative overflow-hidden">
          
          {/* Header */}
          <MotionReveal animation="drop-in" className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-400/40 text-xs text-purple-300 font-mono mb-3 shadow-sm">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span>FUTURE HORIZONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Building Toward <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">AI & Software Research</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              A defined engineering roadmap focused on developing robust systems and contributing to impactful applied computing.
            </p>
          </MotionReveal>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            {/* Career Goal Statement from Resume */}
            <MotionReveal animation="blur-in" delay={0.15}>
            <div className="p-6 sm:p-8 rounded-3xl bg-[#140b2e]/80 border border-purple-400/30 relative shadow-xl">
              <div className="text-xs font-mono uppercase text-purple-300 tracking-wider mb-2 font-semibold">
                Core Career Mission
              </div>
              <blockquote className="text-lg sm:text-2xl font-bold text-white leading-relaxed font-heading">
                "{PORTFOLIO_DATA.personal.careerGoal}"
              </blockquote>
              <div className="mt-3 text-xs text-slate-400 font-mono">
                — Grounded in Software Engineering & AI Problem-Solving
              </div>
            </div>
            </MotionReveal>

            {/* 3 Pillars of Growth */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              
              <MotionReveal animation="swing-left" delay={0.35} className="h-full">
              <div className="p-6 rounded-2xl bg-[#140b2e]/60 border border-purple-500/20 hover:border-purple-400/50 hover:bg-[#1a0f3d] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-3">
                  <Cpu className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  Applied Machine Learning
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Advancing from foundational NLP grading pipelines into large-scale contextual language models and automated analysis workflows.
                </p>
              </div>
              </MotionReveal>

              <MotionReveal animation="rise-3d" delay={0.47} className="h-full">
              <div className="p-6 rounded-2xl bg-[#140b2e]/60 border border-purple-500/20 hover:border-purple-400/50 hover:bg-[#1a0f3d] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-3">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  Software Systems
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Engineering resilient, modular microservices and fault-tolerant architectures with strong OOP principles and verified data integrity.
                </p>
              </div>
              </MotionReveal>

              <MotionReveal animation="swing-right" delay={0.59} className="h-full">
              <div className="p-6 rounded-2xl bg-[#140b2e]/60 border border-purple-500/20 hover:border-purple-400/50 hover:bg-[#1a0f3d] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  Security & Reliability
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Integrating proactive cyber defense, secure authentication standards, and strict input validation into user-facing web applications.
                </p>
              </div>
              </MotionReveal>

            </div>

            {/* Aspirational Direction */}
            <MotionReveal animation="wipe-right" delay={0.2}>
            <div className="p-5 rounded-2xl bg-[#160c33]/80 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping shrink-0" />
                <p className="text-xs sm:text-sm text-slate-200">
                  <strong className="text-purple-300">Aspirational Goal:</strong> Seeking high-impact opportunities such as the Google Student Researcher program to learn from world-class engineering teams and build AI-backed software.
                </p>
              </div>

              <a
                href="#contact"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-semibold whitespace-nowrap shadow-[0_8px_20px_rgba(124,58,237,0.4)] flex items-center gap-1.5 shrink-0 transition-all transform hover:-translate-y-0.5"
              >
                <span>Initiate Discussion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            </MotionReveal>

          </div>

        </div>

      </div>
    </section>
  );
};
