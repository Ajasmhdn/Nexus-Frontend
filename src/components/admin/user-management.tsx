
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Database, Trash2, Edit2, Plus, RefreshCcw } from 'lucide-react';

export function UserManagement() {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [users, setUsers] = useState<any[]>([
    { id: '1', email: 'admin@nexus.com', userId: 'ADMIN_01', role: 'admin' },
    { id: '2', email: 'manager@factory.com', userId: 'USER_88', role: 'user' }
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleInsert = () => {
    if (!email || !userId) {
      toast({ title: "Error", description: "Email and User ID are required", variant: "destructive" });
      return;
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      userId,
      role: userType
    };
    
    setUsers(prev => [...prev, newUser]);
    toast({ title: "Success", description: "User pre-authorized" });
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingId) return;
    setUsers(prev => prev.map(u => u.id === editingId ? { ...u, email, userId, role: userType } : u));
    toast({ title: "Success", description: "User authorization updated" });
    resetForm();
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({ title: "Deleted", description: "User authorization removed" });
  };

  const startEdit = (user: any) => {
    setEditingId(user.id);
    setEmail(user.email);
    setUserId(user.userId);
    setUserType(user.role);
  };

  const resetForm = () => {
    setEmail('');
    setUserId('');
    setUserType('user');
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 space-y-8">
      <Card className="shadow-xl border-slate-200">
        <CardHeader className="text-center border-b border-slate-50 pb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Database className="text-white h-6 w-6" strokeWidth={1.5} />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline font-semibold">Admin Access Management</CardTitle>
          <CardDescription>Manage authorized users and system permissions (Frontend Demo)</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="Enter user email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input 
                id="userId" 
                placeholder="Enter unique user ID" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Select User Role</Label>
            <Select value={userType} onValueChange={(val: any) => setUserType(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 justify-center border-t border-slate-50 pt-6">
          <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px]" onClick={handleInsert}>
            <Plus className="mr-2 h-4 w-4" /> Insert
          </Button>
          <Button variant="default" className="bg-amber-500 hover:bg-amber-600 text-white min-w-[100px]" onClick={resetForm}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]" onClick={handleUpdate} disabled={!editingId}>
            <Edit2 className="mr-2 h-4 w-4" /> Update
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-md border-slate-100">
        <CardHeader>
          <CardTitle className="text-lg">Authorized Access List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(user)}>
                      <Edit2 className="h-4 w-4 text-slate-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
