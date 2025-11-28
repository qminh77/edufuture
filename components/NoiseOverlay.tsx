
import React from 'react';

const NoiseOverlay: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
         <svg viewBox="0 0 200 200" xmlns='http://www.w3.org/2000/svg'>
            <filter id='noiseFilter'>
                <feTurbulence 
                type='fractalNoise' 
                baseFrequency='0.65' 
                numOctaves='3' 
                stitchTiles='stitch'/>
            </filter>
            
            <rect width='100%' height='100%' filter='url(#noiseFilter)'/>
        </svg>
      </div>
      {/* Vignette - Reduced opacity from 0.8 to 0.4 to prevent text from looking 'sunken' */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,5,8,0.4)_100%)]" />
    </>
  );
};

export default NoiseOverlay;
