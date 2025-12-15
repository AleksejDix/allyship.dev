import { Badge } from "@workspace/ui/components/badge"
import { CheckCircle2, XCircle, AlertTriangle, Circle, Clock } from "lucide-react"

type ControlStatusBadgeProps = {
  status: string
}

export function ControlStatusBadge({ status }: ControlStatusBadgeProps) {
  const statusConfig = {
    pass: {
      label: "Pass",
      variant: "default" as const,
      icon: CheckCircle2,
      className: "bg-green-100 text-green-800 border-green-200",
    },
    fail: {
      label: "Fail",
      variant: "destructive" as const,
      icon: XCircle,
      className: "bg-red-100 text-red-800 border-red-200",
    },
    warning: {
      label: "Warning",
      variant: "outline" as const,
      icon: AlertTriangle,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    not_checked: {
      label: "Not Checked",
      variant: "secondary" as const,
      icon: Circle,
      className: "bg-gray-100 text-gray-800 border-gray-200",
    },
    pending: {
      label: "Pending",
      variant: "outline" as const,
      icon: Clock,
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_checked
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  )
}
