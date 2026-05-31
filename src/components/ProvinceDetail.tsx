import { useState, useMemo } from 'react';
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

const ALL_CATEGORIES = ['美食', '景点', '生活照', '史迪奇', '一二布布', '其他'] as const;
const CAT_ICONS: Record<string, string> = {
  '美食': '🍜', '景点': '🏔️', '生活照': '📸', '史迪奇': '👾', '一二布布': '🧸', '其他': '📷',
};

export default function ProvinceDetail({ province, onBack }: ProvinceDetailProps) {
  const { data: photos, isLoading, error } = useProvincePhotos(province);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categoryCounts = photos?.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredPhotos = useMemo(() => {
    if (!photos) return null;
    if (!filterCategory) return photos;
    return photos.filter((p) => p.category === filterCategory);
  }, [photos, filterCategory]);

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <div className="sticky top-0 bg-white/5 backdrop-blur-md border-b border-white/10 z-30">
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
                <span key={cat} className="ml-2">{CAT_ICONS[cat]} {count}</span>
              ))}
            </p>
          )}
        </div>

        {/* Category filter tabs */}
        {photos && photos.length > 0 && (
          <div className="max-w-2xl mx-auto px-4 pb-2 flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => setFilterCategory(null)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs transition-all ${
                !filterCategory ? 'bg-gold text-black font-medium' : 'bg-white/10 text-ink-light hover:bg-white/20'
              }`}
            >
              全部
            </button>
            {ALL_CATEGORIES.filter((c) => categoryCounts?.[c]).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs transition-all ${
                  filterCategory === cat ? 'bg-gold text-black font-medium' : 'bg-white/10 text-ink-light hover:bg-white/20'
                }`}
              >
                {CAT_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        )}
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

        {filteredPhotos && filteredPhotos.length > 0 && (
          <div className="space-y-2">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onClick={setSelectedPhoto}
              />
            ))}
          </div>
        )}

        {filteredPhotos && filteredPhotos.length === 0 && photos && photos.length > 0 && (
          <div className="text-center py-8 text-ink-light text-sm">
            该分类下暂无照片
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
