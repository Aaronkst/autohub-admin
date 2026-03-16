import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserAccountRequestsPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">User Account Requests</h1>
                <p className="text-muted-foreground mt-1">
                    Review and approve pending account requests
                </p>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Coming soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        This page is a placeholder for user account request workflows.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

