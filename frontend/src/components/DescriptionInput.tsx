import { useId, type ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"textarea">;

export default function DescriptionInput(textareaProps: Props) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        Description
      </label>
      <textarea
        {...textareaProps}
        id={id}
        className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50"
      />
    </div>
  );
}
