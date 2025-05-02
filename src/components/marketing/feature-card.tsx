import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slate-800 mb-4">{icon}</div>
        <CardTitle className="text-lg text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
