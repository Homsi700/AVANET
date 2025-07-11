import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { getDevices } from '@/lib/data';

export default async function DashboardPage() {
  const devices = await getDevices();

  return <DashboardClient devices={devices} />;
}
