import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// He eliminat la línia: import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Home,
  Users,
  Wallet,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- FUNCIÓ AFEGIDA AQUÍ PER EVITAR L'ERROR DE BUILD ---
const createPageUrl = (pageName) => {
  if (!pageName) return '/';
  // Converteix "Dashboard" -> "/dashboard"
  return `/${pageName.toLowerCase()}`;
};
// -------------------------------------------------------

const navItems = [
  { name: 'Tauler de control', icon: LayoutDashboard, page: 'Dashboard' },
  { name: 'Propietats', icon: Home, page: 'Properties' },
  { name: 'Llogaters', icon: Users, page: 'Tenants' },
  { name: 'Contractes', icon: FileText, page: 'Contracts' },
  { name: 'Finances', icon: Wallet, page: 'Finances' },
];

const systemItems = [
  { name: 'Configuració', icon: Settings, page: 'Settings' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: 1,
  });

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al tancar sessió:", error);
    }
  };

  const checkIsActive = (pageName) => {
    const targetUrl = createPageUrl(pageName);
    return location.pathname === targetUrl || location.pathname.startsWith(targetUrl);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Obrir menú"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-800">GestióImmobles</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-800 text-sm">GestióImmobles</h1>
              <p className="text-xs text-slate-400">Panel d'Admin</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg"
            aria-label="Tancar menú"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Principal</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = checkIsActive(item.page);
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2">Sistema</p>
          <div className="space-y-1">
            {systemItems.map((item) => {
              const isActive = checkIsActive(item.page);
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            {isLoadingUser ? (
              // Skeleton Loading State
              <>
                <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                  <div className="h-2 w-14 bg-slate-100 rounded animate-pulse" />
                </div>
              </>
            ) : (
              // Actual User Data
              <>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-medium text-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{user?.full_name || 'Usuari'}</p>
                  <p className="text-xs text-slate-400 truncate">Administrador</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors group-hover:text-red-500"
                  title="Tancar sessió"
                >
                  <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
