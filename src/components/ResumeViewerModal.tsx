import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, MapPin, Github, Linkedin, Calendar, Award, Briefcase, GraduationCap, Code, Printer, Download, FileText, Upload } from 'lucide-react';
import { PortfolioData, UploadedResume } from '../types';

interface ResumeViewerModalProps {
  portfolioData: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
  uploadedResume: UploadedResume | null;
  onClearUploadedResume: () => void;
  onUploadResumeClick: () => void;
}

export default function ResumeViewerModal({ 
  portfolioData, 
  isOpen, 
  onClose,
  uploadedResume,
  onClearUploadedResume,
  onUploadResumeClick
}: ResumeViewerModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    // 1. Attempt standard print for local windows
    try {
      window.print();
    } catch (e) {
      console.warn("Standard print blocked by browser iframe context", e);
    }

    // 2. Generate and trigger download of a stunning standalone HTML version of the resume
    // which has its own print action, styled with active theme colors, completely breaking out of the sandbox.
    const skillsHtml = Object.entries(skillsByCategory).map(([category, catSkills]) => `
      <div style="margin-bottom: 15px;">
        <p style="font-size: 11px; font-family: monospace; font-weight: 600; color: #ec4899; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 6px 0;">${category}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${catSkills.map(skill => `
            <span style="padding: 2px 8px; border-radius: 4px; background-color: #0f172a; border: 1px solid rgba(236,72,153,0.15); font-size: 10px; font-family: monospace; color: #cbd5e1;">${skill.name}</span>
          `).join('')}
        </div>
      </div>
    `).join('');

    const eduHtml = education.map(edu => `
      <div style="margin-bottom: 14px;">
        <p style="font-size: 12px; font-weight: bold; color: #ffffff; margin: 0;">${edu.degree}</p>
        <p style="font-size: 11px; color: #22d3ee; margin: 2px 0; font-weight: 500;">${edu.institution}</p>
        <p style="font-size: 10px; font-family: monospace; color: #94a3b8; margin: 0;">${edu.startDate} – ${edu.endDate} ${edu.score ? `• ${edu.score}` : ''}</p>
      </div>
    `).join('');

    const expHtml = experience.map(exp => `
      <div style="margin-bottom: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 5px;">
          <h4 style="font-size: 13px; font-weight: bold; color: #ffffff; margin: 0;">${exp.role}</h4>
          <span style="font-size: 10px; font-family: monospace; color: #22d3ee; background-color: #0c4a6e; padding: 1px 6px; border-radius: 4px;">${exp.startDate} – ${exp.endDate}</span>
        </div>
        <p style="font-size: 12px; font-weight: 600; color: #f472b6; margin: 3px 0 6px 0;">${exp.company}</p>
        <ul style="list-style-type: disc; padding-left: 18px; margin: 0 0 8px 0; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
          ${exp.description.map(bullet => `<li style="margin-bottom: 4px;">${bullet}</li>`).join('')}
        </ul>
        ${exp.technologies && exp.technologies.length > 0 ? `
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 6px;">
            <span style="font-size: 9px; font-family: monospace; opacity: 0.5; color: #94a3b8; text-transform: uppercase;">Tech:</span>
            ${exp.technologies.map(tech => `
              <span style="font-size: 9px; font-family: monospace; color: #cbd5e1; background-color: #1e1b4b; border: 1px solid rgba(99,102,241,0.2); padding: 1px 6px; border-radius: 4px;">${tech}</span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');

    const projHtml = projects.map(proj => `
      <div style="padding: 14px; border-radius: 8px; background-color: rgba(15,23,42,0.4); border: 1px solid rgba(236,72,153,0.05); margin-bottom: 12px;">
        <h4 style="font-size: 12px; font-weight: bold; color: #ffffff; margin: 0 0 4px 0;">${proj.title}</h4>
        <p style="font-size: 11px; color: #cbd5e1; line-height: 1.5; margin: 0 0 6px 0;">${proj.description}</p>
        ${proj.highlights && proj.highlights.length > 0 ? `
          <ul style="list-style-type: disc; padding-left: 16px; margin: 0 0 6px 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
            ${proj.highlights.map(high => `<li>${high}</li>`).join('')}
          </ul>
        ` : ''}
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          ${proj.tags.map(tag => `
            <span style="font-size: 9px; font-family: monospace; color: #f472b6; background-color: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.15); padding: 1px 5px; border-radius: 4px;">${tag}</span>
          `).join('')}
        </div>
      </div>
    `).join('');

    const certHtml = certifications.map(cert => `
      <div style="margin-bottom: 8px; font-size: 11px;">
        <p style="font-weight: bold; color: #ffffff; margin: 0;">${cert.name}</p>
        <p style="font-size: 10px; color: #22d3ee; margin: 0;">${cert.issuer} • ${cert.date}</p>
      </div>
    `).join('');

    const achHtml = achievements.map(ach => `
      <div style="margin-bottom: 8px; font-size: 11px;">
        <p style="font-weight: bold; color: #ffffff; margin: 0;">${ach.title}</p>
        <p style="font-size: 10px; color: #22d3ee; margin: 0;">${ach.issuer} ${ach.date ? `• ${ach.date}` : ''}</p>
      </div>
    `).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.name} - Resume</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #050b14;
      color: #94a3b8;
      margin: 0;
      padding: 30px 15px;
    }
    .toolbar {
      max-width: 850px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: flex-end;
    }
    .print-btn {
      padding: 10px 20px;
      border-radius: 8px;
      background: linear-gradient(135deg, #db2777, #c026d3);
      color: white;
      font-family: monospace;
      font-size: 12px;
      border: none;
      cursor: pointer;
      font-weight: bold;
      box-shadow: 0 4px 14px rgba(219,39,119,0.3);
      transition: all 0.2s;
    }
    .print-btn:hover {
      opacity: 0.9;
    }
    .resume-box {
      max-width: 850px;
      margin: 0 auto;
      background-color: #090f1a;
      border: 1px solid rgba(236,72,153,0.2);
      border-top: 4px solid #db2777;
      border-radius: 12px;
      padding: 35px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-b: 1px solid rgba(236,72,153,0.1);
      padding-bottom: 24px;
      margin-bottom: 25px;
      gap: 20px;
    }
    .header-info h2 { color: #ffffff; font-size: 26px; margin: 0 0 4px 0; }
    .header-info p.title { color: #22d3ee; font-family: monospace; font-size: 15px; font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0; }
    .header-info p.about { color: #94a3b8; font-size: 12px; margin: 0; line-height: 1.6; max-width: 480px; }
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
      background-color: rgba(2,6,23,0.4);
      padding: 14px;
      border: 1px solid rgba(236,72,153,0.1);
      border-radius: 8px;
      font-size: 11px;
    }
    .body-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 25px;
    }
    @media (min-width: 768px) {
      .contact-grid { grid-template-columns: repeat(2, 1fr); }
      .body-grid { grid-template-columns: 4fr 8fr; }
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid rgba(236,72,153,0.15);
      padding-bottom: 6px;
      margin-bottom: 14px;
    }
    .section-title h3 {
      font-size: 11px;
      font-family: monospace;
      color: #f472b6;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin: 0;
      font-weight: bold;
    }
    @media print {
      body {
        background-color: white !important;
        color: #1e293b !important;
        padding: 0;
      }
      .resume-box {
        border: none !important;
        box-shadow: none !important;
        background-color: white !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      .toolbar { display: none !important; }
      .header-info h2 { color: #0f172a !important; }
      .header-info p.title { color: #0284c7 !important; }
      .header-info p.about { color: #334155 !important; }
      .contact-grid {
        background-color: #f8fafc !important;
        border-color: #cbd5e1 !important;
        color: #1e293b !important;
      }
      .section-title h3 { color: #db2777 !important; }
      h4, p, span, li, strong { color: #0f172a !important; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="print-btn" onclick="window.print()">Print This Page / Save PDF</button>
  </div>
  <div class="resume-box">
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(236,72,153,0.1); padding-bottom: 20px; flex-wrap: wrap; gap: 15px;">
        <div class="header-info">
          <h2>${personalInfo.name}</h2>
          <p class="title">Data Analyst</p>
          <p class="about">${personalInfo.about}</p>
        </div>
        <div class="contact-grid">
          ${personalInfo.email ? `<div><strong>Email:</strong> ${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div><strong>Phone:</strong> ${personalInfo.phone}</div>` : ''}
          ${personalInfo.location ? `<div><strong>Location:</strong> ${personalInfo.location}</div>` : ''}
          ${personalInfo.github ? `<div><strong>GitHub:</strong> ${personalInfo.github}</div>` : ''}
          ${personalInfo.linkedin ? `<div style="grid-column: span 2;"><strong>LinkedIn:</strong> ${personalInfo.linkedin}</div>` : ''}
        </div>
      </div>
      
      <div class="body-grid">
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div>
            <div class="section-title">
              <h3>Skills Matrix</h3>
            </div>
            ${skillsHtml}
          </div>
          
          <div>
            <div class="section-title">
              <h3>Education</h3>
            </div>
            ${eduHtml}
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div>
            <div class="section-title">
              <h3>Professional Experience</h3>
            </div>
            ${expHtml}
          </div>
          
          <div>
            <div class="section-title">
              <h3>Key Project Portfolios</h3>
            </div>
            ${projHtml}
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <div class="section-title">
                <h3>Certifications</h3>
              </div>
              ${certHtml}
            </div>
            <div>
              <div class="section-title">
                <h3>Achievements</h3>
              </div>
              ${achHtml}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const { personalInfo, skills, experience, projects, education, certifications, achievements } = portfolioData;

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other Skills';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        
        {/* Animated Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-4xl bg-[#090f1a] border-2 border-pink-500/50 rounded-2xl shadow-[0_0_50px_rgba(236,72,153,0.3)] overflow-hidden text-slate-100 flex flex-col my-8"
          id="resume-viewer-modal-card"
        >
          {/* Decorative scanner line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-fuchsia-500" />
          
          {/* Header Bar */}
          <div className="flex justify-between items-center px-6 py-4 bg-slate-950/60 border-b border-pink-500/10 shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-pink-400 uppercase">
                SYSTEM::COMPILED_RESUME
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-fuchsia-600 border border-pink-500/30 text-white hover:opacity-90 text-xs font-mono transition-all cursor-pointer shadow-lg shadow-pink-500/10"
                title="Download as PDF or Print document"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download / Print PDF</span>
              </button>
              
              <button
                onClick={onClose}
                className="p-1 px-1.5 rounded-lg border border-pink-500/20 text-pink-500 hover:bg-pink-500/10 hover:text-pink-400 transition-all font-sans cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Document Container */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh] space-y-8 print:p-0 print:text-black print:bg-white" id="resume-printable-area">
            
            {/* Printable adjustments stylesheet */}
            <style dangerouslySetInnerHTML={{
              __html: `
                @media print {
                  /* Hide background grids and scroll bars */
                  body {
                    background: white !important;
                    color: black !important;
                  }
                  #resume-viewer-modal-card {
                    border: none !important;
                    box-shadow: none !important;
                    background: white !important;
                    color: black !important;
                    position: static !important;
                    overflow: visible !important;
                    max-height: none !important;
                    width: 100% !important;
                  }
                  #resume-printable-area {
                    background: white !important;
                    color: black !important;
                    overflow: visible !important;
                    max-height: none !important;
                    padding: 0 !important;
                  }
                  /* Force text color in PDF compiler */
                  .text-white, .text-slate-100, .text-slate-200, .text-slate-300, .text-slate-400 {
                    color: #0f172a !important;
                  }
                  .text-cyan-400, .text-cyan-300, .text-pink-400, .text-purple-400 {
                    color: #1e293b !important;
                  }
                  .bg-slate-950, .bg-slate-900, .bg-slate-950/40, .bg-slate-950/20 {
                    background-color: transparent !important;
                    border-color: #e2e8f0 !important;
                  }
                  .border-pink-500/10, .border-pink-500/5, .border-pink-500/50 {
                    border-color: #cbd5e1 !important;
                  }
                  .print\\:text-black { color: #000000 !important; }
                  .print\\:border-slate-300 { border-color: #cbd5e1 !important; }
                  .print\\:bg-slate-100 { background-color: #f1f5f9 !important; }
                }
              `
            }} />

            {/* Core Header info */}
            <div className="border-b border-pink-500/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:border-slate-300">
              <div>
                <h2 className="text-3xl font-display font-bold tracking-tight text-white print:text-black">{personalInfo.name}</h2>
                <p className="text-lg font-mono text-cyan-400 mt-1 uppercase tracking-wider font-semibold">Data Analyst</p>
                <p className="text-sm text-slate-400 max-w-xl mt-3 leading-relaxed print:text-slate-800">{personalInfo.about}</p>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-slate-950/40 p-4 rounded-xl border border-pink-500/10 print:bg-slate-100 print:text-black print:border-slate-300 w-full md:w-auto shrink-0">
                {personalInfo.email && (
                  <div className="flex items-center space-x-2 text-xs">
                    <Mail className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span className="opacity-90">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center space-x-2 text-xs">
                    <Phone className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span className="opacity-90">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center space-x-2 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span className="opacity-90">{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center space-x-2 text-xs">
                    <Github className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-cyan-400">{personalInfo.github.replace('https://', '')}</a>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center space-x-2 text-xs col-span-1 sm:col-span-2">
                    <Linkedin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-cyan-400 break-all">{personalInfo.linkedin.replace('https://www.', '')}</a>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column (Skills & Ed) */}
              <div className="md:col-span-4 space-y-6">
                
                {/* Skills section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-1.5 border-b border-pink-500/10 pb-1.5 print:border-slate-300">
                    <Code className="w-4 h-4 text-pink-500" />
                    <h3 className="text-sm font-mono tracking-widest text-pink-400 uppercase font-bold">Skills Matrix</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                      <div key={category} className="space-y-1.5">
                        <p className="text-xs font-mono font-semibold text-cyan-300 opacity-80 uppercase tracking-widest">{category}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {catSkills.map(skill => (
                            <span
                              key={skill.name}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-pink-500/10 text-[10px] font-mono text-slate-300 print:bg-slate-100 print:text-black print:border-slate-300"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education Section */}
                {education && education.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1.5 border-b border-pink-500/10 pb-1.5 print:border-slate-300">
                      <GraduationCap className="w-4 h-4 text-pink-500" />
                      <h3 className="text-sm font-mono tracking-widest text-pink-400 uppercase font-bold">Education</h3>
                    </div>

                    <div className="space-y-4">
                      {education.map((edu, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-xs font-bold text-white print:text-black">{edu.degree}</p>
                          <p className="text-xs opacity-80 text-cyan-300 font-medium">{edu.institution}</p>
                          <div className="flex items-center space-x-1.5 text-[10px] font-mono opacity-70">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>{edu.startDate} – {edu.endDate}</span>
                            {edu.score && <span>• {edu.score}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (Experience & Projects) */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Work Experience */}
                {experience && experience.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1.5 border-b border-pink-500/10 pb-1.5 print:border-slate-300">
                      <Briefcase className="w-4 h-4 text-pink-500" />
                      <h3 className="text-sm font-mono tracking-widest text-pink-400 uppercase font-bold">Professional Experience</h3>
                    </div>

                    <div className="space-y-5">
                      {experience.map((exp, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <h4 className="text-sm font-bold text-white print:text-black">{exp.role}</h4>
                            <span className="text-[10px] font-mono text-cyan-300">{exp.startDate} – {exp.endDate}</span>
                          </div>
                          <p className="text-xs font-mono text-pink-400 font-semibold opacity-90">{exp.company}</p>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300 print:text-slate-800">
                            {exp.description.map((bullet, bIdx) => (
                              <li key={bIdx} className="leading-relaxed">{bullet}</li>
                            ))}
                          </ul>
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono opacity-50 uppercase tracking-wider">Tech:</span>
                              {exp.technologies.map(tech => (
                                <span key={tech} className="text-[9px] font-mono text-cyan-300/90 rounded bg-slate-950 px-1.5 py-0.5 border border-cyan-500/10 print:bg-slate-100 print:text-black print:border-slate-300">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Work/Projects */}
                {projects && projects.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1.5 border-b border-pink-500/10 pb-1.5 print:border-slate-300">
                      <Award className="w-4 h-4 text-pink-500" />
                      <h3 className="text-sm font-mono tracking-widest text-pink-400 uppercase font-bold">Key Project Portfolios</h3>
                    </div>

                    <div className="space-y-4">
                      {projects.map((proj, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-950/20 border border-pink-500/5 space-y-1.5 print:border-slate-300 print:p-0 print:bg-white print:space-y-1">
                          <h4 className="text-xs font-bold text-white print:text-black">{proj.title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed print:text-slate-800">{proj.description}</p>
                          {proj.highlights && proj.highlights.length > 0 && (
                            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400 print:text-slate-800">
                              {proj.highlights.map((high, hIdx) => (
                                <li key={hIdx}>{high}</li>
                              ))}
                            </ul>
                          )}
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {proj.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-mono text-pink-400 bg-pink-950/20 px-1.5 py-0.5 rounded border border-pink-500/10 print:bg-slate-100 print:text-black">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications and achievements side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {certifications && certifications.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-1.5 border-b border-pink-500/10 pb-1 print:border-slate-300">
                        <Award className="w-3.5 h-3.5 text-pink-500" />
                        <h3 className="text-xs font-mono tracking-widest text-pink-400 uppercase font-bold">Certifications</h3>
                      </div>
                      <div className="space-y-2">
                        {certifications.map((cert, id) => (
                          <div key={id} className="text-xs">
                            <p className="font-bold text-white print:text-black">{cert.name}</p>
                            <p className="text-[10px] opacity-75 text-cyan-300">{cert.issuer} • {cert.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {achievements && achievements.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-1.5 border-b border-pink-500/10 pb-1 print:border-slate-300">
                        <Award className="w-3.5 h-3.5 text-pink-500" />
                        <h3 className="text-xs font-mono tracking-widest text-pink-400 uppercase font-bold">Achievements</h3>
                      </div>
                      <div className="space-y-2">
                        {achievements.map((ach, id) => (
                          <div key={id} className="text-xs">
                            <p className="font-bold text-white print:text-black">{ach.title}</p>
                            <p className="text-[10px] opacity-75 text-cyan-300">{ach.issuer} {ach.date && `• ${ach.date}`}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

          <div className="px-6 py-4 bg-slate-950/60 border-t border-pink-500/10 flex justify-end shrink-0 print:hidden text-xs text-slate-500 font-mono">
            Generated securely offline via Gemini intelligence compiler
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
}
