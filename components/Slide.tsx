
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { SlideData } from '../types';
import { Target, Activity, Zap, Cpu, Code2, Globe, HelpCircle, AlertTriangle, Users } from 'lucide-react';

interface SlideProps {
  data: SlideData;
}

const Slide: React.FC<SlideProps> = ({ data }) => {
  // HUD Color Helper
  const getAccentColor = (alpha = 1) => {
    switch (data.accent) {
      case 'purple': return `rgba(188, 19, 254, ${alpha})`;
      case 'pink': return `rgba(255, 0, 85, ${alpha})`;
      case 'amber': return `rgba(255, 184, 0, ${alpha})`;
      case 'cyan': default: return `rgba(0, 243, 255, ${alpha})`;
    }
  };

  const getTailwindColor = () => {
      switch (data.accent) {
      case 'purple': return 'text-neon-purple border-neon-purple';
      case 'pink': return 'text-neon-pink border-neon-pink';
      case 'amber': return 'text-neon-amber border-neon-amber';
      case 'cyan': default: return 'text-neon-cyan border-neon-cyan';
    }
  }

  // --- Animation Variants ---
  
  // Glitch Text Reveal
  const titleVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "circOut" } 
    }
  };

  // Staggered list items
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const panelVariants: Variants = {
      hidden: { scale: 0.95, opacity: 0, filter: "blur(10px)" },
      visible: { 
          scale: 1, 
          opacity: 1, 
          filter: "blur(0px)",
          transition: { duration: 0.8, ease: "easeOut" }
      }
  }

  // --- Layout Renderers ---

  // 1. HERO: Centered, Massive Impact
  const renderHero = () => (
    <div className="flex flex-col items-center justify-center text-center h-full relative z-10 p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-full blur-3xl -z-10" 
      />

      <motion.div 
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        className={`font-mono text-sm md:text-base tracking-[0.5em] mb-8 uppercase ${getTailwindColor().split(' ')[0]} bg-black/40 backdrop-blur-sm px-4 py-1 rounded`}
      >
        [{data.subtitle}]
      </motion.div>

      <motion.h1 
        initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="font-display text-5xl md:text-8xl font-black uppercase text-white mb-12 leading-tight tracking-tight relative z-20"
        style={{ textShadow: `0 0 50px ${getAccentColor(0.5)}` }}
      >
        {data.title}
        {/* Decorator Lines */}
        <span className={`absolute -left-8 top-0 h-full w-1 ${getTailwindColor().split(' ')[1].replace('border', 'bg')}`} />
      </motion.h1>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/5 inline-block">
         {data.content.map((item, i) => (
             <motion.p key={i} variants={itemVariants} className="font-sans text-xl md:text-2xl text-slate-100 font-light max-w-2xl mx-auto drop-shadow-md">
                 {item}
             </motion.p>
         ))}
      </motion.div>
    </div>
  );

  // 2. DATA GRID: Split with Large Stat
  const renderDataGrid = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-center p-8 lg:p-16 w-full max-w-[1600px] mx-auto z-10 relative">
       {/* Left: Data Stream */}
       <div className="lg:col-span-7 order-2 lg:order-1 bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-2xl">
          <motion.div variants={titleVariants} initial="hidden" animate="visible" className="mb-8">
              <div className="flex items-center gap-3 mb-2 opacity-100">
                  <Activity size={18} color={getAccentColor()} />
                  <span className="font-mono text-xs text-slate-300">ANALYSIS_MODE</span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl text-white font-bold uppercase mb-4 drop-shadow-lg">{data.title}</h2>
              <div className={`h-0.5 w-32 ${getTailwindColor().split(' ')[1].replace('border', 'bg')}`} />
          </motion.div>

          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="grid gap-6"
          >
              {data.content.map((item, i) => (
                  <motion.div key={i} variants={itemVariants} className="flex items-center gap-4 group">
                      <span className={`font-mono text-lg ${getTailwindColor().split(' ')[0]}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="h-full w-[1px] bg-slate-600 group-hover:bg-slate-400 transition-colors" />
                      <p className="font-sans text-xl text-slate-200 group-hover:text-white transition-colors">
                        {item}
                      </p>
                  </motion.div>
              ))}
          </motion.div>
       </div>

       {/* Right: Visualization / Stat */}
       <div className="lg:col-span-5 order-1 lg:order-2 h-full flex flex-col justify-center relative">
          <motion.div 
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className="relative border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-8 rounded-sm shadow-2xl"
          >
             {/* HUD Corners */}
             <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${getTailwindColor().split(' ')[1]}`} />
             <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${getTailwindColor().split(' ')[1]}`} />

             {data.stat && (
                 <div className="text-center z-10 relative">
                    <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}
                        className={`font-display text-7xl md:text-8xl font-black ${getTailwindColor().split(' ')[0]}`}
                        style={{ textShadow: `0 0 30px ${getAccentColor(0.4)}`}}
                    >
                        {data.stat}
                    </motion.div>
                    <p className="font-mono text-sm text-slate-300 mt-2 tracking-widest">KEY_METRIC_DETECTED</p>
                 </div>
             )}
             
             {data.image && (
                 <div className="absolute inset-0 overflow-hidden rounded-sm">
                     <img src={data.image} alt="Visual" className="w-full h-full object-cover opacity-60" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                     {/* Scanline */}
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-[10%] w-full animate-[scanline_3s_linear_infinite]" />
                 </div>
             )}
          </motion.div>
       </div>
    </div>
  );

  // 3. HOLOGRAM: Central Focus with Floating Elements
  const renderHologram = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-6 z-10 relative">
        <motion.div variants={titleVariants} initial="hidden" animate="visible" className="text-center mb-16 bg-black/30 backdrop-blur-md p-8 rounded-2xl border border-white/5">
            <span className={`inline-block py-1 px-3 mb-6 border ${getTailwindColor()} rounded-full font-mono text-xs`}>
                SYSTEM_DEFINITION
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-xl">{data.title}</h1>
            <p className={`font-mono text-xl ${getTailwindColor().split(' ')[0]}`}>{data.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {data.content.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 + 0.5 }}
                    className="relative bg-slate-900/60 border border-slate-700 p-6 hover:border-neon-cyan/50 transition-colors group backdrop-blur-md rounded-lg shadow-lg"
                >
                    <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${data.accent === 'cyan' ? 'neon-cyan' : 'neon-purple'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="flex items-start gap-4">
                        <Target className={`mt-1 shrink-0 ${getTailwindColor().split(' ')[0]}`} size={20} />
                        <p className="font-sans text-lg text-slate-100 font-medium">{item}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
  );

    // 4. FOCUS: Minimalist, heavy typography, background image heavy
  const renderFocus = () => (
      <div className="w-full h-full flex flex-col justify-center px-8 md:px-24 relative overflow-hidden">
           {/* Background Image - Improved Visibility */}
           {data.image && (
               <>
                <div className="absolute inset-0 z-0">
                    <img src={data.image} className="w-full h-full object-cover opacity-40" alt="" />
                    {/* Gradient Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-void via-void/80 to-transparent" />
                </div>
               </>
           )}

           <motion.div variants={titleVariants} initial="hidden" animate="visible" className="z-10 max-w-4xl relative">
               <h2 className="font-mono text-sm text-neon-cyan mb-4 tracking-[0.2em] flex items-center gap-2 font-bold">
                   <Globe size={14} />
                   {data.subtitle}
               </h2>
               <h1 className="font-display text-6xl md:text-8xl font-black text-white uppercase mb-12 leading-[0.9] drop-shadow-2xl">
                   {data.title.split(' ').map((word, i) => (
                       <span key={i} className="block">{word}</span>
                   ))}
               </h1>
           </motion.div>

           <motion.div variants={containerVariants} initial="hidden" animate="visible" className="z-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl bg-black/40 backdrop-blur-sm p-6 rounded-lg border-l-4 border-neon-cyan">
               {data.content.map((item, i) => (
                   <motion.div key={i} variants={itemVariants} className="pl-2 py-2">
                       <p className="font-sans text-xl text-slate-100 font-medium">
                           {item}
                       </p>
                   </motion.div>
               ))}
           </motion.div>
      </div>
  );

  // 5. TERMINAL: Code style
  const renderTerminal = () => (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-6xl mx-auto p-6 relative">
         {/* Background Image support for Terminal */}
         {data.image && (
             <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                 <img src={data.image} className="w-full h-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-void/80" />
             </div>
         )}

        <motion.div 
            initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, ease: "easeInOut" }}
            className="w-full max-w-5xl border-b border-slate-700 mb-8 pb-4 flex justify-between items-end z-10"
        >
            <h1 className="font-display text-4xl text-white drop-shadow-md">{data.title}</h1>
            <span className="font-mono text-neon-cyan text-sm">{data.subtitle}</span>
        </motion.div>

        <motion.div 
            className="w-full max-w-5xl bg-black/80 backdrop-blur-xl border border-slate-700 p-8 font-mono text-lg md:text-xl text-slate-300 shadow-2xl relative overflow-hidden z-10 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
             {/* Terminal Header */}
             <div className="flex gap-2 mb-6 opacity-70">
                 <div className="w-3 h-3 rounded-full bg-red-500" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500" />
                 <div className="w-3 h-3 rounded-full bg-green-500" />
             </div>

             <div className="space-y-4">
                 {data.content.map((line, i) => (
                     <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.3 }}
                        className="flex gap-4"
                     >
                         <span className="text-slate-500 select-none">{(i + 1).toString().padStart(2, '0')}</span>
                         <span className="text-neon-cyan select-none">{'>'}</span>
                         <span className="text-slate-100">{line}</span>
                     </motion.div>
                 ))}
                 <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}
                    className="h-6 w-3 bg-neon-cyan inline-block ml-10 align-middle"
                 />
             </div>
        </motion.div>
    </div>
  );

  // 6. INTERACTION: Pop Quiz / Interrupt Style
  const renderInteraction = () => {
    // Parse content
    // Index 0: Header Prompt (e.g. "QUESTION:")
    // Index 1: The Question text (usually in quotes)
    // Index 2+: Options (if any)
    const prompt = data.content[0];
    const question = data.content[1];
    const options = data.content.slice(2);

    return (
      <div className="flex items-center justify-center h-full w-full relative z-20 px-4">
         {/* Background Pulse Effect */}
         <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
             <motion.div 
               animate={{ scale: [0.8, 1.2], opacity: [0.1, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className={`w-[500px] h-[500px] rounded-full blur-3xl ${data.accent === 'amber' ? 'bg-neon-amber/20' : 'bg-neon-cyan/20'}`}
             />
         </div>

         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: "spring", stiffness: 120, damping: 15 }}
           className={`relative w-full max-w-5xl bg-black/90 backdrop-blur-xl border-2 ${getTailwindColor().split(' ')[1]} shadow-[0_0_50px_rgba(255,184,0,0.15)] rounded-lg overflow-hidden`}
         >
             {/* Hazard Header */}
             <div className={`w-full py-3 px-6 ${data.accent === 'amber' ? 'bg-neon-amber' : 'bg-neon-cyan'} text-black font-display font-bold tracking-widest uppercase flex items-center justify-between`}>
                 <div className="flex items-center gap-2">
                    <AlertTriangle size={24} className="stroke-2" />
                    <span>{data.subtitle || "INTERACTION_REQUIRED"}</span>
                 </div>
                 <div className="hidden md:flex gap-1">
                     {[...Array(6)].map((_, i) => (
                         <div key={i} className="w-1 h-6 bg-black/20 -skew-x-12" />
                     ))}
                 </div>
             </div>

             {/* Main Content Body */}
             <div className="p-8 md:p-12 text-center relative">
                 {/* Decorative Grid */}
                 <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                 <motion.p 
                   initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                   className={`font-mono text-sm md:text-base mb-6 ${getTailwindColor().split(' ')[0]} uppercase tracking-[0.2em]`}
                 >
                   {prompt}
                 </motion.p>

                 <motion.h1 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                   className="font-display text-3xl md:text-5xl lg:text-6xl text-white font-medium mb-12 leading-tight"
                 >
                   {question}
                 </motion.h1>

                 {/* Options Grid (if available) */}
                 {options.length > 0 && (
                     <div className={`grid grid-cols-1 ${options.length > 1 ? 'md:grid-cols-2' : ''} gap-6 max-w-4xl mx-auto`}>
                         {options.map((opt, i) => (
                             <motion.div
                               key={i}
                               initial={{ opacity: 0, x: -20 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{ delay: 0.8 + (i * 0.1) }}
                               className={`border border-slate-700 bg-slate-800/50 p-6 rounded text-left hover:${data.accent === 'amber' ? 'border-neon-amber' : 'border-neon-cyan'} transition-colors cursor-default group`}
                             >
                                 <p className="font-sans text-lg md:text-xl text-slate-200 group-hover:text-white">
                                     {opt.replace(/^>>\s*|\[.*?\]:?\s*/g, '')}
                                 </p>
                             </motion.div>
                         ))}
                     </div>
                 )}
                 
                 {/* Footer Prompt */}
                 {options.length === 0 && (
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                        className="flex items-center justify-center gap-2 mt-8 text-slate-500 font-mono text-xs"
                     >
                         <Users size={14} />
                         <span>AWAITING AUDIENCE RESPONSE...</span>
                     </motion.div>
                 )}
             </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Dynamic Background Layout Decorations */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Top Right Coordinates */}
         <div className="absolute top-8 right-8 font-mono text-xs text-slate-500 flex flex-col items-end gap-1 z-20">
             <span>SEC: 0{data.id}</span>
             <span>LAY: {data.layout.toUpperCase()}</span>
             <span>XYZ: 45.22.11</span>
         </div>
         {/* Bottom Left Grid */}
         <div className="absolute bottom-8 left-8 flex gap-1 z-20">
             {[...Array(5)].map((_, i) => (
                 <div key={i} className={`w-1 h-4 ${i === 0 ? 'bg-neon-cyan' : 'bg-slate-800'}`} />
             ))}
         </div>
      </div>

      {data.layout === 'hero' && renderHero()}
      {data.layout === 'data-grid' && renderDataGrid()}
      {data.layout === 'hologram' && renderHologram()}
      {data.layout === 'focus' && renderFocus()}
      {data.layout === 'terminal' && renderTerminal()}
      {data.layout === 'interaction' && renderInteraction()}
    </div>
  );
};

export default Slide;
