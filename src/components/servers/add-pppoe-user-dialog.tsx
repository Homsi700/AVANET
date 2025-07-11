
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { handleAddPppoeUser } from '@/app/actions';


type AddPppoeUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverId: string;
  serverName: string;
};

const initialState = {};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="animate-spin me-2" /> : null}
            إضافة المستخدم
        </Button>
    )
}


export function AddPppoeUserDialog({ open, onOpenChange, serverId, serverName }: AddPppoeUserDialogProps) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(handleAddPppoeUser, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.message) {
            toast({ title: 'نجاح', description: state.message });
            onOpenChange(false);
        }
    }, [state, onOpenChange, toast]);
    
    useEffect(() => {
        if (!open) {
          formRef.current?.reset();
          // Reset form state manually
          const emptyState = {};
          Object.assign(state, emptyState);
        }
    }, [open, state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مستخدم PPPoE جديد</DialogTitle>
          <DialogDescription>
            إضافة حساب جديد إلى سيرفر {serverName}.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef}>
            <input type="hidden" name="serverId" value={serverId} />
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                    اسم المستخدم
                    </Label>
                    <Input id="username" name="username" className="col-span-3" />
                </div>
                {state?.errors?.username && <p className="col-span-4 text-sm text-destructive text-right">{state.errors.username[0]}</p>}

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                    كلمة المرور
                    </Label>
                    <Input id="password" name="password" type="password" className="col-span-3" />
                </div>
                {state?.errors?.password && <p className="col-span-4 text-sm text-destructive text-right">{state.errors.password[0]}</p>}

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
                 {state?.errors?.service && <p className="col-span-4 text-sm text-destructive text-right">{state.errors.service[0]}</p>}

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
                {state?.errors?.profile && <p className="col-span-4 text-sm text-destructive text-right">{state.errors.profile[0]}</p>}
            </div>

             {state?.errors?._form && (
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
