import { PageHeader } from '@/components/layout/page-header';
import { DevicesClient } from '@/components/devices/devices-client';
import { getServers, getDishes } from '@/lib/data';

export default async function DevicesPage() {
  const servers = await getServers();
  const dishes = await getDishes();
  const devices = [...servers, ...dishes];

  return (
    <div className="flex h-screen flex-col">
      <PageHeader title="إدارة الأجهزة" />
      <DevicesClient devices={devices} />
    </div>
  );
}
