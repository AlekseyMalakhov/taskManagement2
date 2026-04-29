import { Field, FieldContent, FieldLabel, FieldTitle } from "./ui/field"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { PRIORITY_OPTIONS } from "../lib/taskConstants"

interface Props {
  defaultValue: string
  idPrefix: string
  onValueChange: (value: string) => void
}

export default function PriorityRadioGroup({ defaultValue, idPrefix, onValueChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Priority</p>
      <RadioGroup defaultValue={defaultValue} onValueChange={onValueChange} className="flex gap-2">
        {PRIORITY_OPTIONS.map((option) => (
          <FieldLabel key={option.value} htmlFor={`${idPrefix}-${option.value}`} className="flex-1">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{option.label}</FieldTitle>
              </FieldContent>
              <RadioGroupItem value={option.value} id={`${idPrefix}-${option.value}`} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </div>
  )
}
