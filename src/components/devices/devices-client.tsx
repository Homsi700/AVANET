'use client';

import { useState } from 'react';
import type { Device } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DevicesTable } from './devices-table';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { AddDeviceDialog } from '../dashboard/add-device-dialog';

export function DevicesClient({ devices }: { devices: Device[] }) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <>
      <ScrollArea className="flex-1">
        <main className="p-4 md:p-6">
          <div className="mb-4 flex items-center justify-end">
            <Button onClick={() => setAddDialogOpen(true)}>
              <PlusCircle />
              <span>إضافة جهاز جديد</span>
            </Button>
          </div>
          <DevicesTable devices={devices} />
        </main>
      </ScrollArea>
      <AddDeviceDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} />
    </>
  );
}
