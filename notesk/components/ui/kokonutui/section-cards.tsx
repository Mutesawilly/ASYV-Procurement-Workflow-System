import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SectionCardsProps {
  totalBalance: number
  monthlyTransactions: number
  activeAccounts: number
  averageTransaction: number
}

export function SectionCards({
  totalBalance,
  monthlyTransactions,
  activeAccounts,
  averageTransaction,
}: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card flex gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 flex-wrap lg:flex-nowrap">
      <Card className="@container/card flex-1 min-w-0">
        <CardHeader>
          <CardDescription>Total Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">${totalBalance.toFixed(2)}</CardTitle>
          <div className="flex justify-end">
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Across all accounts</div>
        </CardFooter>
      </Card>
      <Card className="@container/card flex-1 min-w-0">
        <CardHeader>
          <CardDescription>Monthly Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{monthlyTransactions}</CardTitle>
          <div className="flex justify-end">
            <Badge variant="outline">
              <IconTrendingUp />
              +15%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Up 15% from last month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Activity increased</div>
        </CardFooter>
      </Card>
      <Card className="@container/card flex-1 min-w-0">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{activeAccounts}</CardTitle>
          <div className="flex justify-end">
            <Badge variant="outline">
              <IconTrendingUp />
              +2
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong account growth <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">All accounts performing well</div>
        </CardFooter>
      </Card>
      <Card className="@container/card flex-1 min-w-0">
        <CardHeader>
          <CardDescription>Average Transaction</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">${averageTransaction.toFixed(2)}</CardTitle>
          <div className="flex justify-end">
            <Badge variant="outline">
              <IconTrendingDown />
              -3%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Slight decrease <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Stable spending patterns</div>
        </CardFooter>
      </Card>
    </div>
  )
}
