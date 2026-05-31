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
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(currentIndex));
    // Force play current video
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <video
        ref={videoRef}
        key={currentIndex}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={BASE + VIDEOS[currentIndex].file} type="video/mp4" />
      </video>

      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-white/10" />

      {/* Video switcher */}
      <div className="absolute bottom-20 left-4 flex flex-col gap-1.5 z-20">
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
