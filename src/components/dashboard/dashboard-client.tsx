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
            {devices.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {devices.map((device) => (
                    <DeviceCard key={device.id} device={device} />
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center h-[calc(100vh-150px)]">
                    <div className="mb-4 text-5xl text-gray-400">🖥️</div>
                    <h3 className="text-2xl font-bold tracking-tight">لا توجد أجهزة مضافة</h3>
                    <p className="text-muted-foreground mb-4">ابدأ بإضافة سيرفر أو طبق لمراقبته.</p>
                    <Button onClick={() => setAddDialogOpen(true)}>
                        <PlusCircle />
                        <span>إضافة جهاز</span>
                    </Button>
                </div>
            )}
          </main>
        </ScrollArea>
      </div>
      <AddDeviceDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} />
    </>
  );
}
