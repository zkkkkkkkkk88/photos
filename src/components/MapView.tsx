import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { ProvinceStats } from '../types';

// Map full province names to short 2-char names
const SHORT_NAMES: Record<string, string> = {
  '北京市': '北京', '天津市': '天津', '河北省': '河北', '山西省': '山西',
  '内蒙古自治区': '内蒙古', '辽宁省': '辽宁', '吉林省': '吉林', '黑龙江省': '黑龙江',
  '上海市': '上海', '江苏省': '江苏', '浙江省': '浙江', '安徽省': '安徽',
  '福建省': '福建', '江西省': '江西', '山东省': '山东', '河南省': '河南',
  '湖北省': '湖北', '湖南省': '湖南', '广东省': '广东', '广西壮族自治区': '广西',
  '海南省': '海南', '重庆市': '重庆', '四川省': '四川', '贵州省': '贵州',
  '云南省': '云南', '西藏自治区': '西藏', '陕西省': '陕西', '甘肃省': '甘肃',
  '青海省': '青海', '宁夏回族自治区': '宁夏', '新疆维吾尔自治区': '新疆',
  '台湾省': '台湾', '香港特别行政区': '香港', '澳门特别行政区': '澳门',
};

function shortName(name: string): string {
  return SHORT_NAMES[name] || name;
}

interface MapViewProps {
  provinceStats: ProvinceStats[];
  onProvinceClick: (provinceName: string) => void;
  onProvinceHover?: (provinceName: string | null) => void;
}

export default function MapView({ provinceStats, onProvinceClick, onProvinceHover }: MapViewProps) {
  const [mapGeoJSON, setMapGeoJSON] = useState<any>(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'china.json')
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
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const name = shortName(params.name);
        const count = statsMap.get(params.name) || 0;
        if (count >= 100) return `🔴 <b>${name}</b><br/>📸 ${count} 张照片`;
        if (count >= 10) return `🟡 <b>${name}</b><br/>📸 ${count} 张照片`;
        if (count >= 1) return `🟣 <b>${name}</b><br/>📸 ${count} 张照片`;
        return `🌙 <b>${name}</b><br/>暂无照片`;
      },
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: 'rgba(212,175,55,0.4)',
      textStyle: { color: '#fff', fontSize: 12 },
    },
    visualMap: {
      type: 'piecewise',
      pieces: [
        { min: 100, color: '#DC2626', label: '100+' },
        { min: 10, max: 99, color: '#D4AF37', label: '10-99' },
        { min: 1, max: 9, color: '#7C3AED', label: '1-9' },
        { value: 0, color: '#1a1a2e' },
      ],
      calculable: false,
      show: false,
    },
    series: [
      {
        type: 'map',
        map: 'china',
        aspectScale: 1.0,
        layoutCenter: ['50%', '52%'],
        layoutSize: '95%',
        roam: false,
        label: {
          show: true,
          color: 'rgba(255,255,255,0.5)',
          fontSize: 10,
          fontFamily: '"Noto Sans SC", sans-serif',
          formatter: (params: any) => shortName(params.name),
        },
        emphasis: {
          label: {
            show: true,
            color: '#E8D48B',
            fontSize: 13,
            fontWeight: 'bold',
            formatter: (params: any) => shortName(params.name),
          },
          itemStyle: {
            areaColor: '#3a2a10',
            borderColor: '#D4AF37',
            borderWidth: 2,
            shadowBlur: 20,
            shadowColor: 'rgba(212, 175, 55, 0.5)',
          },
        },
        itemStyle: {
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1.5,
          areaColor: '#1a1a2e',
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
    <ReactECharts
      option={option}
      style={{ height: 'calc(100vh - 140px)', minHeight: '500px', width: '100%' }}
      onEvents={onEvents}
      opts={{ renderer: 'svg' }}
    />
  );
}
