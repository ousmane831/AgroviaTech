import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { donneesRendement } from '@/data/mockData';

export function RecolteChart() {
  return (
    <Card variant="default" className="animate-fade-in">
      <CardHeader>
        <CardTitle>Rendement par Culture</CardTitle>
        <CardDescription>Évolution sur les 3 derniers mois (kg/ha)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={donneesRendement}>
              <defs>
                <linearGradient id="colorMais" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(43, 85%, 46%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(43, 85%, 46%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorBle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 70%, 50%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(38, 70%, 50%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorTomates" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPdt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(30, 50%, 45%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(30, 50%, 45%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorRiz" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(100, 40%, 50%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(100, 40%, 50%)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="mois" className="text-muted-foreground" tick={{ fontSize: 12 }} />
              <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="maïs"
                name="Maïs"
                stroke="hsl(43, 85%, 46%)"
                fill="url(#colorMais)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="blé"
                name="Blé"
                stroke="hsl(38, 70%, 50%)"
                fill="url(#colorBle)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="tomates"
                name="Tomates"
                stroke="hsl(0, 72%, 51%)"
                fill="url(#colorTomates)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="pdt"
                name="Pommes de terre"
                stroke="hsl(30, 50%, 45%)"
                fill="url(#colorPdt)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="riz"
                name="Riz"
                stroke="hsl(100, 40%, 50%)"
                fill="url(#colorRiz)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
