import React, { useState } from 'react';

interface GiftGridProps {
  links: string[];
  startIndex?: number; // which index in links to start from
}

const GiftGrid: React.FC<GiftGridProps> = ({ links, startIndex = 5 }) => {
  const items = links.slice(startIndex, startIndex + 5);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const qrUrl = (url: string) => `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(url)}`;

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl">
        {items.map((link, i) => (
          <div key={i} className="flex flex-col items-center">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-24 h-24 sm:w-28 sm:h-28 bg-amber-500/10 border border-slate-700 rounded-lg shadow-md flex items-center justify-center hover:scale-105 transform transition"
              aria-label={`Open gift ${i + 1}`}
            >
              <div className="text-center">
                <div className="text-2xl">🎁</div>
                <div className="text-xs mt-1 text-slate-300">Gift {startIndex + i + 1}</div>
              </div>
            </button>

            {openIndex === i && (
              <div className="mt-2 p-2 bg-black/80 border border-slate-700 rounded">
                <img src={qrUrl(link)} alt={`QR for gift ${i + 1}`} className="w-36 h-36 object-contain" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftGrid;
