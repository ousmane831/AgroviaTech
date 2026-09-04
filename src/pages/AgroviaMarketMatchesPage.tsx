import { useEffect, useState } from 'react';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { MarketMatch } from '@/data/agroviamarket';
import { createMarketNegotiation, fetchMarketMatches } from '@/lib/marketApi';
import { useNavigate } from 'react-router-dom';
import { useAuthComplete } from '@/hooks/useAuthComplete';
import { BadgeCheck, CalendarDays, MapPin, MessageSquareText, PackageCheck, Phone, Scale } from 'lucide-react';

const getWhatsappUrl = (phone: string | undefined, message: string) => {
  const digits = phone?.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
};

export default function AgroviaMarketMatchesPage() {
  const navigate = useNavigate();
  const { user } = useAuthComplete();
  const [matches, setMatches] = useState<MarketMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setMatches(await fetchMarketMatches());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les correspondances.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadMatches();
  }, []);

  const averageScore = matches.length
    ? Math.round(matches.reduce((total, match) => total + match.score, 0) / matches.length)
    : 0;
  const negotiationCount = matches.filter((match) => match.status === 'negociation').length;

  const handleContact = async (match: MarketMatch) => {
    try {
      await createMarketNegotiation(
        match.offerId,
        match.needId,
        `Contact via AgroviaMarket pour ${match.crop} (${match.quantity} kg, ${match.region}).`
      );
    } catch (contactError) {
      if (!(contactError instanceof Error && contactError.message.includes('existe déjà'))) {
        setError(contactError instanceof Error ? contactError.message : 'Impossible d’enregistrer la négociation.');
        return;
      }
    }

    const isFarmer = user?.role === 'AGRICULTEUR';
    const contactName = isFarmer ? match.buyerName : match.farmerName;
    const contactPhone = isFarmer ? match.buyerPhone : match.farmerPhone;
    const message = `Bonjour ${contactName}, je vous contacte via AgroviaMarket au sujet de ${match.crop} (${match.quantity} kg, ${match.region}).`;
    const whatsappUrl = getWhatsappUrl(contactPhone, message);
    if (whatsappUrl) window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <VisitorLayout
      title="AgroviaMarket"
      subtitle="Matchs & négociation"
    >
      <section className="mb-8 rounded-2xl border border-[#c9d8cc] bg-[#edf5ef] p-5 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#39714a]">Espace commercial</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#173a25] sm:text-4xl">Correspondances et négociations</h2>
          <p className="mt-3 text-base leading-relaxed text-[#52645a]">
            Comparez les demandes acheteurs avec les offres disponibles et engagez une discussion sur une base claire.
          </p>
        </div>
      </section>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-xl border border-[#dfe5df] bg-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6e7a73]">Correspondances</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#1d2a22]">{matches.length}</p>
            <p className="mt-1 text-sm text-[#69756d]">offres et demandes compatibles</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-[#dfe5df] bg-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6e7a73]">À négocier</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#1d2a22]">{negotiationCount}</p>
            <p className="mt-1 text-sm text-[#69756d]">discussions à ouvrir</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-[#dfe5df] bg-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6e7a73]">Score moyen</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#1d2a22]">{averageScore}%</p>
            <p className="mt-1 text-sm text-[#69756d]">proximité entre les critères</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#1d2a22]">Mises en relation</h3>
          <p className="mt-1 text-sm text-[#69756d]">Les opportunités les plus proches de vos critères.</p>
        </div>
        <span className="hidden rounded-md bg-[#eef7ef] px-3 py-1.5 text-xs font-medium text-[#1d4d2d] sm:inline-flex">
          {matches.length} résultat{matches.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <Card className="rounded-xl border border-[#dfe5df] bg-white shadow-sm"><CardContent className="py-12 text-center text-sm text-[#69756d]">Chargement des correspondances...</CardContent></Card>
        ) : matches.length === 0 ? (
          <Card className="rounded-xl border border-dashed border-[#cfd9d2] bg-white shadow-sm">
            <CardContent className="flex flex-col items-center justify-center px-5 py-12 text-center">
              <PackageCheck className="h-10 w-10 text-[#71927b]" />
              <h3 className="mt-4 text-lg font-semibold text-[#1d2a22]">Aucune correspondance pour le moment</h3>
              <p className="mt-2 max-w-md text-sm text-[#69756d]">
                {user?.role === 'AGRICULTEUR'
                  ? 'Votre récolte est bien enregistrée. Un acheteur doit publier une demande compatible avec votre produit et votre région.'
                  : 'Votre demande est bien enregistrée. Un agriculteur doit publier une offre compatible avec votre produit et votre région.'}
              </p>
              <Button
                variant="outline"
                className="mt-5 rounded-lg border-[#1d4d2d] text-[#1d4d2d]"
                onClick={() => navigate('/visitor/market')}
              >
                Retour au marché
              </Button>
            </CardContent>
          </Card>
        ) : matches.map((match) => (
          <Card key={match.id} className="rounded-xl border border-[#dfe5df] bg-white shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-[#1d2a22]">{match.buyerName}</h3>
                    <span className="rounded-md bg-[#edf7ef] px-2 py-1 text-xs font-medium text-[#1d4d2d]">
                      {match.status === 'match' ? 'Prêt à échanger' : 'À confirmer'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#53615a]">Demande pour {match.crop} · proposée par {match.farmerName}</p>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-[#f4f8f4] px-3 py-2 text-sm font-semibold text-[#1d4d2d]">
                  <Scale className="h-4 w-4" />
                  {match.score}% de compatibilité
                </div>
              </div>

              <div className="mt-5 grid gap-3 border-y border-[#edf1ee] py-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-start gap-2"><PackageCheck className="mt-0.5 h-4 w-4 text-[#39714a]" /><span><small className="block text-xs text-[#718078]">Volume</small><strong className="text-sm text-[#1d2a22]">{match.quantity} kg</strong></span></div>
                <div className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 text-[#39714a]" /><span><small className="block text-xs text-[#718078]">Qualité</small><strong className="text-sm text-[#1d2a22]">{match.quality}</strong></span></div>
                <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-[#39714a]" /><span><small className="block text-xs text-[#718078]">Zone</small><strong className="text-sm text-[#1d2a22]">{match.region}</strong></span></div>
                <div className="flex items-start gap-2"><CalendarDays className="mt-0.5 h-4 w-4 text-[#39714a]" /><span><small className="block text-xs text-[#718078]">Prix indicatif</small><strong className="text-sm text-[#1d2a22]">{match.suggestedPrice} FCFA/kg</strong></span></div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="inline-flex items-center gap-2 text-sm text-[#53615a]"><MessageSquareText className="h-4 w-4 text-[#39714a]" />{match.status === 'match' ? 'Les critères sont alignés.' : 'Une discussion est recommandée.'}</p>
                {(() => {
                  const isFarmer = user?.role === 'AGRICULTEUR';
                  const contactName = isFarmer ? match.buyerName : match.farmerName;
                  const contactPhone = isFarmer ? match.buyerPhone : match.farmerPhone;
                  return contactPhone ? (
                    <Button onClick={() => void handleContact(match)} className="w-full rounded-lg bg-[#1f9d55] text-white hover:bg-[#188447] sm:w-auto">
                        <Phone className="mr-2 h-4 w-4" />
                        Contacter {contactName} sur WhatsApp
                    </Button>
                  ) : (
                    <span className="rounded-lg bg-[#f4f7f4] px-3 py-2 text-xs text-[#69756d]">
                      Numéro WhatsApp non renseigné
                    </span>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </VisitorLayout>
  );
}
