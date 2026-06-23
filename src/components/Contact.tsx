import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { PersonalInfo, ThemeStyle } from '../types';

interface ContactProps {
  personalInfo: PersonalInfo;
  activeTheme: ThemeStyle;
}

export default function Contacts({ personalInfo, activeTheme }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastMailto, setLastMailto] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSending(true);

    const emailSubject = formData.subject || `Inquiry from ${formData.name}`;
    const emailBody = `Hi Navaneethakrishnan,

My name is ${formData.name} (${formData.email}).

Here is my message:
--------------------------------------------------
${formData.message}
--------------------------------------------------

Best regards,
${formData.name}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    setLastMailto(gmailUrl);

    // Attempt direct client dispatch synchronously to avoid popup blocker
    try {
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn("Gmail direct launching blocked or failed", err);
    }

    setTimeout(() => {
      setSending(false);
      setIsSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  // Preset themes
  const containerStyle = {
    bold: 'bg-[#050505] text-[#F5F5F5] py-10 px-6 md:px-12 border-b border-white/10',
    modern: 'bg-slate-950 text-white py-10 px-6 md:px-12 border-b border-slate-900',
    minimalist: 'bg-white text-slate-900 py-10 px-6 md:px-12 border-b border-amber-900/10',
    terminal: 'bg-black text-green-500 py-10 px-6 md:px-12 font-mono',
    cyberpunk: 'bg-slate-950 text-cyan-400 py-10 px-6 md:px-12 border-b border-pink-500/10',
    nordic: 'bg-[#080f19] text-[#e2e8f0] py-10 px-6 md:px-12 border-b border-sky-950/40',
    sunset: 'bg-[#140b09] text-amber-50 py-10 px-6 md:px-12 border-b border-[#e36940]/10'
  };

  const titleStyle = {
    bold: 'text-4xl font-sans font-black text-center tracking-tighter uppercase text-[#F5F5F5]',
    modern: 'text-3xl font-display font-bold text-center tracking-tight',
    minimalist: 'text-3xl font-display font-light text-center tracking-tighter uppercase',
    terminal: 'text-2xl font-mono font-bold text-left tracking-wide uppercase',
    cyberpunk: 'text-3xl font-display font-extrabold text-center tracking-widest uppercase neon-glow',
    nordic: 'text-3xl font-mono font-bold text-center tracking-tight text-[#e2e8f0]',
    sunset: 'text-3xl font-display font-semibold text-center tracking-widest text-amber-100'
  };

  const cardStyle = {
    bold: 'p-6 border border-white/10 bg-white/[0.01] hover:border-[#ff4e00]/20 transition-all rounded-none space-y-6',
    modern: 'p-6 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-xl space-y-6',
    minimalist: 'p-6 rounded-2xl border border-amber-900/10 bg-amber-50/10 shadow-lg space-y-6',
    terminal: 'p-5 border border-green-500/20 bg-slate-950 text-green-400 space-y-5',
    cyberpunk: 'p-6 rounded-2xl bg-slate-950 border border-cyan-500/15 shadow-xl space-y-6',
    nordic: 'p-6 rounded-2xl bg-sky-950/25 border border-sky-900/30 hover:border-sky-500/40 transition-all space-y-6',
    sunset: 'p-6 rounded-sm bg-[#1c0e0b] border border-[#e36940]/20 hover:border-[#e36940] transition-all text-amber-100/90 space-y-6'
  };

  const inputStyle = {
    bold: 'w-full p-3 bg-white/[0.02] border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#ff4e00] focus:ring-1 focus:ring-[#ff4e00]/15 text-xs rounded-none transition-all',
    modern: 'w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 text-xs transition-all',
    minimalist: 'w-full p-3 rounded-xl border border-amber-900/20 bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 text-xs transition-all',
    terminal: 'w-full p-3 bg-black border border-green-500/30 text-green-400 placeholder:text-green-900 focus:outline-none focus:border-green-500 text-xs font-mono transition-all',
    cyberpunk: 'w-full p-3 rounded-xl bg-slate-950 border border-cyan-500/20 text-cyan-200 placeholder:text-cyan-800 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 text-xs font-mono transition-all',
    nordic: 'w-full p-3 rounded-xl bg-sky-950/60 border border-sky-900/40 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/20 text-xs transition-all',
    sunset: 'w-full p-3 rounded-sm bg-[#1a0c0a] border border-[#e36940]/20 text-amber-100 placeholder:text-amber-500/50 focus:outline-none focus:border-[#e36940] focus:ring-1 focus:ring-[#e36940]/20 text-xs font-mono transition-all'
  };

  return (
    <section id="contact-section" className={`w-full ${containerStyle[activeTheme]} transition-colors duration-300`}>
      <div className="w-full max-w-[95%] mx-auto space-y-8">
        
        {/* Section Heading */}
        <div className="space-y-3">
          <h2 id="contact-heading" className={titleStyle[activeTheme]}>
            {activeTheme === 'terminal' ? 'EX-06: CONNECT_SEC_CHAN' : 'Get In Touch'}
          </h2>
          <div className={`h-0.5 w-12 mx-auto ${
            activeTheme === 'bold'
              ? 'bg-[#ff4e00]'
              : activeTheme === 'minimalist' 
                ? 'bg-amber-900/20' 
                : activeTheme === 'terminal'
                  ? 'bg-green-500 hidden' 
                  : activeTheme === 'cyberpunk'
                    ? 'bg-pink-500' 
                    : 'bg-purple-500'
          }`} />
          <p className="text-center text-xs text-slate-500 tracking-wide font-mono select-none">
            {activeTheme === 'terminal' ? 'ESTABLISH WEBSOCKET COMMUNICATIONS' : 'Get in touch directly'}
          </p>
        </div>

        {/* Contact Split Grid */}
        <div id="contact-split-grid" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Info Panels (Col span 5) */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-lg font-bold font-accent tracking-tight">Direct Connections</h3>

            <div className="space-y-3 pt-2">
              {personalInfo.email && (
                <div className="flex items-center space-x-3.5 group">
                  <div className={`p-2.5 rounded-xl border ${
                    activeTheme === 'bold'
                      ? 'border-[#ff4e00]/25 bg-[#ff4e00]/5 text-[#ff4e00] rounded-none'
                      : activeTheme === 'minimalist' 
                        ? 'border-amber-900/10 bg-amber-50 text-amber-900' 
                        : activeTheme === 'terminal'
                          ? 'border-green-500/20 text-green-400 bg-slate-950'
                          : 'border-slate-800 bg-slate-950 text-purple-400'
                  }`}>
                    <Mail className="w-4 h-4 shrink-0" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 block">Direct Email</span>
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-semibold hover:underline font-mono ${
                      activeTheme === 'bold' ? 'text-[#ff4e00]' : 'text-purple-400 dark:text-purple-400'
                    }`}>
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {personalInfo.phone && (
                <div className="flex items-center space-x-3.5 group">
                  <div className={`p-2.5 rounded-xl border ${
                    activeTheme === 'bold'
                      ? 'border-[#ff4e00]/25 bg-[#ff4e00]/5 text-[#ff4e00] rounded-none'
                      : activeTheme === 'minimalist' 
                        ? 'border-amber-900/10 bg-amber-50 text-amber-900' 
                        : activeTheme === 'terminal'
                          ? 'border-green-500/20 text-green-400 bg-slate-950'
                          : 'border-slate-800 bg-slate-950 text-purple-400'
                  }`}>
                    <Phone className="w-4 h-4 shrink-0" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 block">Phone</span>
                    <span className="text-xs font-semibold font-mono">{personalInfo.phone}</span>
                  </div>
                </div>
              )}

              {personalInfo.location && (
                <div className="flex items-center space-x-3.5 group">
                  <div className={`p-2.5 rounded-xl border ${
                    activeTheme === 'bold'
                      ? 'border-[#ff4e00]/25 bg-[#ff4e00]/5 text-[#ff4e00] rounded-none'
                      : activeTheme === 'minimalist' 
                        ? 'border-amber-900/10 bg-amber-50 text-amber-900' 
                        : activeTheme === 'terminal'
                          ? 'border-green-500/20 text-green-400 bg-slate-950'
                          : 'border-slate-800 bg-slate-950 text-purple-400'
                  }`}>
                    <MapPin className="w-4 h-4 shrink-0" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 block">Location</span>
                    <span className="text-xs font-semibold">{personalInfo.location}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Card (Col span 7) */}
          <div className="md:col-span-7">
            <div className={cardStyle[activeTheme]}>
              
               {isSent ? (
                <div id="contact-success-state" className="text-center py-10 space-y-5 px-4">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1">
                    <CheckCircle2 className="w-8 h-8 animate-pulse text-cyan-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Transmission Dispatched</h4>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out! We prepared a secure mail draft to <span className="text-cyan-400 font-mono font-bold">naveenkrishnamoorthi2004@gmail.com</span>.
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-normal">
                      If your device didn't display the automatic mail application, use the instant trigger below:
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {lastMailto && (
                      <a
                        href={lastMailto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:opacity-90 text-white shadow-xl shadow-pink-500/15 cursor-pointer block text-center"
                        title="Trigger Gmail compose window"
                      >
                        Open Email App
                      </a>
                    )}
                    <button
                      id="contact-reset-btn"
                      onClick={() => setIsSent(false)}
                      className="px-4 py-2 text-xs font-bold font-mono border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form id="contact-form-node" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="contact-name" className="text-[10px] font-mono tracking-wider uppercase opacity-60">Full Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className={inputStyle[activeTheme]}
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="contact-email" className="text-[10px] font-mono tracking-wider uppercase opacity-60">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="johndoe@gmail.com"
                        className={inputStyle[activeTheme]}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="contact-subject" className="text-[10px] font-mono tracking-wider uppercase opacity-60">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Subject"
                      className={inputStyle[activeTheme]}
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="contact-message" className="text-[10px] font-mono tracking-wider uppercase opacity-60">Message Content</label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      className={`${inputStyle[activeTheme]} resize-none`}
                    />
                  </div>

                  {/* Send bar */}
                  <div className="flex justify-end items-center pt-2">
                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={sending}
                      className={`flex items-center space-x-2 px-6 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-all ${
                        activeTheme === 'bold'
                          ? 'bg-[#ff4e00] text-black font-black hover:bg-[#ff4e00]/90 rounded-sm'
                          : activeTheme === 'minimalist'
                            ? 'bg-slate-900 text-white hover:bg-slate-800 rounded-xl'
                            : activeTheme === 'terminal'
                              ? 'bg-green-500 text-black border border-green-500 font-semibold rounded-xl'
                              : activeTheme === 'cyberpunk'
                                ? 'bg-cyan-400 text-black border border-cyan-400 font-bold hover:shadow-cyan-500/10 shadow hover:bg-cyan-300 rounded-xl'
                                : activeTheme === 'nordic'
                                  ? 'bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 rounded-xl'
                                  : activeTheme === 'sunset'
                                    ? 'bg-[#e36940] text-amber-100 font-bold hover:bg-[#e36940]/90 rounded-none'
                                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/10 rounded-xl'
                      }`}
                    >
                      {sending ? (
                        <>
                          <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin shrink-0" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 shrink-0" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
