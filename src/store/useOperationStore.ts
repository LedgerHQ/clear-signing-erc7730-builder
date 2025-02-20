import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

type State = {
  validateOperation: string[];
  updatedOperation: string[];
  selectedOperation: string | null;
};

type Action = {
  setSelectedOperation: (selectedOperation: State["selectedOperation"]) => void;
  setValidateOperation: (f: string) => void;
  setUpdatedOperation: (f: string) => void;
};

export const useOperationStore = create<State & Action>()(
  persist(
    (set) => ({
      validateOperation: [],
      toto: [],
      updatedOperation: [],
      selectedOperation: null,
      setValidateOperation: (operation) =>
        set((state) => ({
          validateOperation: state.validateOperation.includes(operation)
            ? state.validateOperation
            : [...state.validateOperation, operation],
        })),
      setUpdatedOperation: (operation) =>
        set((state) => ({
          updatedOperation: state.updatedOperation.includes(operation)
            ? state.updatedOperation
            : [...state.updatedOperation, operation],
        })),
      setSelectedOperation: (selectedOperation) =>
        set(() => ({ selectedOperation })),
    }),
    {
      storage: createJSONStorage(() => sessionStorage),
      name: "store-Operation",
      skipHydration: true,
    },
  ),
);

export default useOperationStore;
