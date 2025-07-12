
import { notFound } from 'next/navigation';
import {
  getServerById,
  getPppoeUsers,
  getInterfaceStats,
  getResourceData,
  getTrafficData,
} from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
import { ServerDetailsClient } from '@/components/servers/server-details-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type ServerDetailPageProps = {
  params: { id: string };
};

export default async function ServerDetailPage({ params: { id } }: ServerDetailPageProps) {
  const server = await getServerById(id);

  if (!server) {
    notFound();
  }

  // Fetch all required data on the server
  const [pppoeUsers, interfaceStats, resourceData, trafficData] =
    await Promise.all([
      getPppoeUsers(server.id),
      getInterfaceStats(server.id),
      getResourceData(server.id),
      getTrafficData(server.id),
    ]);

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
      <ServerDetailsClient
        server={server}
        initialPppoeUsers={pppoeUsers}
        initialInterfaceStats={interfaceStats}
        initialResourceData={resourceData}
        initialTrafficData={trafficData}
      />
    </div>
  );
}
