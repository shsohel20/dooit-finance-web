"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconDeviceMobile, IconDeviceDesktop, IconMapPin, IconWifi } from "@tabler/icons-react";
import { dateShowFormatWithTime } from "@/lib/utils";

export default function DeviceInfoTab({ caseData }) {
  const devices = caseData?.devices;

  if (!devices || devices.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground text-sm">
        No device information available.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {devices.map((device, i) => {
        const isMobile = device.type === "Mobile";
        const Icon = isMobile ? IconDeviceMobile : IconDeviceDesktop;

        return (
          <Card key={i} className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Icon className="size-4" />
                {device.type} Device
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-muted-foreground">OS</span>
                  <span className="text-sm font-medium text-heading">{device.os}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <IconWifi className="size-3.5" />
                    IP Address
                  </span>
                  <span className="font-mono text-sm text-heading">{device.ip}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <IconMapPin className="size-3.5" />
                    Location
                  </span>
                  <span className="text-sm font-medium text-heading">{device.location}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-muted-foreground">Last Seen</span>
                  <span className="text-sm text-heading">
                    {dateShowFormatWithTime(device.lastSeen)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
