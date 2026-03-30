import type { ReactNode } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";

export const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col bg-background">
    <main className="flex-1">{children}</main>
    <BottomNav />
  </div>
);
