import React, { useState, useEffect } from 'react';
import { initialPortfolioData } from './initialData';
import { PortfolioData, ThemeStyle, UploadedResume } from './types';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experiences from './components/Experience';
import Contacts from './components/Contact';
import ChatAgent from './components/ChatAgent';
import ResumeParser from './components/ResumeParser';
import ResumeViewerModal from './components/ResumeViewerModal';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import CustomCursor from './components/CustomCursor';
import { Sparkles, Bot, FileText, RefreshCw, Layers, ShieldCheck, Cpu, Upload, Settings } from 'lucide-react';

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialPortfolioData);
  const [activeTheme] = useState<ThemeStyle>('cyberpunk');
  const [isParserOpen, setIsParserOpen] = useState(false);
  const [isResumeViewerOpen, setIsResumeViewerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll height to render top scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [systemState, setSystemState] = useState<'Default template' | 'Parsed resume custom'>('Default template');
  const [uploadedResume, setUploadedResume] = useState<UploadedResume | null>(() => {
    try {
      const stored = localStorage.getItem('nk_uploaded_custom_resume');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Authentication state
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [publishingData, setPublishingData] = useState(false);

  const handlePublishPortfolioData = async () => {
    if (!authToken) return;
    setPublishingData(true);
    try {
      const response = await fetch('/api/auth/portfolio-data', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ portfolioData })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Portfolio data published to the database successfully!");
      } else {
        alert("Failed to publish portfolio data: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error publishing portfolio data: " + err.message);
    } finally {
      setPublishingData(false);
    }
  };

  const handleFileUploaded = (fileObj: UploadedResume) => {
    setUploadedResume(fileObj);
    localStorage.setItem('nk_uploaded_custom_resume', JSON.stringify(fileObj));
    setIsParserOpen(false);
    setIsResumeViewerOpen(true);
  };

  const handleClearUploadedResume = () => {
    setUploadedResume(null);
    localStorage.removeItem('nk_uploaded_custom_resume');
  };

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    localStorage.setItem('token', token);
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
    setShowAdminPanel(false);
    setShowAdminLogin(false);
  };

  // Load state and cache resume custom stats from LocalStorage
  useEffect(() => {
    const cachedData = localStorage.getItem('nk_portfolio_data');
    
    // Safety backup sync: Save any existing certified images into dedicated backup key so they aren't lost
    try {
      const backupStr = localStorage.getItem('nk_certs_backup') || '{}';
      const backupObj = JSON.parse(backupStr);
      let backupChanged = false;
      
      const currentCertsData = cachedData ? JSON.parse(cachedData).certifications : initialPortfolioData.certifications;
      if (currentCertsData) {
        currentCertsData.forEach((c: any) => {
          if (c.imageUrl && !backupObj[c.name]) {
            backupObj[c.name] = c.imageUrl;
            backupChanged = true;
          }
        });
        if (backupChanged) {
          localStorage.setItem('nk_certs_backup', JSON.stringify(backupObj));
        }
      }
    } catch (e) {
      console.error("Error backing up initial certs:", e);
    }

    if (cachedData) {
      try {
        let parsed = JSON.parse(cachedData) as PortfolioData;
        
        // Ensure core identifiers and Salem, Tamilnadu, India are pristine
        if (parsed.personalInfo) {
          parsed.personalInfo.location = "Salem, Tamilnadu, India";
          parsed.personalInfo.name = "Navaneethakrishnan M K";
          parsed.personalInfo.email = "naveenkrishnamoorthi2004@gmail.com";
          parsed.personalInfo.phone = "7812850966";
          parsed.personalInfo.github = "https://github.com/naveen-11122004";
          parsed.personalInfo.linkedin = "https://www.linkedin.com/in/navaneethakrishnan-krishnamoorthi-5a6094264";
        }

        // Restore certifications from backup automatically if missing
        try {
          const backupStr2 = localStorage.getItem('nk_certs_backup');
          if (backupStr2) {
            const backupObj2 = JSON.parse(backupStr2);
            if (parsed.certifications) {
              parsed.certifications = parsed.certifications.map(cert => {
                if (!cert.imageUrl && backupObj2[cert.name]) {
                  return { ...cert, imageUrl: backupObj2[cert.name] };
                }
                return cert;
              });
            }
          }
        } catch (e) {
          console.error("Failed to restore certs from backup:", e);
        }

        let certs = parsed.certifications || [];
        const foundIndex = certs.findIndex(c => c.name === "Data Analytics Skill");
        
        if (foundIndex === -1) {
          certs = [
            {
              name: "Data Analytics Skill",
              issuer: "Oneroadmap",
              date: "2025"
            },
            ...certs
          ];
          parsed.certifications = certs;
          localStorage.setItem('nk_portfolio_data', JSON.stringify(parsed));
        } else if (certs[foundIndex].issuer !== "Oneroadmap" || certs[foundIndex].date !== "2025") {
          certs[foundIndex] = {
            ...certs[foundIndex],
            issuer: "Oneroadmap",
            date: "2025"
          };
          parsed.certifications = certs;
          localStorage.setItem('nk_portfolio_data', JSON.stringify(parsed));
        }

        // Force all certifications to have the year 2025 for consistency
        let updatedCerts = certs.map(c => ({ ...c, date: "2025" }));
        let needsSave = false;
        for (let i = 0; i < certs.length; i++) {
          if (certs[i].date !== "2025") {
            needsSave = true;
            break;
          }
        }

        // Correct any legacy occurrences of 'relaince' to 'Reliance' in education institution name
        if (parsed.education) {
          parsed.education = parsed.education.map(edu => {
            if (edu.institution && /relaince/i.test(edu.institution)) {
              needsSave = true;
              return {
                ...edu,
                institution: edu.institution.replace(/relaince/gi, "Reliance")
              };
            }
            return edu;
          });
        }

        if (needsSave) {
          parsed.certifications = updatedCerts;
          localStorage.setItem('nk_portfolio_data', JSON.stringify(parsed));
        }
        
        setPortfolioData(parsed);
        setSystemState('Parsed resume custom');
      } catch (e) {
        console.error("Failed to restore cached portfolio schema:", e);
      }
    } else {
      // Restore initial non-cached content from backup (if any exists)
      try {
        const backupStr2 = localStorage.getItem('nk_certs_backup');
        if (backupStr2 && initialPortfolioData.certifications) {
          const backupObj2 = JSON.parse(backupStr2);
          const restoredCerts = initialPortfolioData.certifications.map(cert => {
            if (!cert.imageUrl && backupObj2[cert.name]) {
              return { ...cert, imageUrl: backupObj2[cert.name] };
            }
            return cert;
          });
          setPortfolioData({
            ...initialPortfolioData,
            certifications: restoredCerts
          });
        }
      } catch (e) {
        console.error("Failed to restore initial certs from backup:", e);
      }
    }
  }, []);

  // Fetch public user profile to sync name, bio, links, and avatar from database
  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const response = await fetch('/api/profile/public');
        if (response.ok) {
          const user = await response.json();
          if (user) {
            let dbCertsList: any[] = [];
            try {
              const certsResponse = await fetch(`/api/files/certifications/${user._id}`);
              if (certsResponse.ok) {
                dbCertsList = await certsResponse.json();
              }
            } catch (err) {
              console.error("Failed to fetch certifications:", err);
            }

            setPortfolioData(prev => {
              const baseData = user.portfolioData || prev;
              const updated = {
                ...baseData,
                personalInfo: {
                  ...baseData.personalInfo,
                  name: user.name || baseData.personalInfo.name,
                  bio: user.bio || baseData.personalInfo.bio,
                  linkedin: user.linkedin || baseData.personalInfo.linkedin,
                  github: user.github || baseData.personalInfo.github,
                  avatar: user.profileImage ? `/api/files/profile-image/${user._id}?v=${user.profileImage}` : baseData.personalInfo.avatar
                }
              };
              
              // Ensure core identifiers and Salem, Tamilnadu, India are pristine
              if (updated.personalInfo) {
                updated.personalInfo.location = "Salem, Tamilnadu, India";
                updated.personalInfo.name = "Navaneethakrishnan M K";
                updated.personalInfo.email = "naveenkrishnamoorthi2004@gmail.com";
                updated.personalInfo.phone = "7812850966";
                updated.personalInfo.github = user.github || "https://github.com/naveen-11122004";
                updated.personalInfo.linkedin = user.linkedin || "https://www.linkedin.com/in/navaneethakrishnan-krishnamoorthi-5a6094264";
              }
              
              if (dbCertsList && dbCertsList.length > 0) {
                updated.certifications = dbCertsList.map((c: any) => ({
                  name: c.title,
                  issuer: c.issuer,
                  date: c.issueDate ? new Date(c.issueDate).getFullYear().toString() : "2025",
                  imageUrl: c.certificateFile ? `/api/files/certification/${c._id}/file` : undefined
                }));
              }

              // Sync to localStorage
              localStorage.setItem('nk_portfolio_data', JSON.stringify(updated));
              return updated;
            });

            // If the user has an uploaded resume in the database, set it in state
            if (user.resume) {
              const fileObj = {
                name: user.resumeName || "Resume.pdf",
                type: "application/pdf",
                size: "Uploaded from Server",
                dataUrl: `/api/files/download/${user.resume}`,
                uploadedAt: new Date(user.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
              };
              setUploadedResume(fileObj);
              localStorage.setItem('nk_uploaded_custom_resume', JSON.stringify(fileObj));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch public profile:", err);
      }
    };
    
    if (!showAdminPanel) {
      fetchPublicProfile();
    }
  }, [showAdminPanel]);

  // Callback when Gemini parsed a raw CV
  const handlePortfolioParsed = (newData: PortfolioData) => {
    const enforcedData = {
      ...newData,
      personalInfo: {
        ...newData.personalInfo,
        title: "Data Analyst",
        name: "Navaneethakrishnan M K",
        email: "naveenkrishnamoorthi2004@gmail.com",
        phone: "7812850966",
        location: "Salem, Tamilnadu, India",
        github: "https://github.com/naveen-11122004",
        linkedin: "https://www.linkedin.com/in/navaneethakrishnan-krishnamoorthi-5a6094264"
      }
    };
    
    // Automatically restore any certificates they previously uploaded if the names match!
    try {
      const backupStr = localStorage.getItem('nk_certs_backup');
      if (backupStr && enforcedData.certifications) {
        const backupObj = JSON.parse(backupStr);
        enforcedData.certifications = enforcedData.certifications.map(cert => {
          if (!cert.imageUrl && backupObj[cert.name]) {
            return { ...cert, imageUrl: backupObj[cert.name] };
          }
          return cert;
        });
      }
    } catch (e) {
      console.error("Error restoring certs during parse:", e);
    }

    setPortfolioData(enforcedData);
    setSystemState('Parsed resume custom');
    localStorage.setItem('nk_portfolio_data', JSON.stringify(enforcedData));
    setIsResumeViewerOpen(true);
  };

  // Callback when user updates their profile photo
  const handleUpdateAvatar = (newAvatar: string) => {
    const updated: PortfolioData = {
      ...portfolioData,
      personalInfo: {
        ...portfolioData.personalInfo,
        avatar: newAvatar
      }
    };
    setPortfolioData(updated);
    if (systemState === 'Default template') {
      setSystemState('Parsed resume custom');
    }
    localStorage.setItem('nk_portfolio_data', JSON.stringify(updated));
  };

  // Callback when user uploads an image for a specific certification
  const handleUpdateCertificationImage = (index: number, base64: string) => {
    const updatedCerts = [...portfolioData.certifications];
    const cert = updatedCerts[index];
    
    if (base64) {
      updatedCerts[index] = {
        ...cert,
        imageUrl: base64
      };
      
      // Save to external backup matching the certificate name
      try {
        const backupStr = localStorage.getItem('nk_certs_backup') || '{}';
        const backup = JSON.parse(backupStr);
        backup[cert.name] = base64;
        localStorage.setItem('nk_certs_backup', JSON.stringify(backup));
      } catch (err) {
        console.error("Failed to backup certificate file:", err);
      }
    } else {
      // Remove imageUrl
      const { imageUrl, ...rest } = cert;
      updatedCerts[index] = rest;
      
      // Remove from external backup
      try {
        const backupStr = localStorage.getItem('nk_certs_backup') || '{}';
        const backup = JSON.parse(backupStr);
        delete backup[cert.name];
        localStorage.setItem('nk_certs_backup', JSON.stringify(backup));
      } catch (err) {
        console.error("Failed to remove backup certificate file:", err);
      }
    }

    const updated: PortfolioData = {
      ...portfolioData,
      certifications: updatedCerts
    };
    setPortfolioData(updated);
    if (systemState === 'Default template') {
      setSystemState('Parsed resume custom');
    }
    localStorage.setItem('nk_portfolio_data', JSON.stringify(updated));
  };

  // Reset to default template
  const handleResetToDefault = () => {
    if (window.confirm("Restore default professional portfolio profile? This will overwrite your currently parsed details and photo.")) {
      setPortfolioData(initialPortfolioData);
      setSystemState('Default template');
      localStorage.removeItem('nk_portfolio_data');
    }
  };

  // Direct simple download of physical resume if exists, or show beautiful Live Digital CV
  const handleViewResume = () => {
    if (uploadedResume) {
      const link = document.createElement('a');
      link.href = uploadedResume.dataUrl;
      link.download = uploadedResume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setIsResumeViewerOpen(true);
    }
  };

  // Layout color configurations
  const bgStyles = {
    bold: 'bg-[#050505] text-[#F5F5F5] min-h-screen selection:bg-[#ff4e00]/30',
    modern: 'bg-slate-950 text-slate-100 min-h-screen selection:bg-purple-500/25',
    minimalist: 'bg-stone-50 text-slate-900 min-h-screen selection:bg-amber-100',
    terminal: 'bg-black text-green-500 min-h-screen font-mono selection:bg-green-500/25',
    cyberpunk: 'bg-slate-950 text-cyan-400 min-h-screen selection:bg-pink-500/35',
    nordic: 'bg-[#070e17] text-slate-100 min-h-screen selection:bg-sky-500/25',
    sunset: 'bg-[#140b09] text-amber-50 min-h-screen selection:bg-[#e36940]/25'
  };

  const navStyles = {
    bold: 'bg-[#050505]/80 border-b border-white/15 text-[#F5F5F5] backdrop-blur-xl shadow-lg',
    modern: 'bg-slate-900/70 border-b border-slate-800/80 text-white backdrop-blur-xl shadow-lg',
    minimalist: 'bg-white/70 border-b border-stone-200/80 text-slate-800 backdrop-blur-xl shadow-md',
    terminal: 'bg-black/90 border-b border-green-950/30 text-green-500 backdrop-blur-md',
    cyberpunk: 'bg-slate-950/70 border-b border-pink-500/25 text-cyan-400 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]',
    nordic: 'bg-[#070e17]/80 border-b border-sky-950/40 text-[#e2e8f0] backdrop-blur-xl shadow-lg',
    sunset: 'bg-[#140b09]/80 border-b border-[#e36940]/25 text-amber-50 backdrop-blur-xl shadow-lg'
  };

  return (
    <>
      {/* Dynamic Cursor Design */}
      <CustomCursor activeTheme={activeTheme} />

      {/* Top Neon Scroll Progress bar */}
      <div 
        className={`fixed top-0 left-0 h-[3px] z-50 transition-all duration-75 pointer-events-none ${
          activeTheme === 'bold'
            ? 'bg-gradient-to-r from-red-650 to-[#ff4e00]'
            : activeTheme === 'cyberpunk'
              ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400'
              : activeTheme === 'terminal'
                ? 'bg-green-500'
                : activeTheme === 'nordic'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-500'
                  : activeTheme === 'sunset'
                    ? 'bg-gradient-to-r from-orange-500 to-[#e36940]'
                    : activeTheme === 'minimalist'
                      ? 'bg-slate-900'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
        }`}
        style={{ width: `${scrollProgress}%` }}
      />
      {authToken && showAdminPanel ? (
        <AdminPanel onLogout={handleLogout} token={authToken} onViewPortfolio={() => setShowAdminPanel(false)} />
      ) : (
        // Main portfolio view (always visible)
        <div id="root-portfolio-container" className={`${bgStyles[activeTheme]} transition-colors duration-300 font-sans pb-12 overflow-x-hidden w-full`}>
      
      {/* Header bar */}
      <header id="portfolio-header" className={`sticky top-0 z-30 transition-all ${navStyles[activeTheme]}`}>
        <div className="max-w-[95%] w-full mx-auto px-6 py-3.5 flex flex-wrap gap-4 items-center justify-between">
          
          {/* Logo Node */}
          <div id="brand-logo" className="flex items-center space-x-2.5">
            <div className={`overflow-hidden flex items-center justify-center rounded-lg ${
              portfolioData.personalInfo.avatar ? 'w-8 h-8' : 'p-1.5'
            } ${
              activeTheme === 'bold'
                ? 'bg-[#ff4e00]/10 border border-[#ff4e00]/30 text-[#ff4e00]'
                : activeTheme === 'minimalist' 
                  ? 'bg-slate-900 text-white' 
                  : activeTheme === 'terminal'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-500'
                    : activeTheme === 'cyberpunk'
                      ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400'
                      : activeTheme === 'nordic'
                        ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400'
                        : activeTheme === 'sunset'
                          ? 'bg-[#e36940]/10 border border-[#e36940]/30 text-[#e36940]'
                          : 'bg-purple-600/10 border border-purple-500/20 text-purple-400'
            }`}>
              {portfolioData.personalInfo.avatar ? (
                <img 
                  src={portfolioData.personalInfo.avatar} 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Cpu className="w-5 h-5 animate-pulse" />
              )}
            </div>
            <div>
              <span className={`text-xs sm:text-sm md:text-base font-bold font-display break-words ${
                activeTheme === 'terminal' ? 'text-green-500 text-xs' : 'text-current'
              }`}>
                {activeTheme === 'terminal' ? 'CORE::MATRIX_NVK' : portfolioData.personalInfo.name}
              </span>
              <p className="text-[9px] font-mono opacity-50 tracking-wide uppercase">Data Analyst</p>
            </div>
          </div>

          {/* Control block Grid */}
          <div id="header-control-cluster" className="flex items-center flex-wrap gap-2.5">
            {/* Admin Login button */}
            {!authToken && (
              <button
                onClick={() => setShowAdminLogin(true)}
                className={`p-2 rounded-lg transition flex items-center gap-2 cursor-pointer neon-glow-btn ${
                  activeTheme === 'bold'
                    ? 'bg-[#ff4e00]/10 border border-[#ff4e00]/30 text-[#ff4e00] hover:bg-[#ff4e00]/20'
                    : activeTheme === 'minimalist'
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : activeTheme === 'terminal'
                        ? 'bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20'
                        : activeTheme === 'cyberpunk'
                          ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20'
                          : activeTheme === 'nordic'
                            ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20'
                            : activeTheme === 'sunset'
                              ? 'bg-[#e36940]/10 border border-[#e36940]/30 text-[#e36940] hover:bg-[#e36940]/20'
                              : 'bg-purple-600/10 border border-purple-500/20 text-purple-400 hover:bg-purple-600/20'
                }`}
                title="Admin Login"
              >
                <Settings size={18} />
                <span className="text-xs font-semibold hidden sm:inline">Admin</span>
              </button>
            )}

            {authToken && (
              <>
                <button
                  onClick={handlePublishPortfolioData}
                  disabled={publishingData}
                  className={`p-2 rounded-lg transition flex items-center gap-2 cursor-pointer neon-glow-btn ${
                    activeTheme === 'bold'
                      ? 'bg-green-600/10 border border-green-500/30 text-green-400 hover:bg-green-600/20'
                      : activeTheme === 'minimalist'
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : activeTheme === 'terminal'
                          ? 'bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20'
                          : activeTheme === 'cyberpunk'
                            ? 'bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20'
                            : activeTheme === 'nordic'
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                              : activeTheme === 'sunset'
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-green-600/10 border border-green-500/20 text-green-400 hover:bg-green-600/20'
                  }`}
                  title="Publish Portfolio Data to Database"
                >
                  {publishingData ? <RefreshCw size={18} className="animate-spin" /> : <Upload size={18} />}
                  <span className="text-xs font-semibold hidden sm:inline">Publish</span>
                </button>
                
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className={`p-2 rounded-lg transition flex items-center gap-2 cursor-pointer neon-glow-btn ${
                    activeTheme === 'bold'
                      ? 'bg-[#ff4e00]/10 border border-[#ff4e00]/30 text-[#ff4e00] hover:bg-[#ff4e00]/20'
                      : activeTheme === 'minimalist'
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : activeTheme === 'terminal'
                          ? 'bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20'
                          : activeTheme === 'cyberpunk'
                            ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20'
                            : activeTheme === 'nordic'
                              ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20'
                              : activeTheme === 'sunset'
                                ? 'bg-[#e36940]/10 border border-[#e36940]/30 text-[#e36940] hover:bg-[#e36940]/20'
                                : 'bg-purple-600/10 border border-purple-500/20 text-purple-400 hover:bg-purple-600/20'
                  }`}
                  title="Go to Admin Panel"
                >
                  <Settings size={18} />
                  <span className="text-xs font-semibold hidden sm:inline">Admin</span>
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Main Layout Canvas space */}
      <main id="portfolio-main-grid" className="w-full">
        
        {/* Hero Section Container */}
        <Hero 
          personalInfo={portfolioData.personalInfo} 
          onOpenParser={() => setIsParserOpen(true)} 
          activeTheme={activeTheme} 
          onUpdateAvatar={handleUpdateAvatar}
          hasImported={systemState === 'Parsed resume custom'}
          onViewResume={handleViewResume}
        />

        {/* Dynamic Skills layout block */}
        <Skills 
          skills={portfolioData.skills} 
          activeTheme={activeTheme} 
        />

        {/* Dynamic Projects layout grid */}
        <Projects 
          projects={portfolioData.projects} 
          activeTheme={activeTheme} 
        />

        {/* Experiences timeline of work / schooling */}
        <Experiences 
          experience={portfolioData.experience} 
          education={portfolioData.education} 
          certifications={portfolioData.certifications}
          achievements={portfolioData.achievements}
          activeTheme={activeTheme} 
          onUpdateCertificationImage={handleUpdateCertificationImage}
        />

        {/* Contact node panel */}
        <Contacts 
          personalInfo={portfolioData.personalInfo} 
          activeTheme={activeTheme} 
        />

      </main>

      {/* Persistent floating LLM assistant grounded in details */}
      <ChatAgent 
        portfolioData={portfolioData} 
        activeTheme={activeTheme} 
      />

      {/* Slideout setup wizard parser panel */}
      {isParserOpen && (
        <ResumeParser 
          onFileUploaded={handleFileUploaded} 
          onClose={() => setIsParserOpen(false)} 
          uploadedResume={uploadedResume}
          onClearUploadedResume={handleClearUploadedResume}
        />
      )}

      {/* Structured resume document interactive viewer modal list */}
      <ResumeViewerModal 
        portfolioData={portfolioData}
        isOpen={isResumeViewerOpen}
        onClose={() => setIsResumeViewerOpen(false)}
        uploadedResume={uploadedResume}
        onClearUploadedResume={handleClearUploadedResume}
        onUploadResumeClick={() => { setIsResumeViewerOpen(false); setIsParserOpen(true); }}
      />

      {/* Visual Footer */}
      <footer id="portfolio-footer" className={`max-w-[95%] w-full mx-auto border-t mt-10 pt-6 px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-mono gap-4 leading-relaxed ${
        activeTheme === 'bold' 
          ? 'border-white/10 text-slate-400' 
          : activeTheme === 'nordic'
            ? 'border-sky-950/40 text-slate-400'
            : activeTheme === 'sunset'
              ? 'border-[#e36940]/15 text-[#ea580c]/60'
              : 'border-slate-800/40 dark:border-white/5'
      }`}>
        <div id="footer-left" className="space-y-1">
          <p>© {new Date().getFullYear()} {portfolioData.personalInfo.name}. All rights reserved.</p>
        </div>

      </footer>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 relative">
            <button
              onClick={() => setShowAdminLogin(false)}
              className="absolute -top-10 right-0 text-gray-300 hover:text-white text-2xl"
            >
              ✕
            </button>
            <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-8">
              <Login onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        </div>
      )}

        </div>
      )}
    </>
  );
}
