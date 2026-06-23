import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Sparkles, FileText, ArrowDown, Bot, Camera, Link, Upload, X, Eye } from 'lucide-react';
import { PersonalInfo, ThemeStyle } from '../types';

interface HeroProps {
  personalInfo: PersonalInfo;
  onOpenParser: () => void;
  activeTheme: ThemeStyle;
  onUpdateAvatar: (base64OrUrl: string) => void;
  hasImported?: boolean;
  onViewResume?: () => void;
}

export default function Hero({ personalInfo, onOpenParser, activeTheme, onUpdateAvatar, hasImported = false, onViewResume }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [showAvatarViewer, setShowAvatarViewer] = useState(false);

  const handleAvatarClick = () => {
    if (personalInfo.avatar) {
      setShowAvatarViewer(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Background Interactive Floating Particles Canvas Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 500);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 500;
      }
    };

    window.addEventListener('resize', handleResize);

    const items: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];
    const maxItems = activeTheme === 'cyberpunk' ? 60 : activeTheme === 'terminal' ? 25 : 40;

    // Build particles
    for (let i = 0; i < maxItems; i++) {
      items.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: activeTheme === 'bold'
          ? '#ff4e00'
          : activeTheme === 'cyberpunk' 
            ? (Math.random() > 0.5 ? '#ec4899' : '#06b6d4') 
            : activeTheme === 'terminal' 
              ? '#22c55e' 
              : activeTheme === 'minimalist' 
                ? '#b45309' 
                : '#9333ea'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Cyber grid overlay lines for specific presets
      if (activeTheme === 'cyberpunk') {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Draw particle threads
      items.forEach((item, ii) => {
        item.x += item.vx;
        item.y += item.vy;

        if (item.x < 0 || item.x > width) item.vx *= -1;
        if (item.y < 0 || item.y > height) item.vy *= -1;

        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        
        if (activeTheme === 'cyberpunk') {
          ctx.shadowBlur = 8;
          ctx.shadowColor = item.color;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();

        // Threads connecting close particles
        for (let jj = ii + 1; jj < items.length; jj++) {
          const other = items[jj];
          const dist = Math.hypot(item.x - other.x, item.y - other.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(item.x, item.y);
            ctx.lineTo(other.x, other.y);
            const opacity = (1 - dist / 80) * 0.12;
            ctx.strokeStyle = activeTheme === 'bold'
              ? `rgba(255, 78, 0, ${opacity * 0.8})`
              : activeTheme === 'cyberpunk' 
                ? `rgba(236, 72, 153, ${opacity})`
                : activeTheme === 'terminal' 
                  ? `rgba(34, 197, 94, ${opacity})` 
                  : activeTheme === 'minimalist'
                    ? `rgba(180, 83, 9, ${opacity})`
                    : activeTheme === 'nordic'
                      ? `rgba(56, 189, 248, ${opacity})`
                      : activeTheme === 'sunset'
                        ? `rgba(227, 105, 64, ${opacity})`
                        : `rgba(147, 51, 234, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTheme]);

  // Handle smooth scroll helper
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Aesthetic settings based on active theme
  const containerStyles = {
    bold: 'text-[#F5F5F5] border-b border-white/10 bg-[#050505]',
    modern: 'text-white border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950',
    minimalist: 'text-slate-900 border-b border-amber-900/10 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/50',
    terminal: 'text-green-500 bg-black border-b border-green-900/30 font-mono',
    cyberpunk: 'text-cyan-400 bg-slate-950 border-b border-pink-500/20',
    nordic: 'text-[#e2e8f0] border-b border-sky-900/15 bg-gradient-to-b from-[#070e17] via-[#09121f] to-[#070e17]',
    sunset: 'text-amber-50 border-b border-[#e36940]/10 bg-[#140b09]'
  };

  const titleStyles = {
    bold: 'text-[#F5F5F5] font-sans font-black uppercase tracking-tight mb-2 leading-tight',
    modern: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 font-display font-black leading-tight',
    minimalist: 'text-slate-900 font-display font-light leading-snug tracking-tighter',
    terminal: 'text-green-500 font-mono font-bold leading-normal uppercase select-all',
    cyberpunk: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-400 to-cyan-400 font-display font-extrabold tracking-wide uppercase neon-glow leading-tight',
    nordic: 'text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-slate-350 to-indigo-300 font-sans font-black tracking-tight uppercase leading-tight',
    sunset: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-[#e36940] font-sans font-black tracking-tight uppercase leading-tight'
  };

  return (
    <section 
      id="hero-section" 
      className={`relative overflow-hidden w-full py-10 md:py-16 px-6 md:px-12 transition-all duration-300 min-h-[450px] flex items-center ${containerStyles[activeTheme]}`}
    >
      {/* Absolute Canvas Background */}
      <canvas 
        ref={canvasRef} 
        id="hero-canvas-bg"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0" 
      />

      {/* Decorative Glow elements for the Bold theme */}
      {activeTheme === 'bold' && (
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff4e00] rounded-full blur-[160px] opacity-15 pointer-events-none" />
      )}

      <div className="relative w-full max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Column: Column 1 to Column 3 for Profile Image at the left corner */}
        <div id="hero-avatar-column" className="md:col-span-3 flex flex-col items-center md:items-start justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Cyberpunk Outer Glow / Background Rings */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-pink-500 via-fuchsia-600 to-cyan-400 opacity-70 blur-md animate-pulse pointer-events-none" />
            
            {/* Border frame */}
            <div 
              className="relative overflow-hidden p-[2px] bg-gradient-to-tr from-pink-500 via-fuchsia-600 to-cyan-400 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.2)] select-none"
            >
              <div className="relative w-36 h-36 md:w-44 md:h-44 bg-[#050b14] rounded-[13px] overflow-hidden flex items-center justify-center">
                {personalInfo.avatar ? (
                  <img 
                    src={personalInfo.avatar} 
                    alt={personalInfo.name} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-3">
                    <div className="p-3 rounded-full mb-1 bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      <Camera className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                      Profile Image
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hidden Input File */}
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.div>
        </div>

        {/* Hero Left Content */}
        <div id="hero-main-content" className="md:col-span-9 flex flex-col items-start text-left space-y-6">

          {/* Staggered Name heading */}
          <div className="space-y-3">
            <motion.h4 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              id="hero-name"
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight break-words whitespace-normal max-w-full ${titleStyles[activeTheme]}`}
            >
              {personalInfo.name}
            </motion.h4>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              id="hero-title"
              className={`text-xl sm:text-2xl font-mono ${
                activeTheme === 'bold'
                  ? 'text-[#ff4e00] font-mono text-sm tracking-widest uppercase font-bold'
                  : activeTheme === 'minimalist' 
                    ? 'text-slate-600 font-sans font-medium italic' 
                    : activeTheme === 'terminal'
                      ? 'text-green-400/80'
                      : activeTheme === 'cyberpunk'
                        ? 'text-cyan-400 font-medium'
                        : activeTheme === 'nordic'
                          ? 'text-sky-400 font-bold uppercase tracking-wider'
                          : activeTheme === 'sunset'
                            ? 'text-amber-500 font-semibold uppercase tracking-widest'
                            : 'text-slate-300'
              }`}
            >
              Data Analyst
            </motion.p>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            id="hero-about-desc"
            className={`text-sm sm:text-base leading-relaxed max-w-none ${
              activeTheme === 'minimalist' 
                ? 'text-slate-600 font-serif' 
                : activeTheme === 'terminal'
                  ? 'text-slate-400 font-mono'
                  : activeTheme === 'cyberpunk'
                    ? 'text-slate-400'
                    : 'text-slate-400'
            }`}
          >
            {personalInfo.about}
          </motion.p>

          {/* Action Button Arrays */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            id="hero-action-buttons"
            className="flex flex-wrap items-center gap-3 pt-3"
          >
            {onViewResume && (
              <button
                id="hero-view-resume-btn"
                onClick={onViewResume}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                  activeTheme === 'bold'
                    ? 'border-white/20 text-[#F5F5F5] hover:bg-white/5 rounded-sm'
                    : activeTheme === 'minimalist'
                      ? 'border-amber-900/20 bg-amber-50 text-amber-900 hover:bg-amber-100/50'
                      : activeTheme === 'terminal'
                        ? 'border-green-500/40 hover:border-green-500 text-green-400 bg-slate-950/40 hover:bg-green-500/10'
                        : activeTheme === 'cyberpunk'
                          ? 'bg-gradient-to-r from-pink-600 to-fuchsia-600 border border-pink-500/30 text-white hover:opacity-90 shadow-lg shadow-pink-500/10'
                          : activeTheme === 'nordic'
                            ? 'bg-gradient-to-r from-sky-600 to-blue-600 border-none text-white hover:opacity-90'
                            : activeTheme === 'sunset'
                              ? 'bg-gradient-to-r from-orange-600 to-[#e36940] border-none text-white hover:opacity-90'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 border border-purple-500/30 text-white hover:opacity-90'
                }`}
              >
                <FileText className="w-4 h-4 text-current" />
                <span>View & Download Resume</span>
              </button>
            )}
          </motion.div>

          {/* Social Contact Connectors */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            id="hero-socials"
            className={`flex items-center space-x-5 pt-4 ${
              activeTheme === 'terminal' 
                ? 'text-green-500/60' 
                : activeTheme === 'nordic'
                  ? 'text-sky-450/70'
                  : activeTheme === 'sunset'
                    ? 'text-amber-500/70'
                    : 'text-slate-500'
            }`}
          >
            {personalInfo.github && (
              <a 
                id="hero-github-link"
                href={personalInfo.github} 
                target="_blank" 
                rel="noreferrer" 
                className={`hover:scale-110 transition-all duration-200 ${
                  activeTheme === 'bold' 
                    ? 'hover:text-[#ff4e00] text-white/60' 
                    : activeTheme === 'nordic'
                      ? 'hover:text-sky-400 text-slate-300'
                      : activeTheme === 'sunset'
                        ? 'hover:text-amber-400 text-[#fca5a5]/80'
                        : 'hover:text-purple-400 focus:text-purple-400'
                }`}
                title="Github Profile"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {personalInfo.linkedin && (
              <a 
                id="hero-linkedin-link"
                href={personalInfo.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className={`hover:scale-110 transition-all duration-200 ${
                  activeTheme === 'bold' 
                    ? 'hover:text-[#ff4e00] text-white/60' 
                    : activeTheme === 'nordic'
                      ? 'hover:text-sky-400 text-slate-300'
                      : activeTheme === 'sunset'
                        ? 'hover:text-amber-400 text-[#fca5a5]/80'
                        : 'hover:text-purple-400 focus:text-purple-400'
                }`}
                title="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {personalInfo.email && (
              <a 
                id="hero-email-link"
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:scale-110 transition-all duration-200 ${
                  activeTheme === 'bold' 
                    ? 'hover:text-[#ff4e00] text-white/60' 
                    : activeTheme === 'nordic'
                      ? 'hover:text-sky-400 text-slate-300'
                      : activeTheme === 'sunset'
                        ? 'hover:text-amber-400 text-[#fca5a5]/80'
                        : 'hover:text-purple-400 focus:text-purple-400'
                }`}
                title="Email Me"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </motion.div>

        </div>

      </div>

      {/* Floating Arrow down */}
      <div 
        onClick={() => scrollToId('skills-section')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer opacity-50 hover:opacity-100 transition-all"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] mb-1 font-mono">Scroll for detail</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </div>

      {showAvatarViewer && personalInfo.avatar && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
          onClick={() => setShowAvatarViewer(false)}
        >
          <div 
            className="relative max-w-lg w-full max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
              <div>
                <span className="text-[10px] font-semibold text-purple-400 font-mono uppercase tracking-wide">AVATAR PREVIEW</span>
                <h2 className="text-base font-bold text-white mt-0.5 leading-snug">{personalInfo.name}'s Profile Image</h2>
              </div>
              <button
                onClick={() => setShowAvatarViewer(false)}
                className="p-1 px-3 rounded-lg bg-slate-950 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-4 focus:ring-1 focus:ring-purple-400"
                title="Close View"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>

            {/* Image viewer stage */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-950/70 border border-slate-850 rounded-xl p-3 min-h-[250px]">
              <img 
                src={personalInfo.avatar} 
                alt={personalInfo.name} 
                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3 items-center justify-between text-xs text-slate-500 font-mono pt-3 border-t border-slate-800/40">
              <span className="text-[10px] text-slate-400">Locked Client Avatar View</span>
              <button
                onClick={() => {
                  setShowAvatarViewer(false);
                  fileInputRef.current?.click();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-750 text-xs font-mono cursor-pointer"
                title="Change picture"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Change Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
