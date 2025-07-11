'use client';

import { useEffect, useState } from 'react';
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
import { getPppoeUsers } from '@/lib/data';
import type { PppoeUser } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function ActiveConnectionsTable({ serverId }: { serverId: string }) {
  const [users, setUsers] = useState<PppoeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const pppoeUsers = await getPppoeUsers(serverId);
      setUsers(pppoeUsers);
      setLoading(false);
    };
    fetchData();
  }, [serverId]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>حسابات PPPoE النشطة</CardTitle>
                <CardDescription>
                    عرض وتصفية الحسابات المتصلة حاليًا.
                </CardDescription>
            </div>
            <Button>
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
            {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                ))
            ) : filteredUsers.length > 0 ? (
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
                    <TableCell colSpan={6} className="text-center">
                        لم يتم العثور على مستخدمين.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
