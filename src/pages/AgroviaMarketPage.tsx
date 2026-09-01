import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  BadgeCheck,
  Leaf,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  TrendingUp,
} from 'lucide-react';

const marketStats = [
  { label: 'Offres actives', value: '248', detail: 'Récoltes disponibles' },
  { label: 'Prix moyen', value: '540 FCFA/kg', detail: 'Sur les cultures locales' },
  { label: 'Acheteurs', value: '64', detail: 'Grossistes, restaurants, transformateurs' },
  { label: 'Taux de match', value: '87%', detail: 'Couverture régionale' },
];

const offers = [
  {
    culture: 'Arachides',
    region: 'Dakar',
    quantity: '480 kg',
    quality: 'Premium',
    price: '570 FCFA/kg',
    tag: 'Très demandé'
  },
  {
    culture: 'Tomates',
    region: 'Thiès',
    quantity: '620 kg',
    quality: 'Classe A',
    price: '610 FCFA/kg',
    tag: 'Livraison rapide'
  },
  {
    culture: 'Mil',
    region: 'Saint-Louis',
    quantity: '390 kg',
    quality: 'Standard',
    price: '410 FCFA/kg',
    tag: 'Prix solide'
  },
];

const buyerNeeds = [
  { name: 'Grossiste Dakar', quantity: '300 kg', product: 'Arachides', quality: 'Premium', zone: 'Dakar' },
  { name: 'Restaurant local', quantity: '180 kg', product: 'Tomates', quality: 'Classe A', zone: 'Thiès' },
  { name: 'Transformateur', quantity: '500 kg', product: 'Mil', quality: 'Standard', zone: 'Saint-Louis' },
];

const steps = [
  { title: '1. Déclarer la récolte', description: 'Culture, quantité, qualité, localisation et date de disponibilité.' },
  { title: '2. Valoriser par IA', description: 'Estimation de qualité, classement, recommandations de prix indicatif.' },
  { title: '3. Relier acheteurs', description: 'Matching intelligent avec grossistes, restaurants et transformateurs.' },
  { title: '4. Finaliser la transaction', description: 'Négociation, commande, paiement et logistique simplifiée.' },
];

