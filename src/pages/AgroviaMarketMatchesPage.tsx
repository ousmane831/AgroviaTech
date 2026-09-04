import { useState } from 'react';
import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { computeMarketMatches } from '@/data/agroviamarket';
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, MessageSquareText, PackageCheck, Scale, Send, X } from 'lucide-react';

const matches = computeMarketMatches();
const averageScore = matches.length
  ? Math.round(matches.reduce((total, match) => total + match.score, 0) / matches.length)
  : 0;
const negotiationCount = matches.filter((match) => match.status === 'negociation').length;
const marketWhatsappNumber = import.meta.env.VITE_MARKET_WHATSAPP_NUMBER as string | undefined;

export default function AgroviaMarketMatchesPage() {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [message, setMessage] = useState('Bonjour, je souhaite échanger au sujet de cette offre.');

  const selectedMatch = matches.find((match) => match.id === selectedMatchId);

  const whatsappUrl = selectedMatch && marketWhatsappNumber
    ? `https://wa.me/${marketWhatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        `${message}\n\nProduit : ${selectedMatch.crop}\nVolume : ${selectedMatch.quantity} kg\nZone : ${selectedMatch.region}`
      )}`
    : null;

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
        {matches.length === 0 ? (
          <Card className="rounded-xl border border-dashed border-[#cfd9d2] bg-white shadow-sm">
            <CardContent className="flex flex-col items-center justify-center px-5 py-12 text-center">
              <PackageCheck className="h-10 w-10 text-[#71927b]" />
              <h3 className="mt-4 text-lg font-semibold text-[#1d2a22]">Aucune correspondance pour le moment</h3>
              <p className="mt-2 max-w-md text-sm text-[#69756d]">Publiez une offre ou un besoin pour créer de nouvelles opportunités commerciales.</p>
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
                <Button
                  onClick={() => {
                    setSelectedMatchId(match.id);
                    setMessage(`Bonjour, je souhaite échanger au sujet de votre offre de ${match.crop}.`);
                  }}
                  className="w-full rounded-lg bg-[#1d4d2d] text-white hover:bg-[#163d27] sm:w-auto"
                >
                  Ouvrir la négociation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMatch && (
        <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-[#cfd9d2] bg-white p-5 shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:mx-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#39714a]">Nouvelle négociation</p>
              <h3 className="mt-1 text-lg font-semibold text-[#1d2a22]">{selectedMatch.crop} avec {selectedMatch.buyerName}</h3>
              <p className="mt-1 text-sm text-[#69756d]">Votre demande sera associée à cette correspondance.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedMatchId(null)} title="Fermer">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <label htmlFor="negotiation-message" className="mt-4 block text-sm font-medium text-[#1d2a22]">Message initial</label>
          <textarea
            id="negotiation-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="mt-2 min-h-24 w-full resize-y rounded-lg border border-[#cfd9d2] bg-[#f8faf8] px-3 py-2 text-sm text-[#1d2a22] outline-none focus:ring-2 focus:ring-[#39714a]"
          />

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            {whatsappUrl ? (
              <Button asChild className="rounded-lg bg-[#1f9d55] text-white hover:bg-[#188447]">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <Send className="mr-2 h-4 w-4" />
                  Continuer sur WhatsApp
                </a>
              </Button>
            ) : (
              <p className="rounded-lg bg-[#f4f7f4] px-3 py-2 text-xs text-[#69756d]">
                WhatsApp sera disponible dès que le numéro officiel sera configuré.
              </p>
            )}
            <Button variant="outline" className="rounded-lg border-[#1d4d2d] text-[#1d4d2d]" onClick={() => setSelectedMatchId(null)}>
              Fermer
            </Button>
          </div>
        </div>
      )}
    </VisitorLayout>
  );
}
