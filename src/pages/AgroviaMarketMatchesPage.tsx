import { VisitorLayout } from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { computeMarketMatches } from '@/data/agroviamarket';
import { ArrowRight, BadgeCheck, MessageSquareText, Percent, Sparkles, TrendingUp } from 'lucide-react';

const matches = computeMarketMatches();

export default function AgroviaMarketMatchesPage() {
  return (
    <VisitorLayout
      title="AgroviaMarket"
      subtitle="Matchs & négociation"
    >
      <section className="mb-8 rounded-[24px] border border-[#d5b26b] bg-[#f4f2eb] p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            
            <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-[#1d2a22]">Les meilleurs matchs</h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf5ec] px-3 py-2 text-sm text-[#1d4d2d]">
            <TrendingUp className="h-4 w-4" />
            89% de compatibilité moyenne
          </div>
        </div>
      </section>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-[22px] border border-[#dfe5df] bg-white shadow-none">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.08em] text-[#6e7a73]">Offres actives</p>
            <p className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[#1d2a22]">248</p>
          </CardContent>
        </Card>

        <Card className="rounded-[22px] border border-[#dfe5df] bg-white shadow-none">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.08em] text-[#6e7a73]">Négociations</p>
            <p className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[#1d2a22]">31</p>
          </CardContent>
        </Card>

        <Card className="rounded-[22px] border border-[#dfe5df] bg-white shadow-none">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.08em] text-[#6e7a73]">Commandes validées</p>
            <p className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[#1d2a22]">18</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id} className="rounded-[22px] border border-[#dfe5df] bg-white shadow-none">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-[1.3rem] font-semibold text-[#1d2a22]">{match.buyerName}</h3>
                    <span className="rounded-full bg-[#edf7ef] px-2.5 py-1 text-[0.72rem] font-medium text-[#1d4d2d]">
                      {match.status === 'match' ? 'Très compatible' : 'Négociation'}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.98rem] text-[#53615a]">{match.crop} • {match.quantity} kg • {match.quality}</p>
                </div>

                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <div className="rounded-full bg-[#eaf5ec] px-3 py-2 text-sm font-medium text-[#1d4d2d]">
                    {match.score}% match
                  </div>
                  <div className="rounded-full bg-[#eef7ef] px-3 py-2 text-sm font-medium text-[#1d4d2d]">
                    {match.suggestedPrice} FCFA/kg
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f0f6ff] px-3 py-2 text-sm text-[#204e92]">
                  <Percent className="h-4 w-4" />
                  Compatibilité {match.score}%
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f2f7f2] px-3 py-2 text-sm text-[#1d4d2d]">
                  <BadgeCheck className="h-4 w-4" />
                  Qualité conforme
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#fff7e8] px-3 py-2 text-sm text-[#9a6a14]">
                  <MessageSquareText className="h-4 w-4" />
                  {match.status === 'match' ? 'Négociation rapide' : 'Négociation possible'}
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <Button className="rounded-xl bg-[#1d4d2d] text-white hover:bg-[#163d27]">
                  Négocier
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </VisitorLayout>
  );
}
