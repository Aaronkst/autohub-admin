import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdmins } from "@/api/admin";


export default function AdminManagementPage() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
    });

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const data = await getAdmins(0);
                setAdmins(data || []);
            } catch (err) {
                console.error("Failed to fetch admins:", err);
            } finally {
                setLoading(false);
            }
        };
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

    const filtered = admins.filter(
        (a) =>
            a.name?.toLowerCase().includes(search.toLowerCase()) ||
            a.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Management</h1>
                    <p className="text-muted-foreground mt-1">Manage admin users and their roles</p>
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
                                Fill in the details below to add a new admin user.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" placeholder="09xxxxxxxxx" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input id="role" name="role" placeholder="e.g. admin, moderator" value={formData.role} onChange={handleChange} required />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full sm:w-auto">Create Admin</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-border">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold text-foreground">{admins.length}</p>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Admins</p>
                        <p className="text-2xl font-bold text-foreground">
                            {admins.filter((a) => a.role === "admin").length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Moderators</p>
                        <p className="text-2xl font-bold text-foreground">
                            {admins.filter((a) => a.role === "moderator").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-base font-semibold">Admin Users</CardTitle>
                        <CardDescription>{filtered.length} users found</CardDescription>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
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
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        Loading admins...
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No admins found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && filtered.map((admin) => (
                                <TableRow key={admin.id} className="group">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-primary">
                                                    {admin.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-medium text-foreground">{admin.name}</span>
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
                                            variant={admin.role === "admin" ? "default" : "secondary"}
                                            className="capitalize"
                                        >
                                            {admin.role || "unknown"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {admin.createdAt ? admin.createdAt.split(" ")[0] : "—"}
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
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
