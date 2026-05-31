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
    <div className="min-h-screen bg-transparent flex flex-col">
      <div className="px-4 pt-3 pb-1 text-center">
        <h1 className="text-lg font-serif font-bold text-ink">🍥 我们的旅行手帖</h1>
        <p className="text-xs text-ink-light mt-0.5 space-x-3">
          <span>🎀 已探索 <b className="text-gold">{totalProvinces}</b> 省</span>
          <span>📸 共 <b className="text-gold">{totalPhotos}</b> 张</span>
        </p>
        {hoveredProvince && (
          <span className="inline-block mt-1 bg-black/40 backdrop-blur-sm border border-gold/30 rounded-full px-3 py-0.5 text-xs text-gold">
            {hoveredProvince.replace('省', '').replace('市', '').replace('自治区', '').replace('特别行政区', '').replace('维吾尔', '').replace('壮族', '').replace('回族', '')}
          </span>
        )}
      </div>

      <div className="flex-1">
        <MapView
          provinceStats={provinceStats}
          onProvinceClick={(name) => setSelectedProvince(name)}
          onProvinceHover={setHoveredProvince}
        />
      </div>

    </div>
  );
}
