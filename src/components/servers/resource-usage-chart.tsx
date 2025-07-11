
'use client';

import { useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ResourceData } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function ResourceUsageChart({ initialData }: { initialData: ResourceData }) {
  const [data, setData] = useState<ResourceData>(initialData);

  if (!data || data.length === 0) {
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
