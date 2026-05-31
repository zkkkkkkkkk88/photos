import { useState } from 'react';
import { useProvincePhotos } from '../hooks/usePhotos';
import PhotoCard from './PhotoCard';
import PhotoLightbox from './PhotoLightbox';
import UploadForm from './UploadForm';
import Button from './ui/Button';
import type { Photo } from '../types';

interface ProvinceDetailProps {
  province: string;
  onBack: () => void;
}

export default function ProvinceDetail({ province, onBack }: ProvinceDetailProps) {
  const { data: photos, isLoading, error } = useProvincePhotos(province);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const categoryCounts = photos?.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <div className="sticky top-0 bg-washi/90 backdrop-blur-sm border-b border-warm z-30">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="text-ink-light hover:text-ink text-sm flex items-center gap-1">
              ← 返回地图
            </button>
          </div>
          <h2 className="text-xl font-serif font-bold text-ink">🌸 {province}</h2>
          {photos && (
            <p className="text-xs text-ink-light mt-1">
              {photos.length} 张照片
              {categoryCounts && Object.entries(categoryCounts).map(([cat, count]) => (
                <span key={cat} className="ml-2">
                  {{ '美食': '🍜', '景点': '🏔️', '其他': '📷' }[cat]} {count}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4">
        {isLoading && (
          <div className="text-center py-12 text-ink-light">加载中...</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-400">加载失败，请重试</div>
        )}

        {photos && photos.length === 0 && !showUpload && (
          <div className="text-center py-16 space-y-4">
            <div className="text-5xl">🏔️</div>
            <p className="text-ink-light">这里还没有照片</p>
            <p className="text-xs text-ink-light/60">成为第一个记录的人吧</p>
            <Button onClick={() => setShowUpload(true)}>+ 添加第一张照片</Button>
          </div>
        )}

        {photos && photos.length > 0 && (
          <div className="space-y-2">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onClick={setSelectedPhoto}
              />
            ))}
          </div>
        )}

        {photos && photos.length > 0 && !showUpload && (
          <div className="text-center py-8">
            <Button onClick={() => setShowUpload(true)}>+ 添加照片</Button>
          </div>
        )}

        {showUpload && (
          <div className="card mt-4 mb-8">
            <UploadForm
              province={province}
              onSuccess={() => setShowUpload(false)}
              onCancel={() => setShowUpload(false)}
            />
          </div>
        )}
      </div>

      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
