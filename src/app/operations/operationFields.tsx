import { type UseFormReturn } from "react-hook-form";
import { type OperationFormType } from "./editOperation";
import { type Operation } from "~/store/types";

import OperationScreens from "./operationScreens";
import FieldForm from "./fieldForm";

interface Props {
  form: UseFormReturn<OperationFormType>;
  operationToEdit: Operation | null;
}

const OperationFields = ({ form, operationToEdit }: Props) => {
  if (!operationToEdit) return null;

  return (
    <div className="grid gap-2 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        {form.watch("fields").map((_, index) => (
          <FieldForm key={`field-${index}`} form={form} index={index} />
        ))}
      </div>
      <OperationScreens form={form} />
    </div>
  );
};

export default OperationFields;
