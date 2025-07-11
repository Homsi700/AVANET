
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleUpdateDevice, DeviceFormState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type { Device, Server } from '@/lib/types';

type EditDeviceDialogProps = {
  device: Device;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const initialState: DeviceFormState = {};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="animate-spin me-2" /> : null}
            حفظ التغييرات
        </Button>
    )
}

export function EditDeviceDialog({ device, open, onOpenChange }: EditDeviceDialogProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(handleUpdateDevice, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const isServer = device.type === 'MikroTik';

  useEffect(() => {
    if (state.message) {
      toast({ title: 'نجاح', description: state.message, variant: 'default' });
      onOpenChange(false);
    }
  }, [state.message, onOpenChange, toast]);

  useEffect(() => {
    if (!open) {
      formRef.current?.reset();
      Object.assign(state, {});
    }
  }, [open, state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل الجهاز: {device.name}</DialogTitle>
          <DialogDescription>
            قم بتحديث بيانات الجهاز.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="space-y-4 py-4">
           <input type="hidden" name="id" value={device.id} />
           <input type="hidden" name="type" value={device.type} />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" name="name" defaultValue={device.name} className="col-span-3" />
          </div>
           {state.errors?.name && <p className="col-span-4 text-sm text-destructive text-right">{state.errors.name[0]}</p>}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ip" className="text-right">
              عنوان IP
            </Label>
            <Input id="ip" name="ip" defaultValue={device.ip} className="col-span-3" />
          </div>
          {state.errors?.ip && <p className="col-span-4 text-sm text-destructive text-right">{state.errors.ip[0]}</p>}
          
          {isServer && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="port" className="text-right">
                  المنفذ
                </Label>
                <Input id="port" name="port" type="number" defaultValue={(device as Server).port} className="col-span-3" />
              </div>
              {state.errors?.port && <p className="col-span-4 text-sm text-destructive text-right">{state.errors.port[0]}</p>}
            </>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              اسم المستخدم
            </Label>
            <Input id="username" name="username" defaultValue={device.username} className="col-span-3" />
          </div>
          {state.errors?.username && <p className="col-span-4 text-sm text-destructive text-right">{state.errors.username[0]}</p>}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              كلمة المرور
            </Label>
            <Input id="password" name="password" type="password" placeholder="اتركه فارغاً لعدم التغيير" className="col-span-3" />
          </div>
          {state.errors?.password && <p className="col-span-4 text-sm text-destructive text-right">{state.errors.password[0]}</p>}

          {state.errors?._form && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{state.errors._form[0]}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
             <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
