import React, { useState } from 'react';
import { ExternalLink, Github, Sparkles, FolderGit2, X, BadgeAlert, Layers, Code } from 'lucide-react';
import { Project, ThemeStyle } from '../types';

interface ProjectsProps {
  projects: Project[];
  activeTheme: ThemeStyle;
}

export default function Projects({ projects, activeTheme }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Gather all unique tags
  const allTags = ['All', ...new Set(projects.flatMap(p => p.tags))];

  const filteredProjects = selectedTag === 'All'
    ? projects
    : projects.filter(p => p.tags.includes(selectedTag));

  // Theme configurations
  const containerStyle = {
    bold: 'bg-[#050505] text-[#F5F5F5] py-10 px-6 md:px-12 border-b border-white/10',
    modern: 'bg-slate-950 text-white py-10 px-6 md:px-12 border-b border-slate-800',
    minimalist: 'bg-amber-50/30 text-slate-900 py-10 px-6 md:px-12 border-b border-amber-900/10',
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
    bold: 'flex flex-col h-full border border-white/10 hover:border-[#ff4e00]/40 transition-all duration-300 group overflow-hidden bg-white/[0.01] rounded-none hover:bg-white/[0.02]',
    modern: 'rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full',
    minimalist: 'rounded-xl border border-amber-900/10 bg-white hover:bg-amber-50/10 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full',
    terminal: 'border border-green-500/20 hover:border-green-500 bg-slate-950 text-green-400 p-5 font-mono transition-all flex flex-col h-full',
    cyberpunk: 'rounded-xl bg-slate-950 border border-pink-500/15 hover:border-cyan-400 shadow-md hover:shadow-cyan-400/5 transition-all flex flex-col h-full overflow-hidden text-cyan-300',
    nordic: 'rounded-xl bg-[#0b1625]/80 border border-sky-900/30 hover:border-sky-500/40 hover:bg-sky-500/[0.01] transition-all duration-300 overflow-hidden flex flex-col h-full',
    sunset: 'rounded-sm bg-[#1c0e0b] border border-[#e36940]/20 hover:border-[#e36940] transition-all duration-300 overflow-hidden flex flex-col h-full text-amber-100/90 hover:bg-[#e36940]/[0.02]'
  };

  const tagStyle = (isActive: boolean) => {
    if (isActive) {
      switch (activeTheme) {
        case 'bold': return 'bg-[#ff4e00] text-black font-black uppercase rounded-none border border-[#ff4e00]';
        case 'minimalist': return 'bg-slate-900 text-white border border-slate-900';
        case 'terminal': return 'bg-green-500 text-black font-bold';
        case 'cyberpunk': return 'bg-cyan-400 text-black font-semibold';
        case 'nordic': return 'bg-sky-500 text-slate-950 font-bold rounded-lg border border-sky-500';
        case 'sunset': return 'bg-[#e36940] text-amber-100 font-bold rounded-none border border-[#e36940]';
        default: return 'bg-purple-500 text-white';
      }
    } else {
      switch (activeTheme) {
        case 'bold': return 'border border-white/10 text-slate-400 hover:text-white hover:border-white/30 bg-transparent rounded-none';
        case 'minimalist': return 'border border-amber-900/10 text-slate-600 hover:bg-amber-100/10';
        case 'terminal': return 'border border-green-500/30 text-green-500/60 hover:text-green-400';
        case 'cyberpunk': return 'border border-cyan-500/25 text-cyan-500/60 hover:text-cyan-400';
        case 'nordic': return 'border border-sky-900/40 text-sky-400 bg-sky-950/30 hover:bg-sky-950/60 rounded-lg';
        case 'sunset': return 'border border-[#e36940]/25 text-[#fca5a5]/70 bg-[#1c0e0b]/50 hover:bg-[#e36940]/10 rounded-none';
        default: return 'border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60';
      }
    }
  };

  return (
    <section id="projects-section" className={`w-full ${containerStyle[activeTheme]} transition-colors duration-300`}>
      <div className="w-full max-w-[95%] mx-auto space-y-6">
        
        {/* Section Heading */}
        <div className="space-y-3">
          <h2 id="projects-heading" className={titleStyle[activeTheme]}>
            {activeTheme === 'terminal' ? 'EX-03: SELECTED_PORTFOLIO_NODES' : 'Projects Showcase'}
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
        </div>

        {/* Tag Filters */}
        <div id="projects-tags-row" className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {allTags.map((tag) => (
            <button
              key={tag}
              id={`project-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-300 ${tagStyle(selectedTag === tag)}`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Projects Bento Grid */}
        <div id="projects-bento" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.title + index}
              id={`project-card-${index}`}
              className={`${cardStyle[activeTheme]} relative group`}
            >
              {/* Optional top accent line for Cyberpunk */}
              {activeTheme === 'cyberpunk' && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-cyan-400" />
              )}

              {/* Card Padding Wrapper */}
              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  
                  {/* Title and details */}
                  <div className="flex justify-between items-center text-xs">
                    <FolderGit2 className={`w-4 h-4 ${
                      activeTheme === 'terminal' 
                        ? 'text-green-500' 
                        : activeTheme === 'nordic'
                          ? 'text-sky-400'
                          : activeTheme === 'sunset'
                            ? 'text-[#e36940]'
                            : 'text-purple-400'
                    }`} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold font-accent tracking-tight leading-snug ${
                    activeTheme === 'terminal' 
                      ? 'text-green-300' 
                      : activeTheme === 'nordic'
                        ? 'text-sky-400 font-sans'
                        : activeTheme === 'sunset'
                          ? 'text-amber-400 font-serif'
                          : 'text-current'
                  }`}>
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs leading-relaxed line-clamp-3 leading-relaxed opacity-85 ${
                    activeTheme === 'minimalist' ? 'text-slate-600 font-serif' : 'text-slate-400'
                  }`}>
                    {project.description}
                  </p>
                </div>

                {/* Tags array */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map(t => (
                    <span 
                      key={t} 
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        activeTheme === 'minimalist' 
                          ? 'bg-amber-100 text-amber-800' 
                          : activeTheme === 'terminal'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/10'
                            : activeTheme === 'cyberpunk'
                              ? 'bg-pink-500/10 text-pink-400'
                              : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Interactive expand & Links */}
                <div className="flex items-center justify-between border-t border-slate-800/50 dark:border-white/5 pt-4 mt-auto">
                  
                  <button
                    id={`project-expand-${index}`}
                    onClick={() => setSelectedProject(project)}
                    className={`text-xs font-mono font-bold uppercase tracking-wider hover:underline ${
                      activeTheme === 'minimalist' ? 'text-slate-900' : 'text-purple-400 dark:text-purple-400'
                    }`}
                  >
                    View Mechanics &gt;
                  </button>

                  <div className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" title="Github Pipeline">
                        <Github className="w-4 h-4 hover:text-purple-400 dark:hover:text-purple-400 hover:scale-110 transition-all" />
                      </a>
                    )}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" title="Production Instance">
                        <ExternalLink className="w-4 h-4 hover:text-purple-400 dark:hover:text-purple-400 hover:scale-110 transition-all" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-2xl">
              No matching projects listed. Build a resume using the AI wizard above to parse customized project portfolios!
            </div>
          )}
        </div>

      </div>

      {/* Mechanics Expanded Overlay Modal */}
      {selectedProject && (
        <div id="project-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300">
          <div 
            id="project-detail-modal"
            className={`relative w-full max-w-lg overflow-hidden ${
              activeTheme === 'bold' 
                ? 'bg-[#0c0c0c] border border-[#ff4e00]/20 rounded-none' 
                : 'rounded-2xl bg-slate-900 border border-purple-500/25'
            } shadow-2xl p-6 md:p-8 space-y-6`}
          >
            {/* Action Top and Close */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="text-xl font-bold font-accent text-white mt-1 leading-snug">{selectedProject.title}</h4>
              </div>
              <button 
                id="close-project-modal"
                onClick={() => setSelectedProject(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll area */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <p className="text-sm text-slate-400 leading-relaxed font-sans">{selectedProject.description}</p>
              
              {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className={`text-xs uppercase tracking-widest font-mono font-bold block ${
                    activeTheme === 'bold' ? 'text-[#ff4e00]' : 'text-purple-400'
                  }`}>
                    Engineering Milestones
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                    {selectedProject.highlights.map((milestone, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        <span className="text-slate-300">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies chip array */}
              <div className="space-y-2 pt-2">
                <span className={`text-xs uppercase tracking-widest font-mono font-bold block text-left ${
                  activeTheme === 'bold' ? 'text-[#ff4e00]' : 'text-purple-400'
                }`}>
                  Tech Stack Integration
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tags.map(tech => (
                    <span 
                      key={tech} 
                      className={`font-mono text-[10px] p-1 px-2 border ${
                        activeTheme === 'bold'
                          ? 'bg-[#ff4e00]/5 border-[#ff4e00]/20 text-[#ff4e00] rounded-none'
                          : 'bg-slate-950 text-slate-300 border-slate-800/60 rounded'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal action bars */}
            <div className={`flex justify-end items-center border-t pt-4 mt-2 ${
              activeTheme === 'bold' ? 'border-white/10' : 'border-slate-800/60'
            }`}>
              <div className="flex items-center space-x-2">
                {selectedProject.github && (
                  <a 
                    href={selectedProject.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs transition-all font-mono ${
                      activeTheme === 'bold'
                        ? 'bg-white/5 border border-white/10 text-[#F5F5F5] hover:bg-white/10 rounded-sm'
                        : 'bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Pipeline</span>
                  </a>
                )}
                {selectedProject.link && (
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs transition-all font-mono ${
                      activeTheme === 'bold'
                        ? 'bg-[#ff4e00] text-black font-black hover:bg-[#ff4e00]/90 rounded-sm'
                        : 'bg-purple-600 rounded-xl text-white hover:bg-purple-500'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Instance</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
