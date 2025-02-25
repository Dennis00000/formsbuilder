import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { title, description, questions, isPublic } = json

    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data, error } = await supabase
      .from('forms')
      .insert([
        {
          title,
          description,
          questions,
          is_public: isPublic,
          user_id: session.user.id,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating form:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const sort = searchParams.get('sort') || 'newest'
    const limit = 12
    const offset = (page - 1) * limit

    const supabase = createRouteHandlerClient<Database>({ cookies })

    let queryBuilder = supabase
      .from('forms')
      .select('*, user:users(email), likes:likes(count), responses:responses(count)', { count: 'exact' })
      .ilike('title', `%${query}%`)
      .eq('is_public', true)
      .range(offset, offset + limit - 1)

    switch (sort) {
      case 'oldest':
        queryBuilder = queryBuilder.order('created_at', { ascending: true })
        break
      case 'mostLiked':
        queryBuilder = queryBuilder.order('likes.count', { ascending: false })
        break
      case 'mostResponses':
        queryBuilder = queryBuilder.order('responses.count', { ascending: false })
        break
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
    }

    const { data, error, count } = await queryBuilder

    if (error) throw error

    return NextResponse.json({
      forms: data,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error('Error fetching forms:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 