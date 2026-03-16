import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminManagementPage from "./pages/AdminManagementPage";
import UserAccountRequestsPage from "./pages/UserAccountRequestsPage";
import { Toaster } from "./components/ui/sonner";
import AppLayout from "./layouts/AppLayout";

export default function App() {
    return (
        <BrowserRouter>
            <Toaster />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/admin-management" element={<AdminManagementPage />} />
                    <Route
                        path="/user-account-requests"
                        element={<UserAccountRequestsPage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
