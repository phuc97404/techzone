import { ReactNode } from "react";
import Sidebar from "@/components/modules/Admin/Sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import "./admin.css";

export const metadata = {
  title: "Admin Dashboard - TechZone",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // Basic guard role (Admin required phase 5 task 2 setup)
  if (!session || session.user.role !== "ADMIN") {
     return redirect("/");
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <header className="admin-header">
           <div className="user-info">
              Hi, {session.user.name || "Admin"}
           </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
