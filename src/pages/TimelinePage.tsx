import Timeline from '../components/Timeline';

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-washi pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-2">
        <h1 className="text-xl font-serif font-bold text-ink text-center">📅 旅行时间线</h1>
        <p className="text-xs text-ink-light text-center mt-1">跨省份按日期浏览</p>
      </div>
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <Timeline />
      </div>
    </div>
  );
}
