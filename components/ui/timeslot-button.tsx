import { cn } from "@/lib/utils"

interface TimeslotButtonProps {
  time: string
  price?: number
  available: boolean
  selected: boolean
  onClick: () => void
}

export function TimeslotButton({ time, price, available, selected, onClick }: TimeslotButtonProps) {
  return (
    <button
      disabled={!available}
      onClick={onClick}
      className={cn(
        "w-full py-2.5 px-1.5 text-xs font-semibold rounded-xl border transition-all duration-300",
        "text-center whitespace-nowrap overflow-hidden text-ellipsis leading-normal",
        selected
          ? "bg-primary/10 border-primary text-primary shadow-md cursor-pointer"
          : "bg-white text-[rgba(0,0,0,0.54)] border-[#d7d7d7]",
        available && !selected && "hover:border-primary hover:text-primary cursor-pointer",
        !available && "cursor-not-allowed bg-[#f4f4f4] text-[#b0adad] border-[#d7d7d7]",
      )}
    >
      {time}{price !== undefined && ` | €${price.toFixed(2)}`}
    </button>
  )
}
