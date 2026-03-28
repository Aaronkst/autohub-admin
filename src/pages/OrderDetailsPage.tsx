import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Receipt } from "lucide-react";

import { getOrderDetails, type OrderDetails } from "@/api/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceBookingDetails } from "@/components/ServiceBookingDetails";

const formatPrice = (value: unknown) => {
    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric)) return "—";
    return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numeric);
};

const formatDateTime = (value: unknown) => {
    if (typeof value !== "string" || !value.trim()) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString();
};

const formatValue = (value: unknown) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "string") return value.trim() ? value : "—";
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
};

type FieldDef = {
    key: string;
    label: string;
    formatter?: (value: unknown) => string;
};

const ORDER_FIELDS: FieldDef[] = [
    { key: "id", label: "Order ID" },
    { key: "bulletin_app__order_type__CST", label: "Order Type" },
    { key: "bulletin_app__data_id__CST", label: "Data ID" },
    { key: "bulletin_app__price__CST", label: "Price", formatter: formatPrice },
    { key: "createdDate", label: "Created Date", formatter: formatDateTime },
];

const BOOKING_FIELDS: FieldDef[] = [
    { key: "id", label: "Booking ID" },
    { key: "bulletin_app__booking_type__CST", label: "Booking Type" },
    { key: "bulletin_app__booking_from_date__CST", label: "From Date", formatter: formatDateTime },
    { key: "bulletin_app__booking_to_date__CST", label: "To Date", formatter: formatDateTime },
    { key: "bulletin_app__driver_id__CST", label: "Driver ID" },
    { key: "bulletin_app__car_id__CST", label: "Car ID" },
    { key: "createdDate", label: "Created Date", formatter: formatDateTime },
];

const CAR_SALES_FIELDS: FieldDef[] = [
    { key: "id", label: "Sale Car ID" },
    { key: "bulletin_app__sale_car_model__CST", label: "Car Model" },
    { key: "bulletin_app__sale_car_seats__CST", label: "Seats" },
    { key: "bulletin_app__sales_car_color__CST", label: "Color" },
    { key: "createdDate", label: "Created Date", formatter: formatDateTime },
];

const CAR_PART_FIELDS: FieldDef[] = [
    { key: "id", label: "Car Part ID" },
    { key: "bulletin_app__car_parts_category_id__CST", label: "Category ID" },
    { key: "createdDate", label: "Created Date", formatter: formatDateTime },
];

const SERVICE_BOOKING_FIELDS: FieldDef[] = [
    { key: "id", label: "Service Booking ID" },
    { key: "bulletin_app__order_id__CST", label: "Order ID" },
    {
        key: "bulletin_app__sc_booking_date__CST",
        label: "Booking Date",
        formatter: formatDateTime
    },
    { key: "bulletin_app__sc_id__CST", label: "Service Center ID" },
    { key: "bulletin_app__service_id__CST", label: "Service ID" },
    { key: "createdDate", label: "Created Date", formatter: formatDateTime }
];

function DetailsCard({
    title,
    description,
    icon,
    data,
    fields,
}: {
    title: string;
    description?: string;
    icon?: ReactNode;
    data: Record<string, unknown> | null | undefined;
    fields: FieldDef[];
}) {
    const rows = useMemo(
        () =>
            fields
                .map(({ key, label, formatter }) => ({
                    key,
                    label,
                    value: formatter ? formatter((data ?? {})[key]) : formatValue((data ?? {})[key]),
                }))
                .filter((row) => row.value !== "—"),
        [data, fields]
    );

    return (
        <Card className="border-border">
            <CardHeader className="space-y-1">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </CardTitle>
                {description ? <CardDescription>{description}</CardDescription> : null}
            </CardHeader>
            <CardContent>
                {rows.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No details available.</div>
                ) : (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        {rows.map((row) => (
                            <div key={row.key} className="min-w-0">
                                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                    {row.label}
                                </dt>
                                <dd className="mt-1 text-sm text-foreground break-words">
                                    {row.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </CardContent>
        </Card>
    );
}

export default function OrderDetailsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id")?.trim() ?? "";

    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState<OrderDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!orderId) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getOrderDetails(orderId);
                if (!cancelled) setDetails(data);
            } catch (err) {
                console.error("Failed to fetch order details:", err);
                if (!cancelled) {
                    setError("Failed to fetch order details. Please try again.");
                    setDetails(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [orderId]);

    const order = (details?.order ?? null) as Record<string, unknown> | null;
    const orderType = String(order?.bulletin_app__order_type__CST ?? "").trim();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/orders")}
                            aria-label="Back to orders"
                        >
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold text-foreground truncate">
                                Order Details
                            </h1>
                            <p className="text-muted-foreground">
                                {orderId
                                    ? `Order ID: ${orderId}`
                                    : "Select an order to view details"}
                            </p>
                        </div>
                    </div>
                </div>

                {orderType ? (
                    <Badge variant="secondary" className="capitalize">
                        {orderType}
                    </Badge>
                ) : null}
            </div>

            {!orderId ? (
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">
                            Missing order ID
                        </CardTitle>
                        <CardDescription>
                            Open this page with{" "}
                            <span className="font-mono">order_id</span> in the
                            query string.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : null}

            {error ? (
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-destructive">
                            Error
                        </CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            ) : null}

            {loading ? (
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">
                            Loading…
                        </CardTitle>
                        <CardDescription>
                            Fetching order details.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : null}

            {!loading && orderId ? (
                <div className="space-y-6">
                    <DetailsCard
                        title="Order"
                        description="Core order details"
                        icon={
                            <Receipt className="size-4 text-muted-foreground" />
                        }
                        data={order}
                        fields={ORDER_FIELDS}
                    />

                    {details?.booking_data ? (
                        <DetailsCard
                            title="Booking Details"
                            description="Included for booking orders"
                            data={
                                (details.booking_data ?? null) as Record<
                                    string,
                                    unknown
                                > | null
                            }
                            fields={BOOKING_FIELDS}
                        />
                    ) : null}

                    {details?.sale_car_data ? (
                        <DetailsCard
                            title="Car Sales Details"
                            description="Included for car sales orders"
                            data={
                                (details.sale_car_data ?? null) as Record<
                                    string,
                                    unknown
                                > | null
                            }
                            fields={CAR_SALES_FIELDS}
                        />
                    ) : null}

                    {details?.car_part_data ? (
                        <DetailsCard
                            title="Car Part Details"
                            description="Included for car part orders"
                            data={
                                (details.car_part_data ?? null) as Record<
                                    string,
                                    unknown
                                > | null
                            }
                            fields={CAR_PART_FIELDS}
                        />
                    ) : null}

                    {details?.service_booking ? (
                        // <DetailsCard
                        //     title="Service Booking Details"
                        //     description="Included for service center booking"
                        //     data={
                        //         (details.service_booking ?? null) as Record<
                        //             string,
                        //             unknown
                        //         > | null
                        //     }
                        //     fields={SERVICE_BOOKING_FIELDS}
                        // />
                        <ServiceBookingDetails data={details.service_booking} />
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
