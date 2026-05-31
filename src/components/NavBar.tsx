import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: '🗺️', label: '地图' },
  { to: '/timeline', icon: '📅', label: '时间线' },
  { to: '/stats', icon: '📊', label: '统计' },
];

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-warm z-40">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-sakura bg-sakura-light'
                  : 'text-ink-light hover:text-ink'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
