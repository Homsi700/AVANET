import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { getServers, getDishes } from '@/lib/data';

export default async function DashboardPage() {
  const servers = await getServers();
  const dishes = await getDishes();
  const devices = [...servers, ...dishes];

  return <DashboardClient devices={devices} />;
}
