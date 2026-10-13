import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  Sliders, 
  ArrowRight, 
  Layers, 
  Zap, 
  BarChart2, 
  Search,
  ExternalLink
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { MotionReveal } from './MotionReveal';

interface FeaturedProjectProps {
  onOpenDetails?: (projectId: string) => void;
}

interface PipelineNode {
  id: string;
  name: string;
  shortName: string;
  role: string;
  badge: string;
  formula: string;
  metric: string;
}

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: 'submission',
    name: '1. Student Submission',
    shortName: 'Input Intake',
    role: 'Raw Text Parser & Preprocessor',
    badge: 'Input String',
    formula: 'T_norm = clean(strip(T_raw))',
    metric: '48 words • 286 chars'
  },
  {
    id: 'tokenizer',
    name: '2. Tokenizer & Embeddings',
    shortName: 'Vector Embeddings',
    role: 'Dense Vector & Lemmatization',
    badge: 'BERT / TF-IDF',
    formula: 'v_e = DenseEmbed(tokens)',
    metric: 'dim: 512-d float32'
  },
  {
    id: 'cosine',
    name: '3. Cosine Similarity Matrix',
    shortName: 'Cosine Matrix',
    role: 'High-dimensional dot product',
    badge: 'Vector Overlap',
    formula: 'cos(θ) = (A · B) / (||A|| ||B||)',
    metric: 'Similarity: 0.941'
  },
  {
    id: 'rubric',
    name: '4. Semantic Rubric Score',
    shortName: 'Rubric Scoring',
    role: 'Weighted Criterion Evaluation',
    badge: 'Weighted Loss',
    formula: 'Score = ∑ w_i · C_i(match)',
    metric: '94 / 100 Grade'
  },
  {
    id: 'feedback',
    name: '5. Feedback Generator',
    shortName: 'Diagnostic Output',
    role: 'Formative Diagnostic Synthesis',
    badge: 'Auto Feedback',
    formula: 'FB = Synthesize(Δ_concepts)',
    metric: 'Ready for Review'
  }
];

interface TestPreset {
  id: string;
  label: string;
  score: number;
  cosineSim: number;
  answerText: string;
  evaluationQuality: string;
  feedback: string;
}

