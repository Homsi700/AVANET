import { PageHeader } from '@/components/layout/page-header';
import { PredictClient } from '@/components/predict/predict-client';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PredictPage() {
  return (
    <div className="flex h-screen flex-col">
      <PageHeader title="التنبؤ بمشاكل الشبكة" />
      <ScrollArea className="flex-1">
        <main className="p-4 md:p-6">
          <PredictClient />
        </main>
      </ScrollArea>
    </div>
  );
}
