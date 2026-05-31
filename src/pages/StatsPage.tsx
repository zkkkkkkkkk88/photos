import { useState, useMemo } from 'react';
import { useStats } from '../hooks/useStats';
import { useAllPhotos } from '../hooks/usePhotos';
import PhotoCard from '../components/PhotoCard';
import PhotoLightbox from '../components/PhotoLightbox';
import type { Photo } from '../types';

const categoryIcons: Record<string, string> = {
  '美食': '🍜', '景点': '🏔️', '生活照': '📸', '史迪奇': '👾', '一二布布': '🧸', '花': '🌺', '其他': '📷',
};

const ALL_CATEGORIES = ['美食', '景点', '生活照', '史迪奇', '一二布布', '花', '其他'] as const;

export default function StatsPage() {
  const stats = useStats();
  const { data: allPhotos } = useAllPhotos();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const categoryPhotos = useMemo(() => {
    if (!allPhotos || !filterCategory) return null;
    return allPhotos.filter((p) => p.category === filterCategory);
  }, [allPhotos, filterCategory]);

  if (!stats) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-ink-light">加载中...</p>
      </div>
    );
  }

  if (filterCategory) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="sticky top-0 bg-white/5 backdrop-blur-md border-b border-white/10 z-30">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setFilterCategory(null)} className="text-ink-light hover:text-ink text-sm">
              ← 返回统计
            </button>
            <h2 className="text-lg font-serif font-bold text-ink">
              {categoryIcons[filterCategory]} {filterCategory}
            </h2>
            <span className="text-xs text-ink-light">{categoryPhotos?.length || 0} 张</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-4 space-y-2 pb-8">
          {categoryPhotos && categoryPhotos.length > 0 ? (
            categoryPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} onClick={setSelectedPhoto} />
            ))
          ) : (
            <div className="text-center py-12 text-ink-light">暂无照片</div>
          )}
        </div>

        {selectedPhoto && (
          <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-2">
        <h1 className="text-xl font-serif font-bold text-ink text-center text-shadow">📊 旅行统计</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="card text-center space-y-1">
            <div className="text-3xl font-bold text-gold">{stats.totalProvinces}</div>
            <div className="text-xs text-ink-light">🎀 已探索省份</div>
          </div>
          <div className="card text-center space-y-1">
            <div className="text-3xl font-bold text-gold">{stats.totalPhotos}</div>
            <div className="text-xs text-ink-light">📸 总照片数</div>
          </div>
          <div className="card text-center space-y-1 cursor-pointer hover:shadow-md transition-shadow"
               onClick={() => stats.topCategory !== '暂无' && setFilterCategory(stats.topCategory)}>
            <div className="text-2xl">
              {categoryIcons[stats.topCategory]} {stats.topCategory}
            </div>
            <div className="text-xs text-ink-light">🏆 最多分类（点击查看）</div>
          </div>
          <div className="card text-center space-y-1">
            <div className="text-xl font-bold text-gold">
              {stats.totalPhotos > 0
                ? `${stats.myCount} / ${stats.taCount}`
                : '暂无'}
            </div>
            <div className="text-xs text-ink-light">👤 我 / Ta 贡献</div>
          </div>
        </div>

        {/* Category selector — view all photos by category */}
        <div className="card">
          <h3 className="text-sm font-bold text-ink mb-3">🏷️ 按分类查看全部照片</h3>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const count = allPhotos?.filter((p) => p.category === cat).length || 0;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium hover:bg-gold hover:text-white transition-colors"
                >
                  {categoryIcons[cat]} {cat}
                  <span className="text-xs opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-bold text-ink mb-3">🗺️ 省份照片排行</h3>
          {stats.provinceRanking.length === 0 ? (
            <p className="text-xs text-ink-light text-center py-4">暂无数据</p>
          ) : (
            <div className="space-y-2">
              {stats.provinceRanking.map((p, i) => (
                <div key={p.province} className="flex items-center gap-3">
                  <span className={`text-xs font-bold w-5 ${
                    i < 3 ? 'text-gold' : 'text-ink-light'
                  }`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </span>
                  <span className="flex-1 text-sm text-ink">{p.province}</span>
                  <span className="text-xs text-ink-light">{p.count} 张</span>
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all"
                      style={{
                        width: `${(p.count / stats.provinceRanking[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
