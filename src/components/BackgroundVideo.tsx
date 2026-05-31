import { useState, useEffect, useCallback } from 'react';

const VIDEOS = [
  { file: '1.mp4', label: '🗻 富士山' },
  { file: '2.mp4', label: '🌅 夕阳' },
  { file: '3.mp4', label: '🌸 蜜璃' },
];

const BASE = import.meta.env.BASE_URL + 'videos/';
const STORAGE_KEY = 'bg-video-index';

export default function BackgroundVideo() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(currentIndex));
  }, [currentIndex]);

  const switchTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setHasError(false);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {!hasError && (
        <video
          key={VIDEOS[currentIndex].file}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.75) saturate(0.85)' }}
          onError={() => setHasError(true)}
        >
          <source src={BASE + VIDEOS[currentIndex].file} type="video/mp4" />
        </video>
      )}
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-washi/40 via-washi/30 to-sakura-light/50" />

      {/* Video switcher — left side */}
      <div className="absolute bottom-20 left-4 flex flex-col gap-1.5 z-20">
        {VIDEOS.map((v, i) => (
          <button
            key={v.file}
            onClick={() => switchTo(i)}
            className={`text-left px-3 py-1.5 rounded-full text-xs transition-all backdrop-blur-sm ${
              i === currentIndex
                ? 'bg-white/85 text-sakura font-medium shadow-sm'
                : 'bg-white/40 text-ink-light hover:bg-white/60'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
