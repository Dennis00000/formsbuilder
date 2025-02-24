import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { toggleLike, getLikes, hasLiked } from "@/lib/db"

export async function POST(req: Request, { params }: { params: { formId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const isLiked = await toggleLike(params.formId, session.user.id)
    const likesCount = await getLikes(params.formId)

    return NextResponse.json({ isLiked, likesCount })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { formId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const [likesCount, isLiked] = await Promise.all([
      getLikes(params.formId),
      session ? hasLiked(params.formId, session.user.id) : false,
    ])

    return NextResponse.json({ likesCount, isLiked })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

