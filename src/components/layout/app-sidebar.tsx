"use client";

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Settings, 
  Shield, 
  PlusCircle, 
  LayoutDashboard,
  Server,
  Zap,
  Home,
  LogOut
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { recommendPromptsFromSchema } from '@/ai/flows/recommend-prompts-from-schema';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  onNavigate: (view: 'landing' | 'chat' | 'admin') => void;
  activeView: 'landing' | 'chat' | 'admin';
}

export function AppSidebar({ onNavigate, activeView }: AppSidebarProps) {
  const { state } = useSidebar();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);

  useEffect(() => {
    async function fetchPrompts() {
      setLoadingPrompts(true);
      try {
        const res = await recommendPromptsFromSchema({
          databaseSchema: "machine_logs, maintenance_records, technicians"
        });
        if (res && res.recommendedPrompts) {
          setRecommendations(res.recommendedPrompts.slice(0, 4));
        }
      } catch (e) {
        console.error("Sidebar AI Error:", e);
        // Fallback prompts if the server action itself fails beyond the flow's internal catch
        setRecommendations([
          "Downtime trends last 24h",
          "Machine health summary",
          "Recent work orders",
          "Technician load balance"
        ]);
      } finally {
        setLoadingPrompts(false);
      }
    }
    fetchPrompts();
  }, []);

  return (
    <Sidebar className="border-r border-slate-100 shadow-sm" collapsible="icon">
      <SidebarHeader className="p-4 h-16 flex items-center justify-between">
        <div className={cn("flex items-center gap-3 transition-opacity", state === 'collapsed' ? 'opacity-0' : 'opacity-100')}>
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer" onClick={() => onNavigate('landing')}>
            <Database className="text-white h-5 w-5" strokeWidth={1.5} />
          </div>
          <span className="font-headline font-bold text-slate-900 tracking-tight text-lg">Nexus</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="frost-bg px-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Home" 
                onClick={() => onNavigate('landing')}
                className="text-slate-600 hover:bg-slate-50 mb-1"
              >
                <Home strokeWidth={1.5} />
                <span>Home Page</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="New Analysis" 
                onClick={() => onNavigate('chat')}
                isActive={activeView === 'chat'}
                className={cn(
                  activeView === 'chat' ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <PlusCircle strokeWidth={1.5} />
                <span>New Analysis</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Operational View</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => onNavigate('admin')}
                isActive={activeView === 'admin'}
                className="text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <LayoutDashboard strokeWidth={1.5} />
                <span>Dashboard Hub</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {[
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
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarFallback className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">U</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col transition-opacity", state === 'collapsed' ? 'opacity-0' : 'opacity-100')}>
              <span className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">Demo User</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-tight">Enterprise Tier</span>
            </div>
          </div>
          {state !== 'collapsed' && (
            <Button variant="ghost" size="icon" onClick={() => onNavigate('landing')} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
