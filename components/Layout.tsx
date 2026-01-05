
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Database, 
  LogOut, 
  Menu, 
  X, 
  FlaskConical,
  Search,
  Bell,
  Settings,
  Cloud
} from 'lucide-react';
import { CLOUD_STORAGE_URL } from '../services/mockDatabase';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Report History', icon: Search, path: '/history' },
    { label: 'Database & SKUs', icon: Database, path: '/database' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col fixed md:relative z-30 h-full no-print shadow-2xl`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50 bg-slate-900">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
              <FlaskConical className="text-white h-6 w-6" />
            </div>
            {isSidebarOpen && (
              <div>
                <h1 className="font-bold text-lg tracking-tight leading-none text-white">LabGuard<span className="text-indigo-400">Pro</span></h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wider mt-1">QUALITY CONTROL SYS</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
             <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-slate-400">
               <X size={20} />
             </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }
                ${!isSidebarOpen ? 'justify-center px-2' : ''}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={isActive ? 'text-white' : 'group-hover:text-indigo-400 transition-colors'} />
                  {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                  
                  {/* Active Indicator for collapsed state */}
                  {!isSidebarOpen && isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
          
          <div className="px-4 mt-6">
            <div className={`border-t border-slate-800 pt-6 ${!isSidebarOpen && 'hidden'}`}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Cloud Storage</p>
                <a 
                  href={CLOUD_STORAGE_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all group"
                >
                    <Cloud size={22} className="group-hover:text-emerald-400 transition-colors" />
                    <span className="font-medium text-sm">Open OneDrive</span>
                </a>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className={`h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg border-2 border-slate-800`}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                <p className="text-xs text-indigo-400 truncate">ID: {user.id}</p>
              </div>
            )}
            {isSidebarOpen && (
              <button onClick={onLogout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 no-print sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:flex p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                {location.pathname === '/' ? 'Overview' : 
                location.pathname === '/history' ? 'Reports Archive' :
                location.pathname === '/database' ? 'Database Manager' :
                location.pathname.includes('generator') ? 'Report Generator' : ''}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* OneDrive Connected Link */}
             <a 
               href={CLOUD_STORAGE_URL} 
               target="_blank" 
               rel="noopener noreferrer"
               className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer group"
               title="Open Connected OneDrive Folder"
             >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                OneDrive Connected
             </a>
             
             <button className="p-2 text-slate-400 hover:text-slate-600 relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 relative scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
