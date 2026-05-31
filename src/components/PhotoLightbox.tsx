import { useEffect } from 'react';
import type { Photo } from '../types';
import Tag from './ui/Tag';
import StarRating from './ui/StarRating';

interface PhotoLightboxProps {
  photo: Photo;
  onClose: () => void;
}

export default function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl z-10"
        >
          ✕
        </button>

        <div className="aspect-[4/3] bg-warm rounded-t-2xl overflow-hidden">
          <img
            src={photo.image_url}
            alt={photo.title}
            className="w-full h-full object-contain bg-black/5"
          />
        </div>

        <div className="p-5 space-y-3">
          <h2 className="text-lg font-bold text-ink">{photo.title}</h2>

          {photo.description && (
            <p className="text-sm text-ink-light leading-relaxed">{photo.description}</p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <StarRating value={photo.rating} readonly />
            <span className="text-sm text-ink-light">
              {photo.profile?.nickname || '未知'} · {photo.date}
            </span>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <span className="bg-sakura text-white px-2.5 py-0.5 rounded-full text-xs">
              {{ '美食': '🍜', '景点': '🏔️', '生活照': '📸', '史迪奇': '👾', '一二布布': '🧸', '其他': '📷' }[photo.category]} {photo.category}
            </span>
            {photo.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
