import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import {useState} from "react";




export default function App({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSibdebarOpen] = useState(false);

  return (
    <UserProvider>
      <div className="min-h-screen bg-white text-black">
        <title>Your-Tube Clone</title>
        <Header onToggleSidebar={() => setSibdebarOpen(!sidebarOpen)} />
        <Toaster />
        <div className="flex">
          {/* Mobile Sidebar */}
          <div
            className={`fixed inset-y-0 z-50 bg-white w-64 p-4 transition-transform transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:hidden`}
          >
            <Sidebar onClose={() => setSibdebarOpen(false)} />
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64">
            <Sidebar />
          </div>

   

          {/* Main Content */}
          <div className="flex-1">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </UserProvider>
  );
}