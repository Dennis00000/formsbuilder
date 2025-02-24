import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { createResponse, getFormResponses } from "@/lib/db"

export async function POST(req: Request, { params }: { params: { formId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const response = await createResponse({
      answers: json.answers,
      formId: params.formId,
      userId: session.user.id,
    })

    return NextResponse.json(response)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { formId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const responses = await getFormResponses(params.formId, page)

    return NextResponse.json(responses)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