const TEST_PRESETS: TestPreset[] = [
  {
    id: 'high',
    label: 'Exemplary Response (94%)',
    score: 94,
    cosineSim: 94,
    answerText: 'Loose coupling reduces inter-dependencies between system modules, enabling independent updates, automated testing, and scalable architecture without breaking consumers.',
    evaluationQuality: 'High Semantic Alignment',
    feedback: 'Accurately articulated decoupling benefits, modular boundaries, and maintainability. Full credit awarded for conceptual synthesis.'
  },
  {
    id: 'medium',
    label: 'Partial Response (76%)',
    score: 76,
    cosineSim: 78,
    answerText: 'Loose coupling means classes do not depend on each other too much so you can change one class easily.',
    evaluationQuality: 'Moderate Semantic Alignment',
    feedback: 'Correct fundamental intuition, but lacks elaboration on system scalability, testing isolation, and interface abstraction.'
  },
  {
    id: 'low',
    label: 'Misconception (41%)',
    score: 41,
    cosineSim: 43,
    answerText: 'Loose coupling means having all code in one main file so variables can be accessed everywhere.',
    evaluationQuality: 'Semantic Divergence Detected',
    feedback: 'Confuses loose coupling with tight coupling / monolithic state. Recommended review of OOP Encapsulation and Separation of Concerns.'
  }
];

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ onOpenDetails }) => {
  const { featuredProject } = PORTFOLIO_DATA;
  const [activeTab, setActiveTab] = useState<'pipeline' | 'nlp' | 'instructor' | 'rubric'>('pipeline');
  const [activeNodeIdx, setActiveNodeIdx] = useState<number>(2); // Cosine Similarity Matrix active
  const [activePreset, setActivePreset] = useState<TestPreset>(TEST_PRESETS[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(4);
  const [simulatedScore, setSimulatedScore] = useState<number>(94);
  const [semanticMatch, setSemanticMatch] = useState<number>(91);

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(0);
    setActiveNodeIdx(0);

    const stepInterval = setInterval(() => {
      setSimStep((prev) => {
        const next = prev + 1;
        setActiveNodeIdx(next);
        if (next >= PIPELINE_NODES.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => setIsSimulating(false), 500);
          return PIPELINE_NODES.length - 1;
        }
        return next;
      });
    }, 450);
  };

  const handleSelectPreset = (preset: TestPreset) => {
    setActivePreset(preset);
    setSimulatedScore(preset.score);
    setSemanticMatch(preset.cosineSim);
  };

  return (
    <section id="featured" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Glass Section Container */}
        <MotionReveal animation="rise-3d" delay={0.1}>
          <div className="rounded-[32px] p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-[#110724]/90 via-[#0d061b]/95 to-[#080413]/95 border border-purple-500/25 shadow-[0_20px_60px_rgba(15,7,34,0.7)] relative overflow-hidden">
            
            {/* Header */}
            <MotionReveal animation="blur-in" delay={0.3}>
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-400/40 text-xs text-purple-300 font-mono mb-3 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>CAPSTONE SPOTLIGHT</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">Project</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-300">
                  Automating academic assessment through intelligent Natural Language Processing and modular web architecture.
                </p>
              </div>
            </MotionReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* LEFT COLUMN: Interactive Academic Grading Dashboard Mockup (7 cols) */}
              <div className="lg:col-span-7">
                <MotionReveal animation="swing-left" delay={0.3}>
                  <div className="rounded-2xl border border-purple-500/30 bg-[#090412] overflow-hidden shadow-2xl relative">
                    
                    {/* Mockup Window Header */}
                    <div className="px-4 py-3 bg-[#130d26] border-b border-purple-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        <span className="ml-2 text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-purple-400" />
                          GradExpert Engine Dashboard v1.0
                        </span>
                      </div>
                      
                      {/* Mockup Tabs */}
                      <div className="flex items-center gap-1 bg-[#090514] p-1 rounded-lg border border-purple-500/15 overflow-x-auto scrollbar-none">
                        <button
                          onClick={() => setActiveTab('pipeline')}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                            activeTab === 'pipeline'
                              ? 'bg-purple-600 text-white font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span>AI Pipeline</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('nlp')}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all whitespace-nowrap ${
                            activeTab === 'nlp'
                              ? 'bg-purple-600 text-white font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          NLP Engine
                        </button>
                        <button
                          onClick={() => setActiveTab('instructor')}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all whitespace-nowrap ${
                            activeTab === 'instructor'
                              ? 'bg-purple-600 text-white font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Instructor
                        </button>
                        <button
                          onClick={() => setActiveTab('rubric')}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all whitespace-nowrap ${
                            activeTab === 'rubric'
                              ? 'bg-purple-600 text-white font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Rubric
                        </button>
                      </div>
                    </div>

                    {/* Mockup Body Content */}
                    <div className="p-5 sm:p-6 space-y-4">
                      
                      {/* Subject & Assessment Banner */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-[#160e30] border border-purple-500/20">
                        <div>
                          <div className="text-[10px] font-mono uppercase text-purple-300">Assessment #CS-302</div>
                          <div className="text-sm font-bold text-white">Software Architecture & System Design Exam</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono">
                            Auto-Graded
                          </span>
                          <span className="text-xs font-mono font-bold text-white px-2.5 py-1 rounded-full bg-purple-600">
                            {simulatedScore} / 100
                          </span>
                        </div>
                      </div>

                      {/* TAB 1: AI PIPELINE FLOW VISUALIZATION */}
                      {activeTab === 'pipeline' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                          
                          {/* Interactive Flow Nodes */}
                          <div className="p-3.5 rounded-xl bg-[#100824] border border-purple-500/20">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[11px] font-mono text-purple-300 uppercase font-semibold flex items-center gap-1.5">
                                <Brain className="w-3.5 h-3.5 text-purple-400" />
                                End-to-End Automated Grading Flow
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                {isSimulating ? `Processing Stage ${simStep + 1}/5...` : 'Pipeline Operational'}
                              </span>
                            </div>

                            {/* Horizontal Pipeline Steps */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                              {PIPELINE_NODES.map((node, idx) => {
                                const isActive = activeNodeIdx === idx;
                                const isPassed = simStep >= idx;
                                return (
                                  <button
                                    key={node.id}
                                    onClick={() => setActiveNodeIdx(idx)}
                                    className={`p-2.5 rounded-xl text-left transition-all duration-300 relative border cursor-pointer ${
                                      isActive
                                        ? 'bg-gradient-to-b from-[#2a175c] to-[#1c0f40] border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-[1.03]'
                                        : isPassed
                                        ? 'bg-[#150c33] border-purple-500/30 hover:border-purple-400/50'
                                        : 'bg-[#0d061c] border-purple-500/15 opacity-60'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <span className="text-[9px] font-mono text-purple-300/80 font-bold">0{idx + 1}</span>
                                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-purple-500'}`} />
                                    </div>
                                    <div className="text-[11px] font-bold text-white leading-tight truncate">
                                      {node.shortName}
                                    </div>
                                    <div className="text-[9px] font-mono text-purple-300/70 truncate mt-0.5">
                                      {node.badge}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Active Node Deep-Dive Inspection */}
                            <div className="mt-3 p-3 rounded-lg bg-[#0a0517] border border-purple-500/20 text-xs font-mono space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-purple-300 font-bold">
                                  {PIPELINE_NODES[activeNodeIdx].name}
                                </span>
                                <span className="text-emerald-400 text-[10px]">
                                  {PIPELINE_NODES[activeNodeIdx].metric}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-300 font-sans">
                                {PIPELINE_NODES[activeNodeIdx].role}
                              </div>
                              <div className="p-2 rounded bg-[#12082b] text-[10px] text-cyan-300 border border-purple-500/20 flex items-center justify-between">
                                <span>Formula: <code className="text-white">{PIPELINE_NODES[activeNodeIdx].formula}</code></span>
                                <span className="text-purple-400">Latency: ~24ms</span>
                              </div>
                            </div>
                          </div>

                          {/* Test Simulator: Select Preset Answers */}
                          <div className="p-3.5 rounded-xl bg-[#120a28] border border-purple-500/20 space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                                Test Candidate Submissions:
                              </span>
                              
                              <button
                                onClick={runSimulation}
                                disabled={isSimulating}
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                              >
                                <Zap className="w-3 h-3 text-amber-300" />
                                <span>{isSimulating ? 'Grading...' : 'Run Pipeline'}</span>
                              </button>
                            </div>

                            {/* Preset Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {TEST_PRESETS.map((preset) => (
                                <button
                                  key={preset.id}
                                  onClick={() => handleSelectPreset(preset)}
                                  className={`p-2 rounded-lg text-left text-xs font-mono transition-all border cursor-pointer ${
                                    activePreset.id === preset.id
                                      ? 'bg-purple-900/60 border-purple-400 text-white font-bold'
                                      : 'bg-[#0d071f] border-purple-500/20 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <div className="truncate text-[10px]">{preset.label}</div>
                                  <div className="text-[9px] text-cyan-300 mt-0.5">Score: {preset.score}/100</div>
                                </button>
                              ))}
                            </div>

                            {/* Simulated Answer & Live AI Feedback */}
                            <div className="p-2.5 rounded-lg bg-[#070410] border border-purple-500/15 text-xs">
                              <div className="text-[10px] font-mono text-purple-300 font-semibold mb-1">
                                Candidate Answer:
                              </div>
                              <p className="text-slate-300 font-mono text-[11px] italic">
                                "{activePreset.answerText}"
                              </p>
                              
                              <div className="mt-2 pt-2 border-t border-purple-500/15 flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <div className="text-[10px] font-mono text-slate-300">
                                  <span className="text-purple-300 font-bold">AI Diagnostic Feedback: </span>
                                  {activePreset.feedback}
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>
                      )}

                      {activeTab === 'nlp' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                          {/* Sample Question & Subjective Evaluation */}
                          <div className="p-3.5 rounded-xl bg-[#100924] border border-purple-500/15">
                            <div className="text-[11px] font-mono text-purple-300 font-semibold mb-1">
                              Question: Explain loose coupling in software architecture.
                            </div>
                            <div className="p-2.5 rounded-lg bg-[#07040e] text-xs text-slate-300 font-mono border border-purple-500/10">
                              "Loose coupling reduces inter-dependencies between system modules, enabling independent updates, testing, and scalability."
                            </div>
                          </div>

                          {/* NLP Analytics Matrix */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-[#140c2e] border border-purple-500/20">
                              <div className="text-[10px] font-mono text-slate-400">Semantic Cosine Sim</div>
                              <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">{semanticMatch}%</div>
                              <div className="w-full h-1.5 bg-purple-950 rounded-full mt-1.5 overflow-hidden">
                                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${semanticMatch}%` }} />
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-[#140c2e] border border-purple-500/20">
                              <div className="text-[10px] font-mono text-slate-400">Contextual Match</div>
                              <div className="text-lg font-bold text-purple-300 font-mono mt-0.5">High (0.94)</div>
                              <div className="w-full h-1.5 bg-purple-950 rounded-full mt-1.5 overflow-hidden">
                                <div className="h-full bg-purple-400 rounded-full" style={{ width: '94%' }} />
                              </div>
                            </div>

                            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#140c2e] border border-purple-500/20">
                              <div className="text-[10px] font-mono text-slate-400">Evaluation Speed</div>
                              <div className="text-lg font-bold text-emerald-300 font-mono mt-0.5">~120ms</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-1">Python Engine</div>
                            </div>
                          </div>

                          {/* Interactive Slider to Test NLP Evaluation Sensitivity */}
                          <div className="p-3 rounded-xl bg-[#120a26] border border-purple-500/15">
                            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                              <span className="flex items-center gap-1.5">
                                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                                NLP Grading Rigor Sensitivity:
                              </span>
                              <span className="text-purple-300 font-bold">{semanticMatch}% Match Threshold</span>
                            </div>
                            <input
                              type="range"
                              min="70"
                              max="99"
                              value={semanticMatch}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setSemanticMatch(val);
                                setSimulatedScore(Math.round(val * 1.02));
                              }}
                              className="w-full accent-purple-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === 'instructor' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <div className="p-3.5 rounded-xl bg-[#100924] border border-purple-500/15">
                            <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                              <span>Batch Grading Queue (48 Submissions)</span>
                              <span className="text-xs font-mono text-emerald-400">100% Processed</span>
                            </div>
                            <div className="space-y-2">
                              {[
                                { name: "Assignment 1 — OOP Class Design", status: "Completed", avg: "88/100" },
                                { name: "Quiz 2 — NLP Tokenization & Parsing", status: "Completed", avg: "92/100" },
                                { name: "Final Lab — Relational DB Querying", status: "Completed", avg: "86/100" }
                              ].map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#180f33] border border-purple-500/10">
                                <span className="text-slate-200">{item.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-purple-300">{item.avg}</span>
                                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'rubric' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="p-3.5 rounded-xl bg-[#100924] border border-purple-500/15">
                          <div className="text-xs font-bold text-white mb-2">Grading Engine Rubric Breakdown</div>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#180f33]">
                              <span className="text-slate-200">Objective MCQ Exact Match</span>
                              <span className="font-mono text-purple-300 font-bold">100% Deterministic</span>
                            </div>
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#180f33]">
                              <span className="text-slate-200">Subjective Concept Extraction</span>
                              <span className="font-mono text-cyan-300 font-bold">NLP Semantic Vector</span>
                            </div>
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#180f33]">
                              <span className="text-slate-200">Grammar & Structure Weight</span>
                              <span className="font-mono text-slate-400 font-bold">Configurable (0–20%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-center font-mono text-slate-500 pt-2 border-t border-purple-500/10">
                      * Interactive abstract demonstration of GradExpert AI automated evaluation engine.
                    </div>

                  </div>
                </div>
              </MotionReveal>
            </div>

            {/* RIGHT COLUMN: Project Details, Capabilities & Tech (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <MotionReveal animation="swing-right" delay={0.45}>
                <div>
                  <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-purple-900/70 text-purple-200 border border-purple-400/40">
                    {featuredProject.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-tight">
                    {featuredProject.title}
                  </h3>
                  <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                    {featuredProject.description}
                  </p>
                </div>

                {/* Key Capabilities */}
                <div className="mt-6 space-y-2.5">
                  <h4 className="text-xs font-mono uppercase text-purple-300 font-semibold tracking-wider">
                    Key Capabilities
                  </h4>
                  {featuredProject.capabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>

                {/* Technology Tags */}
                <div className="mt-6">
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2.5">
                    Technologies Utilized
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredProject.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs rounded-xl bg-[#190f36] text-purple-200 border border-purple-400/30 font-mono font-medium shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  {onOpenDetails && (
                    <button
                      onClick={() => onOpenDetails('gradexpert')}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-xs shadow-[0_10px_25px_rgba(124,58,237,0.45)] flex items-center gap-2 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                    >
                      <span>Inspect System Architecture</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <a
                    href="#contact"
                    className="px-5 py-3 rounded-2xl bg-[#140d2b] hover:bg-[#1d133d] border border-purple-500/30 text-slate-200 text-xs font-medium transition-all"
                  >
                    Discuss Project
                  </a>
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
