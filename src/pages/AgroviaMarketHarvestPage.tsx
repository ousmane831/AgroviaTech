import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { useAuthComplete } from '@/hooks/useAuthComplete';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getHarvestOffers, saveHarvestOffers, type HarvestOffer, type MarketQuality } from '@/data/agroviamarket';
import { ArrowRight, CheckCircle2, Leaf, MapPin, Package, Sparkles, TrendingUp } from 'lucide-react';

const suggestedPrice = [
  { label: 'Arachides', value: '570 FCFA/kg' },
  { label: 'Tomates', value: '610 FCFA/kg' },
  { label: 'Mil', value: '410 FCFA/kg' },
  { label: 'Carottes', value: '470 FCFA/kg' },
];

const defaultForm = {
  culture: 'Arachides',
  qualite: 'Premium',
  quantite: '450',
  localisation: 'Dakar',
  date: '2026-09-10',
  prix: '570',
};

export default function AgroviaMarketHarvestPage() {
  const navigate = useNavigate();
  const { user } = useAuthComplete();
  const [form, setForm] = useState(defaultForm);

  const handleChange = (field: keyof typeof defaultForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    const offers = getHarvestOffers();
    const farmerName = `${user?.prenom || ''} ${user?.nom || ''}`.trim() || user?.email || 'Agriculteur';
    const nextOffer: HarvestOffer = {
      id: `offer-${Date.now()}`,
      farmerName,
      region: form.localisation,
      crop: form.culture,
      quantity: Number(form.quantite) || 0,
      quality: form.qualite as MarketQuality,
      availableDate: form.date,
      priceIndicative: Number(form.prix) || 0,
      status: 'active',
    };

    saveHarvestOffers([nextOffer, ...offers]);
    navigate('/visitor/market/matches');
  };

  return (
    <VisitorLayout
      title="AgroviaMarket"
      subtitle="Déclarer ma récolte"
    >
      <section className="mb-8 rounded-[24px] border border-[#d5b26b] bg-[#f4f2eb] p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            
            <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-[#1d2a22]">Publiez votre récolte</h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf5ec] px-3 py-2 text-sm text-[#1d4d2d]">
            <TrendingUp className="h-4 w-4" />
            Prix estimé du marché : 540 FCFA/kg
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[24px] border border-[#dfe5df] bg-white shadow-none">
          <CardContent className="p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="culture">Culture</Label>
                <Input id="culture" value={form.culture} onChange={(e) => handleChange('culture', e.target.value)} placeholder="Ex : Arachides" className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualite">Qualité</Label>
                <Input id="qualite" value={form.qualite} onChange={(e) => handleChange('qualite', e.target.value)} placeholder="Ex : Premium / Standard" className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantite">Quantité disponible</Label>
                <Input id="quantite" value={form.quantite} onChange={(e) => handleChange('quantite', e.target.value)} placeholder="Ex : 450 kg" className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="localisation">Localisation</Label>
                <Input id="localisation" value={form.localisation} onChange={(e) => handleChange('localisation', e.target.value)} placeholder="Ex : Dakar, Sénégal" className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date de disponibilité</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prix">Prix estimé</Label>
                <Input id="prix" value={form.prix} onChange={(e) => handleChange('prix', e.target.value)} placeholder="Ex : 570 FCFA/kg" className="h-12 rounded-xl border-[#dfe5df] bg-[#f9f9f7]" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit} className="rounded-xl bg-[#1d4d2d] px-6 text-white hover:bg-[#163d27]">
                Publier l’offre
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border border-[#dfe5df] bg-[#f8f7f5] shadow-none">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf5ec] text-[#1d4d2d]">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="text-[1.4rem] font-semibold text-[#1d2a22]">Valorisation IA</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-[18px] border border-[#dfe5df] bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#1d2a22]">Qualité estimée</p>
                  <CheckCircle2 className="h-5 w-5 text-[#1d4d2d]" />
                </div>
                <p className="mt-2 text-[1.6rem] font-semibold tracking-[-0.05em] text-[#1d2a22]">Très bonne</p>
              </div>

              <div className="rounded-[18px] border border-[#dfe5df] bg-white p-4">
                <div className="flex items-center gap-2 text-[#1d2a22]">
                  <Package className="h-4 w-4 text-[#1d4d2d]" />
                  <p className="font-medium">Classement produit</p>
                </div>
                <p className="mt-2 text-sm text-[#53615a]">Classe A • Demande stable • Prix compétitif</p>
              </div>

              <div className="rounded-[18px] border border-[#dfe5df] bg-white p-4">
                <div className="flex items-center gap-2 text-[#1d2a22]">
                  <MapPin className="h-4 w-4 text-[#1d4d2d]" />
                  <p className="font-medium">Zone de marché</p>
                </div>
                <p className="mt-2 text-sm text-[#53615a]">Dakar • Thiès • Saint-Louis</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs uppercase tracking-[0.08em] text-[#6e7a73]">Prix suggérés</p>
              <div className="space-y-2">
                {suggestedPrice.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-[#e1e5df] bg-white px-3 py-2 text-sm text-[#1d2a22]">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VisitorLayout>
  );
}
