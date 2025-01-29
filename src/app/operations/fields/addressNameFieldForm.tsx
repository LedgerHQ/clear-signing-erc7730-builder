import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { type UseFormReturn } from "react-hook-form";
import { type OperationFormType } from "../editOperation";

// Define schema
export const AddressNameParametersFormSchema = z.object({
  types: z
    .array(z.enum(["wallet", "eoa", "contract", "token", "collection"]))
    .nonempty("At least one address type must be selected."),
  sources: z
    .array(z.string().nonempty("Source cannot be empty."))
    .nonempty("At least one source must be added."),
});

interface Props {
  form: UseFormReturn<OperationFormType>;
  fieldPath: `fields.${number}`;
}

const AddressNameParametersForm = ({ form, fieldPath }: Props) => {
  const addressTypes = [
    {
      value: "wallet",
      description: "Address is an account controlled by the wallet",
    },
    { value: "eoa", description: "Address is an Externally Owned Account" },
    {
      value: "contract",
      description: "Address is a well-known smart contract",
    },
    { value: "token", description: "Address is a well-known ERC-20 token" },
    {
      value: "collection",
      description: "Address is a well-known NFT collection",
    },
  ];

  return (
    <Form {...form}>
      <div>to fix all of this </div>
      <div>test is connected </div>
      <FormField
        control={form.control}
        name={`${fieldPath}.params.types`}
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Address Type</FormLabel>
            <FormDescription>
              Select the types of addresses to display. This restricts allowable
              sources of names and may lead to additional checks from wallets.
            </FormDescription>
            <ToggleGroup
              type="multiple"
              className="mt-2 flex flex-wrap justify-start gap-2"
              value={field.value || []}
              onValueChange={(value) => field.onChange(value)}
            >
              {addressTypes.map(({ value }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="px-4 py-2 text-sm"
                >
                  {value}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {field.value?.length > 0 && (
              <ul className="mt-2 text-sm text-gray-500">
                {field.value.map((type) => (
                  <li key={type}>
                    <strong>{type}:</strong>{" "}
                    {
                      addressTypes.find((item) => item.value === type)
                        ?.description
                    }
                  </li>
                ))}
              </ul>
            )}
          </FormItem>
        )}
      />

      {/* Trusted Sources Field */}
      <FormField
        control={form.control}
        name={`${fieldPath}.params.sources`}
        render={({ field }) => {
          const handleAddSource = () =>
            field.onChange([...(field.value || []), ""]);
          const handleRemoveSource = (index: number) => {
            const updatedSources = (field.value || []).filter(
              (_, i) => i !== index,
            );
            field.onChange(updatedSources);
          };
          const handleSourceChange = (value: string, index: number) => {
            const updatedSources = [...(field.value || [])];
            updatedSources[index] = value;
            field.onChange(updatedSources);
          };

          return (
            <FormItem className="mb-4">
              <FormLabel>Trusted Sources</FormLabel>
              <FormDescription>
                Trusted sources for names, in order of preferences. Example
                values are local or ens.
              </FormDescription>
              <div className="space-y-2">
                {(field.value || []).map((source, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        value={source}
                        onChange={(e) =>
                          handleSourceChange(e.target.value, idx)
                        }
                        placeholder="Enter a trusted source"
                      />
                    </FormControl>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveSource(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                onClick={handleAddSource}
                className="mt-2"
              >
                Add Source
              </Button>
            </FormItem>
          );
        }}
      />
    </Form>
  );
};

export default AddressNameParametersForm;
