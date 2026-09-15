import { MainLayout } from '@/components/layout/MainLayout';
import { PhotoAnalysis } from '@/components/ai/PhotoAnalysis';

export default function AnalysePhotoPage() {
  return (
    <MainLayout title="Analyse IA de Culture" subtitle="Analysez vos cultures avec l'intelligence artificielle">
      <div className="max-w-2xl mx-auto">
        <PhotoAnalysis />
      </div>
    </MainLayout>
  );
}
