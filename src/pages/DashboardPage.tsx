import { Users, ShieldCheck, UserPlus, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const stats = [
    { label: "Total Admins", value: "12", icon: Users, change: "+2 this month" },
    { label: "Active Now", value: "5", icon: Activity, change: "Online" },
    { label: "Moderators", value: "4", icon: ShieldCheck, change: "33% of team" },
    { label: "New This Month", value: "3", icon: UserPlus, change: "+25%" },
];

const chartData = [
    { month: "Oct", admins: 7 },
    { month: "Nov", admins: 8 },
    { month: "Dec", admins: 8 },
    { month: "Jan", admins: 10 },
    { month: "Feb", admins: 10 },
    { month: "Mar", admins: 12 },
];

const recentActivity = [
    { user: "kst testing", action: "Logged in", time: "2 min ago" },
    { user: "John Doe", action: "Created new admin", time: "1 hour ago" },
    { user: "Jane Smith", action: "Updated settings", time: "3 hours ago" },
    { user: "kst testing", action: "Exported report", time: "Yesterday" },
];

export default function DashboardPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back to AutoHub Admin</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-border">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <stat.icon className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <Card className="lg:col-span-2 border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Admin Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
                                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
                                <Tooltip />
                                <Bar dataKey="admins" fill="hsl(173 58% 39%)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-semibold text-primary">
                                            {item.user.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground">{item.user}</p>
                                        <p className="text-xs text-muted-foreground">{item.action}</p>
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
