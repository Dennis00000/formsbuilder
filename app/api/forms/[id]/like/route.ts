import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'
import { createServerClient } from '@supabase/ssr'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { error } = await supabase
      .from('form_likes')
      .insert({ form_id: params.id, user_id: user.id })

    if (error?.code === '23505') { // Unique violation
      await supabase
        .from('form_likes')
        .delete()
        .eq('form_id', params.id)
        .eq('user_id', user.id)
    } else if (error) {
      throw error
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Error liking form:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 