import React from 'react';
import { ArrowLeft, ArrowRight, MousePointer2 } from 'lucide-react';

interface ControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
}

const Controls: React.FC<ControlsProps> = ({ currentSlide, totalSlides, onNext, onPrev }) => {
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-6 md:p-8 flex justify-between items-end pointer-events-none">
      
      {/* Slide Indicator Number */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2 font-display">
          <span className="text-4xl font-bold text-white">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span className="text-lg text-slate-500">
            / {String(totalSlides).padStart(2, '0')}
          </span>
        </div>
        <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-neon-blue transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pointer-events-auto">
        <button 
          onClick={onPrev}
          disabled={currentSlide === 0}
          className="p-4 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-md text-white hover:bg-neon-blue hover:text-black hover:border-neon-blue transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white group"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className="p-4 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-md text-white hover:bg-neon-blue hover:text-black hover:border-neon-blue transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white group"
        >
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Keyboard Hint */}
      <div className="hidden md:flex items-center gap-4 text-slate-500 text-xs font-mono uppercase tracking-widest absolute bottom-8 left-1/2 -translate-x-1/2 opacity-50">
        <span className="flex items-center gap-1"><span className="border border-slate-600 px-1 rounded">SPACE</span> Next</span>
        <span className="flex items-center gap-1"><span className="border border-slate-600 px-1 rounded">ESC</span> Reset</span>
      </div>

    </div>
  );
};

export default Controls;
