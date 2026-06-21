import React from 'react';
import { Eye, Smartphone, Cpu, Shield, HelpCircle, Layers, Palette, Terminal, Zap, Mountain, Sun } from 'lucide-react';
import { ThemeStyle } from '../types';

interface ThemeSelectorProps {
  currentTheme: ThemeStyle;
  onChangeTheme: (theme: ThemeStyle) => void;
}

export default function ThemeSelector({ currentTheme, onChangeTheme }: ThemeSelectorProps) {
  const themes: { id: ThemeStyle; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'bold',
      label: 'Bold',
      desc: 'Brutalist headers, rich deep orange accents, and stark high-contrast layouts.',
      icon: <Layers className="w-4 h-4 text-[#ff4e00]" />,
      color: 'bg-[#ff4e00]'
    },
    {
      id: 'modern',
      label: 'Modern Dark',
      desc: 'Elegant deep-slate UI with sophisticated ultraviolet glass accents.',
      icon: <Layers className="w-4 h-4 text-purple-400" />,
      color: 'bg-purple-600'
    },
    {
      id: 'nordic',
      label: 'Nordic Frost',
      desc: 'Deep marine sleep, muted slate-blue accents, cold glacier crystalline headers.',
      icon: <Mountain className="w-4 h-4 text-sky-400" />,
      color: 'bg-sky-450'
    },
    {
      id: 'sunset',
      label: 'Sunset Clay',
      desc: 'Warm terracotta evening colors, cozy gold sands, and deep red clay accents.',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      color: 'bg-amber-500'
    },
    {
      id: 'minimalist',
      label: 'Minimalist',
      desc: 'High-contrast light layouts, spacious margins, and warm-toned gray text.',
      icon: <Palette className="w-4 h-4 text-amber-800" />,
      color: 'bg-amber-600/30 text-amber-900 border border-amber-900/30'
    },
    {
      id: 'terminal',
      label: 'Terminal',
      desc: 'Pure monocromatic hacker view utilizing emerald phosphor colors.',
      icon: <Terminal className="w-4 h-4 text-green-400" />,
      color: 'bg-emerald-500'
    },
    {
      id: 'cyberpunk',
      label: 'Cyberpunk',
      desc: 'Obsidian sheets intersected by glowing neon-pink & cyber cyan borders.',
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      color: 'bg-gradient-to-r from-pink-500 to-cyan-400'
    }
  ];

  return (
    <div id="theme-selector-container" className="flex items-center space-x-1 p-1 bg-black/20 dark:bg-slate-950/40 rounded-xl border border-slate-200/10 backdrop-blur-sm shadow-inner">
      {themes.map((theme) => {
        const isActive = currentTheme === theme.id;
        return (
          <button
            key={theme.id}
            id={`theme-btn-${theme.id}`}
            onClick={() => onChangeTheme(theme.id)}
            title={`${theme.label}: ${theme.desc}`}
            className={`relative flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-300 ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-md scale-[1.03] border border-slate-200/10'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/10'
            }`}
          >
            <span className={`p-0.5 rounded-sm shrink-0 ${isActive ? (currentTheme === 'bold' ? 'text-[#ff4e00]' : 'text-purple-500') : 'text-slate-400'}`}>
              {theme.icon}
            </span>
            <span className="hidden sm:inline tracking-tight font-sans text-[11px] font-semibold">{theme.label}</span>
          </button>
        );
      })}
    </div>
  );
}
