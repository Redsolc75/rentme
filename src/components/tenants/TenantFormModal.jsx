import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, Upload, User, Briefcase, CreditCard, Mail, MapPin } from 'lucide-react';
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

export default function TenantFormModal({ tenant, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState({
    tenant_type: tenant?.tenant_type || 'Individual',
    title: tenant?.title || '',
    first_name: tenant?.first_name || '',
    second_name: tenant?.second_name || '',
    last_name: tenant?.last_name || '',
    birth_date: tenant?.birth_date || '',
    birth_place: tenant?.birth_place || '',
    nationality: tenant?.nationality || '',
    dni_nie: tenant?.dni_nie || '',
    id_type: tenant?.id_type || 'DNI',
    id_number: tenant?.id_number || '',
    id_expiry: tenant?.id_expiry || '',
    profession: tenant?.profession || '',
    monthly_income: tenant?.monthly_income || '',
    email: tenant?.email || '',
    secondary_email: tenant?.secondary_email || '',
    phone: tenant?.phone || '',
    landline: tenant?.landline || '',
    address_1: tenant?.address_1 || '',
    address_2: tenant?.address_2 || '',
    tenant_city: tenant?.tenant_city || '',
    tenant_postal_code: tenant?.tenant_postal_code || '',
    region: tenant?.region || '',
    tenant_country: tenant?.tenant_country || '',
    emergency_contact_name: tenant?.emergency_contact_name || '',
    emergency_contact_relation: tenant?.emergency_contact_relation || '',
    emergency_contact_phone: tenant?.emergency_contact_phone || '',
    profile_photo: tenant?.profile_photo || '',
    color_label: tenant?.color_label || 'blue',
    portal_invited: tenant?.portal_invited || false,
  });
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (tenant) {
        return base44.entities.Tenant.update(tenant.id, data);
      }
      return base44.entities.Tenant.create(data);
    },
    onSuccess: () => onSuccess(),
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, profile_photo: file_url }));
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      monthly_income: form.monthly_income ? Number(form.monthly_income) : undefined,
    });
  };

  const colorOptions = [
    { value: 'red', bg: 'bg-red-500' },
    { value: 'blue', bg: 'bg-blue-500' },
    { value: 'green', bg: 'bg-emerald-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {tenant ? `Editar inquilí ${tenant.first_name} ${tenant.last_name}` : 'Nou Inquilí'}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel·lar</Button>
            <Button 
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 rounded-xl"
            >
              {mutation.isPending ? 'Guardant...' : 'Guardar Canvis'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 py-3 border-b border-slate-100">
            <TabsList className="bg-transparent p-0 h-auto gap-6">
              <TabsTrigger value="general" className="px-0 py-2 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Informació General
              </TabsTrigger>
              <TabsTrigger value="additional" className="px-0 py-2 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Informació Adicional
              </TabsTrigger>
              <TabsTrigger value="guarantors" className="px-0 py-2 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Garants
              </TabsTrigger>
              <TabsTrigger value="emergency" className="px-0 py-2 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Contactes d'Emergència
              </TabsTrigger>
              <TabsTrigger value="documents" className="px-0 py-2 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          <form className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <TabsContent value="general" className="mt-0 space-y-6">
              {/* Photo & Type */}
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    {form.profile_photo ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden">
                        <img src={form.profile_photo} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-10 h-10 text-slate-300" />
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <label className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer font-medium">
                    Canviar Foto
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  <p className="text-xs text-slate-400 mt-1">GIF, JPG, PNG. Max 15MB</p>
                  
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">COLOR ETIQUETA</p>
                    <div className="flex gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setForm({ ...form, color_label: color.value })}
                          className={`w-6 h-6 rounded-full ${color.bg} ${
                            form.color_label === color.value ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Tipus d'inquilí</Label>
                    <Select value={form.tenant_type} onValueChange={(v) => setForm({ ...form, tenant_type: v })}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Empresa">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-slate-700 mb-3">Detalls Personals</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Títol</Label>
                        <Select value={form.title} onValueChange={(v) => setForm({ ...form, title: v })}>
                          <SelectTrigger className="rounded-xl bg-white">
                            <SelectValue placeholder="Sra." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sr.">Sr.</SelectItem>
                            <SelectItem value="Sra.">Sra.</SelectItem>
                            <SelectItem value="Dr.">Dr.</SelectItem>
                            <SelectItem value="Dra.">Dra.</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Nom *</Label>
                        <Input
                          value={form.first_name}
                          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                          className="rounded-xl bg-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Segon Nom</Label>
                        <Input
                          value={form.second_name}
                          onChange={(e) => setForm({ ...form, second_name: e.target.value })}
                          className="rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Cognom *</Label>
                        <Input
                          value={form.last_name}
                          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                          className="rounded-xl bg-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Data de Naixement</Label>
                        <Input
                          type="date"
                          value={form.birth_date}
                          onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                          className="rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Lloc de Naixement</Label>
                        <Input
                          value={form.birth_place}
                          onChange={(e) => setForm({ ...form, birth_place: e.target.value })}
                          className="rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Nacionalitat</Label>
                        <Input
                          value={form.nationality}
                          onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                          className="rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">NIF</Label>
                        <Input
                          value={form.dni_nie}
                          onChange={(e) => setForm({ ...form, dni_nie: e.target.value })}
                          placeholder="EX: 12345678Z"
                          className="rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work & ID */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">Estat de treball</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Professió</Label>
                      <Input
                        value={form.profession}
                        onChange={(e) => setForm({ ...form, profession: e.target.value })}
                        className="rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Ingressos mensuals (€)</Label>
                      <Input
                        type="number"
                        value={form.monthly_income}
                        onChange={(e) => setForm({ ...form, monthly_income: e.target.value })}
                        className="rounded-xl bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">Identificació</p>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Tipus</Label>
                        <Select value={form.id_type} onValueChange={(v) => setForm({ ...form, id_type: v })}>
                          <SelectTrigger className="rounded-xl bg-white">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DNI">DNI</SelectItem>
                            <SelectItem value="NIE">NIE</SelectItem>
                            <SelectItem value="Passaport">Passaport</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Venciment</Label>
                        <Input
                          type="date"
                          value={form.id_expiry}
                          onChange={(e) => setForm({ ...form, id_expiry: e.target.value })}
                          className="rounded-xl bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Número</Label>
                      <Input
                        value={form.id_number}
                        onChange={(e) => setForm({ ...form, id_number: e.target.value })}
                        className="rounded-xl bg-white"
                      />
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                      <Upload className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                      <p className="text-sm text-blue-500 font-medium">Pujar arxiu</p>
                      <p className="text-xs text-slate-400">o arrossegar aquí</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">Informació de contacte</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Email Principal *</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="rounded-xl bg-white"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Invitar al portal</Label>
                      <p className="text-xs text-slate-400">Enviar accés a l'inquilí</p>
                    </div>
                    <Switch
                      checked={form.portal_invited}
                      onCheckedChange={(v) => setForm({ ...form, portal_invited: v })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Email Secundari</Label>
                    <Input
                      type="email"
                      value={form.secondary_email}
                      onChange={(e) => setForm({ ...form, secondary_email: e.target.value })}
                      className="rounded-xl bg-white"
                    />
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Mòbil</Label>
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="612 34 56 78"
                        className="rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Telèfon Fix</Label>
                      <Input
                        value={form.landline}
                        onChange={(e) => setForm({ ...form, landline: e.target.value })}
                        placeholder="612 34 56 78"
                        className="rounded-xl bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">Direcció</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Direcció 1</Label>
                    <Input
                      value={form.address_1}
                      onChange={(e) => setForm({ ...form, address_1: e.target.value })}
                      placeholder="Introdueix una ubicació"
                      className="rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Direcció 2</Label>
                    <Input
                      value={form.address_2}
                      onChange={(e) => setForm({ ...form, address_2: e.target.value })}
                      className="rounded-xl bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Ciutat</Label>
                      <Input
                        value={form.tenant_city}
                        onChange={(e) => setForm({ ...form, tenant_city: e.target.value })}
                        className="rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Codi Postal</Label>
                      <Input
                        value={form.tenant_postal_code}
                        onChange={(e) => setForm({ ...form, tenant_postal_code: e.target.value })}
                        className="rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Regió</Label>
                      <Input
                        value={form.region}
                        onChange={(e) => setForm({ ...form, region: e.target.value })}
                        className="rounded-xl bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">País</Label>
                    <Select value={form.tenant_country} onValueChange={(v) => setForm({ ...form, tenant_country: v })}>
                      <SelectTrigger className="rounded-xl bg-white">
                        <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Espanya">Espanya</SelectItem>
                        <SelectItem value="França">França</SelectItem>
                        <SelectItem value="Portugal">Portugal</SelectItem>
                        <SelectItem value="Itàlia">Itàlia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emergency" className="mt-0">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">Contacte d'Emergència</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Nom</Label>
                    <Input
                      value={form.emergency_contact_name}
                      onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
                      className="rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Relació</Label>
                    <Input
                      value={form.emergency_contact_relation}
                      onChange={(e) => setForm({ ...form, emergency_contact_relation: e.target.value })}
                      placeholder="Germana"
                      className="rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Telèfon</Label>
                    <Input
                      value={form.emergency_contact_phone}
                      onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
                      className="rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="mt-0">
              <div className="text-center py-12 text-slate-400">
                Informació adicional
              </div>
            </TabsContent>

            <TabsContent value="guarantors" className="mt-0">
              <div className="text-center py-12 text-slate-400">
                Garants
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <div className="text-center py-12 text-slate-400">
                Documents
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </div>
  );
}