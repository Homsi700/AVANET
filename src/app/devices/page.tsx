import { PageHeader } from '@/components/layout/page-header';
import { DevicesClient } from '@/components/devices/devices-client';
import { getDevices } from '@/lib/data';

export default async function DevicesPage() {
  const devices = await getDevices();

  return (
    <div className="flex h-screen flex-col">
      <PageHeader title="إدارة الأجهزة" />
      <DevicesClient devices={devices} />
    </div>
  );
}
