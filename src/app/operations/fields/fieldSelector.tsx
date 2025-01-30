import { type UseFormReturn } from "react-hook-form";
import { type OperationFormType } from "../editOperation";
import DateFieldForm from "./dateFieldForm";
import { type Operation } from "~/store/types";
import RawFieldForm from "./rawFieldForm";
import CallDataFieldForm from "./callDataFieldForm";
import AmountFieldForm from "./amountFieldForm";
import { FormField, FormItem, FormLabel } from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type components } from "~/generate/api-types";
import TokenAmountFieldForm from "./tokenAmountFormField";
import NftNameParametersForm from "./nftNameFieldForm";
import AddressNameParametersForm from "./addressNameFieldForm";
import DurationFieldForm from "./durationFieldForm";
import UnitParametersForm from "./unitFieldForm";

interface Props {
  form: UseFormReturn<OperationFormType>;
  field: Operation["fields"][number];
  fieldPath: `fields.${number}`;
}

const FieldOption = ({ form, field, fieldPath }: Props) => {
  const format = form.watch(`${fieldPath}.format`);
  if (!("format" in field)) return <div>unknown field format</div>;

  if (format === "raw") {
    return <RawFieldForm />;
  }

  if (format === "amount") {
    return <AmountFieldForm />;
  }

  if (format === "tokenAmount") {
    return <TokenAmountFieldForm form={form} fieldPath={fieldPath} />;
  }

  if (format === "addressName") {
    return <AddressNameParametersForm form={form} fieldPath={fieldPath} />;
  }

  if (format === "calldata") {
    return <CallDataFieldForm />;
  }

  if (format === "nftName") {
    return <NftNameParametersForm form={form} fieldPath={fieldPath} />;
  }

  if (format === "date") {
    return <DateFieldForm form={form} fieldPath={fieldPath} />;
  }

  if (format === "duration") {
    return <DurationFieldForm />;
  }

  if (format === "unit") {
    return <UnitParametersForm form={form} fieldPath={fieldPath} />;
  }

  if (format === "enum") {
    return <div>todo enum</div>;
  }

  return <div>{format}</div>;
};

const possibleFormats: components["schemas"]["FieldFormat"][] = [
  "raw",
  "amount",
  "tokenAmount",
  "addressName",
  "calldata",
  "nftName",
  "date",
  "duration",
  "unit",
  "enum",
];

const FieldSelector = ({ form, field, fieldPath }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <FormField
        control={form.control}
        name={`${fieldPath}.format`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="mt-1">Field format</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? undefined}
            >
              <SelectTrigger className="h-8 w-full text-sm">
                <SelectValue placeholder="Select field value" />
              </SelectTrigger>
              <SelectContent>
                {possibleFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FieldOption form={form} fieldPath={fieldPath} field={field} />
    </div>
  );
};

export default FieldSelector;
