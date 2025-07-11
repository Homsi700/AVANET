import { notFound } from 'next/navigation';
import { getDishById } from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
import { DishDetailsClient } from '@/components/dishes/dish-details-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function DishDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const dish = await getDishById(id);

  if (!dish) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col">
      <PageHeader title={dish.name}>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowRight className="me-2" />
            <span>عودة للوحة التحكم</span>
          </Link>
        </Button>
      </PageHeader>
      <DishDetailsClient dish={dish} />
    </div>
  );
}
