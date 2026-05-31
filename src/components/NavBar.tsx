import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: '🗺️', label: '地图' },
  { to: '/timeline', icon: '📅', label: '时间线' },
  { to: '/stats', icon: '📊', label: '统计' },
];

export default function NavBar() {
  return (
    <nav className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-2xl transition-all backdrop-blur-sm ${
              isActive
                ? 'bg-white/80 text-sakura shadow-sm scale-110'
                : 'bg-white/40 text-ink-light hover:bg-white/60 hover:scale-105'
            }`
          }
        >
          <span className="text-xl">{icon}</span>
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
