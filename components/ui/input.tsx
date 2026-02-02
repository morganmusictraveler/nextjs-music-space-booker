import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full h-10 px-4 text-base font-normal text-[#707070]',
        'bg-white rounded-xl border border-transparent',
        'shadow-[inset_2px_3px_6px_0_rgba(0,0,0,0.16)]',
        'outline-none transition-all duration-300',
        'placeholder:text-[#707070]/70',
        'hover:bg-[#fafbfc]',
        'focus:bg-white focus:border-primary focus:shadow-[inset_1px_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_#187aed]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
