import { createStore } from "zustand/vanilla";
import { type Operation, type OperationMetadata, type Erc7730 } from "./types";
import { persist, createJSONStorage } from "zustand/middleware";
import { type FieldSchemaType } from "~/app/operations/editOperation";
import formatOperationData from "./setOperationData";

export interface Erc7730Store {
  generatedErc7730: Erc7730 | null;
  finalErc7730: Erc7730 | null;
  setErc7730: (by: Erc7730) => void;
  getMetadata: () => Erc7730["metadata"] | null;
  getContractAddress: () => string | null;
  setMetadata: (metadata: Erc7730["metadata"]) => void;
  getOperations: () => Erc7730["display"] | null;
  getOperationsMetadata: (name: string | null) => OperationMetadata | null;
  getFinalOperationsMetadata: (name: string | null) => OperationMetadata | null;
  getOperationsByName: (name: string | null) => Operation | null;
  getFinalOperationByName: (name: string | null) => Operation | null;
  setOperationData: (
    operationName: string,
    intent: string,
    formField: FieldSchemaType[],
  ) => void;
}

export const createErc7730Store = () => {
  return createStore<Erc7730Store>()(
    persist(
      (set, get) => ({
        generatedErc7730: null,
        finalErc7730: null,
        getOperationsByName: (name) => {
          if (!name) return null;
          const formats = get().generatedErc7730?.display?.formats ?? {};
          return formats[name] ?? null;
        },
        getFinalOperationByName: (name) => {
          if (!name) return null;
          const formats = get().finalErc7730?.display?.formats ?? {};
          return formats[name] ?? null;
        },
        setOperationData: (operationName, intent, formField) => {
          // why do I have a warning here?
          set((state) => {
            const { finalErc7730, generatedErc7730 } = formatOperationData(
              {
                generatedErc7730: state.generatedErc7730!,
                finalErc7730: state.finalErc7730!,
              },
              operationName,
              intent,
              formField,
            );
            console.log("inside the set", { finalErc7730, generatedErc7730 });
            return {
              generatedErc7730,
              finalErc7730,
            };
          });
        },
        getContractAddress: () => {
          const { generatedErc7730 } = get();
          const context = generatedErc7730?.context;
          if (!context) return "";

          if ("contract" in context) {
            return context.contract.deployments[0]?.address ?? "";
          }
          return "";
        },
        setErc7730: (generatedErc7730) => set(() => ({ generatedErc7730 })),
        getOperations: () => get().generatedErc7730?.display ?? null,
        getMetadata: () => get().generatedErc7730?.metadata ?? null,
        getOperationsMetadata: (name) => {
          if (!name) return null;
          const formats = get().generatedErc7730?.display?.formats ?? {};
          const intent = formats[name]?.intent;

          return {
            operationName: typeof intent === "string" ? intent : "",
            metadata: get().generatedErc7730?.metadata ?? null,
          };
        },
        getFinalOperationsMetadata: (name) => {
          if (!name) return null;
          const formats = get().finalErc7730?.display?.formats ?? {};
          const intent = formats[name]?.intent;

          return {
            operationName: typeof intent === "string" ? intent : "",
            metadata: get().finalErc7730?.metadata ?? null,
          };
        },
        setMetadata: (metadata) =>
          set((state) => ({
            generatedErc7730: {
              ...state.generatedErc7730!,
              metadata,
            },
            finalErc7730: {
              $schema: state.generatedErc7730!.$schema,
              context: state.generatedErc7730!.context,
              metadata,
              display: state.finalErc7730
                ? {
                    ...state.finalErc7730.display,
                    formats: state.finalErc7730.display.formats ?? {},
                  }
                : { formats: {} },
            },
          })),
      }),
      {
        storage: createJSONStorage(() => sessionStorage),
        name: "store-erc7730",
        skipHydration: true,
      },
    ),
  );
};

export default createErc7730Store;
