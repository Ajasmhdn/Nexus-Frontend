"use client";

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  History, 
  Settings, 
  Shield, 
  LogOut, 
  PlusCircle, 
  Search, 
  LayoutDashboard,
  Server,
  Zap,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { recommendPromptsFromSchema } from '@/ai/flows/recommend-prompts-from-schema';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const { user } = useUser();
  const auth = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);

  useEffect(() => {
    async function fetchPrompts() {
      setLoadingPrompts(true);
      try {
        const res = await recommendPromptsFromSchema({
          databaseSchema: "machine_logs, maintenance_records, technicians"
        });
        setRecommendations(res.recommendedPrompts.slice(0, 4));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPrompts(false);
      }
    }
    fetchPrompts();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <Sidebar className="border-r border-slate-100 shadow-sm" collapsible="icon">
      <SidebarHeader className="p-4 h-16 flex items-center justify-between">
        <div className={cn("flex items-center gap-3 transition-opacity", state === 'collapsed' ? 'opacity-0' : 'opacity-100')}>
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Database className="text-white h-5 w-5" strokeWidth={1.5} />
          </div>
          <span className="font-headline font-bold text-slate-900 tracking-tight text-lg">Nexus</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="frost-bg px-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="New Analysis" className="bg-slate-900 text-white hover:bg-slate-800 hover:text-white mb-2">
                <PlusCircle strokeWidth={1.5} />
                <span>New Analysis</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Operational View</SidebarGroupLabel>
          <SidebarMenu>
            {[
              { icon: LayoutDashboard, label: 'Dashboard' },
              { icon: Server, label: 'Data Connectors' },
              { icon: Shield, label: 'Compliance' },
            ].map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton className="text-slate-600 hover:bg-slate-50 transition-colors">
                  <item.icon strokeWidth={1.5} />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">AI Insights</SidebarGroupLabel>
          <SidebarMenu>
            {loadingPrompts ? (
              <div className="px-4 py-2 space-y-3">
                <div className="h-3 w-3/4 bg-slate-100 animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded" />
              </div>
            ) : (
              recommendations.map((prompt, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton className="h-auto py-2 text-slate-500 hover:text-primary transition-colors group">
                    <Zap className="h-4 w-4 shrink-0 group-hover:text-primary" strokeWidth={1.5} />
                    <span className="text-[13px] leading-tight line-clamp-2">{prompt}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-slate-600 hover:bg-slate-50">
                <Settings strokeWidth={1.5} />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                {user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col transition-opacity", state === 'collapsed' ? 'opacity-0 w-0' : 'opacity-100')}>
              <span className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">
                {user?.displayName || 'Active User'}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-tight">Enterprise Tier</span>
            </div>
          </div>
          {state !== 'collapsed' && (
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
