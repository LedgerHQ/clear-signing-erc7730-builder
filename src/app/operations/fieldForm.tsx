"use client";

import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type OperationFormType } from "./editOperation";
import { type Operation } from "~/store/types";
import FieldSelector from "./fields/fieldSelector";
import { Trash } from "lucide-react";
import OperationScreens from "./operationScreens";

interface Props {
  form: UseFormReturn<OperationFormType>;
  operation: Operation | null;
  field: Operation["fields"][number];
  index: number;
}

const FieldNotIncluded = ({
  form,
  index,
}: {
  form: UseFormReturn<OperationFormType>;
  index: number;
}) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-8">
    <div>
      This field is not included and will not be displayed to the user during
      their operation.
    </div>
    <FormField
      control={form.control}
      name={`fields.${index}.isIncluded`}
      render={({ field }) => (
        <Button onClick={() => field.onChange(true)}>Include</Button>
      )}
    />
  </div>
);

const FieldHeader = ({
  field,
  form,
  index,
}: {
  field: Operation["fields"][number];
  form: UseFormReturn<OperationFormType>;
  index: number;
}) => (
  <div className="flex items-center justify-between">
    <div>{field.path}</div>
    <FormField
      control={form.control}
      name={`fields.${index}.isIncluded`}
      render={({ field }) => (
        <Button variant="destructive" onClick={() => field.onChange(false)}>
          Remove
          <Trash />
        </Button>
      )}
    />
  </div>
);

const FieldLabelInput = ({
  form,
  index,
}: {
  form: UseFormReturn<OperationFormType>;
  index: number;
}) => (
  <FormField
    control={form.control}
    name={`fields.${index}.label`}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Field Name</FormLabel>
        <FormControl>
          <Input placeholder="Enter field name" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const FieldRequiredSwitch = ({
  form,
  index,
}: {
  form: UseFormReturn<OperationFormType>;
  index: number;
}) => (
  <FormField
    control={form.control}
    name={`fields.${index}.isRequired`}
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center gap-2">
          <FormLabel>Required</FormLabel>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </div>
        <p className="text-sm text-muted-foreground">
          The required key indicates which parameters wallets SHOULD display.
        </p>
      </FormItem>
    )}
  />
);

const FieldForm = ({ field, form, index, operation }: Props) => {
  const { isIncluded, path } = form.watch(`fields.${index}`);

  if (!operation) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        {!isIncluded ? (
          <FieldNotIncluded form={form} index={index} />
        ) : (
          <>
            <FieldHeader field={field} form={form} index={index} />
            <FieldLabelInput form={form} index={index} />
            <FieldRequiredSwitch form={form} index={index} />
            <FieldSelector field={field} form={form} index={index} />
          </>
        )}
      </div>
      <OperationScreens
        form={form}
        activeFieldPath={path}
        operation={operation}
      />
    </div>
  );
};

export default FieldForm;
