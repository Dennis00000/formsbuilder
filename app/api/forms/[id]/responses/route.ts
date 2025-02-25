import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json()
    const { answers } = json

    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    // Allow anonymous responses if form is public
    const { data: form } = await supabase
      .from('forms')
      .select('is_public')
      .eq('id', params.id)
      .single()

    if (!form?.is_public && !session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data, error } = await supabase
      .from('responses')
      .insert([
        {
          form_id: params.id,
          user_id: session?.user?.id || null,
          answers,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error submitting response:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user owns the form
    const { data: form } = await supabase
      .from('forms')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!form || form.user_id !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { data, error } = await supabase
      .from('responses')
      .select('*, user:users(email)')
      .eq('form_id', params.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching responses:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 