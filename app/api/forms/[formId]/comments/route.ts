import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { createComment, getFormComments } from "@/lib/db"

export async function POST(req: Request, { params }: { params: { formId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const comment = await createComment({
      content: json.content,
      formId: params.formId,
      userId: session.user.id,
    })

    return NextResponse.json(comment)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { formId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const comments = await getFormComments(params.formId, page)

    return NextResponse.json(comments)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

