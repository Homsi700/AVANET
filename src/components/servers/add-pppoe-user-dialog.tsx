
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


type AddPppoeUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverName: string;
};

export function AddPppoeUserDialog({ open, onOpenChange, serverName }: AddPppoeUserDialogProps) {
  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would handle form submission here
    console.log('Adding PPPoE user...');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مستخدم PPPoE جديد</DialogTitle>
          <DialogDescription>
            إضافة حساب جديد إلى سيرفر {serverName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                اسم المستخدم
                </Label>
                <Input id="username" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                كلمة المرور
                </Label>
                <Input id="password" type="password" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                الخدمة
                </Label>
                <Select name="service">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pppoe">pppoe</SelectItem>
                        <SelectItem value="hotspot">hotspot</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="profile" className="text-right">
                البروفايل
                </Label>
                <Select name="profile">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر بروفايل" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pro-5mbps">pro-5mbps</SelectItem>
                        <SelectItem value="basic-2mbps">basic-2mbps</SelectItem>
                        <SelectItem value="pro-10mbps">pro-10mbps</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            </div>
            <DialogFooter>
            <Button type="submit">إضافة المستخدم</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
