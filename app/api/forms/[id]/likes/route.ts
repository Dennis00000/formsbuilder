import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select()
      .eq('form_id', params.id)
      .eq('user_id', session.user.id)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('form_id', params.id)
        .eq('user_id', session.user.id)

      if (error) throw error
      return NextResponse.json({ liked: false })
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert([
          {
            form_id: params.id,
            user_id: session.user.id,
          },
        ])

      if (error) throw error
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
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

    // Get like count
    const { count: likeCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact' })
      .eq('form_id', params.id)

    // Check if current user liked the form
    let isLiked = false
    if (session) {
      const { data } = await supabase
        .from('likes')
        .select()
        .eq('form_id', params.id)
        .eq('user_id', session.user.id)
        .single()
      isLiked = !!data
    }

    return NextResponse.json({
      count: likeCount,
      isLiked,
    })
  } catch (error) {
    console.error('Error getting likes:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 