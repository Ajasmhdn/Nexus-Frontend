
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2, Database, ShieldCheck, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AuthCenter() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Pure UI Mock Logic
    setTimeout(() => {
      setIsLoading(false);
      toast({ 
        title: isLogin ? "Success" : "Welcome!", 
        description: isLogin ? "Logged in successfully (UI Demo)" : "Your account has been created (UI Demo)" 
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-[400px] shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Database className="text-white h-6 w-6" strokeWidth={1.5} />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline font-semibold text-slate-900">Nexus Access</CardTitle>
          <CardDescription>
            {isLogin ? 'Enter credentials to access platform' : 'Register with authorized User ID'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="userId">Authorized User ID</Label>
                <div className="relative">
                  <Input 
                    id="userId" 
                    placeholder="Enter your unique ID" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                    required 
                    className="pl-10"
                  />
                  <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isLogin ? <Mail className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-slate-500">
            {isLogin ? "Need access? " : "Already registered? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
