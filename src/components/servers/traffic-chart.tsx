
'use client';

import { useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrafficData } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function TrafficChart({ initialData }: { initialData: TrafficData }) {
  const [data, setData] = useState<TrafficData>(initialData);

  if (!data || data.length === 0) {
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
