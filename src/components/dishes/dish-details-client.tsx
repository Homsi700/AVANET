'use client';

import type { Dish } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Signal, Gauge, ArrowDown, ArrowUp, Clock, Wifi } from 'lucide-react';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';

export function DishDetailsClient({ dish }: { dish: Dish }) {
    // Normalize signal strength to a 0-100 scale for the progress bar.
    // Assuming a range from -90 (worst) to -30 (best).
    const getSignalQuality = (signal: number) => {
        if (signal >= -30) return 100;
        if (signal <= -90) return 0;
        return Math.round(((signal - -90) / (-30 - -90)) * 100);
    }
    const signalQuality = getSignalQuality(dish.signalStrength);

  return (
    <ScrollArea className="flex-1">
      <main className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نوع الجهاز</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dish.type}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">عنوان IP</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dish.ip}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الحالة</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dish.status}</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مدة التشغيل</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dish.uptime}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Signal className="h-5 w-5" />
                        <span>قوة الإشارة وجودتها</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between font-mono text-lg">
                        <span>{dish.signalStrength} dBm</span>
                        <span>{signalQuality}%</span>
                    </div>
                    <Progress value={signalQuality} />
                    <p className="text-sm text-muted-foreground">
                        جودة الإشارة ممتازة. (نطاق مثالي: -30 إلى -60 dBm)
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gauge className="h-5 w-5" />
                        <span>مستوى الضجيج</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="font-mono text-3xl font-bold">
                        {dish.noiseFloor} dBm
                     </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        مستوى ضجيج منخفض، مما يضمن اتصالاً مستقرًا. (المثالي: أقل من -90 dBm)
                    </p>
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>معدلات نقل البيانات</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                            <ArrowUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">معدل الإرسال (TX)</p>
                            <p className="text-2xl font-bold">{dish.txRate} Mbps</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300">
                            <ArrowDown className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">معدل الاستلام (RX)</p>
                            <p className="text-2xl font-bold">{dish.rxRate} Mbps</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </ScrollArea>
  );
}
