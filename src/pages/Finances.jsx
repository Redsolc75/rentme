import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Download, TrendingUp, TrendingDown, Calendar, Euro, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import SearchInput from '@/components/ui/SearchInput';
import FilterTabs from '@/components/ui/FilterTabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Finances() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => base44.entities.Property.list(),
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => base44.entities.Tenant.list(),
  });

  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.type === 'Ingrés')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'Despesa')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const pendingAmount = transactions
    .filter(t => t.status === 'Pendent' || t.status === 'Endarrerit')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const filterTabs = [
    { value: 'all', label: 'Tots' },
    { value: 'Ingrés', label: 'Ingressos' },
    { value: 'Despesa', label: 'Despeses' },
  ];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase());
    
    if (typeFilter === 'all') return matchesSearch;
    return matchesSearch && t.type === typeFilter;
  });

  // Sample chart data
  const monthlyData = [
    { month: 'Gen', income: 12500, expenses: 3200 },
    { month: 'Feb', income: 13200, expenses: 2800 },
    { month: 'Mar', income: 14100, expenses: 4100 },
    { month: 'Abr', income: 13800, expenses: 3500 },
    { month: 'Mai', income: 15200, expenses: 2900 },
    { month: 'Jun', income: 15400, expenses: 3100 },
  ];

  const categoryData = [
    { name: 'Lloguer', value: 85, color: '#3b82f6' },
    { name: 'Manteniment', value: 8, color: '#f59e0b' },
    { name: 'Impostos', value: 5, color: '#8b5cf6' },
    { name: 'Altres', value: 2, color: '#64748b' },
  ];

  const sampleTransactions = filteredTransactions.length > 0 ? filteredTransactions : [
    { id: 1, date: '2024-06-15', type: 'Ingrés', category: 'Lloguer', amount: 1200, status: 'Pagat', description: 'Lloguer Juny - Apt. Balmes 122' },
    { id: 2, date: '2024-06-14', type: 'Despesa', category: 'Manteniment', amount: 150, status: 'Pagat', description: 'Reparació fontaneria' },
    { id: 3, date: '2024-06-12', type: 'Ingrés', category: 'Lloguer', amount: 850, status: 'Pagat', description: 'Lloguer Juny - Estudi Platja' },
    { id: 4, date: '2024-06-10', type: 'Ingrés', category: 'Lloguer', amount: 1500, status: 'Pendent', description: 'Lloguer Juny - Casa Vila' },
    { id: 5, date: '2024-06-05', type: 'Despesa', category: 'Assegurança', amount: 320, status: 'Pagat', description: 'Assegurança anual Apt. Centre' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Finances</h1>
          <p className="text-slate-500 mt-1">
            Gestiona els ingressos, despeses i fluxos de caixa.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5 py-2.5 font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Transacció
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Ingressos Totals</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-600">{(totalIncome || 45200).toLocaleString()} €</span>
              </div>
              <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% vs mes anterior
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Despeses Totals</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">{(totalExpenses || 8500).toLocaleString()} €</span>
              </div>
              <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> -5% vs mes anterior
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Pendent de Cobrar</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-600">{(pendingAmount || 2450).toLocaleString()} €</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">3 pagaments pendents</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Euro className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Ingressos vs Despeses</h3>
            <select className="px-3 py-1.5 text-sm bg-slate-100 rounded-lg border-0 focus:ring-2 focus:ring-blue-500">
              <option>Últims 6 mesos</option>
              <option>Últim any</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v/1000)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value.toLocaleString()}€`]}
                />
                <Bar dataKey="income" name="Ingressos" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Despeses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">Distribució per Categoria</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cercar transaccions..."
            className="w-full sm:w-80"
          />
          <FilterTabs 
            tabs={filterTabs}
            activeTab={typeFilter}
            onChange={setTypeFilter}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Data</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Descripció</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Categoria</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Import</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Estat</th>
              </tr>
            </thead>
            <tbody>
              {sampleTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        {new Date(transaction.date).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{transaction.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${transaction.type === 'Ingrés' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transaction.type === 'Ingrés' ? '+' : '-'}{transaction.amount?.toLocaleString()} €
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={transaction.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}