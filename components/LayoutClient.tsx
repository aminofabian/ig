"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import Navbar from "@/components/Dashboard/Navbar";
import Sidebar from "@/components/Dashboard/Sidebar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the pathname dynamically
  const isProfilePage = /^\/profile\/[^/]+$/.test(pathname || ""); // Matches /profile/{username}

  console.log("Current Pathname:", pathname); // Debug: Log pathname to verify correctness

  return (
    <div className="relative bg-[#0a0a0a]">
      <div className="flex h-full">
        {!isProfilePage && (
          <>
            {/* Sidebar */}
            <div className="hidden md:flex h-full md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
              <Sidebar />
            </div>
            {/* Main content with navbar */}
            <main className="md:pl-72 flex-1 min-h-screen">
              <Navbar />
              <div className="container mx-auto px-4 py-6 mt-20">
                <Toaster position="top-center" />
                {children}
              </div>
            </main>
          </>
        )}
        {isProfilePage && (
          <main className="flex-1 min-h-screen">
            <Toaster position="top-center" />
            {children}
          </main>
        )}
      </div>
    </div>
  );
}
