"use client";

import { type UseFormReturn } from "react-hook-form";
import { type OperationFormType } from "./editOperation";

import FieldFormCard from "./fieldFormCard";
import { type Operation } from "~/store/types";

interface Props {
  form: UseFormReturn<OperationFormType>;
  field: Operation["fields"][number];
  index: number;
  prefix?: string;
}

const FieldForm = ({ form, index, prefix = "fields", field }: Props) => {
  const fieldPath = `${prefix}.${index}`;
  const formField = form.watch(fieldPath as `fields.${number}`);

  const isLeaf = !formField.fields || formField.fields.length === 0;

  return isLeaf ? (
    <FieldFormCard
      form={form}
      index={index}
      prefix={prefix}
      formField={field}
    />
  ) : (
    <div className="flex flex-col gap-2">
      {formField?.fields?.map((_, childIndex: number) => {
        if (!("fields" in field)) return null;

        return (
          <div key={childIndex}>
            {field.path && (
              <div className="border-t border-black p-2">{field.path}</div>
            )}
            <FieldForm
              form={form}
              index={childIndex}
              prefix={`${fieldPath}.fields`}
              field={field.fields[childIndex]!}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FieldForm;
