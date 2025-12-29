import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, ChevronLeft, ChevronRight, Download, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import SearchInput from '@/components/ui/SearchInput';
import FilterTabs from '@/components/ui/FilterTabs';
import TenantFormModal from '@/components/tenants/TenantFormModal.jsx';

export default function Tenants() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => base44.entities.Tenant.list(),
  });

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => base44.entities.Contract.list(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => base44.entities.Property.list(),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list(),
  });

  // Get tenant info with their contract and property
  const getTenantInfo = (tenant) => {
    const contract = contracts.find(c => c.tenant_id === tenant.id && (c.status === 'Actiu' || c.status === 'Renovar aviat'));
    const property = contract ? properties.find(p => p.id === contract.property_id) : null;
    
    // Check payment status
    const tenantTransactions = transactions.filter(t => t.tenant_id === tenant.id);
    const hasOverdue = tenantTransactions.some(t => t.status === 'Endarrerit' || t.status === 'Morós');
    const hasPending = tenantTransactions.some(t => t.status === 'Pendent');
    
    let paymentStatus = 'Pagat';
    if (hasOverdue) paymentStatus = 'Morós';
    else if (hasPending) paymentStatus = 'Pendent';
    
    return { contract, property, paymentStatus };
  };

  const filterTabs = [
    { value: 'all', label: 'Tots' },
    { value: 'Pagat', label: 'Al corrent' },
    { value: 'Pendent', label: 'Pendent' },
    { value: 'Morós', label: 'Morós' },
  ];

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = 
      `${t.first_name} ${t.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    
    const { paymentStatus } = getTenantInfo(t);
    return matchesSearch && paymentStatus === statusFilter;
  });

  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);
  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <h1 className="text-2xl font-bold text-slate-800">Inquilins</h1>
          <p className="text-slate-500 mt-1">
            Gestiona els llogaters, contractes i l'estat dels pagaments.
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5 py-2.5 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Afegir Inquilí
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cercar per nom, email o propietat..."
            className="w-full lg:w-80"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <FilterTabs 
              tabs={filterTabs}
              activeTab={statusFilter}
              onChange={setStatusFilter}
            />
            <div className="flex items-center gap-2">
              <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
                <Download className="w-4 h-4 text-slate-500" />
              </button>
              <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Inquilí</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Contacte</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Propietat</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Final Contracte</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Estat</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="px-6 py-4" colSpan={6}>
                      <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : paginatedTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No s'han trobat inquilins
                  </td>
                </tr>
              ) : (
                paginatedTenants.map((tenant) => {
                  const { contract, property, paymentStatus } = getTenantInfo(tenant);
                  return (
                    <tr 
                      key={tenant.id} 
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <Link to={createPageUrl('TenantDetail') + `?id=${tenant.id}`} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {tenant.first_name?.charAt(0)}{tenant.last_name?.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                            {tenant.first_name} {tenant.last_name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-700">{tenant.email}</p>
                          <p className="text-sm text-slate-400">{tenant.phone || '+34 654 123 456'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {property ? (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">📍</span>
                            <span className="text-slate-600">{property.address}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {contract?.end_date ? new Date(contract.end_date).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={paymentStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <ChevronRight className="w-4 h-4 text-slate-300" />
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
              Mostrant {((currentPage - 1) * itemsPerPage) + 1} de {Math.min(currentPage * itemsPerPage, filteredTenants.length)} inquilins
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
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
        <TenantFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}