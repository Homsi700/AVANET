'use client';

import { useEffect, useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getResourceData } from '@/lib/data';
import type { ResourceData } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function ResourceUsageChart({ serverId }: { serverId: string }) {
  const [data, setData] = useState<ResourceData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const resourceData = await getResourceData(serverId);
      setData(resourceData);
      setLoading(false);
    };
    fetchData();
  }, [serverId]);

  if (loading) {
      return <Skeleton className="h-[350px] w-full" />;
  }

  return (
    <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis unit="%" />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Legend />
            <Line type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" name="المعالج" unit="%" />
            <Line type="monotone" dataKey="memory" stroke="hsl(var(--accent))" name="الذاكرة" unit="%" />
        </LineChart>
        </ResponsiveContainer>
    </div>
  );
}
