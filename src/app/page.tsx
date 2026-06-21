
"use client";

import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { LandingPage } from '@/components/landing/landing-page';
import { Toaster } from '@/components/ui/toaster';
import { UserManagement } from '@/components/admin/user-management';

export default function Home() {
  const [view, setView] = useState<'landing' | 'chat' | 'admin'>('landing');

  if (view === 'landing') {
    return (
      <>
        <LandingPage onNavigate={setView} />
        <Toaster />
      </>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white overflow-hidden">
        <AppSidebar onNavigate={setView} activeView={view} />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <main className="flex-1 overflow-hidden">
            {view === 'chat' ? <ChatInterface /> : <UserManagement />}
          </main>
        </SidebarInset>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
