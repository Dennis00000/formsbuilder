import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const t = useTranslations()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-4">{t("error.notFound.title")}</h1>
      <p className="text-muted-foreground mb-8">{t("error.notFound.description")}</p>
      <Button asChild>
        <a href="/">{t("error.notFound.backHome")}</a>
      </Button>
    </div>
  )
} 