import React, { useState } from 'react';
import { Shield, LayoutGrid, Terminal, Cpu, Database, Flame, CheckCircle } from 'lucide-react';
import { Skill, ThemeStyle } from '../types';

interface SkillsProps {
  skills: Skill[];
  activeTheme: ThemeStyle;
}

export default function Skills({ skills, activeTheme }: SkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories in the skillset
  const categories = ['All', ...new Set(skills.map(s => s.category))];

  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  // Map category names to Lucide Icons for high-fidelity decorators
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <LayoutGrid className="w-4 h-4 text-purple-400" />;
      case 'backend':
        return <Database className="w-4 h-4 text-blue-400" />;
      case 'ai & ml':
      case 'generative ai':
        return <Cpu className="w-4 h-4 text-pink-400" />;
      case 'operations & tools':
      case 'operations':
      case 'tools':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      default:
        return <Flame className="w-4 h-4 text-orange-400" />;
    }
  };

  // Aesthetic settings based on active theme
  const containerStyle = {
    bold: 'bg-[#050505] text-[#F5F5F5] py-10 px-6 md:px-12 border-b border-white/10',
    modern: 'bg-slate-900/40 text-white py-10 px-6 md:px-12 border-b border-slate-800',
    minimalist: 'bg-white text-slate-900 py-10 px-6 md:px-12 border-b border-amber-900/10',
    terminal: 'bg-black text-green-500 py-10 px-6 md:px-12 font-mono border-b border-green-900/30',
    cyberpunk: 'bg-slate-950 text-cyan-400 py-10 px-6 md:px-12 border-b border-pink-500/10',
    nordic: 'bg-[#080f19] text-[#e2e8f0] py-10 px-6 md:px-12 border-b border-sky-950/40',
    sunset: 'bg-[#140b09] text-amber-50 py-10 px-6 md:px-12 border-b border-[#e36940]/10'
  };

  const titleStyle = {
    bold: 'font-sans font-black text-center tracking-tighter uppercase text-[#F5F5F5] responsive-section-title',
    modern: 'font-display font-bold text-center tracking-tight responsive-section-title',
    minimalist: 'font-display font-light text-center tracking-tighter uppercase responsive-section-title',
    terminal: 'font-mono font-bold text-left tracking-wide uppercase responsive-section-title',
    cyberpunk: 'font-display font-extrabold text-center tracking-wider sm:tracking-widest uppercase neon-glow responsive-section-title',
    nordic: 'font-mono font-bold text-center tracking-tight text-[#e2e8f0] responsive-section-title',
    sunset: 'font-display font-semibold text-center tracking-wider sm:tracking-widest text-amber-100 responsive-section-title'
  };

  const cardStyle = {
    bold: 'p-5 border border-white/15 bg-white/[0.01] hover:border-[#ff4e00]/40 transition-all duration-300 text-slate-200 rounded-none hover:bg-[#ff4e00]/[0.01]',
    modern: 'p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/20 transition-all duration-300',
    minimalist: 'p-5 rounded-xl border border-amber-900/10 hover:shadow-lg transition-all duration-300 bg-amber-50/20',
    terminal: 'p-4 border border-green-500/20 hover:border-green-500 bg-slate-950 text-green-400 font-mono transition-all',
    cyberpunk: 'p-5 rounded-xl bg-slate-950 border border-cyan-500/20 hover:border-pink-500 shadow-md hover:shadow-pink-500/5 transition-all text-cyan-300',
    nordic: 'p-5 rounded-xl bg-sky-950/25 border border-sky-900/30 hover:border-sky-500/40 hover:bg-sky-500/[0.01] transition-all duration-300 text-slate-200',
    sunset: 'p-5 rounded-sm bg-[#1c0e0b] border border-[#e36940]/20 hover:border-[#e36940] transition-all duration-300 text-amber-100/90 hover:bg-[#e36940]/[0.02]'
  };

  const progressStyle = {
    bold: 'h-1.5 bg-white/10 overflow-hidden rounded-none',
    modern: 'h-2 bg-slate-800 rounded-full overflow-hidden',
    minimalist: 'h-1.5 bg-amber-900/10 rounded-full overflow-hidden',
    terminal: 'h-3 border border-green-500/30 p-0.5 bg-black',
    cyberpunk: 'h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/15',
    nordic: 'h-2 bg-slate-900 rounded-full overflow-hidden',
    sunset: 'h-1.5 bg-amber-950/30 rounded-none overflow-hidden'
  };

  const fillStyle = {
    bold: 'bg-[#ff4e00] h-full',
    modern: 'bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full',
    minimalist: 'bg-slate-800 h-full rounded-full',
    terminal: 'bg-green-500 h-full',
    cyberpunk: 'bg-gradient-to-r from-pink-500 to-cyan-400 h-full rounded-full',
    nordic: 'bg-gradient-to-r from-sky-500 to-sky-300 h-full rounded-full',
    sunset: 'bg-gradient-to-r from-amber-600 to-[#e36940] h-full'
  };

  const badgeStyle = (isActive: boolean) => {
    if (isActive) {
      switch (activeTheme) {
        case 'bold': return 'bg-[#ff4e00] text-black font-black uppercase rounded-sm border border-[#ff4e00]';
        case 'minimalist': return 'bg-slate-900 text-white border border-slate-900';
        case 'terminal': return 'bg-green-500 text-black font-bold border border-green-500';
        case 'cyberpunk': return 'bg-gradient-to-r from-pink-500 to-cyan-400 text-black font-extrabold shadow-md shadow-pink-500/20';
        case 'nordic': return 'bg-sky-500 text-slate-950 font-bold border border-sky-500 rounded-lg';
        case 'sunset': return 'bg-[#e36940] text-amber-100 font-bold border border-[#e36940] rounded-none';
        default: return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      }
    } else {
      switch (activeTheme) {
        case 'bold': return 'border border-white/10 text-slate-400 hover:text-white hover:border-white/30 bg-transparent rounded-sm';
        case 'minimalist': return 'border border-amber-900/10 text-slate-600 bg-amber-100/10 hover:bg-slate-200/50';
        case 'terminal': return 'border border-green-500/30 text-green-500/60 hover:text-green-400 hover:border-green-500 bg-slate-950';
        case 'cyberpunk': return 'border border-cyan-500/20 text-cyan-500/60 hover:text-cyan-400 hover:border-cyan-500 bg-slate-950';
        case 'nordic': return 'border border-sky-900/40 text-sky-450 bg-sky-950/30 hover:bg-sky-950/60 rounded-lg';
        case 'sunset': return 'border border-[#e36940]/25 text-[#fca5a5]/70 bg-[#1c0e0b]/50 hover:bg-[#e36940]/10 rounded-none';
        default: return 'border border-slate-800 text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-900/60';
      }
    }
  };

  return (
    <section id="skills-section" className={`w-full ${containerStyle[activeTheme]} transition-colors duration-300`}>
      <div className="w-full max-w-[95%] mx-auto space-y-6">
        
        {/* Section Heading */}
        <div className="space-y-3">
          <h2 id="skills-heading" className={titleStyle[activeTheme]}>
            {activeTheme === 'terminal' ? 'EX-02: SKILLS_MATRIX' : 'Expertise & Capabilities'}
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
            {activeTheme === 'terminal' ? 'CORE PROTOCOLS & ARCHITECTURAL STACKS' : 'Interactive category indexing'}
          </p>
        </div>

        {/* Filter Badges Row */}
        <div id="skills-filter-row" className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {categories.map((category) => (
            <button
              key={category}
              id={`skill-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-tight uppercase transition-all duration-300 ${badgeStyle(selectedCategory === category)}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dynamic Skills Grid */}
        <div id="skills-deck" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          {filteredSkills.map((skill, index) => (
            <div 
              key={skill.name + index}
              id={`skill-card-${index}`} 
              className={`flex flex-col space-y-3.5 group relative hover:translate-y-[-2px] transition-all duration-300 ${cardStyle[activeTheme]}`}
            >
              {/* Card Decorator Icon on Top of Category */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-xs font-mono opacity-80">
                  {getCategoryIcon(skill.category)}
                  <span className={`${activeTheme === 'minimalist' ? 'text-slate-500 font-sans font-semibold' : 'text-slate-400'}`}>
                    {skill.category}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className={`text-sm font-semibold font-accent tracking-tight ${
                activeTheme === 'terminal' ? 'text-green-300' : 'text-current'
              }`}>
                {skill.name}
              </h3>
            </div>
          ))}
          
          {filteredSkills.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-2xl">
              No skills found. Click the AI Wizard in the hero to import a resume and generate custom skill arrays!
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
