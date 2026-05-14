"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button className="px-3" variant="secondary" onClick={logout}>
      <LogOut size={16} />
      <span className="hidden min-[420px]:inline">Sign out</span>
      <span className="min-[420px]:hidden">Out</span>
    </Button>
  );
}
