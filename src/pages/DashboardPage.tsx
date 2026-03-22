import { getAdmins } from "@/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [totalAdmins, setTotalAdmins] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const data = await getAdmins(0);
                console.log("data", data);
                setAdmins(data.admins);
                setTotalAdmins(data.total_count);
            } catch (err) {
                console.error("Failed to fetch admins:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmins();
    }, []);

    const stats = [
        {
            label: "Total Admins",
            value: loading ? "..." : String(totalAdmins),
            icon: Users,
            change: `${totalAdmins} admins`
        },
        {
            label: "Active Now",
            value: loading ? "..." : String(totalAdmins),
            icon: Activity,
            change: "Online"
        }
    ];

    // Build recent activity from actual admin data (sorted by most recent)
    const recentActivity = [...admins]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((admin) => ({
            user: admin.name,
            action: `Registered as ${admin.role}`,
            time: admin.createdAt?.split(" ")[0] || "—"
        }));

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back to AutoHub Admin
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="border-border">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {stat.label}
                                        </p>
                                        <p className="text-2xl font-bold text-foreground mt-1">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {stat.change}
                                        </p>
                                    </div>
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <stat.icon className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {/* Recent Activity */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {loading && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Loading...
                                </p>
                            )}
                            {!loading && recentActivity.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No recent activity
                                </p>
                            )}
                            {!loading &&
                                recentActivity.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-xs font-semibold text-primary">
                                                {item.user
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground">
                                                {item.user}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.action}
                                            </p>
                                        </div>
                                        <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                                            {item.time}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
