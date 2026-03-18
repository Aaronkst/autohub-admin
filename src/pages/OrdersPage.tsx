import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Search } from "lucide-react";

import { getOrders, type Order } from "@/api/orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const formatPrice = (value: number) => {
    if (!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
};

export default function OrdersPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders(0);
                setOrders(data.orders || []);
                setTotalCount(data.total_count || 0);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return orders;
        return orders.filter((o) => {
            const name = o.user?.name?.toLowerCase() ?? "";
            const email = o.user?.email?.toLowerCase() ?? "";
            const phone = o.user?.phone?.toLowerCase() ?? "";
            const type = o.type?.toLowerCase() ?? "";
            const resourceId = o.resourceId?.toLowerCase() ?? "";
            return (
                name.includes(query) ||
                email.includes(query) ||
                phone.includes(query) ||
                type.includes(query) ||
                resourceId.includes(query)
            );
        });
    }, [orders, search]);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Orders</h1>
                <p className="text-muted-foreground mt-1">View orders placed in AutoHub</p>
            </div>

            <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-base font-semibold">Order List</CardTitle>
                        <CardDescription>
                            {search.trim()
                                ? `Showing ${filtered.length} of ${totalCount}`
                                : `${totalCount} orders found`}
                        </CardDescription>
                    </div>
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by user, type, resource..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="pl-6">User</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Resource</TableHead>
                                <TableHead className="text-right pr-6">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        Loading orders...
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading &&
                                filtered.map((order, index) => (
                                    <TableRow
                                        key={order.id ?? String(index)}
                                        className="group cursor-pointer"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            navigate(
                                                `/orders/details?order_id=${encodeURIComponent(order.id)}`
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                navigate(
                                                    `/orders/details?order_id=${encodeURIComponent(
                                                        order.id
                                                    )}`
                                                );
                                            }
                                        }}
                                    >
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {(order.user?.name || order.user?.email || "U")
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium text-foreground truncate">
                                                        {order.user?.name || "Unknown user"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground truncate">
                                                        {order.user?.email || "—"}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5 text-sm text-foreground">
                                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {order.user?.email || "—"}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    {order.user?.phone || "—"}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="capitalize">
                                                {order.type || "unknown"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {order.resourceId || "—"}
                                        </TableCell>
                                        <TableCell className="text-right pr-6 font-medium">
                                            {formatPrice(order.price)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