export default function AgroviaMarketPage() {
  return (
    <VisitorLayout
      title="AgroviaMarket"
      subtitle="Après-récolte & Marché — mise en relation directe agriculteurs / acheteurs"
    >
      <section className="mb-8 rounded-[24px] border border-[#d5b26b] bg-[#f4f2eb] p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e4f2e8] px-3 py-1 text-xs font-semibold text-[#1d4d2d]">
              <Sparkles className="h-3.5 w-3.5" />
              nouveau module
            </div>
            <h2 className="text-[2.1rem] font-semibold tracking-[-0.05em] text-[#1d2a22]">
              Vendez votre récolte au meilleur prix, plus vite.
            </h2>
            <p className="mt-3 text-[1.02rem] leading-relaxed text-[#47554d]">
              AgroviaMarket connecte directement les agriculteurs avec les acheteurs, avec aide à la valorisation,
              estimation de prix et mise en relation commerciale intelligente.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button className="rounded-xl bg-[#1d4d2d] text-white hover:bg-[#163d27]">
              Déclarer une récolte
            </Button>
            <Button variant="outline" className="rounded-xl border-[#1d4d2d] text-[#1d4d2d] hover:bg-[#edf7ef]">
              Publier un besoin
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {marketStats.map((item) => (
          <Card key={item.label} className="rounded-[20px] border border-[#dfe5df] bg-[#f9f7f5] shadow-none">
            <CardContent className="px-5 py-4">
              <p className="text-[0.82rem] font-medium uppercase tracking-[0.08em] text-[#5d665e]">{item.label}</p>
              <p className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-[#1d2a22]">{item.value}</p>
              <p className="mt-2 text-[0.9rem] text-[#5d665e]">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-8 grid gap-5 lg:grid-cols-4">
        {steps.map((step) => (
          <Card key={step.title} className="rounded-[20px] border border-[#dfe5df] bg-white shadow-none">
            <CardContent className="p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f3eb] text-[#1d4d2d]">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-[1.05rem] font-semibold text-[#1d2a22]">{step.title}</h3>
              <p className="text-[0.96rem] leading-relaxed text-[#53615a]">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-8 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[22px] border border-[#dfe5df] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#1d2a22]">Offres les plus pertinentes</h3>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7ef] px-2.5 py-1 text-xs font-medium text-[#1d4d2d]">
              <TrendingUp className="h-3.5 w-3.5" />
              87% match
            </div>
          </div>

          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.culture} className="rounded-[18px] border border-[#e1e5df] bg-[#f8f8f6] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf5ec] text-[#1d4d2d]">
                      <PackageCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[1.1rem] font-semibold text-[#1d2a22]">{offer.culture}</p>
                      <p className="text-sm text-[#5d665e]">{offer.region}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#e5f2ff] px-2.5 py-1 text-[0.7rem] font-medium text-[#294d8d]">{offer.tag}</span>
                    <span className="rounded-full bg-[#eef7ef] px-2.5 py-1 text-[0.7rem] font-medium text-[#1d4d2d]">{offer.quality}</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.08em] text-[#6e7a73]">Quantité</p>
                    <p className="mt-1 font-medium text-[#1d2a22]">{offer.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.08em] text-[#6e7a73]">Prix indicatif</p>
                    <p className="mt-1 font-medium text-[#1d2a22]">{offer.price}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.08em] text-[#6e7a73]">Disponibilité</p>
                    <p className="mt-1 font-medium text-[#1d2a22]">Sous 3 jours</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-[#dfe5df] bg-[#f8f7f5] p-5 shadow-sm">
          <h3 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#1d2a22]">Besoins acheteurs</h3>
          <div className="mt-5 space-y-4">
            {buyerNeeds.map((need) => (
              <div key={need.name} className="rounded-[18px] border border-[#e1e5df] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#1d2a22]">{need.name}</p>
                    <p className="mt-1 text-sm text-[#5d665e]">{need.product}</p>
                  </div>
                  <ShoppingBag className="h-5 w-5 text-[#1d4d2d]" />
                </div>
                <div className="mt-3 grid gap-2 text-sm text-[#47554d]">
                  <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#1d4d2d]" /> {need.quantity}</div>
                  <div className="flex items-center gap-2"><PackageCheck className="h-4 w-4 text-[#1d4d2d]" /> Qualité {need.quality}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#1d4d2d]" /> Zone {need.zone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-[#dfe5df] bg-[#f5f9f6] p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-[1.6rem] font-semibold tracking-[-0.04em] text-[#1d2a22]">Transaction facilitée</h3>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7ef] px-3 py-1.5 text-xs font-medium text-[#1d4d2d]">
            <Truck className="h-3.5 w-3.5" />
            négociation + logistique
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[18px] border border-[#dfe5df] bg-white p-4">
            <p className="text-[1.05rem] font-semibold text-[#1d2a22]">Négociation</p>
            <p className="mt-2 text-[0.96rem] leading-relaxed text-[#53615a]">Accord précis sur le prix, quantité et délais de livraison.</p>
          </div>
          <div className="rounded-[18px] border border-[#dfe5df] bg-white p-4">
            <p className="text-[1.05rem] font-semibold text-[#1d2a22]">Commande</p>
            <p className="mt-2 text-[0.96rem] leading-relaxed text-[#53615a]">Validation rapide avec historique des offres et documents de transaction.</p>
          </div>
          <div className="rounded-[18px] border border-[#dfe5df] bg-white p-4">
            <p className="text-[1.05rem] font-semibold text-[#1d2a22]">Livraison</p>
            <p className="mt-2 text-[0.96rem] leading-relaxed text-[#53615a]">Mise en relation avec des solutions de transport selon la zone et le volume.</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="rounded-xl bg-[#1d4d2d] text-white hover:bg-[#163d27]">
            Explorer le marché
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </VisitorLayout>
  );
}
