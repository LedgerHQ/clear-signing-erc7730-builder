/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { type UseFormReturn } from "react-hook-form";
import { type OperationFormType } from "./editOperation";

import FieldFormCard from "./fieldFormCard";
import { Key } from "react";

interface Props {
  form: UseFormReturn<OperationFormType>;
  index: number;
  prefix?: string;
}

const FieldForm = ({ form, index, prefix = "fields" }: Props) => {
  const fieldPath = `${prefix}.${index}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formField = form.watch(fieldPath as any);

  // Check if the current field has nested fields
  const isLeaf = !formField.fields || formField.fields.length === 0;

  return isLeaf ? (
    <FieldFormCard form={form} index={index} prefix={prefix} />
  ) : (
    // Render nested fields recursively
    <div className="flex flex-col gap-2">
      {formField?.fields?.map((_: never, childIndex: number) => (
        <div key={childIndex}>
          {formField.path && (
            <div className="border-t border-black p-2">{formField.path}</div>
          )}
          <FieldForm
            form={form}
            index={childIndex}
            prefix={`${fieldPath}.fields`}
          />
        </div>
      ))}
    </div>
  );
};

export default FieldForm;
