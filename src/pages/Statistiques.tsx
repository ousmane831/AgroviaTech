import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RecolteChart } from '@/components/dashboard/RecolteChart';
import { PertesChart } from '@/components/dashboard/PertesChart';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { parcelles, recoltes, statistiquesGlobales } from '@/data/mockData';

/**
 * Page des statistiques détaillées
 * Affiche des graphiques et analyses des données agricoles
 */
const Statistiques = () => {
  // Données pour le graphique de répartition des surfaces
  const surfaceParCulture = parcelles.reduce((acc, p) => {
    const existing = acc.find((item) => item.name === p.typeCulture);
    if (existing) {
      existing.value += p.surface;
    } else {
      acc.push({ name: p.typeCulture, value: p.surface });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Données pour le graphique de répartition des récoltes
  const recolteParParcelle = recoltes.reduce((acc, r) => {
    const parcelle = parcelles.find((p) => p.id === r.parcelleId);
    if (parcelle) {
      const existing = acc.find((item) => item.name === parcelle.typeCulture);
      if (existing) {
        existing.value += r.quantiteRecoltee;
      } else {
        acc.push({ name: parcelle.typeCulture, value: r.quantiteRecoltee });
      }
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Couleurs pour les graphiques
  const COLORS = [
    'hsl(43, 85%, 46%)',
    'hsl(38, 70%, 50%)',
    'hsl(0, 72%, 51%)',
    'hsl(30, 50%, 45%)',
    'hsl(100, 40%, 50%)',
  ];

  return (
    <MainLayout
      title="Statistiques"
      subtitle="Analyses et visualisations de vos données agricoles"
    >
      {/* KPIs principaux */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                {statistiquesGlobales.surfaceTotale.toFixed(1)} ha
              </p>
              <p className="text-sm text-muted-foreground">Surface totale</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-success">
                {(statistiquesGlobales.recolteTotale / 1000).toFixed(1)} T
              </p>
              <p className="text-sm text-muted-foreground">Production totale</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning">
                {(
                  statistiquesGlobales.recolteTotale /
                  statistiquesGlobales.surfaceTotale /
                  1000
                ).toFixed(2)}{' '}
                T/ha
              </p>
              <p className="text-sm text-muted-foreground">Rendement moyen</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-destructive">
                {statistiquesGlobales.tauxPerte.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Taux de perte</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <RecolteChart />
        <PertesChart />
      </div>

      {/* Graphiques de répartition */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Répartition des surfaces */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des surfaces</CardTitle>
            <CardDescription>Par type de culture (hectares)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={surfaceParCulture}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {surfaceParCulture.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)} ha`, 'Surface']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Répartition des récoltes */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des récoltes</CardTitle>
            <CardDescription>Par type de culture (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recolteParParcelle}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {recolteParParcelle.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${(value / 1000).toFixed(1)} T`,
                      'Récolte',
                    ]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Statistiques;
