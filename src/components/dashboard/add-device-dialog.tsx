
'use client';

import { useActionState, useFormStatus } from 'react';
import { useEffect, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { handleAddDevice, AddDeviceState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

type AddDeviceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const initialState: AddDeviceState = {};

function SubmitButton({ type }: { type: 'server' | 'dish' }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="animate-spin me-2" /> : null}
            {type === 'server' ? 'إضافة سيرفر' : 'إضافة طبق'}
        </Button>
    )
}

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const { toast } = useToast();
  
  // Use separate form states for server and dish
  const [serverState, serverFormAction] = useActionState(handleAddDevice, initialState);
  const [dishState, dishFormAction] = useActionState(handleAddDevice, initialState);

  const serverFormRef = useRef<HTMLFormElement>(null);
  const dishFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (serverState.message) {
      toast({ title: 'نجاح', description: serverState.message, variant: 'default' });
      onOpenChange(false);
    }
     if (dishState.message) {
      toast({ title: 'نجاح', description: dishState.message, variant: 'default' });
      onOpenChange(false);
    }
  }, [serverState.message, dishState.message, onOpenChange, toast]);
  
  // Reset forms and state when dialog closes
  useEffect(() => {
    if (!open) {
      serverFormRef.current?.reset();
      dishFormRef.current?.reset();
      // A bit of a hack to reset the form state on close
      Object.assign(serverState, {});
      Object.assign(dishState, {});
    }
  }, [open, serverState, dishState]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة جهاز جديد</DialogTitle>
          <DialogDescription>
            أضف سيرفر MikroTik أو طبق UBNT/Mimosa جديد للمراقبة.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="server" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="server">إضافة سيرفر</TabsTrigger>
            <TabsTrigger value="dish">إضافة طبق</TabsTrigger>
          </TabsList>
          <TabsContent value="server">
            <form action={serverFormAction} ref={serverFormRef} className="space-y-4">
               <input type="hidden" name="type" value="server" />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="server-name" className="text-right">
                  الاسم
                </Label>
                <Input id="server-name" name="name" className="col-span-3" />
              </div>
               {serverState.errors?.name && <p className="col-span-4 text-sm text-destructive text-right">{serverState.errors.name[0]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="server-ip" className="text-right">
                  آي بي السيرفر
                </Label>
                <Input id="server-ip" name="ip" className="col-span-3" />
              </div>
              {serverState.errors?.ip && <p className="col-span-4 text-sm text-destructive text-right">{serverState.errors.ip[0]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="server-port" className="text-right">
                  المنفذ
                </Label>
                <Input id="server-port" name="port" type="number" placeholder="8728 (اختياري)" className="col-span-3" />
              </div>
              {serverState.errors?.port && <p className="col-span-4 text-sm text-destructive text-right">{serverState.errors.port[0]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="server-username" className="text-right">
                  اسم المستخدم
                </Label>
                <Input id="server-username" name="username" className="col-span-3" />
              </div>
              {serverState.errors?.username && <p className="col-span-4 text-sm text-destructive text-right">{serverState.errors.username[0]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="server-password" className="text-right">
                  كلمة المرور
                </Label>
                <Input id="server-password" name="password" type="password" className="col-span-3" />
              </div>
              {serverState.errors?.password && <p className="col-span-4 text-sm text-destructive text-right">{serverState.errors.password[0]}</p>}

              {serverState.errors?._form && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>خطأ</AlertTitle>
                    <AlertDescription>{serverState.errors._form[0]}</AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                 <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>إلغاء</Button>
                <SubmitButton type="server" />
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value="dish">
            <form action={dishFormAction} ref={dishFormRef} className="space-y-4">
               <input type="hidden" name="type" value="dish" />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dish-name" className="text-right">
                  الاسم
                </Label>
                <Input id="dish-name" name="name" className="col-span-3" />
              </div>
               {dishState.errors?.name && <p className="col-span-4 text-sm text-destructive text-right">{dishState.errors.name[0]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dish-ip" className="text-right">
                  عنوان IP
                </Label>
                <Input id="dish-ip" name="ip" className="col-span-3" />
              </div>
               {dishState.errors?.ip && <p className="col-span-4 text-sm text-destructive text-right">{dishState.errors.ip[0]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dish-username" className="text-right">
                  اسم المستخدم
                </Label>
                <Input id="dish-username" name="username" className="col-span-3" />
              </div>
              {dishState.errors?.username && <p className="col-span-4 text-sm text-destructive text-right">{dishState.errors.username[0]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dish-password" className="text-right">
                  كلمة المرور
                </Label>
                <Input id="dish-password" name="password" type="password" className="col-span-3" />
              </div>
              {dishState.errors?.password && <p className="col-span-4 text-sm text-destructive text-right">{dishState.errors.password[0]}</p>}
              
              {dishState.errors?._form && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>خطأ</AlertTitle>
                    <AlertDescription>{dishState.errors._form[0]}</AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                 <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>إلغاء</Button>
                <SubmitButton type="dish" />
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
