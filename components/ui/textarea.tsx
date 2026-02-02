import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'w-full min-h-[120px] py-3 px-4 text-base font-normal text-[#707070]',
        'bg-white rounded-[10px] border border-transparent',
        'shadow-[inset_3px_3px_5px_0_rgba(0,0,0,0.17)]',
        'outline-none transition-all duration-300',
        'placeholder:text-[#707070]/70',
        'resize-none',
        'hover:bg-[#fafbfc]',
        'focus:bg-white focus:border-primary focus:shadow-[inset_1.5px_1.5px_2px_0_rgba(0,0,0,0.07),0_0_0_1px_#187aed]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
