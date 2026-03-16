import { type ComponentType, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Shield,
    UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
    label: string;
    to: string;
    icon: ComponentType<{ className?: string }>;
};

type NavGroup = {
    label: string;
    items: NavItem[];
};

const SIDEBAR_COLLAPSED_STORAGE_KEY = "autohub.admin.sidebarCollapsed";

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "1";
        } catch {
            return false;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(
                SIDEBAR_COLLAPSED_STORAGE_KEY,
                collapsed ? "1" : "0"
            );
        } catch {
            // ignore storage errors
        }
    }, [collapsed]);

    const navGroups = useMemo<NavGroup[]>(
        () => [
            {
                label: "Home",
                items: [
                    {
                        label: "Dashboard",
                        to: "/dashboard",
                        icon: LayoutDashboard,
                    },
                ],
            },
            {
                label: "Management",
                items: [
                    {
                        label: "Admin Management",
                        to: "/admin-management",
                        icon: Shield,
                    },
                    {
                        label: "User Account Requests",
                        to: "/user-account-requests",
                        icon: UserCheck,
                    },
                ],
            },
        ],
        []
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex min-h-screen">
                <aside
                    className={cn(
                        "relative flex shrink-0 flex-col border-r border-border bg-background transition-[width] duration-200 ease-out",
                        collapsed ? "w-16" : "w-64"
                    )}
                >
                    <div
                        className={cn(
                            "flex h-14 items-center justify-between gap-2 border-b border-border px-3",
                            collapsed && "justify-center px-2"
                        )}
                    >
                        <div className={cn("min-w-0", collapsed && "sr-only")}>
                            <div className="truncate text-sm font-semibold leading-none">
                                AutoHub Admin
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                                Admin Portal
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setCollapsed((v) => !v)}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {collapsed ? (
                                <ChevronRight className="size-4" />
                            ) : (
                                <ChevronLeft className="size-4" />
                            )}
                        </Button>
                    </div>

                    <nav className="flex-1 space-y-5 px-2 py-4">
                        {navGroups.map((group) => (
                            <div key={group.label} className="space-y-2">
                                <div
                                    className={cn(
                                        "px-2 text-xs font-medium tracking-wide text-muted-foreground",
                                        collapsed ? "sr-only" : "uppercase"
                                    )}
                                >
                                    {group.label}
                                </div>
                                <div className="space-y-1">
                                    {group.items.map((item) => (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            className={({ isActive }) =>
                                                cn(
                                                    "flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                                                    "hover:bg-muted hover:text-foreground",
                                                    collapsed && "justify-center",
                                                    isActive
                                                        ? "bg-muted text-foreground"
                                                        : "text-muted-foreground"
                                                )
                                            }
                                            aria-label={collapsed ? item.label : undefined}
                                        >
                                            <item.icon className="size-4" />
                                            <span className={cn("truncate", collapsed && "sr-only")}>
                                                {item.label}
                                            </span>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="flex h-14 items-center border-b border-border px-4">
                        <div className="text-sm text-muted-foreground">
                            Welcome to AutoHub Admin
                        </div>
                    </header>

                    <main className="min-w-0 flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
