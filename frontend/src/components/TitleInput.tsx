import type { ComponentPropsWithoutRef } from "react"

interface Props extends ComponentPropsWithoutRef<"input"> {
  id: string
  error?: string
}

export default function TitleInput({ id, error, ...inputProps }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        Title
      </label>
      <input
        id={id}
        type="text"
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50"
        {...inputProps}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
