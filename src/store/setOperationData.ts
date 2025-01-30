// setOperationData.ts
import { type FieldSchemaType } from "~/app/operations/editOperation";
import { type Erc7730Store } from "./erc7730Store";
import { type Erc7730 } from "./types";

const formatOperationData = (
  {
    generatedErc7730,
    finalErc7730,
  }: { generatedErc7730: Erc7730; finalErc7730: Erc7730 },
  operationName: string,
  intent: string,
  formField: FieldSchemaType[],
) => {
  // Type for fields excluding `isIncluded`
  type FilteredFieldSchemaType = Omit<FieldSchemaType, "isIncluded">;

  // Recursive function to remove `isIncluded` and process nested fields correctly
  const filterFields = (
    fieldList: FieldSchemaType[],
  ): FilteredFieldSchemaType[] => {
    return fieldList
      .filter((field) => field.isIncluded) // Remove fields where isIncluded is false
      .map(({ isIncluded, fields, ...rest }) => ({
        ...rest, // Spread remaining properties (omitting isIncluded)
        fields: fields && fields.length > 0 ? filterFields(fields) : undefined, // Ensure nested fields are handled correctly
      })) as FilteredFieldSchemaType[]; // Type assertion to satisfy TypeScript
  };

  // Get the original fields from the mockERC
  const originalFields =
    generatedErc7730.display.formats[operationName]?.fields || [];

  // Process fields before filtering
  const processedFields = formField.map((field, index) => ({
    ...originalFields[index],
    ...field,
  }));

  // Remove `isIncluded` property for `generatedErc7730` fields
  const generatedFields = processedFields.map(
    ({ isIncluded, ...rest }) => rest,
  );

  const filteredFields = filterFields(processedFields);

  const currentState = {
    ...generatedErc7730,
    display: {
      ...generatedErc7730.display,
      formats: {
        ...generatedErc7730.display.formats,
        [operationName]: {
          ...generatedErc7730.display.formats[operationName],
          intent,
          fields: generatedFields,
        },
      },
    },
  };

  const currentFinalState = {
    ...finalErc7730,
    display: {
      ...finalErc7730.display,
      formats: {
        ...finalErc7730.display.formats,
        [operationName]: {
          ...finalErc7730.display.formats[operationName],
          intent,
          fields: filteredFields,
        },
      },
    },
  };

  return { generatedErc7730: currentState, finalErc7730: currentFinalState };
};

export default formatOperationData;
