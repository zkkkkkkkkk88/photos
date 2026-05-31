import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { ProvinceStats } from '../types';

interface MapViewProps {
  provinceStats: ProvinceStats[];
  onProvinceClick: (provinceName: string) => void;
  onProvinceHover?: (provinceName: string | null) => void;
}

export default function MapView({ provinceStats, onProvinceClick, onProvinceHover }: MapViewProps) {
  const [mapGeoJSON, setMapGeoJSON] = useState<any>(null);

  useEffect(() => {
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then((res) => res.json())
      .then((geo) => {
        echarts.registerMap('china', geo);
        setMapGeoJSON(geo);
      })
      .catch(console.error);
  }, []);

  if (!mapGeoJSON) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-ink-light text-sm">地图加载中...</div>
      </div>
    );
  }

  const statsMap = new Map(provinceStats.map((s) => [s.province, s.count]));

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const count = statsMap.get(params.name) || 0;
        return count > 0
          ? `🌸 <b>${params.name}</b><br/>📸 ${count} 张照片`
          : `🤍 <b>${params.name}</b><br/>暂无照片`;
      },
      backgroundColor: '#fff',
      borderColor: '#E8DDD0',
      textStyle: { color: '#8B7D6D', fontSize: 12 },
    },
    visualMap: {
      min: 0,
      max: Math.max(1, ...provinceStats.map((s) => s.count)),
      inRange: {
        color: ['#F5EDE3', '#FDE8E8', '#F9C5C5', '#F4C2C2', '#E8A8A8'],
      },
      calculable: false,
      show: false,
    },
    series: [
      {
        type: 'map',
        map: 'china',
        aspectScale: 0.85,
        roam: false,
        label: {
          show: true,
          color: '#B0A090',
          fontSize: 9,
          fontFamily: '"Noto Sans SC", sans-serif',
        },
        emphasis: {
          label: {
            show: true,
            color: '#8B7D6D',
            fontSize: 12,
            fontWeight: 'bold',
          },
          itemStyle: {
            areaColor: '#FFF5F5',
            borderColor: '#F4C2C2',
            borderWidth: 2,
            shadowBlur: 12,
            shadowColor: 'rgba(244, 194, 194, 0.3)',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1.5,
          areaColor: '#F5EDE3',
        },
        data: provinceStats.map((s) => ({
          name: s.province,
          value: s.count,
        })),
      },
    ],
  };

  const onEvents = {
    click: (params: any) => {
      if (params.name) {
        onProvinceClick(params.name);
      }
    },
    mouseover: (params: any) => {
      onProvinceHover?.(params.name || null);
    },
    mouseout: () => {
      onProvinceHover?.(null);
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-warm overflow-hidden shadow-sm">
      <ReactECharts
        option={option}
        style={{ height: '68vh', minHeight: '480px' }}
        onEvents={onEvents}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
