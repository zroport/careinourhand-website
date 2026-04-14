import * as React from "react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "type">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    data-slot="checkbox"
    className={cn(
      "size-4 shrink-0 rounded border border-input accent-[#620E87] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#620E87]/30 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
