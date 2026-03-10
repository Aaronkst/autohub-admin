import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminManagementPage from "./pages/AdminManagementPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
    return (
        <BrowserRouter>
            <Toaster />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin-management" element={<AdminManagementPage />} />
            </Routes>
        </BrowserRouter>
    );
}
