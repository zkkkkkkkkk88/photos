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
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const name = shortName(params.name);
        const count = statsMap.get(params.name) || 0;
        return count > 0
          ? `🌸 <b>${name}</b><br/>📸 ${count} 张照片`
          : `🤍 <b>${name}</b><br/>暂无照片`;
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
          fontSize: 10,
          fontFamily: '"Noto Sans SC", sans-serif',
          formatter: (params: any) => shortName(params.name),
        },
        emphasis: {
          label: {
            show: true,
            color: '#8B7D6D',
            fontSize: 13,
            fontWeight: 'bold',
            formatter: (params: any) => shortName(params.name),
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
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-warm overflow-hidden shadow-sm">
      <ReactECharts
        option={option}
        style={{ height: 'calc(100vh - 130px)', minHeight: '400px' }}
        onEvents={onEvents}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
