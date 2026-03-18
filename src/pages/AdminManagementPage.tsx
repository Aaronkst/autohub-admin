import { useState, useEffect } from "react";
import {
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    AtSignIcon,
    PhoneIcon,
    Loader2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getAdmins } from "@/api/admin";
import { toast } from "sonner";

export default function AdminManagementPage() {
    const [open, setOpen] = useState(false);
    const [admins, setAdmins] = useState<any[]>([]);
    const [total, setTotal] = useState();
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState({
        email: "",
        phone: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: ""
    });

    const fetchAdmins = async (searchParams?: URLSearchParams) => {
        setLoading(true);
        try {
            const data = await getAdmins(0, searchParams);
            if (data) {
                setAdmins(data.admins);
                setTotal(data.total_count);
            } else {
                toast.error("Failed to fetch admins");
            }
        } catch (err) {
            console.error("Failed to fetch admins:", err);
            toast.error("Failed to fetch admins");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Create Admin (dummy):", formData);
        setFormData({ name: "", email: "", phone: "", password: "", role: "" });
        setOpen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search.email) params.set("email", search.email);
        if (search.phone) params.set("phone", search.phone);
        fetchAdmins(params);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Admin Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage admin users and their roles
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="size-4 mr-1.5" />
                            Create Admin
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Admin</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to add a new admin
                                user.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="09xxxxxxxxx"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    name="role"
                                    placeholder="e.g. admin, moderator"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto"
                                >
                                    Create Admin
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Table */}
            <Card className="border-border">
                <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between space-y-0 pb-4 gap-8">
                    <div>
                        <CardTitle className="text-base font-semibold">
                            Admin Users
                        </CardTitle>
                        <CardDescription>
                            {total === undefined ? (
                                <Loader2Icon className="animate-spin size-5" />
                            ) : (
                                `${total} users found`
                            )}
                        </CardDescription>
                    </div>
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row md:items-center gap-2"
                    >
                        <div className="relative w-64">
                            <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by email..."
                                className="pl-9"
                                value={search.email}
                                onChange={(e) =>
                                    setSearch((s) => ({
                                        ...s,
                                        email: e.target.value
                                    }))
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
                                    setSearch((s) => ({
                                        ...s,
                                        phone: e.target.value
                                    }))
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
                                <TableHead className="pl-6">Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-muted-foreground py-8"
                                    >
                                        Loading admins...
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && admins.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-muted-foreground py-8"
                                    >
                                        No admins found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading &&
                                admins.map((admin) => (
                                    <TableRow key={admin.id} className="group">
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {admin.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-foreground">
                                                    {admin.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5 text-sm text-foreground">
                                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {admin.email}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    {admin.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    admin.role === "admin"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="capitalize"
                                            >
                                                {admin.role || "unknown"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {admin.createdAt
                                                ? admin.createdAt.split(" ")[0]
                                                : "—"}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
