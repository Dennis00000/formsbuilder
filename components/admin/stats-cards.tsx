"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, MessageSquare, Activity } from "lucide-react"
import type { AdminStats } from "@/lib/admin"

interface StatsCardsProps {
  initialStats: AdminStats
}

export function StatsCards({ initialStats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: initialStats.userCount,
      icon: Users,
    },
    {
      title: "Total Forms",
      value: initialStats.formCount,
      icon: FileText,
    },
    {
      title: "Total Responses",
      value: initialStats.responseCount,
      icon: MessageSquare,
    },
    {
      title: "Active Users",
      value: initialStats.activeUsers,
      icon: Activity,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

