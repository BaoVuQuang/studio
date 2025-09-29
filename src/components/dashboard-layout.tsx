'use client';
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[280px_1fr_380px] h-screen bg-background">
      {children}
    </div>
  );
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-r bg-card p-4 flex flex-col gap-6">
      <header className="flex items-center gap-2">
        <BrainCircuit className="h-7 w-7 text-primary" />
        <h1 className="font-bold text-xl tracking-tight">StudyBuddy AI</h1>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="overflow-y-auto">
      {children}
    </main>
  );
}

export function AppChatbar({ children }: { children: React.ReactNode }) {
  return <aside>{children}</aside>;
}
