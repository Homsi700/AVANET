import { notFound } from 'next/navigation';
import { getServerById } from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
import { ServerDetailsClient } from '@/components/servers/server-details-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function ServerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const server = await getServerById(params.id);

  if (!server) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col">
      <PageHeader title={server.name}>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowRight className="me-2" />
            <span>عودة للوحة التحكم</span>
          </Link>
        </Button>
      </PageHeader>
      <ServerDetailsClient server={server} />
    </div>
  );
}
