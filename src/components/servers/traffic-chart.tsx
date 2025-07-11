
'use client';

import { useEffect, useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTrafficData } from '@/lib/data';
import type { TrafficData } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function TrafficChart({ serverId }: { serverId: string }) {
  const [data, setData] = useState<TrafficData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const trafficData = await getTrafficData(serverId);
        setData(trafficData);
      } catch (error) {
        console.error("Failed to fetch traffic data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
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
            <YAxis unit=" Mbps" />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Legend />
            <Line type="monotone" dataKey="download" stroke="hsl(var(--primary))" name="تحميل" unit=" Mbps" />
            <Line type="monotone" dataKey="upload" stroke="hsl(var(--accent))" name="رفع" unit=" Mbps" />
        </LineChart>
        </ResponsiveContainer>
    </div>
  );
}
