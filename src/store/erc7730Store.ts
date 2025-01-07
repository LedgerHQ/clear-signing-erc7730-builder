import { createStore } from "zustand/vanilla";
import { Operation, type Erc7730 } from "./types";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Erc7730Store {
  erc7730: Erc7730 | null;
  setErc7730: (by: Erc7730) => void;
  getMetadata: () => Erc7730["metadata"] | null;
  getContractAddress: () => string | null;
  setMetadata: (metadata: Erc7730["metadata"]) => void;
  getOperations: () => Erc7730["display"] | null;
  getOperationsMetadata: (name: string) => {
    operationName: string;
    metadata: Erc7730["metadata"] | null;
  };
  getOperationsByName: (name: string) => Operation | null;
  setOperationData: (name: string, OperationData: Operation) => void;
  getContext: () => Erc7730["context"] | null;
}

export const createErc7730Store = () => {
  return createStore<Erc7730Store>()(
    persist(
      (set, get) => ({
        erc7730: null,
        getOperationsByName: (name: string) => {
          const formats = get().erc7730?.display?.formats ?? {};
          return formats[name] ?? null;
        },
        setOperationData: (name, OperationData) =>
          set((state) => ({
            erc7730: {
              ...state.erc7730!,
              display: {
                ...state.erc7730!.display,
                formats: {
                  ...state.erc7730?.display?.formats,
                  [name]: OperationData,
                },
              },
            },
          })),
        getContractAddress: () => {
          const { erc7730 } = get();
          const context = erc7730?.context;
          if (!context) return "";

          if ("contract" in context) {
            return context.contract.deployments[0]?.address ?? "";
          }
          return "";
        },
        setErc7730: (erc7730) => set(() => ({ erc7730 })),
        getOperations: () => get().erc7730?.display ?? null,
        getMetadata: () => get().erc7730?.metadata ?? null,
        getOperationsMetadata: (name) => {
          const formats = get().erc7730?.display?.formats ?? {};
          const intent = formats[name]?.intent;

          return {
            operationName: typeof intent === "string" ? intent : "",
            metadata: get().erc7730?.metadata ?? null,
          };
        },
        setMetadata: (metadata) =>
          set((state) => ({
            erc7730: {
              ...state.erc7730!,
              metadata,
            },
          })),
        getContext: () => get().erc7730?.context ?? null,
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
