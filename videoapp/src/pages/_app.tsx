import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider, useUser } from "../lib/AuthContext";
import { useState } from "react";
import SignInDialog from "@/components/SignInDialog";

function AppContent({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, handlegooglesignin } = useUser();

  return (
    <div className="min-h-screen bg-white text-black">
      <title>Your-Tube Clone</title>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Toaster />
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
        <div className="flex-1">
          <Component {...pageProps} />
        </div>
      </div>

      {/* Sign-In Modal */}
      {/* <Dialog open={!loading && !user}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              You must be signed in to use this app.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={handlegooglesignin}>Sign in with Google</Button>
          </div>
        </DialogContent>
      </Dialog> */}
      <SignInDialog />


      
    </div>
  );
}

export default function App(props: AppProps) {
  return (
    <UserProvider>
      <AppContent {...props} />
    </UserProvider>
  );
}
