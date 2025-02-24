import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search forms..." className="pl-8" />
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Start a new form</h2>
        <Card className="w-[200px] cursor-pointer hover:bg-accent transition-colors">
          <CardContent className="p-6 flex items-center justify-center min-h-[150px]">
            <Button variant="outline">Create blank form</Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Saved Recent Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-md mb-2" />
                <h3 className="font-medium">Form Template {i}</h3>
                <p className="text-sm text-muted-foreground">Last edited 2 days ago</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

