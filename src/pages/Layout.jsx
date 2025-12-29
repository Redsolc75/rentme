import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added hooks
import { createPageUrl } from './utils';
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

const navItems = [
  { name: 'Tauler de control', icon: LayoutDashboard, page: 'Dashboard', path: '/dashboard' },
  { name: 'Propietats', icon: Home, page: 'Properties', path: '/properties' },
  { name: 'Llogaters', icon: Users, page: 'Tenants', path: '/tenants' },
  { name: 'Contractes', icon: FileText, page: 'Contracts', path: '/contracts' },
  { name: 'Finances', icon: Wallet, page: 'Finances', path: '/finances' },
];

const systemItems = [
  { name: 'Configuració', icon: Settings, page: 'Settings', path: '/settings' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fetch user data
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: 1, // Don't retry indefinitely if 401
  });

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
      // Invalidate queries or clear cache here if needed
      navigate('/login'); // Redirect to login
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Helper to determine active state
  // You might need to adjust
