import React, { useState } from 'react';
import { 
  Mail, 
  Linkedin, 
  MapPin, 
  Send, 
  Check, 
  Copy, 
  ExternalLink,
  Clock,
  Calendar,
  Globe,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import contactImg from '../assets/images/rida_contact_portrait_1790576222201.webp';
import { MotionReveal } from './MotionReveal';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [delivered, setDelivered] = useState(false); // true = really emailed via Web3Forms
  const [honeypot, setHoneypot] = useState('');

  // Public access key from https://web3forms.com (safe to expose in the browser).
  const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const inquiryTopics = [
    { id: 'swe', label: 'Software Engineering Role', subject: 'Opportunity: Software Engineering Position' },
    { id: 'ai', label: 'AI / ML Research', subject: 'Inquiry: AI/ML & Applied Research Collaboration' },
    { id: 'fullstack', label: 'Full-Stack Architecture', subject: 'Project: Web & Systems Development' },
    { id: 'general', label: 'General Networking', subject: 'Connecting with Rida Zaib' }
  ];

  const handleSelectTopic = (subjectText: string) => {
    setFormData(prev => ({ ...prev, subject: subjectText }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please provide your name, email, and message.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    setError('');

    // Spam bots fill hidden fields; humans never see this one.
    if (honeypot) { setSubmitted(true); setDelivered(true); return; }

    // No key configured -> fall back to opening the visitor's email app.
    if (!WEB3FORMS_KEY) {
      setSubmitted(true);
      return;
    }

    setSending(true);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email, // becomes the Reply-To, so you can just hit "Reply"
          subject: formData.subject || `Portfolio inquiry from ${formData.name}`,
          message: formData.message,
          from_name: 'Portfolio Contact Form',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDelivered(true);
        setSubmitted(true);
      } else {
        setError('Could not send right now. Please try again, or email me directly.');
      }
    } catch {
      setError('Network error. Please try again, or email me directly.');
    } finally {
      setSending(false);
    }
  };

  const constructMailtoUrl = () => {
    const subj = encodeURIComponent(formData.subject || `Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Rida,\n\n${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`
    );
    return `mailto:${PORTFOLIO_DATA.personal.email}?subject=${subj}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Subtle architectural ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/[0.07] rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/[0.05] rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Minimalist Editorial Typography */}
        <MotionReveal animation="blur-in" delay={0.1}>
          <div className="max-w-3xl mb-14 text-left">
            <div className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3 flex items-center gap-2">
              <span>04</span>
              <span className="text-purple-600">/</span>
              <span>Inquiries & Collaboration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Let's build something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-violet-300 to-cyan-200">
                extraordinary.
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              Available for full-time Software Engineering roles, AI research initiatives, and ambitious technical projects. Send a direct note below or reach out via official channels.
            </p>
          </div>
        </MotionReveal>

        {/* Master Contact Card: Data-Driven Two-Column Layout */}
        <MotionReveal animation="rise-3d" delay={0.2}>
          <div className="rounded-3xl bg-[#0e071e]/90 border border-white/[0.08] shadow-[0_20px_70px_rgba(10,5,22,0.85)] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            
            {/* Top Hairline Shimmer Accent */}
            <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              
              {/* LEFT COLUMN: Clean Portrait & Quantitative Telemetry (5 cols) */}
              <MotionReveal animation="swing-left" delay={0.35} className="lg:col-span-5 flex flex-col space-y-6">
                
                {/* Architectural Portrait Frame */}
                <MotionReveal animation="clip-up" delay={0.55}>
                <div className="relative w-full rounded-2xl overflow-hidden bg-[#140b28] border border-white/[0.1] shadow-xl group">
                  <div className="aspect-[4/3] sm:aspect-square w-full relative overflow-hidden">
                    <img
                      src={contactImg}
                      alt="Rida Zaib - Software Engineer"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      loading="eager"
                    />
                    {/* Linear bottom gradient scrim for legible typography */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d061c] via-[#0d061c]/40 to-transparent" />
                    
                    {/* Floating Status Indicator */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d061c]/80 border border-white/[0.1] backdrop-blur-md text-[11px] font-mono text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Available for Hire</span>
                    </div>

                    {/* Candidate Identity Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white tracking-tight font-heading">
                        Rida Zaib
                      </h3>
                      <p className="text-xs font-mono text-purple-300 mt-0.5">
                        Software Engineer
                      </p>
                    </div>
                  </div>
                </div>

                </MotionReveal>

                {/* Data-Driven Operational Telemetry */}
                <MotionReveal animation="pop" delay={0.75} className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Response</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1 tabular-nums">
                      &lt; 24 Hours
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Fast email turnaround
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Time Zone</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-1 tabular-nums">
                      PKT (UTC+5)
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Global overlap ready
                    </div>
                  </div>
                </MotionReveal>

                {/* Direct Channel Cards */}
                <MotionReveal animation="fade-in-up" delay={0.9} className="space-y-2.5">
                  {/* Primary Email */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-400/40 hover:bg-white/[0.04] transition-all flex items-center justify-between group/chan">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          Primary Email
                        </div>
                        <a 
                          href={`mailto:${PORTFOLIO_DATA.personal.email}`}
                          className="text-xs font-semibold text-slate-200 hover:text-white truncate block transition-colors"
                        >
                          {PORTFOLIO_DATA.personal.email}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-purple-900/50 border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Copy Email Address"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px] text-emerald-300">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-purple-300" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* LinkedIn Channel */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-400/40 hover:bg-white/[0.04] transition-all flex items-center justify-between group/chan">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                        <Linkedin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          Professional Network
                        </div>
                        <span className="text-xs font-semibold text-slate-200 truncate block">
                          linkedin.com/in/rida-zaib
                        </span>
                      </div>
                    </div>
                    <a
                      href={PORTFOLIO_DATA.personal.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-purple-900/50 border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                      title="Open LinkedIn"
                    >
                      <span className="text-[11px]">Connect</span>
                      <ExternalLink className="w-3 h-3 text-purple-300" />
                    </a>
                  </div>

                  {/* Location Meta */}
                  <div className="pt-1 flex items-center gap-2 text-xs font-mono text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Punjab, Pakistan · Available for Remote & Relocation</span>
                  </div>
                </MotionReveal>

              </MotionReveal>

              {/* RIGHT COLUMN: Modern High-End Communication Form (7 cols) */}
              <MotionReveal animation="swing-right" delay={0.45} className="lg:col-span-7 flex flex-col">
                
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
                    Send a Direct Note
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill in the form below and your message will land straight in my inbox.
                  </p>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {error && (
                      <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Segmented Topic Selector */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-2">
                        SELECT INQUIRY TOPIC
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {inquiryTopics.map((topic) => {
                          const isSelected = formData.subject === topic.subject;
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => handleSelectTopic(topic.subject)}
                              className={`px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-all duration-200 cursor-pointer border flex items-center justify-between ${
                                isSelected
                                  ? 'bg-purple-950/80 border-purple-400 text-white shadow-sm'
                                  : 'bg-white/[0.02] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.05]'
                              }`}
                            >
                              <span>{topic.label}</span>
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-purple-400' : 'bg-transparent'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dual Inputs: Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5">
                          YOUR NAME <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Elena Rostova"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] focus:border-purple-400 focus:bg-white/[0.05] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition-all font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5">
                          YOUR EMAIL <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="elena@enterprise.com"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] focus:border-purple-400 focus:bg-white/[0.05] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition-all font-sans"
                        />
                      </div>
                    </div>

                    {/* Custom Subject Line */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        SUBJECT LINE
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Subject of your message..."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] focus:border-purple-400 focus:bg-white/[0.05] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition-all font-sans"
                      />
                    </div>

                    {/* Message Area */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        MESSAGE CONTENT <span className="text-purple-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your team, project requirements, or opportunity..."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] focus:border-purple-400 focus:bg-white/[0.05] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition-all resize-none font-sans"
                      />
                    </div>

                    {/* Honeypot (hidden from humans) */}
                    <input
                      type="text"
                      name="botcheck"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      className="hidden"
                      aria-hidden="true"
                    />

                    {/* Submit Action */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-sm shadow-[0_10px_25px_rgba(124,58,237,0.35)] hover:shadow-[0_14px_35px_rgba(124,58,237,0.55)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group/btn disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span>{sending ? 'Sending...' : 'Send Message'}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </form>
                ) : (
                  /* Form Success State */
                  <div className="py-12 text-center space-y-6 animate-in fade-in duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                      <Check className="w-7 h-7" />
                    </div>

                    <div>
                      <h4 className="text-2xl font-bold text-white font-heading">
                        {delivered ? `Message sent, ${formData.name}!` : `Almost there, ${formData.name}`}
                      </h4>
                      <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                        {delivered
                          ? 'Thanks for reaching out. Rida will get back to you by email soon.'
                          : 'Click below to open your email app with your message ready to send to Rida Zaib:'}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      {!delivered && (
                      <a
                        href={constructMailtoUrl()}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/80 cursor-pointer transition-transform hover:scale-105"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Open Email App</span>
                      </a>
                      )}

                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setDelivered(false);
                          setFormData({ name: '', email: '', subject: '', message: '' });
                        }}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 hover:text-white text-xs font-medium cursor-pointer transition-all"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                )}

              </MotionReveal>

            </div>

          </div>
        </MotionReveal>

      </div>
    </section>
  );
};
