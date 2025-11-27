import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { donneesPertes } from '@/data/mockData';

export function PertesChart() {
  return (
    <Card variant="default" className="animate-fade-in">
      <CardHeader>
        <CardTitle>Pertes vs Stockage</CardTitle>
        <CardDescription>Comparaison mensuelle (kg)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={donneesPertes} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="mois" className="text-muted-foreground" tick={{ fontSize: 12 }} />
              <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString('fr-FR')} kg`,
                  name === 'stockees' ? 'Stockées' : 'Pertes',
                ]}
              />
              <Bar dataKey="stockees" name="Stockées" radius={[4, 4, 0, 0]}>
                {donneesPertes.map((_, index) => (
                  <Cell key={`cell-stockees-${index}`} fill="hsl(var(--success))" />
                ))}
              </Bar>
              <Bar dataKey="pertes" name="Pertes" radius={[4, 4, 0, 0]}>
                {donneesPertes.map((_, index) => (
                  <Cell key={`cell-pertes-${index}`} fill="hsl(var(--destructive))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
