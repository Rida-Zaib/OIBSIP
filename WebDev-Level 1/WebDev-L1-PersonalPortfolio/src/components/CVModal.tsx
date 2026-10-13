import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  MapPin, 
  Mail, 
  Linkedin, 
  Check, 
  Copy, 
  FileText,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Code2,
  Terminal,
  Sparkles,
  Award,
  Globe,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CV_PLAIN_TEXT = `
RIDA ZAIB
Software Engineer | AI & Systems Developer
Email: ridazaibb04@gmail.com | Location: Punjab, Pakistan | LinkedIn: www.linkedin.com/in/rida-zaib

OBJECTIVE
Software Engineering graduate with hands-on experience building full-stack applications and applying AI to real-world problems. Seeking a Google Student Researcher position to contribute to research in machine learning and software systems while continuing academic study in Computer Science.

EDUCATION
University of Gujrat
BS Software Engineering (2022 – 2026) — Degree Completed
Core Subjects: Data Structures & Algorithms, Object-Oriented Software Engineering, Database Systems, Artificial Intelligence, Software Architecture, Web Engineering.

PROJECTS
1. GradExpert — Final Year Project (2025–2026)
   - Architected an AI-powered evaluation system automating assessment of subjective and objective exam questions.
   - Implemented Natural Language Processing (NLP) semantic cosine similarity algorithms to evaluate conceptual answer correctness.
   - Built interactive instructor management dashboard with real-time scoring rubrics, batch evaluation queues, and performance analytics.
   - Stack: Python, NLP, FastAPI, React.js, Tailwind CSS, PostgreSQL/MySQL.

2. Netflix Clone (Full-Stack Web Application)
   - Built responsive streaming platform UI using React.js and Node.js REST API with user auth and catalog search.

3. Hotel Management System (Java OOP Desktop)
   - Engineered modular desktop application utilizing Object-Oriented principles for room reservation, occupancy tracking, and automatic billing.

4. School Management System (Relational Database & Java)
   - Designed normalized 3NF MySQL relational database schema and Java interface for student enrollment and grade management.

TECHNICAL SKILLS
- Programming Languages: Python, Java, JavaScript
- Web Development: React.js, Node.js, HTML5, CSS3, RESTful APIs
- Artificial Intelligence: Machine Learning fundamentals, Natural Language Processing, Model Evaluation
- Databases: MySQL, MongoDB, Relational Database Design (3NF Normalization)
- Tools & Practices: Git & GitHub, VS Code, Object-Oriented Design, Agile/Scrum, Data Structures & Algorithms
- Core Concepts: Software Engineering Principles, System Design, Problem Solving, Research Methodology

ADDITIONAL INFORMATION
- Languages: English (Proficient), Urdu (Native)
- Interests: Artificial Intelligence, Machine Learning, Ethical Hacking, Cyber Security, Mobile/Web App Development

CAREER GOAL
Grow as a well-rounded engineer across AI/ML, software systems, and cyber security, and contribute to applied research.
`.trim();

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'text'>('visual');

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      import('../utils/generatePdf').then(m => m.downloadRidaZaibCV());
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(CV_PLAIN_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const skillGroups = [
    { label: 'Languages', items: ['Python', 'Java', 'JavaScript (ES6+)', 'SQL'] },
    { label: 'Web Stack', items: ['React.js', 'Node.js', 'FastAPI', 'REST APIs', 'Tailwind CSS'] },
    { label: 'AI & Systems', items: ['NLP', 'Cosine Similarity', 'Vector Embeddings', 'Model Eval'] },
    { label: 'Databases', items: ['MySQL', 'MongoDB', '3NF Relational Design'] },
    { label: 'Tools', items: ['Git/GitHub', 'VS Code', 'Agile/Scrum', 'SOLID OOP'] }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#130b26] border border-purple-500/35 rounded-3xl shadow-[0_25px_80px_rgba(124,58,237,0.45)] overflow-hidden my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar with Quick Actions */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#1b0f3b] via-[#140a2e] to-[#1a0f38] border-b border-purple-500/25 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-heading">Curriculum Vitae</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> ATS Verified
                </span>
              </div>
              <p className="text-[11px] text-purple-300/80 font-mono">Professional Software Engineering Resume</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-[#100726] p-1 rounded-xl border border-purple-500/20 text-xs font-mono mr-1">
              <button
                onClick={() => setViewMode('visual')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'visual'
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Executive View
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'text'
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Raw Text
              </button>
            </div>

            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-xl bg-[#231349] hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy plain text CV"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-[#231349] hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-mono items-center gap-1.5 transition-all cursor-pointer"
              title="Print resume"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Direct PDF Download button that generates Rida_Zaib_CV.pdf */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-950/70 transition-all cursor-pointer"
              title="Download Rida_Zaib_CV.pdf"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
              aria-label="Close CV Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container with the Dedicated 2-Column Professional CV Document */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-[#0a0515]/95">
          
          {viewMode === 'text' ? (
            /* Plain Text View */
            <div className="w-full max-w-3xl mx-auto bg-[#0e071e] text-slate-200 p-6 rounded-2xl border border-purple-500/25 font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {CV_PLAIN_TEXT}
            </div>
          ) : (
            /* THE RESTRAINED, PROFESSIONAL 2-COLUMN RESUME (White background, ATS-friendly) */
            <div 
              className="w-full max-w-3xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl p-7 sm:p-10 border border-slate-200 font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-full"
              style={{ minHeight: '1020px' }}
            >
              {/* Header: Name & Target Role */}
              <div className="border-b-2 border-slate-900 pb-5 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight uppercase font-heading">
                      RIDA ZAIB
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold text-purple-800 mt-1 tracking-wide flex items-center gap-2">
                      <span>Software Engineer | AI/ML & Systems Developer</span>
                    </p>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 sm:text-right font-medium">
                    <div className="flex items-center sm:justify-end gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span>Punjab, Pakistan</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 text-purple-800 font-mono">
                      <Mail className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <a href="mailto:ridazaibb04@gmail.com" className="hover:underline">ridazaibb04@gmail.com</a>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 text-purple-800">
                      <Linkedin className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <a href="https://www.linkedin.com/in/rida-zaib" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        linkedin.com/in/rida-zaib
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-COLUMN RESTRAINED RECRUITER LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-start">
                
                {/* LEFT/NARROW COLUMN (4 cols): Contact, Skills, Languages, Interests */}
                <div className="md:col-span-4 space-y-6 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6 text-xs">
                  
                  {/* Education Highlight in Left Sidebar */}
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-950 border-b border-purple-700/40 pb-1 mb-2.5 font-mono text-[11px] text-purple-900 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-700" />
                      <span>Education</span>
                    </h3>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">University of Gujrat</div>
                      <div className="text-purple-800 font-semibold text-xs mt-0.5">
                        BS Software Engineering
                      </div>
                      <div className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">
                        Degree Completed • 2022–2026
                      </div>
                      <div className="text-slate-600 mt-2 text-[11px] leading-relaxed">
                        <span className="font-semibold text-slate-800">Key Coursework:</span> DSA, OOP, System Architecture, Database Systems, Artificial Intelligence, Web Engineering.
                      </div>
                    </div>
                  </div>

                  {/* Technical Skills with Clean Badges */}
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-950 border-b border-purple-700/40 pb-1 mb-2.5 font-mono text-[11px] text-purple-900 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-purple-700" />
                      <span>Technical Skills</span>
                    </h3>
                    
                    <div className="space-y-3">
                      {skillGroups.map((group, gIdx) => (
                        <div key={gIdx}>
                          <div className="font-bold text-slate-900 text-[11px] mb-1.5">{group.label}</div>
                          <div className="flex flex-wrap gap-1">
                            {group.items.map((item, iIdx) => (
                              <span 
                                key={iIdx}
                                className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] border border-slate-200"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-950 border-b border-purple-700/40 pb-1 mb-2 font-mono text-[11px] text-purple-900 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-purple-700" />
                      <span>Languages</span>
                    </h3>
                    <div className="space-y-1 text-slate-700">
                      <div>• English — <span className="font-semibold text-slate-900">Proficient</span></div>
                      <div>• Urdu — <span className="font-semibold text-slate-900">Native</span></div>
                    </div>
                  </div>

                  {/* Focus Areas */}
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-950 border-b border-purple-700/40 pb-1 mb-2 font-mono text-[11px] text-purple-900 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-700" />
                      <span>Engineering Focus</span>
                    </h3>
                    <div className="space-y-1 text-slate-700 text-[11px]">
                      <div>• AI/ML & Natural Language Processing</div>
                      <div>• Scalable Software Architecture</div>
                      <div>• Relational Database Normalization</div>
                      <div>• Cybersecurity & Secure Coding</div>
                    </div>
                  </div>

                </div>

                {/* MAIN COLUMN (8 cols): Objective, Projects, Career Goal */}
                <div className="md:col-span-8 space-y-5 text-xs">
                  
                  {/* Career Objective */}
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-950 border-b border-purple-700/40 pb-1 mb-2 font-mono text-[11px] text-purple-900 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-purple-700" />
                      <span>Career Objective</span>
                    </h3>
                    <div className="border-l-2 border-purple-600 pl-3.5 py-0.5">
                      <p className="text-slate-700 leading-relaxed text-justify">
                        Software Engineering graduate with hands-on experience building full-stack applications and applying AI to real-world problems. Seeking a <span className="font-bold text-slate-900">Google Student Researcher</span> position to contribute to research in machine learning and software systems while continuing academic study in Computer Science.
                      </p>
                    </div>
                  </div>

                  {/* Technical Projects */}
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-slate-950 border-b border-purple-700/40 pb-1 mb-3 font-mono text-[11px] text-purple-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-purple-700" />
                        <span>Featured Technical Projects</span>
                      </span>
                      <span className="text-[10px] font-normal text-slate-500 font-sans">Engineering Portfolio</span>
                    </h3>

                    <div className="space-y-4">
                      
                      {/* Project 1: GradExpert */}
                      <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-950 text-sm">GradExpert — Final Year Project</span>
                              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[9px] font-mono font-bold">
                                Capstone Spotlight
                              </span>
                            </div>
                            <div className="text-purple-800 font-mono text-[10px] mt-0.5">
                              Python • Natural Language Processing • Cosine Similarity • FastAPI • React.js • MySQL
                            </div>
                          </div>
                          <span className="text-purple-900 font-mono text-[11px] font-bold shrink-0">2025 – 2026</span>
                        </div>
                        <ul className="list-disc list-outside pl-3.5 space-y-1 text-slate-700 text-[11px] mt-2 leading-relaxed">
                          <li>Architected an automated AI assessment engine evaluating subjective text responses and objective answer keys.</li>
                          <li>Implemented NLP tokenization, lemmatization, and cosine similarity matching for conceptual scoring accuracy.</li>
                          <li>Developed real-time instructor dashboards supporting customizable grading rubrics and automated batch queue processing.</li>
                        </ul>
                      </div>

                      {/* Project 2: Netflix Clone */}
                      <div className="p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>Netflix Clone (Full-Stack Streaming Platform)</span>
                          <span className="text-slate-500 font-mono text-[10px]">React • Node • REST</span>
                        </div>
                        <p className="text-slate-700 text-[11px] mt-1 leading-relaxed">
                          Engineered a responsive video streaming interface with user authentication, catalogue browsing, search filtration, and RESTful API backend integration.
                        </p>
                      </div>

                      {/* Project 3: Hotel Management System */}
                      <div className="p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>Hotel Management System (Desktop Architecture)</span>
                          <span className="text-slate-500 font-mono text-[10px]">Java • Swing • SOLID</span>
                        </div>
                        <p className="text-slate-700 text-[11px] mt-1 leading-relaxed">
                          Engineered an object-oriented desktop application for room reservation, real-time occupancy monitoring, and automated billing invoice calculation applying OOP SOLID principles.
                        </p>
                      </div>

                      {/* Project 4: School Management System */}
                      <div className="p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>School Management System (Relational DB & Java)</span>
                          <span className="text-slate-500 font-mono text-[10px]">Java • MySQL • 3NF</span>
                        </div>
                        <p className="text-slate-700 text-[11px] mt-1 leading-relaxed">
                          Designed a normalized (3NF) relational database schema managing student enrollments, faculty allocations, and academic records with transactional consistency.
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Career Goal */}
                  <div className="pt-2">
                    <h3 className="font-bold uppercase tracking-wider text-slate-950 border-b border-purple-700/40 pb-1 mb-1.5 font-mono text-[11px] text-purple-900">
                      Long-Term Vision
                    </h3>
                    <p className="text-slate-700 italic text-[11px] leading-relaxed">
                      "Dedicated to growing as a well-rounded software engineer across AI/ML, distributed systems, and cybersecurity, with a strong commitment to applying academic research to real-world software solutions."
                    </p>
                  </div>

                </div>

              </div>

              {/* Bottom ATS-Friendly Footer */}
              <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Official Resume • Rida Zaib • University of Gujrat</span>
                <span>Available for Google Student Researcher</span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

