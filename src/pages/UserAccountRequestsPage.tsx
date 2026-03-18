import { useEffect, useState } from "react";
import { AtSign, Check, Loader2, Mail, Phone, PhoneIcon, X } from "lucide-react";

import {
    getAccountRequests,
    updateAccountRequestStatus,
    type AccountRequest
} from "@/api/account-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

const getStatusBadgeVariant = (status: string) => {
    const normalized = status.trim().toLowerCase();
    if (["approved", "approve", "accepted", "accept"].includes(normalized)) {
        return "default";
    }
    if (["pending", "requested", "request"].includes(normalized)) {
        return "secondary";
    }
    if (["rejected", "reject", "declined", "decline"].includes(normalized)) {
        return "destructive";
    }
    return "secondary";
};

export default function UserAccountRequestsPage() {
    const [search, setSearch] = useState({ email: "", phone: "" });
    const [requests, setRequests] = useState<AccountRequest[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<
        Record<string, "approved" | "rejected" | undefined>
    >({});

    const fetchRequests = async (searchParams?: URLSearchParams) => {
        setLoading(true);
        try {
            const data = await getAccountRequests(0, searchParams);
            setRequests(data.account_requests || []);
            setTotalCount(data.total_counts || 0);
        } catch (err) {
            console.error("Failed to fetch account requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search.email) params.set("email", search.email);
        if (search.phone) params.set("phone", search.phone);
        fetchRequests(params);
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    User Account Requests
                </h1>
                <p className="text-muted-foreground mt-1">
                    Review and approve pending account requests
                </p>
            </div>

            <Card className="border-border">
                <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between space-y-0 pb-4 gap-8">
                    <div>
                        <CardTitle className="text-base font-semibold">
                            Account Requests
                        </CardTitle>
                        <CardDescription>{totalCount} requests found</CardDescription>
                    </div>
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row md:items-center gap-2"
                    >
                        <div className="relative w-64">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by email..."
                                className="pl-9"
                                value={search.email}
                                onChange={(e) =>
                                    setSearch((s) => ({ ...s, email: e.target.value }))
                                }
                            />
                        </div>
                        <div className="relative w-64">
                            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by phone..."
                                className="pl-9"
                                value={search.phone}
                                onChange={(e) =>
                                    setSearch((s) => ({ ...s, phone: e.target.value }))
                                }
                            />
                        </div>
                        <Button>Search</Button>
                    </form>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="pl-6">User</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Request Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Requested</TableHead>
                                <TableHead className="w-[220px] text-right pr-6">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground py-8"
                                    >
                                        Loading requests...
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && requests.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground py-8"
                                    >
                                        No account requests found.
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading &&
                                requests.map((req, index) => (
                                    <TableRow
                                        key={req.id ?? String(index)}
                                        className="group"
                                    >
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {(
                                                            req.user?.name ||
                                                            req.user?.email ||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium text-foreground truncate">
                                                        {req.user?.name ||
                                                            "Unknown user"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground truncate">
                                                        {req.user?.email || "—"}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5 text-sm text-foreground">
                                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {req.user?.email || "—"}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    {req.user?.phone || "—"}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className="capitalize"
                                            >
                                                {req.requestType || "unknown"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getStatusBadgeVariant(
                                                    req.status || "unknown"
                                                )}
                                                className="capitalize"
                                            >
                                                {req.status || "unknown"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {req.createdAt
                                                ? req.createdAt.split(" ")[0]
                                                : "—"}
                                        </TableCell>
                                        <TableCell className="pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {(() => {
                                                    const normalizedStatus = (
                                                        req.status || ""
                                                    ).trim().toLowerCase();
                                                    const isFinal = ["approved", "rejected"].includes(
                                                        normalizedStatus
                                                    );
                                                    const requestId = String(req.id);
                                                    const isApproving =
                                                        actionLoading[requestId] === "approved";
                                                    const isRejecting =
                                                        actionLoading[requestId] === "rejected";
                                                    const isBusy = isApproving || isRejecting;

                                                    return (
                                                        <>
                                                <Button
                                                    size="sm"
                                                    disabled={isFinal || isBusy}
                                                    onClick={() =>
                                                        (async () => {
                                                            try {
                                                                console.log(
                                                                    "Approve account request:",
                                                                    req
                                                                );
                                                                setActionLoading((prev) => ({
                                                                    ...prev,
                                                                    [requestId]: "approved"
                                                                }));
                                                                await updateAccountRequestStatus(
                                                                    requestId,
                                                                    "approved"
                                                                );
                                                                setRequests((prev) =>
                                                                    prev.map((r) =>
                                                                        String(r.id) === requestId
                                                                            ? { ...r, status: "approved" }
                                                                            : r
                                                                    )
                                                                );
                                                            } catch (err) {
                                                                console.error(
                                                                    "Failed to approve account request:",
                                                                    err
                                                                );
                                                            } finally {
                                                                setActionLoading((prev) => {
                                                                    const next = { ...prev };
                                                                    delete next[requestId];
                                                                    return next;
                                                                });
                                                            }
                                                        })()
                                                    }
                                                >
                                                    {isApproving ? (
                                                        <Loader2 className="size-4 mr-1.5 animate-spin" />
                                                    ) : (
                                                        <Check className="size-4 mr-1.5" />
                                                    )}
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={isFinal || isBusy}
                                                    onClick={() =>
                                                        (async () => {
                                                            try {
                                                                console.log(
                                                                    "Reject account request:",
                                                                    req
                                                                );
                                                                setActionLoading((prev) => ({
                                                                    ...prev,
                                                                    [requestId]: "rejected"
                                                                }));
                                                                await updateAccountRequestStatus(
                                                                    requestId,
                                                                    "rejected"
                                                                );
                                                                setRequests((prev) =>
                                                                    prev.map((r) =>
                                                                        String(r.id) === requestId
                                                                            ? { ...r, status: "rejected" }
                                                                            : r
                                                                    )
                                                                );
                                                            } catch (err) {
                                                                console.error(
                                                                    "Failed to reject account request:",
                                                                    err
                                                                );
                                                            } finally {
                                                                setActionLoading((prev) => {
                                                                    const next = { ...prev };
                                                                    delete next[requestId];
                                                                    return next;
                                                                });
                                                            }
                                                        })()
                                                    }
                                                >
                                                    {isRejecting ? (
                                                        <Loader2 className="size-4 mr-1.5 animate-spin" />
                                                    ) : (
                                                        <X className="size-4 mr-1.5" />
                                                    )}
                                                    Reject
                                                </Button>
                                                        </>
                                                    );
                                                })()}
                                            </div>
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
