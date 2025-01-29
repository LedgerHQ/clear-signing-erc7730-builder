import { type UseFormReturn } from "react-hook-form";
import { Device } from "~/components/devices/device";
import { ReviewScreen } from "~/components/devices/reviewScreen";
import { getScreensForOperation } from "~/shared/getScreensForOperation";
import { type Operation } from "~/store/types";
import { type OperationFormType } from "./editOperation";
import { type FieldSchemaType } from "./editOperation";

interface Props {
  form: UseFormReturn<OperationFormType>;
}

export const getLeafFields = (fields: FieldSchemaType[]): FieldSchemaType[] => {
  const leafFields: FieldSchemaType[] = [];

  const extractLeafFields = (field: FieldSchemaType) => {
    if (!field.fields || field.fields.length === 0) {
      leafFields.push(field);
    } else {
      field.fields.forEach(extractLeafFields);
    }
  };

  fields.forEach(extractLeafFields);

  return leafFields;
};

const OperationScreens = ({ form }: Props) => {
  const { fields } = form.watch();

  if (fields.length === 0) return null;

  const leafFields = getLeafFields(fields);

  console.log("leafFields", leafFields);
  const screens = getScreensForOperation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    fields: leafFields.filter((field) => field.isIncluded) as any,
  });

  const totalPages = screens.length + 1;

  return (
    <div className="hidden flex-col items-center gap-4 md:flex">
      {screens.map((screen, index) => (
        <Device.Frame key={`review-screen-${index}`}>
          <ReviewScreen screen={screen} />
          <Device.Pagination current={index + 2} total={totalPages} />
        </Device.Frame>
      ))}
    </div>
  );
};

export default OperationScreens;
