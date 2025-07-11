
'use client';

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

type AddDeviceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would handle form submission here
    console.log('Adding device...');
    onOpenChange(false);
  };

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
            <form onSubmit={handleAdd}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="server-name" className="text-right">
                    الاسم
                  </Label>
                  <Input id="server-name" defaultValue="MikroTik HQ" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="server-ip" className="text-right">
                    آي بي السيرفر
                  </Label>
                  <Input id="server-ip" defaultValue="192.168.88.1" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="server-port" className="text-right">
                    المنفذ
                  </Label>
                  <Input id="server-port" type="number" defaultValue="8728" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="server-username" className="text-right">
                    اسم المستخدم
                  </Label>
                  <Input id="server-username" defaultValue="admin" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="server-password" className="text-right">
                    كلمة المرور
                  </Label>
                  <Input id="server-password" type="password" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">إضافة سيرفر</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value="dish">
            <form onSubmit={handleAdd}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dish-name" className="text-right">
                    الاسم
                  </Label>
                  <Input id="dish-name" defaultValue="UBNT Link 1" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dish-ip" className="text-right">
                    عنوان IP
                  </Label>
                  <Input id="dish-ip" defaultValue="10.10.0.2" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dish-username" className="text-right">
                    اسم المستخدم
                  </Label>
                  <Input id="dish-username" defaultValue="ubnt" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dish-password" className="text-right">
                    كلمة المرور
                  </Label>
                  <Input id="dish-password" type="password" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">إضافة طبق</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
