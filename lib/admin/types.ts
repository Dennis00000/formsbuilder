export interface AdminStats {
  userCount: number
  formCount: number
  responseCount: number
  activeUsers: number
  totalStorage: number
}

export interface AdminUser {
  id: string
  email: string
  role: "admin" | "user"
  created_at: string
  last_sign_in_at: string | null
  forms_count: number
  responses_count: number
  storage_used: number
}

export interface AuditLog {
  id: string
  user_id: string
  action: "INSERT" | "UPDATE" | "DELETE"
  resource_type: string
  resource_id: string
  metadata: {
    old_data?: Record<string, any>
    new_data?: Record<string, any>
  }
  created_at: string
}

export interface StorageUsage {
  user_id: string
  size: number
  updated_at: string
}

