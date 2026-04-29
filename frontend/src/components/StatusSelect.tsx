import { useId, type ComponentPropsWithoutRef } from "react"
import { STATUS_OPTIONS } from "../lib/taskConstants"

type Props = ComponentPropsWithoutRef<"select">

export default function StatusSelect(selectProps: Props) {
  const id = useId()
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        Status
      </label>
      <select
        {...selectProps}
        id={id}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50"
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
