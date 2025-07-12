
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import type { PppoeUser } from '@/lib/types';
import { AddPppoeUserDialog } from './add-pppoe-user-dialog';

export function ActiveConnectionsTable({ 
  serverId, 
  serverName, 
  initialUsers,
  pppoeProfiles,
}: { 
  serverId: string, 
  serverName: string, 
  initialUsers: PppoeUser[],
  pppoeProfiles: string[],
}) {
  const [users, setUsers] = useState<PppoeUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);

  // Note: The periodic refresh logic was removed as it's a common source of client-side fs module errors.
  // Re-fetching should be handled by navigating or using a manual refresh button that triggers a server action.

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>حسابات PPPoE النشطة</CardTitle>
                <CardDescription>
                    عرض وتصفية الحسابات المتصلة حاليًا.
                </CardDescription>
            </div>
            <Button onClick={() => setAddUserDialogOpen(true)}>
                <PlusCircle className="me-2" />
                <span>إضافة حساب</span>
            </Button>
        </div>
        <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="ابحث عن مستخدم..."
                className="ps-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم المستخدم</TableHead>
              <TableHead>الخدمة</TableHead>
              <TableHead>عنوان IP</TableHead>
              <TableHead>مدة الاتصال</TableHead>
              <TableHead>رفع</TableHead>
              <TableHead>تحميل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.service}</TableCell>
                  <TableCell>{user.ipAddress}</TableCell>
                  <TableCell>{user.uptime}</TableCell>
                  <TableCell>{user.upload}</TableCell>
                  <TableCell>{user.download}</TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                        لا توجد حسابات PPPoE نشطة لعرضها.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
     <AddPppoeUserDialog
        open={isAddUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        serverName={serverName}
        serverId={serverId}
        pppoeProfiles={pppoeProfiles}
      />
    </>
  );
}
