import React, { useState, useRef } from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, Code2, Award, Trophy, Upload, X, Eye, FileImage, Download, Trash2 } from 'lucide-react';
import { Experience, Education, Certification, Achievement, ThemeStyle } from '../types';

interface ExperienceProps {
  experience: Experience[];
  education: Education[];
  certifications?: Certification[];
  achievements?: Achievement[];
  activeTheme: ThemeStyle;
  onUpdateCertificationImage?: (index: number, base64: string) => void;
}

export default function Experiences({ 
  experience, 
  education, 
  certifications, 
  achievements, 
  activeTheme,
  onUpdateCertificationImage 
}: ExperienceProps) {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [selectedCertIndex, setSelectedCertIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const downloadCertificate = (name: string, imageUrl: string) => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      
      let ext = 'png';
      if (imageUrl.includes('application/pdf')) ext = 'pdf';
      else if (imageUrl.includes('image/jpeg')) ext = 'jpg';
      else if (imageUrl.includes('image/webp')) ext = 'webp';
      else if (imageUrl.includes('image/svg+xml')) ext = 'svg';

      link.download = `${name.replace(/\s+/g, '_')}_Certificate.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download cert file:", err);
    }
  };

  const handleFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateCertificationImage) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Certificate document should be under 8MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateCertificationImage(idx, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Theme styling overrides
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
    bold: 'text-3xl font-sans font-black tracking-tighter uppercase text-[#F5F5F5]',
    modern: 'text-3xl font-display font-bold text-center tracking-tight',
    minimalist: 'text-3xl font-display font-light text-center tracking-tighter uppercase',
    terminal: 'text-2xl font-mono font-bold text-left tracking-wide uppercase',
    cyberpunk: 'text-3xl font-display font-extrabold text-center tracking-widest uppercase neon-glow',
    nordic: 'text-3xl font-mono font-bold text-center tracking-tight text-[#e2e8f0]',
    sunset: 'text-3xl font-display font-semibold text-center tracking-widest text-amber-100'
  };

  const cardStyle = {
    bold: 'p-6 border border-white/10 bg-white/[0.01] hover:border-[#ff4e00]/40 transition-all rounded-none hover:bg-white/[0.02]',
    modern: 'p-6 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/15 transition-all shadow-md',
    minimalist: 'p-6 rounded-xl border border-amber-900/10 hover:shadow-lg transition-all bg-amber-50/10',
    terminal: 'p-5 border border-green-500/20 bg-slate-950 hover:border-green-500 text-green-400 Transition-all',
    cyberpunk: 'p-6 rounded-xl bg-slate-950 border border-pink-500/10 hover:border-cyan-400 shadow-sm transition-all text-cyan-300',
    nordic: 'p-6 rounded-2xl bg-[#0b1625]/80 border border-sky-900/30 hover:border-sky-500/45 transition-all shadow-md text-slate-200',
    sunset: 'p-6 rounded-sm bg-[#1c0e0b] border border-[#e36940]/20 hover:border-[#e36940] transition-all duration-300 text-amber-100/90'
  };

  return (
    <section id="experience-section" className={`w-full ${containerStyle[activeTheme]} transition-colors duration-300`}>
      <div className="w-full max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Experience Timeline */}
        <div id="experience-timeline" className="space-y-8">
          <div className="space-y-2">
            <h3 className={`${titleStyle[activeTheme]} flex items-center space-x-3 text-left justify-start`}>
              <Briefcase className={`w-5 h-5 shrink-0 ${activeTheme === 'bold' ? 'text-[#ff4e00]' : 'text-purple-400'}`} />
              <span>{activeTheme === 'terminal' ? 'EX-04_CAREER_PROG' : 'Work Experience'}</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-mono tracking-wide uppercase">Chronological work timeline</p>
          </div>

          <div id="exp-nodes" className="relative border-l border-slate-800 dark:border-white/10 ml-3 pl-6 space-y-8">
            {experience.map((work, idx) => (
              <div key={work.company + idx} id={`exp-node-${idx}`} className="relative">
                {/* Visual Timeline Circle Indicator */}
                <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  activeTheme === 'bold'
                    ? 'border-[#ff4e00] bg-[#050505]'
                    : activeTheme === 'minimalist'
                      ? 'border-slate-800 bg-white'
                      : activeTheme === 'terminal'
                        ? 'border-green-500 bg-black'
                        : activeTheme === 'cyberpunk'
                          ? 'border-pink-500 bg-slate-950'
                          : activeTheme === 'nordic'
                            ? 'border-sky-500 bg-slate-950'
                            : activeTheme === 'sunset'
                              ? 'border-[#e36940] bg-[#140b09]'
                              : 'border-purple-500 bg-slate-950'
                }`} />

                <div className={`${cardStyle[activeTheme]} flex flex-col gap-3`}>
                  {/* Job Details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="text-base font-bold font-accent text-slate-950 dark:text-white leading-tight">
                      {work.role}
                    </h4>
                    <span className="flex items-center space-x-1 text-[11px] text-slate-500 font-mono shrink-0">
                      <span>{work.startDate} – {work.endDate}</span>
                    </span>
                  </div>

                  <p className={`text-xs font-semibold ${
                    activeTheme === 'bold' 
                      ? 'text-[#ff4e00]' 
                      : activeTheme === 'nordic'
                        ? 'text-sky-400'
                        : activeTheme === 'sunset'
                          ? 'text-[#e36940]'
                          : activeTheme === 'minimalist' 
                            ? 'text-amber-900' 
                            : 'text-purple-400 dark:text-purple-400'
                  }`}>
                    {work.company}
                  </p>

                  {/* Bullet description layout */}
                  <ul className="space-y-1 text-xs leading-relaxed text-slate-400 list-disc list-inside">
                    {work.description.map((bullet, ii) => (
                      <li key={ii} className="leading-relaxed list-item pl-0.5">
                        <span className="text-slate-400 dark:text-slate-300">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack used in the role */}
                  {work.technologies && work.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/40 dark:border-white/5">
                      {work.technologies.map(t => (
                        <span 
                          key={t} 
                          className={`font-mono text-[9px] p-0.5 px-2 border ${
                            activeTheme === 'bold'
                              ? 'bg-[#ff4e00]/5 border-[#ff4e00]/25 text-[#ff4e00] rounded-none'
                              : activeTheme === 'nordic'
                                ? 'bg-sky-500/10 border-sky-400/20 text-sky-400 rounded-lg'
                                : activeTheme === 'sunset'
                                  ? 'bg-[#e36940]/10 border-[#e36940]/20 text-[#fca5a5] rounded-none'
                                  : 'bg-slate-950 text-slate-300 border border-slate-800/30 rounded'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}

            {experience.length === 0 && (
              <p className="text-xs text-slate-500 font-mono italic">No career timeline found. Use the AI Wizard in the hero to populate customizable details!</p>
            )}
          </div>

          {/* Prizes Won subsection */}
          <div className="space-y-4 pt-6 border-t border-slate-800/20 dark:border-white/10">
            <div className="space-y-1">
              <h4 className={`${titleStyle[activeTheme]} flex items-center space-x-2.5 text-lg justify-start`}>
                <Trophy className={`w-4 h-4 shrink-0 ${activeTheme === 'bold' ? 'text-[#ff4e00]' : 'text-pink-400'}`} />
                <span>{activeTheme === 'terminal' ? 'EX-08_AWARDS' : 'Prizes Won'}</span>
              </h4>
              <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">VICTORY LOG</p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  title: "1st Prize in Web Development",
                  college: "Sona Engineering College"
                },
                {
                  title: "2nd Prize in Project Presentation",
                  college: "Hackwave KEC"
                },
                {
                  title: "2nd Prize in Project Presentation",
                  college: "Ruby Day KEC"
                }
              ].map((prize, pIdx) => (
                <div 
                  key={pIdx}
                  className={`p-3 border ${
                    activeTheme === 'bold'
                      ? 'border-white/10 bg-white/[0.01] hover:border-[#ff4e00]/40 rounded-none'
                      : activeTheme === 'minimalist'
                        ? 'border-amber-900/10 bg-amber-50/10 hover:shadow-md rounded-xl shadow-sm'
                        : activeTheme === 'terminal'
                          ? 'border-green-500/20 bg-slate-950 hover:border-green-500 text-green-400 font-mono'
                          : activeTheme === 'cyberpunk'
                            ? 'border-pink-500/10 bg-slate-950 hover:border-cyan-400 rounded-xl text-cyan-300'
                            : 'rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/15'
                  } transition-all duration-300 flex items-center justify-between gap-4`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded ${
                      activeTheme === 'cyberpunk' 
                        ? 'bg-pink-500/10 text-pink-400' 
                        : activeTheme === 'bold'
                          ? 'bg-[#ff4e00]/5 text-[#ff4e00]'
                          : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      <Trophy className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {prize.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {prize.college}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education Timeline */}
        <div id="education-timeline" className="space-y-8">
          <div className="space-y-2">
            <h3 className={`${titleStyle[activeTheme]} flex items-center space-x-3 text-left justify-start`}>
              <GraduationCap className={`w-5 h-5 shrink-0 ${activeTheme === 'bold' ? 'text-[#ff4e00]' : 'text-blue-400'}`} />
              <span>{activeTheme === 'terminal' ? 'EX-05_ACADEMICS' : 'Education'}</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-mono tracking-wide uppercase">Academics and certifications</p>
          </div>

          <div id="edu-nodes" className="relative border-l border-slate-800 dark:border-white/10 ml-3 pl-6 space-y-4">
            {education.map((school, idx) => (
              <div key={school.institution + idx} id={`edu-node-${idx}`} className="relative">
                {/* Timeline node */}
                <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  activeTheme === 'bold'
                    ? 'border-[#ff4e00] bg-[#050505]'
                    : activeTheme === 'minimalist'
                      ? 'border-slate-800 bg-white'
                      : activeTheme === 'terminal'
                        ? 'border-green-500 bg-black'
                        : activeTheme === 'cyberpunk'
                          ? 'border-pink-500 bg-slate-950'
                          : activeTheme === 'nordic'
                            ? 'border-sky-500 bg-slate-950'
                            : activeTheme === 'sunset'
                              ? 'border-[#e36940] bg-[#140b09]'
                              : 'border-purple-500 bg-slate-950'
                }`} />

                <div className={`${cardStyle[activeTheme]} flex flex-col gap-3`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="text-base font-bold font-accent text-slate-950 dark:text-white leading-tight">
                      {school.degree}
                    </h4>
                    <span className="flex items-center space-x-1 text-[11px] text-slate-500 font-mono shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span>{school.startDate} – {school.endDate}</span>
                    </span>
                  </div>
                  
                  <p className={`text-xs font-semibold ${
                    activeTheme === 'bold' 
                      ? 'text-[#ff4e00]' 
                      : activeTheme === 'nordic'
                        ? 'text-sky-400'
                        : activeTheme === 'sunset'
                          ? 'text-[#e36940]'
                          : activeTheme === 'minimalist' 
                            ? 'text-amber-900' 
                            : 'text-purple-400 dark:text-blue-400'
                  }`}>
                    {school.institution}
                  </p>
                  
                  {school.score && (
                    <div className={`p-2 inline-block border w-fit ${
                      activeTheme === 'bold'
                        ? 'bg-[#ff4e00]/5 border-[#ff4e00]/25 text-[#ff4e00] rounded-none'
                        : 'bg-slate-950/40 rounded border border-slate-800/30'
                    }`}>
                      <span className={`font-mono text-xs font-semibold ${
                        activeTheme === 'bold' ? 'text-[#ff4e00]' : 'text-purple-400'
                      }`}>{school.score}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {education.length === 0 && (
              <p className="text-xs text-slate-500 font-mono italic">No academic catalog found.</p>
            )}
          </div>

          {/* Certifications and Achievements Block */}
          {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
            <div id="credentials-timeline" className="space-y-8 pt-8 border-t border-slate-800/20 dark:border-white/10">
              
              {/* Certifications Subsection */}
              {certifications && certifications.length > 0 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className={`${titleStyle[activeTheme]} flex items-center space-x-2.5 text-lg justify-start`}>
                      <Award className={`w-4 h-4 shrink-0 col-span-1 ${activeTheme === 'bold' ? 'text-[#ff4e00]' : 'text-purple-400 dark:text-purple-400'}`} />
                      <span>{activeTheme === 'terminal' ? 'EX-06_CREDENTIALS' : 'Certifications'}</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">Technical Bootcamps & Specializations</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {certifications.map((cert, idx) => (
                      <div 
                        key={cert.name + idx} 
                        onClick={() => {
                          if (cert.imageUrl) {
                            setSelectedCert(cert);
                            setSelectedCertIndex(idx);
                          } else {
                            fileInputRefs.current[idx]?.click();
                          }
                        }}
                        className={`p-3.5 border cursor-pointer hover:scale-[1.01] hover:shadow-lg relative group overflow-hidden ${
                          activeTheme === 'bold'
                            ? 'border-white/10 bg-white/[0.01] hover:border-[#ff4e00]/40 rounded-none'
                            : activeTheme === 'minimalist'
                              ? 'border-amber-900/10 bg-amber-50/10 hover:shadow-md rounded-xl'
                              : activeTheme === 'terminal'
                                ? 'border-green-500/20 bg-slate-950 hover:border-green-500 text-green-400 font-mono'
                                : activeTheme === 'cyberpunk'
                                  ? 'border-pink-500/10 bg-slate-950 hover:border-cyan-400 rounded-xl text-cyan-300'
                                  : 'rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/15'
                        } transition-all duration-300 flex flex-col justify-between`}
                        title={cert.imageUrl ? "Click to view/download certification document" : "Click to upload certification proof document"}
                      >
                        <input 
                          type="file"
                          ref={el => fileInputRefs.current[idx] = el}
                          className="hidden"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileChange(idx, e)}
                        />
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                              {cert.name}
                            </h5>
                          </div>
                          <p className={`text-[10px] font-mono mt-1 ${activeTheme === 'bold' ? 'text-[#ff4e00]' : 'text-slate-400'}`}>
                            {cert.issuer}
                          </p>
                        </div>

                        {cert.imageUrl ? (
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-900/10 dark:border-white/5">
                            <div className="flex items-center space-x-1.5 text-[9px] text-pink-500 dark:text-cyan-400 font-semibold select-none">
                              <Eye className="w-3 h-3 text-pink-500 dark:text-cyan-400" />
                              <span>View Certificate</span>
                            </div>
                            <div className="text-[9px] text-slate-500 font-mono">
                              {cert.date}
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-900/10 dark:border-white/5">
                            <div 
                              className="flex items-center space-x-1 text-[9px] text-slate-400 dark:text-slate-400 hover:text-purple-400 transition-colors select-none font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRefs.current[idx]?.click();
                              }}
                            >
                              <Upload className="w-3 h-3 text-slate-500 mr-0.5" />
                              <span>Upload Proof (PDF/Image)</span>
                            </div>
                            <div className="text-[9px] text-slate-500 font-mono">
                              {cert.date}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Subsection */}
              {achievements && achievements.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-1">
                    <h4 className={`${titleStyle[activeTheme]} flex items-center space-x-2.5 text-lg justify-start`}>
                      <Trophy className={`w-4 h-4 shrink-0 ${activeTheme === 'bold' ? 'text-[#ff4e00]' : 'text-purple-400 dark:text-yellow-500'}`} />
                      <span>{activeTheme === 'terminal' ? 'EX-07_HONORS' : 'Achievements'}</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">Hackathons & Competitive Coding</p>
                  </div>

                  <div className="space-y-2.5">
                    {achievements.map((ach, idx) => (
                      <div 
                        key={ach.title + idx}
                        className={`p-3 border ${
                          activeTheme === 'bold'
                            ? 'border-white/10 bg-white/[0.01] hover:border-[#ff4e00]/40 rounded-none'
                            : activeTheme === 'minimalist'
                              ? 'border-amber-900/10 bg-amber-50/10 hover:shadow-md rounded-xl shadow-sm'
                              : activeTheme === 'terminal'
                                ? 'border-green-500/20 bg-slate-950 hover:border-green-500 text-green-400 font-mono'
                                : activeTheme === 'cyberpunk'
                                  ? 'border-pink-500/10 bg-slate-950 hover:border-cyan-400 rounded-xl text-cyan-300'
                                  : 'rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/15'
                        } transition-all duration-300 flex items-center justify-between gap-4`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-1.5 rounded ${activeTheme === 'bold' ? 'bg-[#ff4e00]/5 text-[#ff4e00]' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            <Trophy className="w-3.5 h-3.5 shrink-0" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                              {ach.title}
                            </h5>
                            <p className="text-[10px] text-slate-400">
                              {ach.issuer}
                            </p>
                          </div>
                        </div>
                        {ach.date && (
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">{ach.date}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* Lightbox / particular certification viewer modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
          onClick={() => {
            setSelectedCert(null);
            setSelectedCertIndex(null);
          }}
        >
          <div 
            className="relative max-w-3xl w-full max-h-[92vh] bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-semibold text-purple-400 font-mono uppercase tracking-wide">VERIFIED CREDENTIAL DOCUMENT</span>
                <h2 className="text-base md:text-xl font-bold text-white mt-1 leading-snug">{selectedCert.name}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedCert.issuer} – {selectedCert.date}</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedCert(null);
                  setSelectedCertIndex(null);
                }}
                className="p-1 px-3 rounded-lg bg-slate-1000 dark:bg-slate-950 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-4 focus:ring-1 focus:ring-purple-400"
                title="Close View"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
            
            {/* Visual presentation frame (PDF embed iframe or Image renderer) */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-950/70 border border-slate-850 rounded-xl p-3 min-h-[300px]">
              {selectedCert.imageUrl ? (
                selectedCert.imageUrl.includes('application/pdf') ? (
                  <iframe 
                    src={selectedCert.imageUrl} 
                    className="w-full h-[55vh] rounded-lg border-none"
                    title={selectedCert.name}
                  />
                ) : (
                  <img 
                    src={selectedCert.imageUrl} 
                    alt={selectedCert.name} 
                    className="max-w-full max-h-[58vh] object-contain rounded-lg shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                )
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileImage className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                  <p className="text-xs text-slate-400 font-mono">No certificate proof uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
