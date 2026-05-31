import { useState, useEffect, useRef } from 'react';

const VIDEOS = [
  { file: '1.mp4', label: '🗻 富士山' },
  { file: '2.mp4', label: '🌅 夕阳' },
  { file: '3.mp4', label: '🌸 蜜璃' },
];

const BASE = import.meta.env.BASE_URL + 'videos/';
const STORAGE_KEY = 'bg-video-index';

export default function BackgroundVideo() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch { return 0; }
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Switch video source when index changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = BASE + VIDEOS[currentIndex].file;
    video.src = src;
    video.load();
    video.play().catch(() => {});
    try { localStorage.setItem(STORAGE_KEY, String(currentIndex)); } catch {}
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src={BASE + VIDEOS[currentIndex].file}
      />

      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-white/10" />

      {/* Video switcher — right side */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-1.5 z-50">
        {VIDEOS.map((v, i) => (
          <button
            key={v.file}
            onClick={() => setCurrentIndex(i)}
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
