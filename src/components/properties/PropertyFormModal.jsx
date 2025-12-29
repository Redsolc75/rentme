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
    status: property?.status || 'Buit',
    rent_price: property?.rent_price || '',
    surface_area: property?.surface_area || '',
    rooms: property?.rooms || '',
    bathrooms: property?.bathrooms || '',
    purchase_year: property?.purchase_year || '',
    description: property?.description || '',
    image_url: property?.image_url || '',
    reference: property?.reference || '',
  });
  const [uploading, setUploading] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      rent_price: form.rent_price ? Number(form.rent_price) : undefined,
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
              <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Tipus</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pis">Pis</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Local">Local</SelectItem>
                  <SelectItem value="Estudi">Estudi</SelectItem>
                  <SelectItem value="Àtic">Àtic</SelectItem>
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
                  <SelectItem value="Manteniment">Manteniment</SelectItem>
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