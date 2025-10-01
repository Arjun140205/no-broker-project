import * as React from "react"
import { cn } from "../../lib/utils"

export interface CalendarProps {
  className?: string
  selected?: Date
  onDateSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  mode?: 'single' | 'multiple' | 'range'
}

function Calendar({
  className,
  selected,
  onDateSelect,
  disabled,
  mode = 'single',
}: CalendarProps) {
  return (
    <div className={cn("p-3", className)}>
      <div className="text-center text-sm text-muted-foreground">
        Calendar component - Please use react-datepicker for date selection
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }