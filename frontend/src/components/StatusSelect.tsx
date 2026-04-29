import type { ComponentPropsWithoutRef } from "react"
import { STATUS_OPTIONS } from "../lib/taskConstants"

interface Props extends ComponentPropsWithoutRef<"select"> {
  id: string
}

export default function StatusSelect({ id, ...selectProps }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        Status
      </label>
      <select
        id={id}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50"
        {...selectProps}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
