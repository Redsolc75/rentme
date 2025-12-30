import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, Upload, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PropertyFormModal({ property, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: property?.name || '',
    address: property?.address || '',
    city: property?.city || '',
    postal_code: property?.postal_code || '',
    country: property?.country || 'Espanya',
    type: property?.type || 'Pis',
    category: property?.category || 'Pis',
    status: property?.status || 'Buit',
    rent_price: property?.rent_price || '',
    deposit_amount: property?.deposit_amount || '',
    contract_pdf_url: property?.contract_pdf_url || '',
    deposit_receipt_pdf_url: property?.deposit_receipt_pdf_url || '',
    ibi_cost_annual: property?.ibi_cost_annual || '',
    garbage_tax_annual: property?.garbage_tax_annual || '',
    who_pays_ibi: property?.who_pays_ibi || 'Propietari',
    who_pays_garbage: property?.who_pays_garbage || 'Propietari',
    tenant_name: property?.tenant_name || '',
    tenant_surname: property?.tenant_surname || '',
    tenant_dni: property?.tenant_dni || '',
    tenant_nationality: property?.tenant_nationality || '',
    tenant_age: property?.tenant_age || '',
    surface_area: property?.surface_area || '',
    rooms: property?.rooms || '',
    bathrooms: property?.bathrooms || '',
    purchase_year: property?.purchase_year || '',
    description: property?.description || '',
    image_url: property?.image_url || '',
    reference: property?.reference || '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingContract, setUploadingContract] = useState(false);
  const [uploadingDeposit, setUploadingDeposit] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (property) {
        return base44.entities.Property.update(property.id, data);
      }
      return base44.entities.Property.create(data);
    },
    onSuccess: () => onSuccess(),
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, image_url: file_url }));
    setUploading(false);
  };

  const handleContractUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingContract(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, contract_pdf_url: file_url }));
    setUploadingContract(false);
  };

  const handleDepositUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingDeposit(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, deposit_receipt_pdf_url: file_url }));
    setUploadingDeposit(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      rent_price: form.rent_price ? Number(form.rent_price) : undefined,
      deposit_amount: form.deposit_amount ? Number(form.deposit_amount) : undefined,
      ibi_cost_annual: form.ibi_cost_annual ? Number(form.ibi_cost_annual) : undefined,
      garbage_tax_annual: form.garbage_tax_annual ? Number(form.garbage_tax_annual) : undefined,
      tenant_age: form.tenant_age ? Number(form.tenant_age) : undefined,
      surface_area: form.surface_area ? Number(form.surface_area) : undefined,
      rooms: form.rooms ? Number(form.rooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      purchase_year: form.purchase_year ? Number(form.purchase_year) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {property ? 'Editar Propietat' : 'Nova Propietat'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          {/* Image Upload */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Imatge Principal</Label>
            <div className="relative">
              {form.image_url ? (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                  <img src={form.image_url} alt="Property" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, image_url: '' }))}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">Pujar imatge o arrossegar aquí</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG fins 10MB</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Nom *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Apartament Centre"
                className="rounded-xl"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Referència</Label>
              <Input
                value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
                placeholder="REF-001"
                className="rounded-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Adreça *</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Carrer Major 12, 2n 1a"
                className="rounded-xl"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Ciutat</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Barcelona"
                className="rounded-xl"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Codi Postal</Label>
              <Input
                value={form.postal_code}
                onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                placeholder="08001"
                className="rounded-xl"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pis">Pis</SelectItem>
                  <SelectItem value="Local comercial">Local comercial</SelectItem>
                  <SelectItem value="Nau industrial">Nau industrial</SelectItem>
                  <SelectItem value="Parking">Parking</SelectItem>
                  <SelectItem value="Solar">Solar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Estat</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buit">Buit</SelectItem>
                  <SelectItem value="Llogat">Llogat</SelectItem>
                  <SelectItem value="En reformes">En reformes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Preu Lloguer (€/mes)</Label>
              <Input
                type="number"
                value={form.rent_price}
                onChange={(e) => setForm({ ...form, rent_price: e.target.value })}
                placeholder="850"
                className="rounded-xl"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Import Fiança (€)</Label>
              <Input
                type="number"
                value={form.deposit_amount}
                onChange={(e) => setForm({ ...form, deposit_amount: e.target.value })}
                placeholder="1700"
                className="rounded-xl"
              />
            </div>
            
            {/* Financial Section */}
            <div className="sm:col-span-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Impostos i Despeses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Cost IBI Anual (€)</Label>
                  <Input
                    type="number"
                    value={form.ibi_cost_annual}
                    onChange={(e) => setForm({ ...form, ibi_cost_annual: e.target.value })}
                    placeholder="450"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Qui paga l'IBI?</Label>
                  <Select value={form.who_pays_ibi} onValueChange={(v) => setForm({ ...form, who_pays_ibi: v })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Propietari">Propietari</SelectItem>
                      <SelectItem value="Llogater">Llogater</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Cost Escombraries Anual (€)</Label>
                  <Input
                    type="number"
                    value={form.garbage_tax_annual}
                    onChange={(e) => setForm({ ...form, garbage_tax_annual: e.target.value })}
                    placeholder="120"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Qui paga Escombraries?</Label>
                  <Select value={form.who_pays_garbage} onValueChange={(v) => setForm({ ...form, who_pays_garbage: v })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Propietari">Propietari</SelectItem>
                      <SelectItem value="Llogater">Llogater</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tenant Section */}
            <div className="sm:col-span-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Dades del Llogater</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Nom</Label>
                  <Input
                    value={form.tenant_name}
                    onChange={(e) => setForm({ ...form, tenant_name: e.target.value })}
                    placeholder="Joan"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Cognoms</Label>
                  <Input
                    value={form.tenant_surname}
                    onChange={(e) => setForm({ ...form, tenant_surname: e.target.value })}
                    placeholder="García López"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">DNI/NIE</Label>
                  <Input
                    value={form.tenant_dni}
                    onChange={(e) => setForm({ ...form, tenant_dni: e.target.value })}
                    placeholder="12345678A"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Nacionalitat</Label>
                  <Input
                    value={form.tenant_nationality}
                    onChange={(e) => setForm({ ...form, tenant_nationality: e.target.value })}
                    placeholder="Espanyola"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Edat</Label>
                  <Input
                    type="number"
                    value={form.tenant_age}
                    onChange={(e) => setForm({ ...form, tenant_age: e.target.value })}
                    placeholder="35"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="sm:col-span-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Contracte PDF</Label>
                  {form.contract_pdf_url ? (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                      <a href={form.contract_pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm truncate flex-1">
                        Veure contracte
                      </a>
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, contract_pdf_url: '' }))}
                        className="p-1.5 hover:bg-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center px-4 py-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 cursor-pointer transition-colors">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500">Pujar contracte PDF</span>
                      <input type="file" className="hidden" accept=".pdf" onChange={handleContractUpload} disabled={uploadingContract} />
                      {uploadingContract && <span className="text-xs text-blue-500 mt-1">Pujant...</span>}
                    </label>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Rebut Fiança PDF</Label>
                  {form.deposit_receipt_pdf_url ? (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                      <a href={form.deposit_receipt_pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm truncate flex-1">
                        Veure rebut fiança
                      </a>
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, deposit_receipt_pdf_url: '' }))}
                        className="p-1.5 hover:bg-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center px-4 py-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 cursor-pointer transition-colors">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500">Pujar rebut PDF</span>
                      <input type="file" className="hidden" accept=".pdf" onChange={handleDepositUpload} disabled={uploadingDeposit} />
                      {uploadingDeposit && <span className="text-xs text-blue-500 mt-1">Pujant...</span>}
                    </label>
                  )}
                </div>
              </div>
            </div>
            
            {/* Property Details */}
            <div className="sm:col-span-2 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Característiques de l'Immoble</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Superfície (m²)</Label>
                  <Input
                    type="number"
                    value={form.surface_area}
                    onChange={(e) => setForm({ ...form, surface_area: e.target.value })}
                    placeholder="85"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Habitacions</Label>
                  <Input
                    type="number"
                    value={form.rooms}
                    onChange={(e) => setForm({ ...form, rooms: e.target.value })}
                    placeholder="3"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Banys</Label>
                  <Input
                    type="number"
                    value={form.bathrooms}
                    onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                    placeholder="2"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Any Construcció</Label>
                  <Input
                    type="number"
                    value={form.purchase_year}
                    onChange={(e) => setForm({ ...form, purchase_year: e.target.value })}
                    placeholder="1985"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Descripció</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Fantàstic apartament reformat al cor de l'Eixample..."
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
            Cancel·lar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-blue-500 hover:bg-blue-600 rounded-xl"
          >
            {mutation.isPending ? 'Guardant...' : property ? 'Guardar Canvis' : 'Crear Propietat'}
          </Button>
        </div>
      </div>
    </div>
  );
}