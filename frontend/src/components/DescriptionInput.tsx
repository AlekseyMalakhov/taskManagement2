import type { ComponentPropsWithoutRef } from "react"

interface Props extends ComponentPropsWithoutRef<"textarea"> {
  id: string
}

export default function DescriptionInput({ id, ...textareaProps }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        Description
      </label>
      <textarea
        id={id}
        className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50"
        {...textareaProps}
      />
    </div>
  )
}
