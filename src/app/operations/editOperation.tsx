import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useErc7730Store } from "~/store/erc7730Provider";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import OperationInformation from "./operationInformation";
import OperationFields from "./operationFields";
import { DateFieldFormSchema } from "./fields/dateFieldForm";
import { useEffect } from "react";
import { TokenAmountFieldFormSchema } from "./fields/tokenAmountFormField";
import { NftNameParametersFormSchema } from "./fields/nftNameFieldForm";
import { AddressNameParametersFormSchema } from "./fields/addressNameFieldForm";
import { UnitParametersFormSchema } from "./fields/unitFieldForm";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ValidOperationButton from "./validOperationButton";
import ReviewOperationsButton from "./reviewOperationsButton";

const BaseFieldSchema = z.object({
  label: z.string().nullable().optional(),
  format: z.union([
    z.enum([
      "raw",
      "addressName",
      "calldata",
      "amount",
      "tokenAmount",
      "nftName",
      "date",
      "duration",
      "unit",
      "enum",
    ]),
    z.null(),
    z.undefined(),
  ]),
  params: z.union([
    DateFieldFormSchema,
    TokenAmountFieldFormSchema,
    NftNameParametersFormSchema,
    AddressNameParametersFormSchema,
    UnitParametersFormSchema,
    z.object({}).strict(),
  ]),
  isIncluded: z.boolean(),
});

export type FieldSchemaType = z.infer<typeof BaseFieldSchema> & {
  fields?: FieldSchemaType[];
};

const FieldSchema: z.ZodType<FieldSchemaType> = BaseFieldSchema.extend({
  fields: z.lazy(() => z.array(FieldSchema)).optional(),
});

const OperationFormSchema = z.object({
  intent: z.string().min(1, {
    message: "Please enter the intent of the operation.",
  }),
  fields: z.array(FieldSchema),
});

export type OperationFormType = z.infer<typeof OperationFormSchema>;

interface Props {
  selectedOperation: string;
}
const EditOperation = ({ selectedOperation }: Props) => {
  const operationToEdit = useErc7730Store((s) => s.getOperationsByName)(
    selectedOperation,
  );
  const operationValidated = useErc7730Store((s) => s.getFinalOperationByName)(
    selectedOperation,
  );
  const operationMetadata = useErc7730Store((s) => s.getOperationsMetadata)(
    selectedOperation,
  );

  const setOperationData = useErc7730Store((s) => s.setOperationData);

  const router = useRouter();

  // const toot = useErc7730Store((s) => s.generatedErc7730);
  // console.log("toto", toot);

  const form = useForm<OperationFormType>({
    resolver: zodResolver(OperationFormSchema),
    defaultValues: {
      intent: "",
      fields: [],
    },
  });

  useEffect(() => {
    if (!operationToEdit) return;

    const defaultValues = {
      intent:
        typeof operationToEdit.intent === "string"
          ? operationToEdit.intent
          : "",
      fields: operationToEdit.fields.map((field) => ({
        ...field,
        isIncluded:
          operationValidated === null
            ? true
            : !!operationValidated.fields.find((f) => f.path === field.path),
      })),
    };

    form.reset(defaultValues);
  }, [operationToEdit, form, operationValidated]);

  if (!selectedOperation) return null;

  function onSubmit() {
    const { intent, fields } = form.getValues();

    console.log("fields", fields);

    const processedFields = fields
      .filter((field) => field.isIncluded)
      .map(({ isIncluded, ...rest }) => rest);

    setOperationData(
      selectedOperation,
      {
        intent,
        fields,
      },
      {
        intent,
        fields: processedFields,
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <OperationInformation
          form={form}
          operationMetadata={operationMetadata}
        />
        <OperationFields form={form} operationToEdit={operationToEdit} />
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          {operationToEdit && (
            <ReviewOperationsButton
              form={form}
              operation={operationToEdit}
              operationMetadata={operationMetadata}
            />
          )}
          <ValidOperationButton onClick={onSubmit} />
          <Button onClick={() => router.push("/review")}>
            review <ArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditOperation;
