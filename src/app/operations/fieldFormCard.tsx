"use client";

import { Card } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type OperationFormType } from "./editOperation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronsDown } from "lucide-react";
import FieldSelector from "./fields/fieldSelector";
import { type Operation } from "~/store/types";

interface Props {
  form: UseFormReturn<OperationFormType>;
  index: number;
  prefix: string;
  formField: Operation["fields"][number];
}

const FieldFormCard = ({ form, index, prefix, formField }: Props) => {
  const fieldPath = `${prefix}.${index}` as `fields.${number}`;

  console.log("formField", formField);
  console.log("fieldPath", fieldPath);

  return (
    <Card key={`card-leaf-${index}`} className="flex flex-col gap-2 px-3 py-2">
      <div className="flex items-center justify-between">
        <div>{formField.path}</div>
        <FormField
          control={form.control}
          name={`${fieldPath}.isIncluded`}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={`${fieldPath}.label`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="Enter label"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Collapsible className="py-3">
        <CollapsibleTrigger className="group flex w-full items-center justify-center gap-2 text-neutral-300">
          <span className="text-sm">
            <span className="transition group-data-[state='open']:hidden">
              Show options
            </span>
            <span className="transition group-data-[state='closed']:hidden">
              Hide options
            </span>
          </span>
          <ChevronsDown className="size-4 text-center transition group-data-[state='open']:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <FieldSelector field={formField} form={form} fieldPath={fieldPath} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default FieldFormCard;
