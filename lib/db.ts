import { kv } from "@vercel/kv"

export type User = {
  id: string
  name: string | null
  email: string
  password?: string
  image?: string
  createdAt: string
}

export type Form = {
  id: string
  title: string
  description?: string
  questions: Question[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export type Question = {
  id: string
  type: "text" | "choice" | "multipleChoice"
  title: string
  options?: string[]
}

export type Response = {
  id: string
  answers: Record<string, any>
  createdAt: string
  formId: string
  userId: string
}

export type Comment = {
  id: string
  content: string
  createdAt: string
  formId: string
  userId: string
}

export type Like = {
  formId: string
  userId: string
  createdAt: string
}

// User operations
export async function createUser(userData: Omit<User, "id" | "createdAt">) {
  const id = crypto.randomUUID()
  const user: User = {
    ...userData,
    id,
    createdAt: new Date().toISOString(),
  }

  await kv.hset(`user:${id}`, user)
  await kv.set(`user:email:${userData.email}`, id)

  return user
}

export async function getUserByEmail(email: string) {
  const userId = await kv.get<string>(`user:email:${email}`)
  if (!userId) return null

  return kv.hgetall<User>(`user:${userId}`)
}

export async function getUserById(id: string) {
  return kv.hgetall<User>(`user:${id}`)
}

// Form operations
export async function createForm(formData: Omit<Form, "id" | "createdAt" | "updatedAt">) {
  const id = crypto.randomUUID()
  const form: Form = {
    ...formData,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await kv.hset(`form:${id}`, form)
  await kv.zadd(`user:${formData.userId}:forms`, {
    score: Date.now(),
    member: id,
  })

  if (form.isPublic) {
    await kv.zadd("public:forms", {
      score: Date.now(),
      member: id,
    })
  }

  return form
}

export async function getForm(id: string) {
  return kv.hgetall<Form>(`form:${id}`)
}

export async function getUserForms(userId: string, page = 1, limit = 10) {
  const start = (page - 1) * limit
  const end = start + limit - 1

  const formIds = await kv.zrange<string[]>(`user:${userId}:forms`, start, end)
  const forms = await Promise.all(formIds.map((id) => kv.hgetall<Form>(`form:${id}`)))

  return forms.filter(Boolean)
}

export async function searchForms(query: string, page = 1, limit = 10) {
  const start = (page - 1) * limit
  const end = start + limit - 1

  const formIds = await kv.zrange<string[]>("public:forms", start, end)
  const forms = await Promise.all(formIds.map((id) => kv.hgetall<Form>(`form:${id}`)))

  return forms
    .filter(Boolean)
    .filter(
      (form) =>
        form.title.toLowerCase().includes(query.toLowerCase()) ||
        form.description?.toLowerCase().includes(query.toLowerCase()),
    )
}

// Response operations
export async function createResponse(responseData: Omit<Response, "id" | "createdAt">) {
  const id = crypto.randomUUID()
  const response: Response = {
    ...responseData,
    id,
    createdAt: new Date().toISOString(),
  }

  await kv.hset(`response:${id}`, response)
  await kv.zadd(`form:${responseData.formId}:responses`, {
    score: Date.now(),
    member: id,
  })

  return response
}

export async function getFormResponses(formId: string, page = 1, limit = 10) {
  const start = (page - 1) * limit
  const end = start + limit - 1

  const responseIds = await kv.zrange<string[]>(`form:${formId}:responses`, start, end)
  const responses = await Promise.all(responseIds.map((id) => kv.hgetall<Response>(`response:${id}`)))

  return responses.filter(Boolean)
}

// Comment operations
export async function createComment(commentData: Omit<Comment, "id" | "createdAt">) {
  const id = crypto.randomUUID()
  const comment: Comment = {
    ...commentData,
    id,
    createdAt: new Date().toISOString(),
  }

  await kv.hset(`comment:${id}`, comment)
  await kv.zadd(`form:${commentData.formId}:comments`, {
    score: Date.now(),
    member: id,
  })

  return comment
}

export async function getFormComments(formId: string, page = 1, limit = 10) {
  const start = (page - 1) * limit
  const end = start + limit - 1

  const commentIds = await kv.zrange<string[]>(`form:${formId}:comments`, start, end)
  const comments = await Promise.all(commentIds.map((id) => kv.hgetall<Comment>(`comment:${id}`)))

  return comments.filter(Boolean)
}

// Like operations
export async function toggleLike(formId: string, userId: string) {
  const key = `form:${formId}:likes`
  const exists = await kv.sismember(key, userId)

  if (exists) {
    await kv.srem(key, userId)
    return false
  } else {
    await kv.sadd(key, userId)
    return true
  }
}

export async function getLikes(formId: string) {
  return kv.scard(`form:${formId}:likes`)
}

export async function hasLiked(formId: string, userId: string) {
  return kv.sismember(`form:${formId}:likes`, userId)
}

