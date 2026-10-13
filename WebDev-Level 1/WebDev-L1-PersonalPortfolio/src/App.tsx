import React, { useState, lazy, Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import { ScrollProgress, SectionDivider } from './components/MotionExtras';
import { BackgroundEffect } from './components/BackgroundEffect';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Education } from './components/Education';
import { Skills } from './components/Skills';
import { FeaturedProject } from './components/FeaturedProject';
import { Projects } from './components/Projects';
import { ResearchConstellation } from './components/ResearchConstellation';
import { Career } from './components/Career';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
const ProjectModal = lazy(() => import('./components/ProjectModal').then(m => ({ default: m.ProjectModal })));
const InteractiveTerminal = lazy(() => import('./components/InteractiveTerminal').then(m => ({ default: m.InteractiveTerminal })));
const CVModal = lazy(() => import('./components/CVModal').then(m => ({ default: m.CVModal })));

export default function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isCVOpen, setIsCVOpen] = useState<boolean>(false);

  const handleOpenProjectDetails = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleCloseProjectDetails = () => {
    setSelectedProjectId(null);
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative min-h-screen bg-[#07050D] text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      <ScrollProgress />
      {/* Background Animated Ambience */}
      <BackgroundEffect />

      {/* Navigation Bar */}
      <Navbar 
        onOpenTerminal={() => setIsTerminalOpen(true)} 
        onOpenCV={() => setIsCVOpen(true)} 
      />

      {/* Main Page Sections */}
      <main className="relative z-10">
        <Hero 
          onOpenTerminal={() => setIsTerminalOpen(true)} 
          onOpenCV={() => setIsCVOpen(true)} 
        />
        <SectionDivider tone="purple" />
        <About />
        <SectionDivider tone="cyan" />
        <Education />
        <SectionDivider tone="violet" />
        <Skills />
        <SectionDivider tone="purple" />
        <FeaturedProject onOpenDetails={handleOpenProjectDetails} />
        <SectionDivider tone="cyan" />
        <Projects onOpenDetails={handleOpenProjectDetails} />
        <SectionDivider tone="violet" />
        <ResearchConstellation />
        <SectionDivider tone="purple" />
        <Career />
        <SectionDivider tone="cyan" />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      <Suspense fallback={null}>
      {/* Deep Dive Project Architecture Modal */}
      <ProjectModal
        projectId={selectedProjectId}
        onClose={handleCloseProjectDetails}
      />

      {/* Interactive Developer CLI Terminal */}
      <InteractiveTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Working Curriculum Vitae (CV) Modal */}
      <CVModal
        isOpen={isCVOpen}
        onClose={() => setIsCVOpen(false)}
      />
      </Suspense>
    </div>
    </MotionConfig>
  );
}
