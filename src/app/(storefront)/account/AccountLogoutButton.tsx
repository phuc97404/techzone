"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AccountLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-400 transition-colors border-l-4 border-transparent hover:bg-red-500/10 hover:border-red-500"
    >
      <LogOut size={18} />
      Đăng xuất
    </button>
  );
}
