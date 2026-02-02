import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full h-10 px-4 text-base font-normal text-[#707070]",
          "bg-[#fafbfc] rounded-xl border border-transparent",
          "shadow-[inset_2px_3px_6px_0_rgba(0,0,0,0.08)]",
          "outline-none transition-all duration-300",
          "placeholder:text-[#707070]/70",
          "hover:bg-[#f7f8fb]",
          "focus:bg-white focus:border-primary/20 focus:shadow-[inset_1px_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_#187aed]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
TextInput.displayName = "TextInput"

export { TextInput }
