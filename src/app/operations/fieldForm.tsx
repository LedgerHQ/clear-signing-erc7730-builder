"use client";

import { Card } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type OperationFormType } from "./editOperation";
import { type Operation } from "~/store/types";

import { Collapsible, CollapsibleContent } from "~/components/ui/collapsible";

interface Props {
  form: UseFormReturn<OperationFormType>;
  field: Operation["fields"][number];
  index: number;
}

const FieldForm = ({ field, form, index }: Props) => {
  return (
    <Card key={field.path} className="p-4">
      <div className="flex items-center justify-between">
        <div>{field.path}</div>
        <FormField
          control={form.control}
          name={`field.${index}.isIncluded`}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>
      <Collapsible open={form.watch(`field.${index}.isIncluded`)}>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
          <FormField
            control={form.control}
            name={`field.${index}.label`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operation name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of the transaction Operation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
export default FieldForm;
