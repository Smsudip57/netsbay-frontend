import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/context/context";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Template from "./pages/Template";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Marketing from "./pages/Marketing";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerified from "./pages/EmailVerified";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import PaymentStatus from "./pages/PaymentStatus";
import Test from "./pages/dashboard/test";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Marketing />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/template" element={<Template />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/email-verified" element={<EmailVerified />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/payment/status" element={<PaymentStatus />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </ThemeProvider>
);

export default App;