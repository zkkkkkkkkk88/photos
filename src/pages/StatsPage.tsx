import { useStats } from '../hooks/useStats';

const categoryIcons: Record<string, string> = {
  '美食': '🍜',
  '景点': '🏔️',
  '其他': '📷',
};

export default function StatsPage() {
  const stats = useStats();

  if (!stats) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-ink-light">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-2">
        <h1 className="text-xl font-serif font-bold text-ink text-center">📊 旅行统计</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="card text-center space-y-1">
            <div className="text-3xl font-bold text-sakura">{stats.totalProvinces}</div>
            <div className="text-xs text-ink-light">🎀 已探索省份</div>
          </div>
          <div className="card text-center space-y-1">
            <div className="text-3xl font-bold text-sakura">{stats.totalPhotos}</div>
            <div className="text-xs text-ink-light">📸 总照片数</div>
          </div>
          <div className="card text-center space-y-1">
            <div className="text-2xl">
              {categoryIcons[stats.topCategory]} {stats.topCategory}
            </div>
            <div className="text-xs text-ink-light">🏆 照片最多分类</div>
          </div>
          <div className="card text-center space-y-1">
            <div className="text-xl font-bold text-sakura">
              {stats.totalPhotos > 0
                ? `${stats.myCount} / ${stats.taCount}`
                : '暂无'}
            </div>
            <div className="text-xs text-ink-light">👤 我 / Ta 贡献</div>
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
                    i < 3 ? 'text-sakura' : 'text-ink-light'
                  }`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </span>
                  <span className="flex-1 text-sm text-ink">{p.province}</span>
                  <span className="text-xs text-ink-light">{p.count} 张</span>
                  <div className="w-24 h-1.5 bg-warm rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sakura rounded-full transition-all"
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
