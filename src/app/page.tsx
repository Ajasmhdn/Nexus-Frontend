
"use client";

import { useUser, useFirestore, useDoc } from '@/firebase';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { LandingPage } from '@/components/landing/landing-page';
import { Toaster } from '@/components/ui/toaster';
import { UserManagement } from '@/components/admin/user-management';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <main className="flex-1 overflow-hidden">
            <ChatInterface />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <UserManagement />
    </div>
  );
}

export default function Home() {
  const { user, loading } = useUser();
  const db = useFirestore();
  
  // Use a stable document reference for the user's profile
  const userProfileRef = user ? doc(db, 'users', user.uid) : null;
  const { data: profile, loading: profileLoading } = useDoc<any>(userProfileRef);

  if (loading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" strokeWidth={1.5} />
          <span className="text-sm font-medium text-slate-400 animate-pulse uppercase tracking-widest">Initializing Nexus...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {profile?.role === 'admin' ? <AdminDashboard /> : <Dashboard />}
      <Toaster />
    </>
  );
}
