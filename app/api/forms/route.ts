import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { createForm, searchForms } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const form = await createForm({
      title: json.title,
      description: json.description,
      questions: json.questions,
      isPublic: json.isPublic ?? false,
      userId: session.user.id,
    })

    return NextResponse.json(form)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const forms = await searchForms(query, page)

    return NextResponse.json(forms)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

