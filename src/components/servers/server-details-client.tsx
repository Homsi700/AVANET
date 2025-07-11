'use client';

import type { Server } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Cpu, MemoryStick, Users, Clock } from 'lucide-react';
import { ActiveConnectionsTable } from './active-connections-table';
import { InterfaceStatsTable } from './interface-stats-table';
import { TrafficChart } from './traffic-chart';
import { ScrollArea } from '../ui/scroll-area';

export function ServerDetailsClient({ server }: { server: Server }) {
  return (
    <ScrollArea className="flex-1">
      <main className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">استهلاك المعالج</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{server.cpuUsage}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">استهلاك الذاكرة</CardTitle>
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{server.memoryUsage}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {server.activePppoe}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مدة التشغيل</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{server.uptime}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>حركة البيانات</CardTitle>
            </CardHeader>
            <CardContent>
              <TrafficChart serverId={server.id} />
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6">
            <ActiveConnectionsTable serverId={server.id} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6">
            <InterfaceStatsTable serverId={server.id} />
        </div>

      </main>
    </ScrollArea>
  );
}
