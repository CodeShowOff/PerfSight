import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navLinks = [
    {
      to: '/dashboard',
      label: 'Observatory',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    {
      to: '/reports',
      label: 'Records',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
    {
      to: '/baselines',
      label: 'Baselines',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    },
    {
      to: '/perf',
      label: 'Telemetry',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
  ];

  return (
    <aside className="w-64 bg-stone-100 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 flex flex-col shadow-sm transition-colors duration-300 z-10 font-sans">
      {/* Search / Section Label */}
      <div className="p-6 border-b border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 transition-colors duration-300">Menu</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-3">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3 rounded-none transition-all duration-200 border-l-2 ${isActive
                    ? 'border-stone-900 dark:border-stone-100 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 shadow-sm'
                    : 'border-transparent text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600 hover:text-stone-900 dark:hover:text-stone-200'
                  }`
                }
              >
                <span className={({ isActive }) => isActive ? 'text-stone-900 dark:text-stone-100 transition-colors duration-300' : 'text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors duration-300'}>
                  {link.icon}
                </span>
                <span className="font-serif tracking-wide">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="flex items-center gap-2 group">
          <div className="w-2 h-2 bg-stone-900 dark:bg-stone-100 rounded-full animate-pulse transition-colors duration-300"></div>
          <span className="text-xs uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors duration-300 cursor-pointer">Live Feed Active</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
