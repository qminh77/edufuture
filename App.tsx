
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PRESENTATION_DATA } from './constants';
import Slide from './components/Slide';
import Starfield from './components/Background';
import Controls from './components/Controls';
import Preloader from './components/Preloader';
import NoiseOverlay from './components/NoiseOverlay';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Preload images
  useEffect(() => {
    PRESENTATION_DATA.forEach((slide) => {
      if (slide.image) {
        const img = new Image();
        img.src = slide.image;
      }
    });
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlideIndex((prev) => 
      prev === PRESENTATION_DATA.length - 1 ? prev : prev + 1
    );
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlideIndex((prev) => 
      prev === 0 ? prev : prev - 1
    );
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger slide navigation if focusing on an input (like the chat)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (isLoading) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'Escape':
          setCurrentSlideIndex(0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isLoading]);

  // Cinematic Transition Variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      zIndex: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100, // Reduced movement distance for more subtle 'fade-through' feel
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
    })
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden text-slate-100 font-sans selection:bg-neon-cyan selection:text-black bg-void">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      <NoiseOverlay />
      
      {!isLoading && (
        <>
          <Starfield />
          
          <main className="relative w-full h-full z-10">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlideIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 30 },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  filter: { duration: 0.4 }
                }}
                className="absolute inset-0 w-full h-full"
              >
                <Slide data={PRESENTATION_DATA[currentSlideIndex]} />
              </motion.div>
            </AnimatePresence>
          </main>

          <Controls 
            currentSlide={currentSlideIndex} 
            totalSlides={PRESENTATION_DATA.length}
            onNext={nextSlide}
            onPrev={prevSlide}
          />
          
          <AIAssistant />
        </>
      )}
    </div>
  );
};

export default App;
