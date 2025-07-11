
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
import { Badge } from '@/components/ui/badge';
import type { InterfaceStat } from '@/lib/types';

export function InterfaceStatsTable({ initialStats }: { initialStats: InterfaceStat[] }) {
  const [stats, setStats] = useState<InterfaceStat[]>(initialStats);

  // Note: The periodic refresh logic was removed. Data should be passed from a server component.

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
            {stats.map((stat) => (
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
