
'use client';

import { useState, useTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Device, Server } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { handleDeleteDevice } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { EditDeviceDialog } from './edit-device-dialog';

const getStatusVariant = (status: 'Online' | 'Offline'): 'default' | 'destructive' => {
  return status === 'Online' ? 'default' : 'destructive';
};

export function DevicesTable({ devices }: { devices: Device[] }) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleEditClick = (device: Device) => {
    setSelectedDevice(device);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (device: Device) => {
    setSelectedDevice(device);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDevice) return;

    startTransition(async () => {
        const result = await handleDeleteDevice(selectedDevice.id);
        if (result.success) {
            toast({
                title: 'نجاح',
                description: result.message,
            });
        } else {
            toast({
                title: 'خطأ',
                description: result.message,
                variant: 'destructive',
            });
        }
        setDeleteDialogOpen(false);
        setSelectedDevice(null);
    });
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>عنوان IP</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell>{device.ip}{device.type === 'MikroTik' && (device as Server).port ? `:${(device as Server).port}`: ''}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(device.status)}>{device.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                        <span className="sr-only">فتح القائمة</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(device)}>
                        <Pencil className="me-2" />
                        <span>تعديل</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(device)} disabled={isPending}>
                        <Trash2 className="me-2 text-destructive" />
                        <span className="text-destructive">حذف</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الجهاز بشكل دائم
              من خوادمنا.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              )}
              onClick={confirmDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedDevice && (
        <EditDeviceDialog 
            key={selectedDevice.id} // Re-mount the component when device changes
            device={selectedDevice} 
            open={isEditDialogOpen} 
            onOpenChange={setEditDialogOpen} 
        />
      )}
    </>
  );
}
