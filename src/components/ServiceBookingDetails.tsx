import type { ServiceBookingData } from "@/api/orders";
import { getServiceCenterDetails, type ServiceAndCenterData } from "@/api/service-center";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ServiceBookingDetailsProps {
  data: Partial<ServiceBookingData>
}

export function ServiceBookingDetails({ data }: ServiceBookingDetailsProps) {
  const [serviceCenterData, setServiceCenterData] =
      useState<ServiceAndCenterData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(data.bulletin_app__sc_id__CST && data.bulletin_app__service_id__CST) {
      setLoading(true)
      getServiceCenterDetails(
          data.bulletin_app__sc_id__CST,
          data.bulletin_app__service_id__CST
      ).then(setServiceCenterData).finally(() => setLoading(false))
    }
  }, [data])

  if(!serviceCenterData) {
    return <Loader2Icon className="animate-spin size-4" />
  }

  return (
      <Card className="border-border">
          <CardHeader className="space-y-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <span>Service Booking Details</span>
              </CardTitle>
              <CardDescription>
                  Included for service center booking"
              </CardDescription>
          </CardHeader>
          <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {data.bulletin_app__sc_booking_date__CST && <div className="min-w-0">
                      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Booked date
                      </dt>
                      <dd className="mt-1 text-sm text-foreground break-words">
                          {new Date(data.bulletin_app__sc_booking_date__CST).toLocaleString("en-GB")}
                      </dd>
                  </div>}
                  <div className="min-w-0">
                      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Service center
                      </dt>
                      <dd className="mt-1 text-sm text-foreground break-words">
                          {serviceCenterData.serviceCenter.name}
                      </dd>
                  </div>
                  <div className="min-w-0">
                      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Service
                      </dt>
                      <dd className="mt-1 text-sm text-foreground break-words">
                          {serviceCenterData.service.name}
                      </dd>
                  </div>
              </dl>
          </CardContent>
      </Card>
  );
}