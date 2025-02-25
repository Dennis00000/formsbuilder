import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Not Found</h2>
        <p>Could not find requested resource</p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
} 