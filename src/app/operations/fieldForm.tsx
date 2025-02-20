"use client";

import { Card } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type OperationFormType } from "./editOperation";
import { type Operation } from "~/store/types";
import FieldSelector from "./fields/fieldSelector";
import { Button } from "~/components/ui/button";
import { Trash } from "lucide-react";
import OperationScreens from "./operationScreens";

interface Props {
  form: UseFormReturn<OperationFormType>;
  operation: Operation | null;
  field: Operation["fields"][number];
  index: number;
}

const FieldForm = ({ field, form, index, operation }: Props) => {
  const { isIncluded, path } = form.watch(`fields.${index}`);

  if (!operation) return null;

  if (!isIncluded) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 p-7">
        <div>
          This field is not included and will not be displayed to the user
          during his operation.
        </div>
        <div>
          <FormField
            control={form.control}
            name={`fields.${index}.isIncluded`}
            render={({ field }) => (
              <Button onClick={() => field.onChange(true)}>Include</Button>
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>{field.path}</div>
          <FormField
            control={form.control}
            name={`fields.${index}.isIncluded`}
            render={({ field }) => (
              <Button
                variant={"destructive"}
                onClick={() => field.onChange(false)}
              >
                Remove
                <Trash />
              </Button>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={`fields.${index}.label`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`fields.${index}.isRequired`}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Required</FormLabel>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
              <FormDescription>
                The required key indicates which parameters wallets SHOULD
                display.
              </FormDescription>
            </FormItem>
          )}
        />
        <FieldSelector field={field} form={form} index={index} />
      </div>
      <div>
        <OperationScreens
          form={form}
          activeFieldPath={path}
          operation={operation}
        />
      </div>
    </div>
  );
};
export default FieldForm;
