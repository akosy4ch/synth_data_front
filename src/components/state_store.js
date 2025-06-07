import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGeneratorStore = create(
  persist(
    (set) => ({
      file: null,
      columns: [],
      selectedColumns: [],
      models: {},
      syntheticData: null,
      analysisResults: null,
      analysisMetadata: null,
      preserveOtherColumns: false,

      setFile: (file) => set({ file }),
      setColumns: (columns) => set({ columns }),
      setSelectedColumns: (selectedColumns) => set({ selectedColumns }),
      setModels: (updater) =>
        set((state) => ({
          models: typeof updater === "function"
            ? updater(state.models)
            : updater
        })),
      setSyntheticData: (syntheticData) => set({ syntheticData }),
      setAnalysisResults: (analysisResults) => set({ analysisResults }),
      setAnalysisMetadata: (data) => set({ analysisMetadata: data }),
      setPreserveOtherColumns: (preserveOtherColumns) => set({ preserveOtherColumns }),

      reset: () =>
        set({
          file: null,
          columns: [],
          selectedColumns: [],
          models: {},
          syntheticData: null,
          analysisResults: null,
          analysisMetadata: null,
          preserveOtherColumns: false,
        }),
    }),
    {
      name: 'generator-storage',
      partialize: (state) => ({
        columns: state.columns,
        selectedColumns: state.selectedColumns,
        models: state.models,
        preserveOtherColumns: state.preserveOtherColumns,
      }),
    }
  )
);

export default useGeneratorStore;
