import type { Meta, StoryObj } from "@storybook/react";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSeparator,
  FieldSet,
  FieldLegend,
  FieldTitle,
} from "@/components/ui/field";

const meta = {
  title: "UI/Field",
  component: Field,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="v-input">Username</FieldLabel>
      <input id="v-input" className="rounded-md border px-2 py-1 text-sm w-full" />
      <FieldDescription>Choose a unique username.</FieldDescription>
    </Field>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="h-input">
          <FieldTitle>Email</FieldTitle>
        </FieldLabel>
        <FieldContent>
          <input id="h-input" type="email" className="rounded-md border px-2 py-1 text-sm w-full" />
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field data-invalid="true">
      <FieldLabel htmlFor="err-input">Password</FieldLabel>
      <input id="err-input" type="password" className="rounded-md border px-2 py-1 text-sm w-full" />
      <FieldError errors={[{ message: "Password must be at least 8 characters." }]} />
    </Field>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="desc-input">Bio</FieldLabel>
      <textarea id="desc-input" className="rounded-md border px-2 py-1 text-sm w-full min-h-20" />
      <FieldDescription>Write a short bio about yourself.</FieldDescription>
    </Field>
  ),
};

export const FieldSetExample: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Personal info</FieldLegend>
      <Field>
        <FieldLabel htmlFor="fs-name">Name</FieldLabel>
        <input id="fs-name" className="rounded-md border px-2 py-1 text-sm w-full" />
      </Field>
      <FieldSeparator />
      <Field>
        <FieldLabel htmlFor="fs-email">Email</FieldLabel>
        <input id="fs-email" type="email" className="rounded-md border px-2 py-1 text-sm w-full" />
      </Field>
    </FieldSet>
  ),
};

export const SeparatorWithLabel: Story = {
  render: () => (
    <div className="w-64">
      <FieldSeparator>or</FieldSeparator>
    </div>
  ),
};
