import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';

interface InteractiveTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  command: string;
  output: string | React.ReactNode;
  timestamp: string;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      command: 'init',
      output: (
        <div className="space-y-1 text-slate-300">
          <p className="text-purple-300 font-bold">Rida Zaib Software Engineering Terminal v2.4</p>
          <p className="text-slate-400">Type <span className="text-cyan-400 font-semibold">help</span> or click command chips below to explore.</p>
        </div>
      ),
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    let output: string | React.ReactNode = '';

    switch (trimmed) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-purple-300 font-bold">Available Commands:</p>
            <p><span className="text-cyan-400 font-mono w-24 inline-block">whoami</span> — Display candidate summary</p>
            <p><span className="text-cyan-400 font-mono w-24 inline-block">skills</span> — List technical stack & languages</p>
            <p><span className="text-cyan-400 font-mono w-24 inline-block">education</span> — View university & degree program</p>
            <p><span className="text-cyan-400 font-mono w-24 inline-block">gradexpert</span> — Inspect AI final year project</p>
            <p><span className="text-cyan-400 font-mono w-24 inline-block">projects</span> — List all engineered applications</p>
            <p><span className="text-cyan-400 font-mono w-24 inline-block">contact</span> — Get verified email & LinkedIn</p>
            <p><span className="text-cyan-400 font-mono w-24 inline-block">clear</span> — Clear terminal window</p>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <p><strong className="text-white">{PORTFOLIO_DATA.personal.name}</strong> ({PORTFOLIO_DATA.personal.role})</p>
            <p>{PORTFOLIO_DATA.personal.bio}</p>
            <p className="text-purple-300">Location: {PORTFOLIO_DATA.personal.location} | Age: {PORTFOLIO_DATA.personal.age}</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-2 text-xs">
            <p className="text-purple-300 font-bold">Verified Technical Stack:</p>
            <p><span className="text-slate-400">Languages:</span> Python, Java, JavaScript</p>
            <p><span className="text-slate-400">Web Stack:</span> React.js, Node.js, HTML5, CSS3, REST APIs</p>
            <p><span className="text-slate-400">AI / NLP:</span> Machine Learning, NLP, Model Evaluation</p>
            <p><span className="text-slate-400">Databases:</span> MySQL, MongoDB, Relational DB Design</p>
            <p><span className="text-slate-400">Tools:</span> Git & GitHub, VS Code, Agile/Scrum, OOP Design</p>
          </div>
        );
        break;

      case 'education':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <p className="text-white font-bold">{PORTFOLIO_DATA.education.institution}</p>
            <p>{PORTFOLIO_DATA.education.degree} ({PORTFOLIO_DATA.education.period})</p>
            <p className="text-emerald-400 font-medium">Status: {PORTFOLIO_DATA.education.status}</p>
          </div>
        );
        break;

      case 'gradexpert':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <p className="text-purple-300 font-bold">{PORTFOLIO_DATA.featuredProject.title}</p>
            <p>{PORTFOLIO_DATA.featuredProject.description}</p>
            <p className="text-cyan-400 font-mono">Tags: {PORTFOLIO_DATA.featuredProject.tags.join(', ')}</p>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-purple-300 font-bold">Software Portfolio Projects:</p>
            <p>1. <strong className="text-white">GradExpert</strong> — AI & NLP Automated Grading System (Python)</p>
            <p>2. <strong className="text-white">Netflix Clone</strong> — Full-Stack Video Streaming (React/Node)</p>
            <p>3. <strong className="text-white">Hotel Management System</strong> — Desktop OOP System (Java)</p>
            <p>4. <strong className="text-white">School Management System</strong> — Relational Academic DB (Java/MySQL)</p>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <p>Email: <a href={`mailto:${PORTFOLIO_DATA.personal.email}`} className="text-cyan-400 underline">{PORTFOLIO_DATA.personal.email}</a></p>
            <p>LinkedIn: <a href={PORTFOLIO_DATA.personal.linkedin} target="_blank" rel="noreferrer" className="text-purple-400 underline">{PORTFOLIO_DATA.personal.linkedin}</a></p>
          </div>
        );
        break;

      case 'clear':
        setLogs([]);
        setInput('');
        return;

      default:
        output = (
          <p className="text-rose-400 text-xs">
            Command not recognized: "{cmd}". Type <span className="text-cyan-400 font-bold">help</span> for available options.
          </p>
        );
    }

    setLogs(prev => [...prev, {
      command: cmd,
      output,
      timestamp: new Date().toLocaleTimeString()
    }]);

    setInput('');
  };

  const chips = ['help', 'whoami', 'skills', 'gradexpert', 'education', 'contact', 'clear'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full ${isMaximized ? 'h-[94vh] max-w-5xl' : 'max-w-2xl h-[520px]'} bg-[#0a0614] border border-purple-500/40 rounded-2xl flex flex-col shadow-2xl shadow-purple-950/80 overflow-hidden transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Titlebar */}
        <div className="px-4 py-3 bg-[#120a22] border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" onClick={() => setIsMaximized(!isMaximized)} />
            <div className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" onClick={() => handleCommand('help')} />
            <span className="ml-2 text-xs font-mono text-slate-300 flex items-center gap-1.5 font-semibold">
              <TerminalIcon className="w-3.5 h-3.5 text-purple-400" />
              rida@portfolio: ~ (bash)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Toggle Size"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-rose-400"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 bg-[#080410]">
          {logs.map((log, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-purple-400 font-bold">rida@engineering:~$</span>
                <span className="text-white font-semibold">{log.command}</span>
                <span className="text-[10px] text-slate-600 ml-auto">{log.timestamp}</span>
              </div>
              <div className="pl-4 py-1 text-slate-200 border-l border-purple-500/20">
                {log.output}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Command Helper Chips */}
        <div className="px-4 py-2 bg-[#0e081c] border-t border-purple-500/15 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-mono text-purple-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick:
          </span>
          {chips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleCommand(chip)}
              className="px-2 py-0.5 rounded bg-purple-950/70 hover:bg-purple-900 border border-purple-500/25 text-[11px] font-mono text-purple-200 hover:text-white whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleCommand(input); }}
          className="p-3 bg-[#110924] border-t border-purple-500/20 flex items-center gap-2"
        >
          <span className="text-purple-400 font-mono text-xs font-bold shrink-0">
            rida@engineering:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command (e.g. help, skills, gradexpert)..."
            className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            title="Execute"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
