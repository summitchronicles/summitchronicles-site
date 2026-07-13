import { PublicLayout } from '@/app/components/layout/PublicLayout';
import { TrainingRedesignPrototype } from '@/app/components/training/TrainingRedesignPrototype';

export default function TrainingPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#050505] text-white">
        <TrainingRedesignPrototype />
      </div>
    </PublicLayout>
  );
}
