export const locales = ["en", "lt", "ru"] as const
export type Locale = (typeof locales)[number]

