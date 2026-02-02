import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full min-h-[120px] py-3 px-4 text-base font-normal text-[#707070]",
          "bg-[#fafbfc] rounded-[10px] border border-transparent",
          "shadow-[inset_3px_3px_5px_0_rgba(0,0,0,0.08)]",
          "outline-none transition-all duration-300",
          "placeholder:text-[#707070]/70",
          "resize-none",
          "hover:bg-[#f7f8fb]",
          "focus:bg-white focus:border-primary/20 focus:shadow-[inset_1.5px_1.5px_2px_0_rgba(0,0,0,0.07),0_0_0_1px_#187aed]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
TextArea.displayName = "TextArea"

export { TextArea }
