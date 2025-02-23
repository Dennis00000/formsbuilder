import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className="grid grid-cols-[240px_1fr] min-h-screen">
      <aside className="border-r bg-muted/40 p-4 space-y-4">
        <div className="font-semibold mb-2">Admin Panel</div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            Forms
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Manage Users
          </Button>
        </nav>
      </aside>

      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
          </div>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Content Area</h2>
            <p className="text-muted-foreground">Admin dashboard content will be displayed here.</p>
          </Card>
        </div>
      </main>
    </div>
  )
}

