
"use client";

import React, { useState } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const db = useFirestore();
  const { toast } = useToast();
  
  const authorizedUsersQuery = collection(db, 'authorized_users');
  const { data: authorizedUsers, loading } = useCollection<any>(authorizedUsersQuery);

  const handleInsert = async () => {
    if (!email || !userId) {
      toast({ title: "Error", description: "Email and User ID are required", variant: "destructive" });
      return;
    }
    
    try {
      await addDoc(collection(db, 'authorized_users'), {
        email,
        userId,
        role: userType
      });
      toast({ title: "Success", description: "User pre-authorized" });
      resetForm();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      await updateDoc(doc(db, 'authorized_users', editingId), {
        email,
        userId,
        role: userType
      });
      toast({ title: "Success", description: "User authorization updated" });
      resetForm();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'authorized_users', id));
      toast({ title: "Deleted", description: "User authorization removed" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
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
    <div className="w-full max-w-4xl space-y-8">
      <Card className="shadow-xl border-slate-200">
        <CardHeader className="text-center border-b border-slate-50 pb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Database className="text-white h-6 w-6" strokeWidth={1.5} />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline font-semibold">CRUD with Firebase</CardTitle>
          <CardDescription>Manage authorized users and system access</CardDescription>
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
            <Label>Select User-Type</Label>
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
          <Button variant="default" className="bg-amber-500 hover:bg-amber-600 text-white min-w-[100px]" onClick={() => resetForm()}>
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
              {authorizedUsers.map((user) => (
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
              {authorizedUsers.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                    No authorized users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
