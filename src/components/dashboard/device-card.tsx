import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Device, Server, Dish } from '@/lib/types';
import {
  ArrowRight,
  Cpu,
  MemoryStick,
  Server as ServerIcon,
  Wifi,
  Signal,
  Gauge,
  ArrowDown,
  ArrowUp,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function isServer(device: Device): device is Server {
  return device.type === 'MikroTik';
}

const getStatusVariant = (status: 'Online' | 'Offline'): 'default' | 'destructive' => {
    return status === 'Online' ? 'default' : 'destructive';
}

const getStatusClass = (status: 'Online' | 'Offline'): string => {
    return status === 'Online' ? 'bg-green-500' : 'bg-red-500';
}

export function DeviceCard({ device }: { device: Device }) {
  const linkHref = isServer(device) ? `/servers/${device.id}` : `/dishes/${device.id}`;
  const Icon = isServer(device) ? ServerIcon : Wifi;

  return (
    <Card className="flex h-full flex-col transition-all hover:shadow-lg">
      <Link href={linkHref} className="flex h-full flex-col">
        <CardHeader className="flex-row items-start gap-4 space-y-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-secondary">
            <Icon className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle>{device.name}</CardTitle>
            <CardDescription>{device.type}</CardDescription>
          </div>
          <Badge variant={getStatusVariant(device.status)} className="flex items-center gap-1 capitalize">
             <span className={cn("h-2 w-2 rounded-full", getStatusClass(device.status))}></span>
             {device.status}
          </Badge>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {isServer(device) ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                  <span>CPU: {device.cpuUsage}%</span>
                  <Progress value={device.cpuUsage} className="flex-1" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MemoryStick className="h-4 w-4" />
                  <span>Memory: {device.memoryUsage}%</span>
                  <Progress value={device.memoryUsage} className="flex-1" />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Signal className="h-4 w-4" />
                    <span>Signal: {device.signalStrength} dBm</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gauge className="h-4 w-4" />
                    <span>Noise: {device.noiseFloor} dBm</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowUp className="h-4 w-4 text-blue-500" />
                    <span>TX: {device.txRate} Mbps</span>
                    <ArrowDown className="h-4 w-4 text-green-500" />
                    <span>RX: {device.rxRate} Mbps</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="mt-auto flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{device.uptime}</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <span>التفاصيل</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
