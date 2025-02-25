"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{this.state.error?.message || "Something went wrong"}</p>
              <Button onClick={this.handleRetry}>Try again</Button>
            </CardContent>
          </Card>
        )
      )
    }

    return this.props.children
  }
}

