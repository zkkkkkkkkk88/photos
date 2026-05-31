import { useState, useMemo } from 'react';
import MapView from '../components/MapView';
import ProvinceDetail from '../components/ProvinceDetail';
import { useAllPhotos } from '../hooks/usePhotos';
import type { ProvinceStats } from '../types';

export default function HomePage() {
  const { data: photos } = useAllPhotos();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  const provinceStats = useMemo((): ProvinceStats[] => {
    if (!photos) return [];
    const counts = new Map<string, number>();
    photos.forEach((p) => {
      counts.set(p.province, (counts.get(p.province) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([province, count]) => ({
      province,
      count,
    }));
  }, [photos]);

  const totalPhotos = photos?.length || 0;
  const totalProvinces = provinceStats.length;

  if (selectedProvince) {
    return (
      <ProvinceDetail
        province={selectedProvince}
        onBack={() => setSelectedProvince(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-washi pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-2 pb-0.5 text-center">
        <h1 className="text-base font-serif font-bold text-ink">🍥 我们的旅行手帖</h1>
        <p className="text-[10px] text-ink-light mt-0.5 space-x-3">
          <span>🎀 已探索 <b className="text-sakura">{totalProvinces}</b> 省</span>
          <span>📸 共 <b className="text-sakura">{totalPhotos}</b> 张</span>
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-1">
        <MapView
          provinceStats={provinceStats}
          onProvinceClick={(name) => setSelectedProvince(name)}
          onProvinceHover={setHoveredProvince}
        />
      </div>

      {hoveredProvince && (
        <div className="max-w-4xl mx-auto px-4 mt-1 text-center">
          <span className="inline-block bg-white border border-sakura rounded-full px-3 py-1 text-xs text-sakura">
            🌸 {hoveredProvince}
            {provinceStats.find((s) => s.province === hoveredProvince)
              ? ` — ${provinceStats.find((s) => s.province === hoveredProvince)!.count} 张`
              : ' — 暂无照片'}
          </span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 mt-1 text-center">
        <p className="text-[10px] text-ink-light/60">点击省份查看照片</p>
      </div>
    </div>
  );
}
