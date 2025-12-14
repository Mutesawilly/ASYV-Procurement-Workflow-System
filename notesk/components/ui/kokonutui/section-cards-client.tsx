"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"

type CardData = {
  id: string
  title: string
  value: string
  subtitle?: string
  percentage?: number | null
}

interface SectionCardsClientProps {
  cards: CardData[]
}

export default function SectionCardsClient({ cards }: SectionCardsClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const isPositive = (card.percentage ?? 0) >= 0
        const TrendIcon = isPositive ? TrendingUp : TrendingDown
        const percentageText = card.percentage !== null && card.percentage !== undefined
          ? `${isPositive ? '+' : ''}${card.percentage.toFixed(1)}%`
          : null

        return (
          <Card key={card.id} className="group hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-3">
              <div className="flex justify-end">
                {percentageText && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <TrendIcon className="size-3" />
                    {percentageText}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold tabular-nums">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
