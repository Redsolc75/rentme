import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, Plus, User, Calendar, Euro, Building, FileText, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContractFormModal({ contract, properties, tenants, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState({
    property_id: contract?.property_id || '',
    tenant_id: contract?.tenant_id || '',
    contract_type: contract?.contract_type || 'Contracte d\'arrendament d\'habitatge',
    reference: contract?.reference || '',
    is_active: contract?.is_active ?? true,
    is_indefinite: contract?.is_indefinite || false,
    start_date: contract?.start_date || '',
    end_date: contract?.end_date || '',
    duration_years: contract?.duration_years || 3,
    auto_renew: contract?.auto_renew || false,
    payment_frequency: contract?.payment_frequency || 'Mensual',
    payment_method: contract?.payment_method || 'Transferència bancària',
    payment_day: contract?.payment_day || 1,
    payment_type: contract?.payment_type || 'Pagament per avançat',
    rent_amount: contract?.rent_amount || '',
    expenses_amount: contract?.expenses_amount || '',
    expenses_included: contract?.expenses_included || false,
    fixed_expenses: contract?.fixed_expenses || false,
    total_rent: contract?.total_rent || '',
    vat_applicable: contract?.vat_applicable || false,
    vat_percentage: contract?.vat_percentage || 10,
    deposit_amount: contract?.deposit_amount || '',
    deposit_months: contract?.deposit_months || 2,
    ipc_index: contract?.ipc_index || 'IPC',
    ipc_auto_update: contract?.ipc_auto_update || false,
    ipc_reference_date: contract?.ipc_reference_date || '',
    revision_type: contract?.revision_type || 'Un índex de referència de lloguer',
    first_receipt_date: contract?.first_receipt_date || '',
    calculate_proportional: contract?.calculate_proportional || false,
    status: contract?.status || 'Actiu',
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (contract) {
        return base44.entities.Contract.update(contract.id, data);
      }
      return base44.entities.Contract.create(data);
    },
    onSuccess: () => onSuccess(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalRent = (Number(form.rent_amount) || 0) + (Number(form.expenses_amount) || 0);
    mutation.mutate({
      ...form,
      rent_amount: Number(form.rent_amount) || 0,
      expenses_amount: Number(form.expenses_amount) || 0,
      total_rent: totalRent,
      deposit_amount: Number(form.deposit_amount) || 0,
      payment_day: Number(form.payment_day) || 1,
      duration_years: Number(form.duration_years) || 3,
      vat_percentage: Number(form.vat_percentage) || 10,
      deposit_months: Number(form.deposit_months) || 2,
    });
  };

  const selectedProperty = properties?.find(p => p.id === form.property_id);
  const selectedTenant = tenants?.find(t => t.id === form.tenant_id);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header Tabs */}
        <div className="bg-emerald-500 px-6 py-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent p-0 gap-2 h-auto">
              {['Informació General', 'Informació Adicional', 'Rebuts', 'Altres Ajustes', 'Garants', 'Lloguer', 'Documents', 'Vista prèvia', 'Notes'].map((tab, i) => (
                <TabsTrigger 
                  key={tab}
                  value={tab.toLowerCase().replace(/\s+/g, '-')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                    activeTab === tab.toLowerCase().replace(/\s+/g, '-') 
                      ? 'bg-white text-emerald-600' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <form className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          {/* Property Selection */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">Propietat llogada</h3>
            <div className="flex items-center gap-3">
              <Select value={form.property_id} onValueChange={(v) => setForm({ ...form, property_id: v })}>
                <SelectTrigger className="flex-1 rounded-xl">
                  <SelectValue placeholder="Selecciona una propietat" />
                </SelectTrigger>
                <SelectContent>
                  {properties?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} - {p.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" className="rounded-xl">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Contract Status */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">Estat del lloguer</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                />
                <span className="text-sm text-slate-600">El lloguer està <strong>Actiu</strong></span>
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-500 mb-1.5 block">Tipus *</Label>
              <Select value={form.contract_type} onValueChange={(v) => setForm({ ...form, contract_type: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contracte d'arrendament d'habitatge">Contracte d'arrendament d'habitatge</SelectItem>
                  <SelectItem value="Contracte de local comercial">Contracte de local comercial</SelectItem>
                  <SelectItem value="Contracte de temporada">Contracte de temporada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ID */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">ID</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">ID</Label>
                <Input
                  value={form.reference || 'E02'}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  className="rounded-xl"
                  placeholder="Per favor, ingressa un identificador o número"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Número d'identificació</Label>
                <Input
                  placeholder="LloguerG2"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">Duració</h3>
            <div className="flex items-center gap-3 mb-4">
              <Switch
                checked={form.is_indefinite}
                onCheckedChange={(v) => setForm({ ...form, is_indefinite: v })}
              />
              <span className="text-sm text-slate-600">Duració del lloguer, segons fix o obert</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Inici de lloguer *</Label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Fi del lloguer</Label>
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="rounded-xl"
                  disabled={form.is_indefinite}
                />
              </div>
            </div>
            <div className="mb-4">
              <Label className="text-xs text-slate-500 mb-1.5 block">Durada del lloguer</Label>
              <Select value={String(form.duration_years)} onValueChange={(v) => setForm({ ...form, duration_years: Number(v) })}>
                <SelectTrigger className="w-32 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(y => (
                    <SelectItem key={y} value={String(y)}>{y} anys</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.auto_renew}
                onCheckedChange={(v) => setForm({ ...form, auto_renew: v })}
              />
              <div>
                <span className="text-sm text-slate-600 font-medium">Renovar</span>
                <p className="text-xs text-slate-400">Si marca la casella "Renovació automàtica", el lloguer es renovarà...</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">Pagament</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Pagament *</Label>
                <Select value={form.payment_frequency} onValueChange={(v) => setForm({ ...form, payment_frequency: v })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensual">Mensual</SelectItem>
                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block invisible">Tipus</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={form.payment_type === 'Pagament per avançat' ? 'default' : 'outline'}
                    onClick={() => setForm({ ...form, payment_type: 'Pagament per avançat' })}
                    className="flex-1 rounded-xl text-xs"
                  >
                    Pagament per avançat
                  </Button>
                  <Button
                    type="button"
                    variant={form.payment_type === 'Pagament endarrerit' ? 'default' : 'outline'}
                    onClick={() => setForm({ ...form, payment_type: 'Pagament endarrerit' })}
                    className="flex-1 rounded-xl text-xs"
                  >
                    Pagament endarrerit
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Mètode de pagament</Label>
                <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transferència bancària">Transferència bancària</SelectItem>
                    <SelectItem value="Domiciliació">Domiciliació</SelectItem>
                    <SelectItem value="Efectiu">Efectiu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Data de pagament</Label>
                <Select value={String(form.payment_day)} onValueChange={(v) => setForm({ ...form, payment_day: Number(v) })}>
                  <SelectTrigger className="w-20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                      <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Rent */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">Lloguer</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Lloguer *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                  <Input
                    type="number"
                    value={form.rent_amount}
                    onChange={(e) => setForm({ ...form, rent_amount: e.target.value })}
                    className="rounded-xl pl-8"
                    placeholder="850,00"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Despeses de lloguer</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                  <Input
                    type="number"
                    value={form.expenses_amount}
                    onChange={(e) => setForm({ ...form, expenses_amount: e.target.value })}
                    className="rounded-xl pl-8"
                    placeholder="30,00"
                  />
                </div>
              </div>
              <div className="flex items-end gap-2 pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.expenses_included}
                    onChange={(e) => setForm({ ...form, expenses_included: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-xs text-slate-600">Provisió de despeses</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.fixed_expenses}
                    onChange={(e) => setForm({ ...form, fixed_expenses: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-xs text-slate-600">Pquet de despeses fixes</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <Label className="text-xs text-slate-500 mb-1.5 block">Lloguer Total *</Label>
              <div className="relative w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                <Input
                  type="number"
                  value={(Number(form.rent_amount) || 0) + (Number(form.expenses_amount) || 0)}
                  readOnly
                  className="rounded-xl pl-8 bg-slate-50"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-500 mb-1.5 block">IVA</Label>
              <Select value={form.vat_applicable ? 'yes' : 'no'} onValueChange={(v) => setForm({ ...form, vat_applicable: v === 'yes' })}>
                <SelectTrigger className="w-64 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">Impost sobre el lloguer de les persones físiques</SelectItem>
                  <SelectItem value="yes">Impost sobre lloguer despeses incloses - {form.vat_percentage}%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deposit */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">Dipòsit de seguretat</h3>
            <div>
              <Label className="text-xs text-slate-500 mb-1.5 block">Import de seguretat *</Label>
              <div className="relative w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                <Input
                  type="number"
                  value={form.deposit_amount}
                  onChange={(e) => setForm({ ...form, deposit_amount: e.target.value })}
                  className="rounded-xl pl-8"
                  placeholder="2500,00"
                />
              </div>
            </div>
          </div>

          {/* IPC Revision */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">Revisió de lloguer</h3>
            <RadioGroup
              value={form.revision_type}
              onValueChange={(v) => setForm({ ...form, revision_type: v })}
              className="space-y-2 mb-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="No revisar el lloguer" id="r1" />
                <Label htmlFor="r1" className="text-sm text-slate-600">No revisar el lloguer</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Un índex de referència de lloguer" id="r2" />
                <Label htmlFor="r2" className="text-sm text-slate-600">Un índex de referència de lloguer</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Un percentatge acordat a l'acta" id="r3" />
                <Label htmlFor="r3" className="text-sm text-slate-600">Un percentatge acordat a l'acta</Label>
              </div>
            </RadioGroup>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Índex</Label>
                <Select value={form.ipc_index} onValueChange={(v) => setForm({ ...form, ipc_index: v })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IPC">IPC</SelectItem>
                    <SelectItem value="IRAV">IRAV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Data referència</Label>
                <Input
                  value={form.ipc_reference_date || 'novembre, 2015, 3.60'}
                  onChange={(e) => setForm({ ...form, ipc_reference_date: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Switch
                checked={form.ipc_auto_update}
                onCheckedChange={(v) => setForm({ ...form, ipc_auto_update: v })}
              />
              <span className="text-sm text-slate-600">Actualització automàtica</span>
            </div>
          </div>

          {/* Tenant Selection */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">Inquilins</h3>
            <div>
              <Label className="text-xs text-slate-500 mb-1.5 block">Inquilí(ns)</Label>
              <Select value={form.tenant_id} onValueChange={(v) => setForm({ ...form, tenant_id: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecciona un inquilí" />
                </SelectTrigger>
                <SelectContent>
                  {tenants?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs">
                          {t.first_name?.charAt(0)}{t.last_name?.charAt(0)}
                        </div>
                        {t.first_name} {t.last_name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTenant && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium">
                  {selectedTenant.first_name?.charAt(0)}{selectedTenant.last_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{selectedTenant.first_name} {selectedTenant.last_name}</p>
                  <p className="text-xs text-slate-400">{selectedTenant.email}</p>
                </div>
              </div>
            )}
            <button type="button" className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Afegir Inquilí
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
            Cancel·lar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-emerald-500 hover:bg-emerald-600 rounded-xl"
          >
            {mutation.isPending ? 'Guardant...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </div>
  );
}