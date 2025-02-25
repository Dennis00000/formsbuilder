"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { AdminUser } from "@/lib/admin"

interface UserTableProps {
  initialUsers: AdminUser[]
  currentUserId: string
}

export function UserTable({ initialUsers, currentUserId }: UserTableProps) {
  const { toast } = useToast()
  const [users, setUsers] = useState(initialUsers)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  const handleRoleUpdate = async (userId: string, newRole: "admin" | "user") => {
    try {
      setUpdatingUserId(userId)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) throw new Error("Failed to update role")

      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

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

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete user")

      setUsers(users.filter((user) => user.id !== userId))
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setDeleteUserId(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Forms</TableHead>
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
                  onValueChange={(value) => handleRoleUpdate(user.id, value as "admin" | "user")}
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
              <TableCell>{user.forms_count}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteUserId(user.id)}
                  disabled={user.id === currentUserId}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

