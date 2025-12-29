import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ChevronRight, 
  Pencil, 
  Share2, 
  Euro, 
  Calendar, 
  TrendingUp,
  Maximize,
  BedDouble,
  Bath,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  Plus,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from '@/components/ui/StatusBadge';
import PropertyFormModal from '@/components/properties/PropertyFormModal.jsx';

export default function PropertyDetail() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();
  
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');

  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const properties = await base44.entities.Property.list();
      return properties.find(p => p.id === propertyId);
    },
    enabled: !!propertyId,
  });

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => base44.entities.Contract.list(),
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => base44.entities.Tenant.list(),
  });

  const { data: maintenanceRecords = [] } = useQuery({
    queryKey: ['maintenance', propertyId],
    queryFn: () => base44.entities.MaintenanceRecord.filter({ property_id: propertyId }),
    enabled: !!propertyId,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents', propertyId],
    queryFn: () => base44.entities.Document.filter({ property_id: propertyId }),
    enabled: !!propertyId,
  });

  // Get current tenant
  const activeContract = contracts.find(c => c.property_id === propertyId && c.status === 'Actiu');
  const currentTenant = activeContract ? tenants.find(t => t.id === activeContract.tenant_id) : null;

  if (propertyLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto text-center py-20">
        <p className="text-slate-500">Propietat no trobada</p>
        <Link to={createPageUrl('Properties')} className="text-blue-500 hover:underline mt-2 inline-block">
          Tornar a la llista
        </Link>
      </div>
    );
  }

  const sampleDocuments = documents.length > 0 ? documents : [
    { id: 1, name: 'Contracte Lloguer 2024', type: 'Contracte', file_size: '2.4 MB', upload_date: '2023-10-15' },
    { id: 2, name: 'Certificat Energètic', type: 'Certificat', file_size: '1.1 MB', upload_date: '2022-09-22' },
    { id: 3, name: 'Inventari Mobiliari', type: 'Inventari', file_size: '500 KB', upload_date: '2023-10-01' },
  ];

  const sampleMaintenance = maintenanceRecords.length > 0 ? maintenanceRecords : [
    { id: 1, title: 'Reparació Fontaneria', description: 'Fuita d\'aigua reparada al bany principal.', date: '2024-02-15', cost: 120, status: 'Completat', type: 'Reparació' },
    { id: 2, title: 'Revisió Anual Gas', description: 'Inspecció rutinària completada amb èxit.', date: '2024-01-10', cost: 85, status: 'Completat', type: 'Revisió' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to={createPageUrl('Properties')} className="hover:text-blue-500 transition-colors">Propietats</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-700">{property.city || 'Barcelona'}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-800 font-medium">{property.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
            <img
              src={property.image_url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200'}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <StatusBadge status={property.status} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-2xl font-bold text-white">{property.address}</h1>
              <p className="text-white/80 mt-1">{property.city || 'Eixample, Barcelona'} • {property.postal_code || '08008'}</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg">Visió General</TabsTrigger>
              <TabsTrigger value="tenants" className="rounded-lg">Llogaters</TabsTrigger>
              <TabsTrigger value="finances" className="rounded-lg">Finances</TabsTrigger>
              <TabsTrigger value="maintenance" className="rounded-lg">Manteniment</TabsTrigger>
              <TabsTrigger value="documents" className="rounded-lg">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Characteristics */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Característiques</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Superfície</p>
                    <div className="flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800">{property.surface_area || 85} m²</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Habitacions</p>
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800">{property.rooms || 3} Habs</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Banys</p>
                    <div className="flex items-center gap-2">
                      <Bath className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800">{property.bathrooms || 2} Banys</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Any Construcció</p>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800">{property.purchase_year || 1985}</span>
                    </div>
                  </div>
                </div>

                {property.description && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="font-semibold text-slate-800 mb-2">Descripció</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {property.description || 'Fantàstic apartament reformat al cor de l\'Eixample. Disposa de molta llum natural, terres de parquet, calefacció central i aire condicionat. La cuina esta totalment equipada amb electrodomèstics d\'alta gamma. Situat a prop de transport públic i zones comercials.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Galeria</h3>
                  <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">Veure tot</button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300',
                    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300',
                    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
                    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300',
                  ].map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer hover:opacity-90 transition-opacity relative">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {i === 3 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">+5</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tenants" className="mt-6">
              {currentTenant ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-4">Llogater Actual</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-semibold">
                      {currentTenant.first_name?.charAt(0)}{currentTenant.last_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{currentTenant.first_name} {currentTenant.last_name}</p>
                      <p className="text-sm text-slate-500">Ocupant des de {currentTenant.tenant_since || '2022'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${currentTenant.email}`} className="text-blue-500 hover:underline">{currentTenant.email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{currentTenant.phone || '+34 655 123 456'}</span>
                    </div>
                  </div>
                  <Link 
                    to={createPageUrl('TenantDetail') + `?id=${currentTenant.id}`}
                    className="mt-4 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
                  >
                    Veure perfil complet
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center py-12">
                  <p className="text-slate-500">No hi ha llogater actual</p>
                  <Link to={createPageUrl('Contracts') + '?action=new'}>
                    <Button className="mt-4 bg-blue-500 hover:bg-blue-600 rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Contracte
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="maintenance" className="mt-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Historial de Manteniment</h3>
                  <button className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Nou registre
                  </button>
                </div>
                <div className="space-y-4">
                  {sampleMaintenance.map((record, i) => (
                    <div key={record.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          record.status === 'Completat' ? 'bg-emerald-100' : 'bg-blue-100'
                        }`}>
                          {record.status === 'Completat' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Wrench className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        {i < sampleMaintenance.length - 1 && (
                          <div className="w-0.5 flex-1 bg-slate-200 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-800">{record.title}</p>
                            <p className="text-sm text-slate-500 mt-0.5">{record.description}</p>
                          </div>
                          <span className="text-sm text-slate-400">{record.date}</span>
                        </div>
                        <p className="text-sm text-blue-500 font-medium mt-2">Cost: {record.cost} €</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Documents</h3>
                  <button className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Afegir
                  </button>
                </div>
                <div className="space-y-3">
                  {sampleDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.type} • {doc.file_size} • {doc.upload_date}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="finances" className="mt-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center py-12">
                <p className="text-slate-500">Historial financer de la propietat</p>
                <Link to={createPageUrl('Finances')}>
                  <Button variant="outline" className="mt-4 rounded-xl">
                    Veure Finances
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 rounded-xl">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button 
              onClick={() => setShowEditModal(true)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-xl"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar Propietat
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Euro className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Lloguer Mensual</p>
                <p className="text-2xl font-bold text-slate-800">{property.rent_price?.toLocaleString() || 1250} €</p>
              </div>
            </div>
            <p className="text-xs text-emerald-500 font-medium">↗ +4.5% vs any passat</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Final de Contracte</p>
                <p className="text-2xl font-bold text-slate-800">{activeContract?.end_date ? new Date(activeContract.end_date).toLocaleDateString('ca-ES', { month: 'short', year: 'numeric' }) : 'Oct 2024'}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">Queden 8 mesos</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Rendibilitat Neta</p>
                <p className="text-2xl font-bold text-slate-800">5.2%</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">ROI anual estimat</p>
          </div>

          {/* Current Tenant Card */}
          {currentTenant && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Llogater Actual</h3>
                <span className="text-xs text-blue-500 font-medium">Al corrent</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {currentTenant.first_name?.charAt(0)}{currentTenant.last_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{currentTenant.first_name} {currentTenant.last_name}</p>
                  <p className="text-xs text-slate-400">Ocupant des de {currentTenant.tenant_since || '2022'}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${currentTenant.email}`} className="text-blue-500 hover:underline truncate">{currentTenant.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{currentTenant.phone || '+34 655 123 456'}</span>
                </div>
              </div>
              <Link 
                to={createPageUrl('TenantDetail') + `?id=${currentTenant.id}`}
                className="mt-4 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
              >
                Veure perfil complet
              </Link>
            </div>
          )}

          {/* Map placeholder */}
          <div className="bg-slate-200 rounded-2xl aspect-video overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Veure al mapa
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <PropertyFormModal
          property={property}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}