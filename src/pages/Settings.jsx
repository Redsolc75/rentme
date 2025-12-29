import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { User, Building, Bell, CreditCard, Shield, Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    company_name: '',
    company_address: '',
    company_nif: '',
  });

  const [notifications, setNotifications] = useState({
    email_payments: true,
    email_contracts: true,
    email_maintenance: false,
    push_payments: true,
    push_contracts: false,
  });

  React.useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const settingsSections = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'company', label: 'Empresa', icon: Building },
    { id: 'notifications', label: 'Notificacions', icon: Bell },
    { id: 'billing', label: 'Facturació', icon: CreditCard },
    { id: 'security', label: 'Seguretat', icon: Shield },
    { id: 'preferences', label: 'Preferències', icon: Globe },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Configuració</h1>
        <p className="text-slate-500 mt-1">
          Gestiona la teva compte i preferències de l'aplicació.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === section.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <section.icon className={`w-5 h-5 ${activeTab === section.id ? 'text-blue-500' : 'text-slate-400'}`} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Informació del Perfil</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                  {profileForm.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <Button variant="outline" className="rounded-xl mb-2">Canviar foto</Button>
                  <p className="text-xs text-slate-400">JPG, GIF o PNG. Màx 1MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Nom complet</Label>
                  <Input
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</Label>
                  <Input
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="rounded-xl"
                    disabled
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Telèfon</Label>
                  <Input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+34 612 345 678"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Idioma</Label>
                  <Select defaultValue="ca">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">Català</SelectItem>
                      <SelectItem value="es">Espanyol</SelectItem>
                      <SelectItem value="en">Anglès</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Canvis
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Dades de l'Empresa</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Nom de l'empresa</Label>
                  <Input
                    value={profileForm.company_name}
                    onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                    placeholder="La meva empresa SL"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">NIF/CIF</Label>
                  <Input
                    value={profileForm.company_nif}
                    onChange={(e) => setProfileForm({ ...profileForm, company_nif: e.target.value })}
                    placeholder="B12345678"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Adreça fiscal</Label>
                  <Input
                    value={profileForm.company_address}
                    onChange={(e) => setProfileForm({ ...profileForm, company_address: e.target.value })}
                    placeholder="Carrer Major, 1, 08001 Barcelona"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Canvis
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Preferències de Notificacions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-slate-700 mb-4">Notificacions per Email</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700">Pagaments</p>
                        <p className="text-sm text-slate-400">Rebuts quan es processen pagaments</p>
                      </div>
                      <Switch
                        checked={notifications.email_payments}
                        onCheckedChange={(v) => setNotifications({ ...notifications, email_payments: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700">Contractes</p>
                        <p className="text-sm text-slate-400">Alertes de venciment i renovacions</p>
                      </div>
                      <Switch
                        checked={notifications.email_contracts}
                        onCheckedChange={(v) => setNotifications({ ...notifications, email_contracts: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700">Manteniment</p>
                        <p className="text-sm text-slate-400">Actualitzacions d'incidències</p>
                      </div>
                      <Switch
                        checked={notifications.email_maintenance}
                        onCheckedChange={(v) => setNotifications({ ...notifications, email_maintenance: v })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-medium text-slate-700 mb-4">Notificacions Push</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700">Pagaments urgents</p>
                        <p className="text-sm text-slate-400">Alertes de pagaments vençuts</p>
                      </div>
                      <Switch
                        checked={notifications.push_payments}
                        onCheckedChange={(v) => setNotifications({ ...notifications, push_payments: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700">Nous contractes</p>
                        <p className="text-sm text-slate-400">Quan es crea un contracte</p>
                      </div>
                      <Switch
                        checked={notifications.push_contracts}
                        onCheckedChange={(v) => setNotifications({ ...notifications, push_contracts: v })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Preferències
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Seguretat</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-slate-700 mb-4">Canviar Contrasenya</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Contrasenya actual</Label>
                      <Input type="password" className="rounded-xl" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Nova contrasenya</Label>
                      <Input type="password" className="rounded-xl" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Confirmar contrasenya</Label>
                      <Input type="password" className="rounded-xl" />
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                      Actualitzar Contrasenya
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-medium text-slate-700 mb-4">Autenticació de dos factors</h3>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-slate-700">2FA no activat</p>
                      <p className="text-sm text-slate-400">Afegeix una capa extra de seguretat</p>
                    </div>
                    <Button variant="outline" className="rounded-xl">Activar</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'billing' || activeTab === 'preferences') && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">
                {activeTab === 'billing' ? 'Facturació' : 'Preferències'}
              </h2>
              <div className="text-center py-12 text-slate-400">
                <p>Pròximament</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}