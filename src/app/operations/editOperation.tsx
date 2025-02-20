import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useErc7730Store } from "~/store/erc7730Provider";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import OperationInformation from "./operationInformation";
import OperationFields from "./operationFields";
import { DateFieldFormSchema } from "./fields/dateFieldForm";
import { useEffect, useState } from "react";
import { TokenAmountFieldFormSchema } from "./fields/tokenAmountFormField";
import { NftNameParametersFormSchema } from "./fields/nftNameFieldForm";
import { AddressNameParametersFormSchema } from "./fields/addressNameFieldForm";
import { UnitParametersFormSchema } from "./fields/unitFieldForm";
import { useRouter } from "next/navigation";
import ValidOperationButton from "./validOperationButton";
import ReviewOperationsButton from "./reviewOperationsButton";
import { convertOperationToSchema } from "~/lib/convertOperationToSchema";
import { updateOperationFromSchema } from "~/lib/updateOperationFromSchema";
import { removeExcludedFields } from "~/lib/removeExcludedFields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import FieldForm from "./fieldForm";
import { Button } from "~/components/ui/button";
import useOperationStore from "~/store/useOperationStore";
import { Slash } from "lucide-react";

const FieldParams = z.union([
  DateFieldFormSchema,
  TokenAmountFieldFormSchema,
  NftNameParametersFormSchema,
  AddressNameParametersFormSchema,
  UnitParametersFormSchema,
  z.null(),
  z.object({}).strict(),
]);

export type ParamsType = z.infer<typeof FieldParams>;

const OperationFormSchema = z.object({
  intent: z.string().min(1, {
    message: "Please enter the intent of the operation.",
  }),
  fields: z.array(
    z.object({
      label: z.string(),
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
      params: FieldParams,
      path: z.string(),
      isRequired: z.boolean(),
      isIncluded: z.boolean(),
    }),
  ),
});

export type OperationFormType = z.infer<typeof OperationFormSchema>;

interface Props {
  selectedOperation: string;
}
const EditOperation = ({ selectedOperation }: Props) => {
  const operationToEdit = useErc7730Store((s) => s.getOperationsByName)(
    selectedOperation,
  );

  const operationMetadata = useErc7730Store((s) => s.getOperationsMetadata)(
    selectedOperation,
  );

  const setOperationData = useErc7730Store((s) => s.setOperationData);
  const saveOperationData = useErc7730Store((s) => s.saveOperationData);

  const setUpdatedOperation = useOperationStore(
    (state) => state.setUpdatedOperation,
  );

  const form = useForm<OperationFormType>({
    resolver: zodResolver(OperationFormSchema),
    mode: "onChange",
    defaultValues: {
      intent: "",
      fields: [],
    },
  });

  const { watch } = form;

  const formSteps = watch("fields").map((field) => field.path);
  const [step, setStep] = useState("intent");

  useEffect(() => {
    if (!operationToEdit) return;
    console.log("operationToEdit", operationToEdit);
    const defaultValues = convertOperationToSchema(operationToEdit);

    console.log("defaultValues", defaultValues);
    form.reset(defaultValues);
  }, [operationToEdit, form]);

  useEffect(() => {
    const subscription = watch(() => {
      const { intent, fields } = form.getValues();

      if (!operationToEdit) return;

      const updatedOperation = updateOperationFromSchema(operationToEdit, {
        intent,
        fields,
      });

      setUpdatedOperation(selectedOperation);
      saveOperationData(selectedOperation, updatedOperation);
    });
    return () => subscription.unsubscribe();
  }, [
    form,
    operationToEdit,
    saveOperationData,
    selectedOperation,
    watch,
    setUpdatedOperation,
  ]);

  if (!selectedOperation) return null;

  function onSubmit() {
    const { intent, fields } = form.getValues();

    if (!operationToEdit) return;

    const updatedOperation = updateOperationFromSchema(operationToEdit, {
      intent,
      fields,
    });

    setOperationData(
      selectedOperation,
      updatedOperation,
      removeExcludedFields(updatedOperation),
    );
  }

  return (
    <>
      <div className="mb-10 flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">{selectedOperation}</h1>
        <ValidOperationButton
          isValid={form.formState.isValid}
          onClick={form.handleSubmit(onSubmit)}
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Tabs
            defaultValue="tab1"
            orientation="horizontal"
            value={step}
            onValueChange={(value) => setStep(value)}
          >
            <TabsList className="flew-row mb-6 flex items-center gap-2">
              {["intent", ...formSteps].map((step, index) => (
                <>
                  <TabsTrigger
                    className="focus:outline-none data-[state=inactive]:text-neutral-300 dark:data-[state=inactive]:text-neutral-500"
                    value={step}
                    key={step}
                  >
                    {step}
                  </TabsTrigger>
                  {index !== formSteps.length && <Slash className="h-4" />}
                </>
              ))}
            </TabsList>
            <TabsContent value="intent">
              <OperationInformation
                form={form}
                operationMetadata={operationMetadata}
              />
              <Button onClick={() => formSteps[0] && setStep(formSteps[0])}>
                Continue
              </Button>
            </TabsContent>
            {form.watch("fields").map((field, index) => (
              <TabsContent value={field.path} key={field.path}>
                <FieldForm
                  field={field}
                  form={form}
                  index={index}
                  operation={operationToEdit}
                />
                <div className="mt-4 flex justify-between">
                  <Button
                    onClick={() =>
                      index > 0
                        ? setStep(formSteps[index - 1] ?? "intent")
                        : setStep("intent")
                    }
                  >
                    Previous
                  </Button>

                  {index < formSteps.length - 1 && (
                    <Button onClick={() => setStep(formSteps[index + 1] ?? "")}>
                      Next
                    </Button>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </form>
      </Form>
    </>
  );
};

export default EditOperation;
