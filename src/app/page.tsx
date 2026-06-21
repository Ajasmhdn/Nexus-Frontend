"use client";

import { useUser, useFirestore, useDoc } from '@/firebase';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { LandingPage } from '@/components/landing/landing-page';
import { Toaster } from '@/components/ui/toaster';
import { UserManagement } from '@/components/admin/user-management';
import { Loader2, AlertTriangle } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

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
  const auth = useAuth();
  
  // Use a stable document reference for the user's profile
  // Only create the ref if we have a user to avoid rule errors
  const userProfileRef = user ? doc(db, 'users', user.uid) : null;
  const { data: profile, loading: profileLoading, error: profileError } = useDoc<any>(userProfileRef);

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

  // If user is logged in but no profile exists, they might be in the middle of signup
  if (user && !profile && !profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Account Setup Required</h2>
            <p className="text-slate-500">
              We couldn't find your profile. If you just signed up, please wait a moment while we finish setting up your account.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => signOut(auth)}
            className="w-full"
          >
            Go Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {profile?.role === 'admin' ? <AdminDashboard /> : <Dashboard />}
      <Toaster />
    </>
  );
}
