import { useState, useEffect, useCallback } from 'react';

// Add video filenames here (put video files in public/videos/)
const VIDEOS: string[] = [
  '1.mp4',
  '2.mp4',
  '3.mp4',
  '4.mp4',
];

const BASE = import.meta.env.BASE_URL + 'videos/';
const STORAGE_KEY = 'bg-video-index';

export default function BackgroundVideo() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [hasError, setHasError] = useState(false);
  const effectiveIndex = VIDEOS.length > 0 ? currentIndex % VIDEOS.length : 0;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(effectiveIndex));
  }, [effectiveIndex]);

  const nextVideo = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % VIDEOS.length);
    setHasError(false);
  }, []);

  const prevVideo = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);
    setHasError(false);
  }, []);

  const showControls = VIDEOS.length > 1;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {VIDEOS.length > 0 && !hasError && (
        <video
          key={VIDEOS[effectiveIndex]}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.55) saturate(0.7)' }}
          onError={() => setHasError(true)}
        >
          <source src={BASE + VIDEOS[effectiveIndex]} type="video/mp4" />
        </video>
      )}
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-washi/90 via-washi/70 to-sakura-light/80" />

      {/* Video switcher controls */}
      {showControls && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm z-20">
          <button
            onClick={prevVideo}
            className="text-ink-light hover:text-ink text-sm px-1 transition-colors"
            title="上一个"
          >
            ◀
          </button>
          <span className="text-[10px] text-ink-light whitespace-nowrap">
            🎬 {effectiveIndex + 1}/{VIDEOS.length}
          </span>
          <button
            onClick={nextVideo}
            className="text-ink-light hover:text-ink text-sm px-1 transition-colors"
            title="下一个"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
