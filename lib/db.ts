import { supabase } from "./supabase"

// Define types
export type SortOption = "newest" | "oldest" | "mostLiked" | "mostResponses"

export interface Form {
  id: string
  title: string
  description: string | null
  questions: any[] // Assuming questions is an array of objects
  is_public: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  form_id: string
  user_id: string
  content: string
  created_at: string
  user?: {
    email: string
  }
}

// Database interaction functions
export async function createForm(data: {
  title: string
  description?: string
  isPublic: boolean
  userId: string
}): Promise<Form | null> {
  try {
    const { data: form, error } = await supabase
      .from("forms")
      .insert([
        {
          title: data.title,
          description: data.description,
          is_public: data.isPublic,
          user_id: data.userId,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return form
  } catch (error) {
    console.error("Error creating form:", error)
    return null
  }
}

export async function getUserForms(userId: string): Promise<Form[]> {
  try {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching user forms:", error)
    return []
  }
}

export async function getForm(id: string): Promise<Form | null> {
  try {
    const { data, error } = await supabase.from("forms").select("*").eq("id", id).single()

    if (error) throw error
    return data || null
  } catch (error) {
    console.error("Error fetching form:", error)
    return null
  }
}

export async function createComment(data: {
  formId: string
  userId: string
  content: string
}): Promise<Comment | null> {
  try {
    const { data: comment, error } = await supabase
      .from("comments")
      .insert([
        {
          form_id: data.formId,
          user_id: data.userId,
          content: data.content,
        },
      ])
      .select(`*, user:user_id(email)`)
      .single()

    if (error) throw error
    return comment
  } catch (error) {
    console.error("Error creating comment:", error)
    return null
  }
}

export async function getFormComments(formId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select(`*, user:user_id(email)`)
      .eq("form_id", formId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export async function toggleLike(formId: string, userId: string): Promise<boolean> {
  try {
    // Check if the user already liked the form
    const { data: existingLike, error: selectError } = await supabase
      .from("likes")
      .select("*")
      .eq("form_id", formId)
      .eq("user_id", userId)
      .single()

    if (selectError && selectError.code !== "404") {
      throw selectError
    }

    if (existingLike) {
      // Unlike the form
      const { error: deleteError } = await supabase.from("likes").delete().eq("form_id", formId).eq("user_id", userId)

      if (deleteError) throw deleteError
      return false
    } else {
      // Like the form
      const { error: insertError } = await supabase.from("likes").insert([
        {
          form_id: formId,
          user_id: userId,
        },
      ])

      if (insertError) throw insertError
      return true
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    throw error
  }
}

export async function getLikeCount(formId: string): Promise<number> {
  try {
    const { data, error } = await supabase.from("likes").select("count(*)", { count: "exact" }).eq("form_id", formId)

    if (error) throw error
    return data?.[0]?.count ?? 0
  } catch (error) {
    console.error("Error fetching like count:", error)
    return 0
  }
}

export async function checkIfLiked(formId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("likes")
      .select("*")
      .eq("form_id", formId)
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "404") {
      throw error
    }

    return !!data
  } catch (error) {
    console.error("Error checking if liked:", error)
    return false
  }
}

interface SearchFormsOptions {
  query?: string
  page?: number
  sortBy?: SortOption
  isPublic?: boolean
  limit?: number
}

interface SearchFormsResult {
  forms: Form[]
  totalPages: number
  currentPage: number
}

export async function searchForms(options: SearchFormsOptions): Promise<SearchFormsResult> {
  const { query = "", page = 1, sortBy = "newest", isPublic = true, limit = 12 } = options

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit - 1

  let dbQuery = supabase
    .from("forms")
    .select(`*, user:user_id(email), likes:likes(count), responses:responses(count)`, { count: "exact" })
    .ilike("title", `%${query}%`)
    .eq("is_public", isPublic)

  switch (sortBy) {
    case "newest":
      dbQuery = dbQuery.order("created_at", { ascending: false })
      break
    case "oldest":
      dbQuery = dbQuery.order("created_at", { ascending: true })
      break
    case "mostLiked":
      dbQuery = dbQuery.order("likes", { ascending: false }) // This might not work directly, needs a join or function
      break
    case "mostResponses":
      dbQuery = dbQuery.order("responses", { ascending: false }) // Same as mostLiked
      break
    default:
      dbQuery = dbQuery.order("created_at", { ascending: false })
  }

  const { data, error, count } = await dbQuery.range(startIndex, endIndex)

  if (error) {
    console.error("Error searching forms:", error)
    return { forms: [], totalPages: 0, currentPage: page }
  }

  const forms = data as Form[]

  const totalForms = count || 0
  const totalPages = Math.ceil(totalForms / limit)

  return {
    forms,
    totalPages,
    currentPage: page,
  }
}

