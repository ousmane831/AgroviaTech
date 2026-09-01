import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getBuyerNeeds, saveBuyerNeeds, type BuyerNeed, type MarketQuality } from '@/data/agroviamarket';
import { ArrowRight, BadgeCheck, BriefcaseBusiness, MapPinned, ShoppingCart, Sparkles } from 'lucide-react';

const defaultForm = {
  produit: 'Arachides',
  qualite: 'Premium',
  quantite: '300',
  zone: 'Dakar',
  budget: '600',
  delai: '2026-09-12',
};

export default function AgroviaMarketBuyerPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);

  const handleChange = (field: keyof typeof defaultForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    const needs = getBuyerNeeds();
    const nextNeed: BuyerNeed = {
      id: `need-${Date.now()}`,
      buyerName: 'Nouvel acheteur',
      region: form.zone,
      crop: form.produit,
      quantity: Number(form.quantite) || 0,
      quality: form.qualite as MarketQuality,
      targetPrice: Number(form.budget) || 0,
      deliveryDate: form.delai,
      type: 'Grossiste',
    };

    saveBuyerNeeds([nextNeed, ...needs]);
    navigate('/visitor/market/matches');
  };

  return (
    <VisitorLayout
      title="AgroviaMarket"
      subtitle="Publier un besoin"
    >
      <section className="mb-8 rounded-[24px] border border-[#d5b26b] bg-[#f4f2eb] p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e4f2e8] px-3 py-1 text-xs font-semibold text-[#1d4d2d]">
              <Sparkles className="h-3.5 w-3.5" />
              acheteur
            </div>
            <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-[#1d2a22]">Déclarez vos besoins</h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf5ec] px-3 py-2 text-sm text-[#1d4d2d]">
            <BadgeCheck className="h-4 w-4" />
            Matching intelligent avec les producteurs
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[24px] border border-[#dfe5df] bg-white shadow-none">
          <CardContent className="p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="produit">Type de produit</Label>
                <Input id="produit" value={form.produit} onChange={(e) => handleChange('produit', e.target.value)} placeholder="Ex : Arachides" className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualite">Qualité demandée</Label>
                <Input id="qualite" value={form.qualite} onChange={(e) => handleChange('qualite', e.target.value)} placeholder="Ex : Premium / Classe A" className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantite">Quantité souhaitée</Label>
                <Input id="quantite" value={form.quantite} onChange={(e) => handleChange('quantite', e.target.value)} placeholder="Ex : 500 kg" className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone">Zone de livraison</Label>
                <Input id="zone" value={form.zone} onChange={(e) => handleChange('zone', e.target.value)} placeholder="Ex : Dakar" className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget cible</Label>
                <Input id="budget" value={form.budget} onChange={(e) => handleChange('budget', e.target.value)} placeholder="Ex : 600 FCFA/kg" className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delai">Délai de livraison</Label>
                <Input id="delai" type="date" value={form.delai} onChange={(e) => handleChange('delai', e.target.value)} className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit} className="rounded-xl bg-[#1d4d2d] px-6 text-white hover:bg-[#163d27]">
                Publier le besoin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border border-[#dfe5df] bg-[#f8f7f5] shadow-none">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf5ec] text-[#1d4d2d]">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <h3 className="text-[1.4rem] font-semibold text-[#1d2a22]">Besoins typiques</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-[18px] border border-[#dfe5df] bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#1d2a22]">Grossiste Dakar</p>
                  <ShoppingCart className="h-4 w-4 text-[#1d4d2d]" />
                </div>
                <p className="mt-2 text-sm text-[#53615a]">Arachides • 300 kg • Qualité premium • Dakar</p>
              </div>

              <div className="rounded-[18px] border border-[#dfe5df] bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#1d2a22]">Restaurant local</p>
                  <MapPinned className="h-4 w-4 text-[#1d4d2d]" />
                </div>
                <p className="mt-2 text-sm text-[#53615a]">Tomates • 180 kg • Classe A • Thiès</p>
              </div>

              <div className="rounded-[18px] border border-[#dfe5df] bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#1d2a22]">Transformateur</p>
                  <BadgeCheck className="h-4 w-4 text-[#1d4d2d]" />
                </div>
                <p className="mt-2 text-sm text-[#53615a]">Mil • 500 kg • Standard • Saint-Louis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VisitorLayout>
  );
}
