import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { calculateAnnualProfit } from '@/utils/financialCalculations';
import { 
  Home, 
  Wallet, 
  Users, 
  Wrench, 
  Building2, 
  PieChart, 
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  FileText
} from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import ActionButton from '@/components/dashboard/ActionButton';
import TasksPanel from '@/components/dashboard/TasksPanel';
import IncomeChart from '@/components/dashboard/IncomeChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => base44.entities.Property.list(),
  });

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => base44.entities.Contract.list(),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list(),
  });

  // Calculate stats
  const currentYear = new Date().getFullYear();
  const annualProfit = calculateAnnualProfit(properties, transactions, currentYear);
  
  const totalProperties = properties.length;
  const rentedProperties = properties.filter(p => p.status === 'Llogat').length;
  const occupancyRate = totalProperties > 0 ? Math.round((rentedProperties / totalProperties) * 100) : 0;
  
  const monthlyIncome = transactions
    .filter(t => t.type === 'Ingrés' && t.status === 'Pagat')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const pendingPayments = transactions
    .filter(t => t.status === 'Pendent' || t.status === 'Endarrerit')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Filter properties by category
  const filteredProperties = categoryFilter === 'all' 
    ? properties 
    : properties.filter(p => p.category === categoryFilter);

  const pendingTasks = [
    { type: 'payment', title: 'Lloguer Vençut', subtitle: 'Marta López - A...', badge: '450 €', time: 'Avui', urgent: true },
    { type: 'renewal', title: 'Renovació C...', subtitle: 'C/ Mallorca 123,...', badge: 'Expira', time: '3 dies', urgent: false },
    { type: 'maintenance', title: 'Reparació Ai...', subtitle: 'Àtic Carrer Balm...', badge: 'Obert', time: '12h', urgent: false },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resum General</h1>
          <p className="text-slate-500 mt-1">
            Benvingut de nou, {user?.full_name?.split(' ')[0] || 'Usuari'}. Aquí tens l'estat actual de la teva cartera.
          </p>
        </div>
        <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 self-start">
          <FileText className="w-4 h-4" />
          Informe
        </button>
      </div>

      {/* Annual Profit Summary Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mb-8 shadow-lg text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Benefici Net Anual {currentYear}</p>
            <h2 className="text-4xl font-bold">{annualProfit.netProfit.toLocaleString('ca-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</h2>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-blue-100 text-xs mb-1">Ingressos Totals</p>
            <p className="text-lg font-semibold">+{annualProfit.totalIncome.toLocaleString('ca-ES')} €</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs mb-1">Despeses Totals</p>
            <p className="text-lg font-semibold">-{annualProfit.totalExpenses.toLocaleString('ca-ES')} €</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs mb-1">Marge Net</p>
            <p className="text-lg font-semibold">{totalProperties > 0 ? ((annualProfit.netProfit / annualProfit.totalIncome) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to={createPageUrl('Properties') + '?action=new'}>
          <ActionButton
            sublabel="Acció"
            label="Afegir Propietat"
            icon={Home}
            iconBgColor="bg-rose-100"
            iconColor="text-rose-500"
          />
        </Link>
        <Link to={createPageUrl('Finances') + '?action=new'}>
          <ActionButton
            sublabel="Finances"
            label="Registrar Pagament"
            icon={Wallet}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-500"
          />
        </Link>
        <Link to={createPageUrl('Tenants') + '?action=new'}>
          <ActionButton
            sublabel="Llogaters"
            label="Nou Llogater"
            icon={Users}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-500"
          />
        </Link>
        <ActionButton
          sublabel="Manteniment"
          label="Incidència"
          icon={Wrench}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-500"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Propietats Totals"
          value={totalProperties || 12}
          icon={Building2}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-500"
          trend="+1"
          trendUp={true}
        />
        <StatsCard
          title="Taxa d'Ocupació"
          value={`${occupancyRate || 83}%`}
          icon={PieChart}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-500"
          trend="+5%"
          trendUp={true}
        />
        <StatsCard
          title="Ingressos Mensuals"
          value={`${(monthlyIncome || 15400).toLocaleString()} €`}
          icon={TrendingUp}
          iconBgColor="bg-violet-100"
          iconColor="text-violet-500"
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Pagaments Pendents"
          value={`${(pendingPayments || 1250).toLocaleString()} €`}
          icon={AlertTriangle}
          iconBgColor="bg-red-100"
          iconColor="text-red-500"
          badge="3 pendents"
        />
      </div>

      {/* Charts and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <IncomeChart />
        </div>
        <div>
          <TasksPanel tasks={pendingTasks} />
        </div>
      </div>

      {/* Featured Properties */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Propietats</h3>
          <div className="flex items-center gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44 rounded-xl">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Totes les categories</SelectItem>
                <SelectItem value="Pis">Pis</SelectItem>
                <SelectItem value="Local comercial">Local comercial</SelectItem>
                <SelectItem value="Nau industrial">Nau industrial</SelectItem>
                <SelectItem value="Parking">Parking</SelectItem>
                <SelectItem value="Solar">Solar</SelectItem>
              </SelectContent>
            </Select>
            <Link 
              to={createPageUrl('Properties')}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 group"
            >
              Veure totes
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(filteredProperties.length > 0 ? filteredProperties.slice(0, 6) : [
            { id: 1, name: 'Apartament Centre', address: 'Carrer Major 12, 2n 1a', rent_price: 850, status: 'Llogat', image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
            { id: 2, name: 'Casa de la Vila', address: 'Plaça de l\'Ajuntament 4', rent_price: 1200, status: 'Llogat', image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' },
            { id: 3, name: 'Estudi Platja', address: 'Passeig Marítim 45', rent_price: 600, status: 'Buit', image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
          ]).map((property) => (
            <Link
              key={property.id}
              to={createPageUrl('PropertyDetail') + `?id=${property.id}`}
              className="group"
            >
              <div className="rounded-xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="aspect-video relative">
                  <img
                    src={property.image_url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full ${
                    property.status === 'Llogat' ? 'bg-emerald-500 text-white' : 
                    property.status === 'Buit' ? 'bg-slate-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{property.name}</h4>
                  <p className="text-sm text-slate-500 mt-0.5">{property.address}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">{property.rent_price?.toLocaleString()}€<span className="text-sm font-normal text-slate-400">/mes</span></p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}