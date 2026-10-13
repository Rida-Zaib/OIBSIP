import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Layers, 
  Compass, 
  ArrowRight,
  Code2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { EASING_BEZIER } from '../animations/variants';
import { MotionReveal } from './MotionReveal';

export const ResearchConstellation: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ai-ml');

  const nodes = [
    {
      id: 'ai-ml',
      name: 'AI & Machine Learning',
      short: 'AI / ML',
      icon: Cpu,
      x: '50%',
      y: '10%',
      color: '#a855f7',
      description: 'Investigating foundational supervised/unsupervised machine learning models, loss convergence, and automated evaluation metrics for real-world decision tasks.',
      status: 'Capstone Application & Research Study',
      keyTopics: ['Model Evaluation (Precision, Recall)', 'Predictive Scoring', 'Regression & Classification']
    },
    {
      id: 'nlp',
      name: 'Natural Language Processing',
      short: 'NLP',
      icon: Brain,
      x: '85%',
      y: '35%',
      color: '#c084fc',
      description: 'Analyzing semantic vector spaces, contextual tokenization, and cosine similarity for automated subjective answer grading in GradExpert.',
      status: 'Active Final Year Implementation',
      keyTopics: ['Semantic Similarity Analysis', 'Text Normalization', 'Automated Rubric Matching']
    },
    {
      id: 'software-systems',
      name: 'Software Systems & Architecture',
      short: 'Systems',
      icon: Layers,
      x: '75%',
      y: '80%',
      color: '#818cf8',
      description: 'Structuring robust, maintainable, and modular software systems adhering to SOLID OOP guidelines, clean separation of concerns, and scalable contracts.',
      status: 'Core Engineering Discipline',
      keyTopics: ['Object-Oriented Design', 'Modular Separation', 'Relational Schemas']
    },
    {
      id: 'cyber-security',
      name: 'Cyber Security',
      short: 'Security',
      icon: ShieldCheck,
      x: '25%',
      y: '80%',
      color: '#38bdf8',
      description: 'Studying defensive engineering principles, secure authentication flows, session encryption, and proactive vulnerability mitigation in client-server apps.',
      status: 'Engineering Interest',
      keyTopics: ['Secure Authentication', 'Access Control (RBAC)', 'Input Sanitization']
    },
    {
      id: 'web-dev',
      name: 'Web & Mobile Development',
      short: 'Web Dev',
      icon: Globe,
      x: '15%',
      y: '35%',
      color: '#ec4899',
      description: 'Building modern responsive web experiences with component-based reactive paradigms, state synchronization, and RESTful API consumption.',
      status: 'Applied in Full-Stack Projects',
      keyTopics: ['React.js Single Page Apps', 'Node.js Backend APIs', 'Responsive Motion & UI']
    }
  ];

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <section id="research" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Glass Section Container */}
        <div className="rounded-[32px] p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-[#110724]/90 via-[#0d061b]/95 to-[#080413]/95 border border-purple-500/25 shadow-[0_20px_60px_rgba(15,7,34,0.7)] relative overflow-hidden">
          
          {/* Header */}
          <MotionReveal animation="clip-up" className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-400/40 text-xs text-purple-300 font-mono mb-3 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>RESEARCH & INQUIRY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              What I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">Exploring</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Interactive knowledge constellation mapping core research interests and engineering domains around software intelligence.
            </p>
          </MotionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT: Visual Interactive Constellation Map (7 cols) */}
            <MotionReveal animation="zoom-in" delay={0.15} className="lg:col-span-7">
              <div className="relative w-full aspect-square max-w-[480px] mx-auto rounded-3xl bg-[#090412] border border-purple-500/25 p-4 flex items-center justify-center overflow-hidden shadow-2xl">
                
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-tech-dots opacity-40" />

                {/* SVG Connecting Vector Lines with self-drawing path animation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>

                  <motion.line 
                    x1="50" y1="50" x2="50" y2="18" 
                    stroke="url(#vectorGrad)" strokeWidth="0.8" strokeDasharray="2,2" 
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.1, ease: EASING_BEZIER }}
                  />
                  <motion.line 
                    x1="50" y1="50" x2="80" y2="38" 
                    stroke="url(#vectorGrad)" strokeWidth="0.8" strokeDasharray="2,2" 
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.25, ease: EASING_BEZIER }}
                  />
                  <motion.line 
                    x1="50" y1="50" x2="72" y2="76" 
                    stroke="url(#vectorGrad)" strokeWidth="0.8" strokeDasharray="2,2" 
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.4, ease: EASING_BEZIER }}
                  />
                  <motion.line 
                    x1="50" y1="50" x2="28" y2="76" 
                    stroke="url(#vectorGrad)" strokeWidth="0.8" strokeDasharray="2,2" 
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.55, ease: EASING_BEZIER }}
                  />
                  <motion.line 
                    x1="50" y1="50" x2="20" y2="38" 
                    stroke="url(#vectorGrad)" strokeWidth="0.8" strokeDasharray="2,2" 
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.7, ease: EASING_BEZIER }}
                  />

                  <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth="0.5" />
                </svg>

                {/* Central Core Node: RIDA ZAIB with scale reveal */}
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: EASING_BEZIER }}
                  className="relative z-20 flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-purple-700 to-violet-500 p-0.5 shadow-xl shadow-purple-600/40 animate-pulse-glow"
                >
                  <div className="w-full h-full rounded-full bg-[#0d071d] flex flex-col items-center justify-center p-2 text-center">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-white tracking-wider">
                      RIDA ZAIB
                    </span>
                    <span className="text-[9px] font-mono text-purple-300 font-semibold mt-0.5">
                      Research Core
                    </span>
                  </div>
                </motion.div>

                {/* Orbiting Interactive Domain Nodes with gentle subtle float */}
                <motion.button
                  onClick={() => setSelectedNodeId('ai-ml')}
                  initial={{ opacity: 0, scale: 0.3 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0 }, default: { type: 'spring', stiffness: 230, damping: 13, delay: 0.90 } }}
                  className={`absolute top-[8%] left-1/2 -translate-x-1/2 z-20 p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 group cursor-pointer ${
                    selectedNodeId === 'ai-ml'
                      ? 'bg-purple-600 border-purple-300 text-white scale-110 shadow-lg shadow-purple-600/50'
                      : 'bg-[#140b2b] border-purple-500/30 text-purple-200 hover:border-purple-300 hover:scale-105'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-purple-300 group-hover:text-white" />
                  <span className="text-xs font-mono font-bold whitespace-nowrap">AI / ML</span>
                </motion.button>

                <motion.button
                  onClick={() => setSelectedNodeId('nlp')}
                  initial={{ opacity: 0, scale: 0.3 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  animate={{ y: [0, 5, 0] }}
                  transition={{ y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }, default: { type: 'spring', stiffness: 230, damping: 13, delay: 1.06 } }}
                  className={`absolute top-[28%] right-[4%] z-20 p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 group cursor-pointer ${
                    selectedNodeId === 'nlp'
                      ? 'bg-violet-600 border-violet-300 text-white scale-110 shadow-lg shadow-violet-600/50'
                      : 'bg-[#140b2b] border-purple-500/30 text-purple-200 hover:border-violet-300 hover:scale-105'
                  }`}
                >
                  <Brain className="w-4 h-4 text-violet-300 group-hover:text-white" />
                  <span className="text-xs font-mono font-bold whitespace-nowrap">NLP</span>
                </motion.button>

                <motion.button
                  onClick={() => setSelectedNodeId('software-systems')}
                  initial={{ opacity: 0, scale: 0.3 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }, default: { type: 'spring', stiffness: 230, damping: 13, delay: 1.22 } }}
                  className={`absolute bottom-[10%] right-[10%] z-20 p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 group cursor-pointer ${
                    selectedNodeId === 'software-systems'
                      ? 'bg-indigo-600 border-indigo-300 text-white scale-110 shadow-lg shadow-indigo-600/50'
                      : 'bg-[#140b2b] border-purple-500/30 text-purple-200 hover:border-indigo-300 hover:scale-105'
                  }`}
                >
                  <Layers className="w-4 h-4 text-indigo-300 group-hover:text-white" />
                  <span className="text-xs font-mono font-bold whitespace-nowrap">Systems</span>
                </motion.button>

                <motion.button
                  onClick={() => setSelectedNodeId('cyber-security')}
                  initial={{ opacity: 0, scale: 0.3 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  animate={{ y: [0, 6, 0] }}
                  transition={{ y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }, default: { type: 'spring', stiffness: 230, damping: 13, delay: 1.38 } }}
                  className={`absolute bottom-[10%] left-[10%] z-20 p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 group cursor-pointer ${
                    selectedNodeId === 'cyber-security'
                      ? 'bg-cyan-600 border-cyan-300 text-white scale-110 shadow-lg shadow-cyan-600/50'
                      : 'bg-[#140b2b] border-purple-500/30 text-purple-200 hover:border-cyan-300 hover:scale-105'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-300 group-hover:text-white" />
                  <span className="text-xs font-mono font-bold whitespace-nowrap">Security</span>
                </motion.button>

                <motion.button
                  onClick={() => setSelectedNodeId('web-dev')}
                  initial={{ opacity: 0, scale: 0.3 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }, default: { type: 'spring', stiffness: 230, damping: 13, delay: 1.54 } }}
                  className={`absolute top-[28%] left-[4%] z-20 p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 group cursor-pointer ${
                    selectedNodeId === 'web-dev'
                      ? 'bg-pink-600 border-pink-300 text-white scale-110 shadow-lg shadow-pink-600/50'
                      : 'bg-[#140b2b] border-purple-500/30 text-purple-200 hover:border-pink-300 hover:scale-105'
                  }`}
                >
                  <Globe className="w-4 h-4 text-pink-300 group-hover:text-white" />
                  <span className="text-xs font-mono font-bold whitespace-nowrap">Web Dev</span>
                </motion.button>

              </div>
            </MotionReveal>

            {/* RIGHT: Detailed Node Insight Panel (5 cols) */}
            <MotionReveal animation="swing-right" delay={0.3} className="lg:col-span-5">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.55, ease: EASING_BEZIER }}
                className="rounded-3xl p-6 sm:p-8 border border-purple-500/25 bg-[#140b2e]/80 shadow-xl"
              >
                
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-400/30">
                    {activeNode.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Node Focus</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {activeNode.name}
                </h3>

                <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {activeNode.description}
                </p>

                {/* Target Topics */}
                <div className="mt-6 space-y-2">
                  <h4 className="text-xs font-mono uppercase text-purple-300 font-semibold tracking-wider">
                    Target Inquiries & Applications
                  </h4>
                  <div className="space-y-1.5">
                    {activeNode.keyTopics.map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-purple-500/15 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Click any node on the constellation to inspect
                  </span>
                </div>

              </motion.div>
            </MotionReveal>

          </div>

        </div>

      </div>
    </section>
  );
};
