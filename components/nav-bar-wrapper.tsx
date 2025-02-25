'use client'

import { NavBar } from './nav-bar'
import type { User } from '@supabase/supabase-js'

export function NavBarWrapper({ user }: { user: User | null }) {
  return <NavBar user={user} />
} 