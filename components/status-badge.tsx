import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface StatusConfig {
  label: string
  icon: LucideIcon
  variant: "default" | "secondary" | "destructive" | "outline" | null | undefined
}

interface StatusBadgeProps<T extends string> {
  status: T
  config: Record<T, StatusConfig>
  className?: string
}

export function StatusBadge<T extends string>({ 
  status, 
  config,
  className 
}: StatusBadgeProps<T>) {
  const statusConfig = config[status]
  const Icon = statusConfig.icon

  return (
    <Badge
      variant={statusConfig.variant}
      className={cn("flex items-center gap-1", className)}
    >
      <Icon className="h-3 w-3" />
      {statusConfig.label}
    </Badge>
  )
} 