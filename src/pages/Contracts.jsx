import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, ChevronLeft, ChevronRight, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import SearchInput from '@/components/ui/SearchInput';
import FilterTabs from '@/components/ui/FilterTabs';
import ContractFormModal from '@/components/contracts/ContractFormModal.jsx';

export default function Contracts() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const queryClient = useQueryClient();

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => base44.entities.Contract.list(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => base44.entities.Property.list(),
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => base44.entities.Tenant.list(),
  });

  const getContractInfo = (contract) => {
    const property = properties.find(p => p.id === contract.property_id);
    const tenant = tenants.find(t => t.id === contract.tenant_id);
    return { property, tenant };
  };

  const filterTabs = [
    { value: 'all', label: 'Tots els estats' },
    { value: 'Actiu', label: 'Actius' },
    { value: 'Renovar aviat', label: 'A punt de vèncer' },
    { value: 'Finalitzat', label: 'Finalitzats' },
  ];

  const filteredContracts = contracts.filter(c => {
    const { property, tenant } = getContractInfo(c);
    const matchesSearch = 
      property?.address?.toLowerCase().includes(search.toLowerCase()) ||
      `${tenant?.first_name} ${tenant?.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      c.reference?.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && c.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const activeContracts = contracts.filter(c => c.status === 'Actiu').length;
  const renewalPending = contracts.filter(c => c.status === 'Renovar aviat').length;
  const monthlyIncome = contracts
    .filter(c => c.status === 'Actiu')
    .reduce((sum, c) => sum + (c.rent_amount || 0), 0);

  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 50;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'new') {
      setShowModal(true);
    }
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contractes de Lloguer</h1>
          <p className="text-slate-500 mt-1">
            Gestió centralitzada de contractes, venciments i estats.
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5 py-2.5 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nou Contracte
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Lloguers Actius</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{activeContracts || 24}</span>
                <span className="text-xs text-emerald-500 font-medium">↗ +2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Renovacions Pendents</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{renewalPending || 3}</span>
                <span className="text-xs text-amber-500 font-medium">Atenció</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Ingressos Mensuals</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{(monthlyIncome || 28500).toLocaleString()} €</span>
                <span className="text-xs text-emerald-500 font-medium">↗ +5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cerca per propietat, llogater o ID..."
            className="w-full lg:w-80"
          />
          <FilterTabs 
            tabs={filterTabs}
            activeTab={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Propietat</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Llogater</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Estat</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Durada Contracte</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Mensualitat</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="px-6 py-4" colSpan={5}>
                      <div className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : paginatedContracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No s'han trobat contractes
                  </td>
                </tr>
              ) : (
                paginatedContracts.map((contract) => {
                  const { property, tenant } = getContractInfo(contract);
                  const progress = calculateProgress(contract.start_date, contract.end_date);
                  
                  return (
                    <tr 
                      key={contract.id} 
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                            <img
                              src={property?.image_url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{property?.address || 'Carrer de Balmes, 124'}</p>
                            <p className="text-xs text-slate-400">{property?.city || 'Barcelona'} • Ref: {contract.reference || '2023-01'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {tenant ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                              {tenant.first_name?.charAt(0)}{tenant.last_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-700">{tenant.first_name} {tenant.last_name}</p>
                              <p className="text-xs text-slate-400">{tenant.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={contract.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-slate-700 mb-1">
                            {contract.start_date ? new Date(contract.start_date).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Gen 2023'} - {contract.end_date ? new Date(contract.end_date).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '31 Des 2024'}
                          </p>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                contract.status === 'Finalitzat' ? 'bg-slate-400' :
                                progress > 80 ? 'bg-amber-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{contract.rent_amount?.toLocaleString() || '1.200'} €</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Mostrant {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredContracts.length)} de {filteredContracts.length} resultats
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ContractFormModal
          properties={properties}
          tenants={tenants}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}