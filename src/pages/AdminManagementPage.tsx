import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Dummy data
const dummyAdmins = [
    {
        id: "1",
        name: "kst testing",
        email: "kst@bruno.com",
        phone: "09123458976",
        role: "admin",
        createdDate: "2026-03-08 14:50:19",
    },
    {
        id: "2",
        name: "John Doe",
        email: "john@autohub.com",
        phone: "09876543210",
        role: "admin",
        createdDate: "2026-03-05 10:30:00",
    },
    {
        id: "3",
        name: "Jane Smith",
        email: "jane@autohub.com",
        phone: "09111222333",
        role: "moderator",
        createdDate: "2026-03-01 08:15:45",
    },
];

export default function AdminManagementPage() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Create Admin (dummy):", formData);
        setFormData({ name: "", email: "", phone: "", password: "", role: "" });
        setOpen(false);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin Management</h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="size-4 mr-1" />
                            Create New Admin
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
                                <Button type="submit" className="w-full sm:w-auto">
                                    Create Admin
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Admin Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyAdmins.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell className="font-medium">
                                        {admin.name}
                                    </TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>{admin.phone}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                            {admin.role}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {admin.createdDate}
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
