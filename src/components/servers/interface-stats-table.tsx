
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
import { Badge } from '@/components/ui/badge';
import { getInterfaceStats } from '@/lib/data';
import type { InterfaceStat } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function InterfaceStatsTable({ serverId }: { serverId: string }) {
  const [stats, setStats] = useState<InterfaceStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const interfaceStats = await getInterfaceStats(serverId);
        setStats(interfaceStats);
      } catch (error) {
        console.error("Failed to fetch interface stats:", error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serverId]);

  const getStatusVariant = (status: 'Running' | 'Down'): 'default' | 'destructive' => {
    return status === 'Running' ? 'default' : 'destructive';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>حالة الواجهات</CardTitle>
        <CardDescription>
            عرض إحصائيات لحظية لواجهات السيرفر.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الواجهة</TableHead>
              <TableHead>حالة</TableHead>
              <TableHead>معدل الاستلام (RX)</TableHead>
              <TableHead>معدل الإرسال (TX)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                ))
            ) : stats.map((stat) => (
              <TableRow key={stat.id}>
                <TableCell className="font-medium">{stat.name}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(stat.status)}>{stat.status}</Badge>
                </TableCell>
                <TableCell>{stat.rxRate}</TableCell>
                <TableCell>{stat.txRate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
