
"use client";

import React, { useState } from 'react';
import { Database, Zap, Shield, BarChart3, ChevronRight, Play, Server, Cpu, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthCenter } from '@/components/auth/auth-center';

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-slate-50">
        <Button 
          variant="ghost" 
          className="absolute top-8 left-8 text-slate-500 hover:text-slate-900"
          onClick={() => setShowAuth(false)}
        >
          <ChevronRight className="rotate-180 mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <AuthCenter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-body overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Database className="text-white h-6 w-6" strokeWidth={1.5} />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight">Nexus</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#solutions" className="hover:text-primary transition-colors">Solutions</a>
            <a href="#compliance" className="hover:text-primary transition-colors">Compliance</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-semibold" onClick={() => setShowAuth(true)}>Log in</Button>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-xl" onClick={() => setShowAuth(true)}>
              <Lock className="mr-2 h-4 w-4" /> Admin
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Zap className="h-3 w-3 fill-primary" />
              Next-Gen Operational Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-slate-900 leading-[1.1] tracking-tight">
              Bridge Natural Language to <span className="text-primary">Industrial SQL</span>.
            </h1>
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
              Query massive operational datasets using plain English. Nexus maps complex industrial schemas to accurate SQL queries in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-2xl shadow-primary/20 text-lg font-semibold" onClick={() => setShowAuth(true)}>
                <Lock className="mr-2 h-5 w-5" /> Admin Portal
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 border-slate-200 hover:bg-slate-50 rounded-xl text-lg font-semibold">
                <Play className="mr-2 h-4 w-4 fill-slate-900" /> Watch Demo
              </Button>
            </div>
          </div>
          <div className="relative lg:h-[600px] animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2.5rem] blur-3xl" />
            <div className="relative h-full bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden p-4">
              <div className="flex items-center gap-2 mb-4 px-4 py-2 border-b border-slate-800">
                <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
              </div>
              <div className="space-y-4 p-4 font-code text-sm">
                <div className="text-emerald-400 flex gap-4">
                  <span className="text-slate-600">01</span>
                  <span>SELECT machine_id, downtime_minutes</span>
                </div>
                <div className="text-emerald-400 flex gap-4">
                  <span className="text-slate-600">02</span>
                  <span>FROM factory_logs</span>
                </div>
                <div className="text-emerald-400 flex gap-4">
                  <span className="text-slate-600">03</span>
                  <span>WHERE status = 'FAILURE'</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-headline font-bold text-slate-900 tracking-tight">Enterprise Data Intelligence</h2>
            <p className="text-lg text-slate-500">Powerful tools designed for complex industrial environments.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Real-time Mapping",
                desc: "AI-driven translation layer that understands complex table relationships."
              },
              {
                icon: Shield,
                title: "Security & Compliance",
                desc: "Role-based access control and detailed audit logs."
              },
              {
                icon: BarChart3,
                title: "Operational Analytics",
                desc: "Visualize generated query results instantly."
              }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <f.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
