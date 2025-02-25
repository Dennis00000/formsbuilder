import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data, error } = await supabase
      .from('forms')
      .select('*, user:users(email), likes:likes(count), responses:responses(count)')
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!data) return new NextResponse('Not Found', { status: 404 })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching form:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json()
    const { title, description, questions, isPublic } = json

    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check ownership
    const { data: form } = await supabase
      .from('forms')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!form || form.user_id !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { data, error } = await supabase
      .from('forms')
      .update({
        title,
        description,
        questions,
        is_public: isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating form:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check ownership
    const { data: form } = await supabase
      .from('forms')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!form || form.user_id !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting form:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 