import { useState } from "react";
import { useUser } from "@/lib/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import SignInDialog from "@/components/SignInDialog";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-white text-black">
      <title>Your-Tube Clone</title>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Toaster />

      <SignInDialog open={!user} />

      <div className="flex">
        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 z-50 bg-white w-64 p-4 transition-transform transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
