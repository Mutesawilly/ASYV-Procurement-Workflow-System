import { Card } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ title, value, change, changeType, icon: Icon, color = "#498160" }: StatCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  }[changeType];

  // Create a light version of the color for background
  const lightBg = `${color}15`;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="mt-1.5">{value}</p>
          <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>
        </div>
        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: lightBg }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </Card>
  );
}
