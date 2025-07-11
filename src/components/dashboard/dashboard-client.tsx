'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Device } from '@/lib/types';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { AddDeviceDialog } from './add-device-dialog';
import { DeviceCard } from './device-card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DashboardClient({ devices }: { devices: Device[] }) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen flex-col">
        <PageHeader title="لوحة التحكم">
          <Button onClick={() => setAddDialogOpen(true)}>
            <PlusCircle />
            <span>إضافة جهاز</span>
          </Button>
        </PageHeader>
        <ScrollArea className="flex-1">
          <main className="flex-1 p-4 md:p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {devices.map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          </main>
        </ScrollArea>
      </div>
      <AddDeviceDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} />
    </>
  );
}
