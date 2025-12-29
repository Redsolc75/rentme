import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ChevronRight, 
  Pencil, 
  Bell,
  Plus,
  Mail, 
  Phone,
  CreditCard,
  User,
  Calendar,
  Building,
  Euro,
  FileText,
  Download,
  Upload,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import TenantFormModal from '@/components/tenants/TenantFormModal.jsx';

export default function TenantDetail() {
  const [showEditModal, setShowEditModal] = useState(false);
  const queryClient = useQueryClient();
  
  const urlParams = new URLSearchParams(window.location.search);
  const tenantId = urlParams.get('id');

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      const tenants = await base44.entities.Tenant.list();
      return tenants.find(t => t.id === tenantId);
    },
    enabled: !!tenantId,
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
    queryKey: ['transactions', tenantId],
    queryFn: () => base44.entities.Transaction.filter({ tenant_id: tenantId }),
    enabled: !!tenantId,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents', tenantId],
    queryFn: () => base44.entities.Document.filter({ tenant_id: tenantId }),
    enabled: !!tenantId,
  });

  // Get current contract and property
  const activeContract = contracts.find(c => c.tenant_id === tenantId && (c.status === 'Actiu' || c.status === 'Renovar aviat'));
  const currentProperty = activeContract ? properties.find(p => p.id === activeContract.property_id) : null;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-6 lg:p-8 max-w-6xl mx-auto text-center py-20">
        <p className="text-slate-500">Inquilí no trobat</p>
        <Link to={createPageUrl('Tenants')} className="text-blue-500 hover:underline mt-2 inline-block">
          Tornar a la llista
        </Link>
      </div>
    );
  }

  const samplePayments = transactions.length > 0 ? transactions : [
    { id: 1, month: 'Maig 2024', date: '03/05/2024', amount: 1200, status: 'Pagat' },
    { id: 2, month: 'Abril 2024', date: '02/04/2024', amount: 1200, status: 'Pagat' },
    { id: 3, month: 'Març 2024', date: '05/03/2024', amount: 1200, status: 'Endarrerit' },
  ];

  const sampleDocuments = documents.length > 0 ? documents : [
    { id: 1, name: 'Contracte_2...', type: 'Contracte' },
    { id: 2, name: 'DNI_Scan.jpg', type: 'DNI' },
    { id: 3, name: 'Asseguranç...', type: 'Assegurança' },
  ];

  const tenantSince = tenant.tenant_since ? new Date(tenant.tenant_since).toLocaleDateString('ca-ES', { month: 'long', year: 'numeric' }) : 'Març 2023';

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to={createPageUrl('Tenants')} className="hover:text-blue-500 transition-colors">Tots els Inquilins</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-800 font-medium">{tenant.first_name} {tenant.last_name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold relative">
            {tenant.first_name?.charAt(0)}{tenant.last_name?.charAt(0)}
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{tenant.first_name} {tenant.last_name}</h1>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-full">ACTIU</span>
            </div>
            <p className="text-slate-500 mt-1">
              Inquilí des de {tenantSince} • ID: #INQ-{tenant.id?.slice(-4).toUpperCase() || '8921'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-slate-500" />
          </button>
          <button 
            onClick={() => setShowEditModal(true)}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Pencil className="w-5 h-5 text-slate-500" />
          </button>
          <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Pagament
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Button variant="outline" className="rounded-xl">
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
        <Button variant="outline" className="rounded-xl">
          <Phone className="w-4 h-4 mr-2" />
          Trucar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Contract */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-800">Contracte Actual</h3>
              </div>
              <Link to={createPageUrl('Contracts')} className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                Veure Contracte
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Propietat</p>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {currentProperty?.name || 'Apartament 2B'}, {currentProperty?.address || 'C/ Marina 123'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Lloguer Mensual</p>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {activeContract?.rent_amount?.toLocaleString() || '1.200'},00 €
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Durada del Contracte</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {activeContract?.start_date ? new Date(activeContract.start_date).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Mar 2023'} - {activeContract?.end_date ? new Date(activeContract.end_date).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '28 Feb 2026'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Fiança Dipositada</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {activeContract?.deposit_amount?.toLocaleString() || '2.400'},00 € (Incasòl)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Historial de Pagaments</h3>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
            </div>
            
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 text-xs font-semibold text-slate-400 uppercase">Mes</th>
                  <th className="text-left py-3 text-xs font-semibold text-slate-400 uppercase">Data Pagament</th>
                  <th className="text-left py-3 text-xs font-semibold text-slate-400 uppercase">Import</th>
                  <th className="text-left py-3 text-xs font-semibold text-slate-400 uppercase">Estat</th>
                  <th className="text-left py-3 text-xs font-semibold text-slate-400 uppercase">Rebut</th>
                </tr>
              </thead>
              <tbody>
                {samplePayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-50">
                    <td className="py-4 text-slate-700 font-medium">{payment.month}</td>
                    <td className="py-4 text-slate-500">{payment.date}</td>
                    <td className="py-4 text-slate-700 font-medium">{payment.amount?.toLocaleString()} €</td>
                    <td className="py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="py-4">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button className="w-full mt-4 py-2.5 text-sm text-blue-500 hover:text-blue-600 font-medium">
              Veure tot l'historial
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4">Informació Personal</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">Email</p>
                  <a href={`mailto:${tenant.email}`} className="text-blue-500 hover:underline text-sm">{tenant.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">Mòbil</p>
                  <span className="text-slate-700 text-sm">{tenant.phone || '+34 612 345 678'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">DNI/NIE</p>
                  <span className="text-slate-700 text-sm">{tenant.dni_nie || '48123456X'}</span>
                </div>
              </div>
            </div>

            {tenant.emergency_contact_name && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase mb-3">Contacte d'Emergència</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">{tenant.emergency_contact_name}</p>
                    <p className="text-xs text-slate-400">{tenant.emergency_contact_relation} • {tenant.emergency_contact_phone}</p>
                  </div>
                </div>
              </div>
            )}

            {!tenant.emergency_contact_name && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase mb-3">Contacte d'Emergència</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Maria Puig</p>
                    <p className="text-xs text-slate-400">Germana • 666 777 888</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Documents</h3>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <Upload className="w-4 h-4 text-blue-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {sampleDocuments.map((doc) => (
                <div key={doc.id} className="aspect-square bg-slate-50 rounded-xl flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-slate-100 transition-colors">
                  {doc.type === 'DNI' ? (
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  <p className="text-xs text-slate-600 text-center truncate w-full">{doc.name}</p>
                </div>
              ))}
              <div className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                <Plus className="w-5 h-5 text-slate-400 mb-1" />
                <p className="text-xs text-slate-400">Afegir Doc</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <TenantFormModal
          tenant={tenant}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}