
import { notFound } from 'next/navigation';
import {
  getServerById,
  getPppoeUsers,
  getInterfaceStats,
  getResourceData,
  getTrafficData,
  getPppoeProfiles,
} from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
import { ServerDetailsClient } from '@/components/servers/server-details-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type ServerDetailPageProps = {
  params: { id: string };
};

export default async function ServerDetailPage({ params }: ServerDetailPageProps) {
  const { id } = params;
  const server = await getServerById(id);

  if (!server) {
    notFound();
  }

  // Fetch all required data on the server
  const [pppoeUsers, interfaceStats, resourceData, trafficData, pppoeProfiles] =
    await Promise.all([
      getPppoeUsers(server.id),
      getInterfaceStats(server.id),
      getResourceData(server.id),
      getTrafficData(server.id),
      getPppoeProfiles(server.id),
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
        initialPppoeProfiles={pppoeProfiles}
      />
    </div>
  );
}
