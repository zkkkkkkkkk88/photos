import { useMemo } from 'react';
import { useAllPhotos } from './usePhotos';
import { useAuth } from './useAuth';
import type { Stats, ProvinceStats } from '../types';

export function useStats() {
  const { data: photos } = useAllPhotos();
  const { user } = useAuth();

  return useMemo((): Stats | null => {
    if (!photos) return null;

    const provinceMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();
    let myCount = 0;
    let taCount = 0;

    photos.forEach((p) => {
      provinceMap.set(p.province, (provinceMap.get(p.province) || 0) + 1);
      categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
      if (user && p.user_id === user.id) {
        myCount++;
      } else {
        taCount++;
      }
    });

    const provinceRanking: ProvinceStats[] = Array.from(provinceMap.entries())
      .map(([province, count]) => ({ province, count }))
      .sort((a, b) => b.count - a.count);

    const topCategory = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '暂无';

    return {
      totalProvinces: provinceMap.size,
      totalPhotos: photos.length,
      topCategory,
      myCount,
      taCount,
      provinceRanking,
    };
  }, [photos, user]);
}
