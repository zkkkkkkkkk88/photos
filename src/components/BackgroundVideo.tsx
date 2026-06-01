import { useState, useEffect, useRef } from 'react';

const VIDEOS = [
  { file: '1.mp4', label: '🗻 富士山' },
  { file: '2.mp4', label: '🌅 义勇' },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = BASE + VIDEOS[currentIndex].file;
    video.load();
    video.play().catch(() => {});
    try { localStorage.setItem(STORAGE_KEY, String(currentIndex)); } catch {}
  }, [currentIndex]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  return (
    <>
      {/* Background video */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          src={BASE + VIDEOS[0].file}
        />
        {/* Dark overlay for cinema feel */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Theme toggle button + dropdown */}
      <div className="fixed right-5 bottom-24 z-50">
        {menuOpen && (
          <div className="absolute bottom-full right-0 mb-3 flex flex-col gap-1.5 p-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl"
               onClick={(e) => e.stopPropagation()}>
            {VIDEOS.map((v, i) => (
              <button
                key={v.file}
                onClick={() => { setCurrentIndex(i); setMenuOpen(false); }}
                className={`text-left px-4 py-2 rounded-xl text-sm transition-all whitespace-nowrap ${
                  i === currentIndex
                    ? 'bg-gold/30 text-gold-light font-bold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-xl border border-white/15
                     text-gold text-lg flex items-center justify-center
                     hover:bg-black/70 hover:border-gold/40 transition-all
                     shadow-lg"
          title="切换主题"
        >
          🎨
        </button>
      </div>
    </>
  );
}
