"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button 
      onClick={async () => {
        await signOut({ redirect: false });
        window.location.href = "/login";
      }}
      className="w-full flex items-center gap-3 px-4 py-2 mt-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-all"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-sm font-medium">Sair</span>
    </button>
  );
}
