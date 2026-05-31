import { useMemo, useState } from 'react';
import { useAllPhotos } from '../hooks/usePhotos';
import PhotoCard from './PhotoCard';
import PhotoLightbox from './PhotoLightbox';
import type { Photo } from '../types';

export default function Timeline() {
  const { data: photos, isLoading, error } = useAllPhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const grouped = useMemo(() => {
    if (!photos) return [];
    const groups = new Map<string, Photo[]>();
    photos.forEach((p) => {
      const d = p.date;
      if (!groups.has(d)) groups.set(d, []);
      groups.get(d)!.push(p);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [photos]);

  if (isLoading) {
    return <div className="text-center py-12 text-ink-light">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-400">加载失败</div>;
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">📅</div>
        <div className="text-bubble inline-block">
          <p className="text-ink font-medium">还没有照片记录</p>
          <p className="text-xs text-ink-light mt-1">回到地图添加第一张照片吧</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-sakura/20" />

        <div className="space-y-6">
          {grouped.map(([date, items]) => (
            <div key={date} className="relative">
              <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-sakura border-2 border-white shadow-sm" />
              <h3 className="text-sm font-bold text-sakura mb-2">{date}</h3>
              <div className="space-y-2">
                {items.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onClick={setSelectedPhoto}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}
