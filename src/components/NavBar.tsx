import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: '🗺️', label: '地图' },
  { to: '/timeline', icon: '📅', label: '时间线' },
  { to: '/stats', icon: '📊', label: '统计' },
];

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-4 pt-2"
         style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
      <div className="max-w-lg mx-auto flex justify-center gap-3 px-4">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-6 py-2 rounded-2xl transition-all text-xs font-medium ${
                isActive
                  ? 'bg-white/5 text-gold shadow-gold'
                  : 'text-white/40 hover:text-white/70'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
