"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { updateUserRole } from "@/lib/roles"

interface User {
  id: string
  email: string
  role: string
  created_at: string
}

interface AdminDashboardProps {
  users: User[]
  currentUserId: string
}

export function AdminDashboard({ users, currentUserId }: AdminDashboardProps) {
  const { toast } = useToast()
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      setUpdatingUserId(userId)
      await updateUserRole(userId, newRole as "admin" | "user")

      toast({
        title: "Success",
        description: "User role updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setUpdatingUserId(null)
    }
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  defaultValue={user.role}
                  onValueChange={(value) => handleRoleUpdate(user.id, value)}
                  disabled={user.id === currentUserId}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {updatingUserId === user.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                ) : (
                  <Button variant="ghost" size="sm" disabled={user.id === currentUserId}>
                    Manage
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

