interface ErrorMessageProps {
  error: Error | unknown
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  const message = error instanceof Error ? error.message : "An error occurred"

  return (
    <div className="rounded-lg border border-destructive/50 p-4 text-destructive">
      <h2 className="font-semibold mb-2">Error</h2>
      <p>{message}</p>
    </div>
  )
}

