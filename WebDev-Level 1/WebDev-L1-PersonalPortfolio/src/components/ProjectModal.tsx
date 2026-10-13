import React from 'react';
import { X, CheckCircle2, Code2, Layers, Cpu, ExternalLink, Github, Sparkles } from 'lucide-react';
import { ProjectItem, PORTFOLIO_DATA } from '../data/portfolio';

interface ProjectModalProps {
  projectId: string | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ projectId, onClose }) => {
  if (!projectId) return null;

  // Retrieve project details
  let project: ProjectItem | typeof PORTFOLIO_DATA.featuredProject | undefined;
  if (projectId === 'gradexpert') {
    project = PORTFOLIO_DATA.featuredProject;
  } else {
    project = PORTFOLIO_DATA.projects.find(p => p.id === projectId);
  }

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#040209]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/40 bg-[#0e081e]/95 shadow-2xl shadow-purple-950/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-slate-300 hover:text-white transition-all"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-purple-300 text-xs font-mono mb-2 border border-purple-400/30">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{project.category}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {project.title}
          </h3>
        </div>

        {/* Overview */}
        <div className="mt-4 p-4 rounded-2xl bg-[#140c2b] border border-purple-500/20 text-sm text-slate-200 leading-relaxed">
          {project.detailedDescription || project.description}
        </div>

        {/* Key Highlights / Capabilities */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-mono uppercase text-purple-300 font-semibold tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-400" />
            System Architecture & Features
          </h4>
          <div className="space-y-2">
            {('capabilities' in project ? project.capabilities : project.highlights).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-6">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2.5">
            Technologies Applied
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs rounded-lg bg-[#180f33] text-purple-200 border border-purple-500/30 font-mono font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 pt-4 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-400">
            * Verified Project from Resume Curriculum
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md"
            >
              Close Window
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
