import { create } from 'zustand';

export type ProcessingState = 'idle' | 'uploading' | 'processing' | 'converting' | 'completed' | 'error';

export type DownloadResult = {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  isObjectUrl: boolean;
};

interface ToolState {
  files: File[];
  processingState: ProcessingState;
  progress: number;
  errorMessage: string | null;
  downloadResult: DownloadResult | null;
  toolConfig: Record<string, any>;
  
  setFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  moveFile: (fromIndex: number, toIndex: number) => void;
  setProcessingState: (state: ProcessingState) => void;
  setProgress: (progress: number) => void;
  setErrorMessage: (msg: string | null) => void;
  setDownloadResult: (result: DownloadResult | null) => void;
  setToolConfig: (config: Record<string, any>) => void;
  reset: () => void;
}

export const useToolStore = create<ToolState>((set, get) => ({
  files: [],
  processingState: 'idle',
  progress: 0,
  errorMessage: null,
  downloadResult: null,
  toolConfig: {},

  setFiles: (files) => {
    const { downloadResult } = get();
    if (downloadResult?.isObjectUrl) URL.revokeObjectURL(downloadResult.url);
    set({ files, errorMessage: null, downloadResult: null, processingState: 'idle', progress: 0 });
  },
  removeFile: (index) => set((state) => ({ files: state.files.filter((_, i) => i !== index) })),
  moveFile: (fromIndex, toIndex) => set((state) => {
    if (fromIndex === toIndex) return state;
    if (fromIndex < 0 || toIndex < 0) return state;
    if (fromIndex >= state.files.length || toIndex >= state.files.length) return state;

    const nextFiles = [...state.files];
    const [moved] = nextFiles.splice(fromIndex, 1);
    nextFiles.splice(toIndex, 0, moved);
    return { files: nextFiles };
  }),
  setProcessingState: (state) => set({ processingState: state }),
  setProgress: (progress) => set({ progress }),
  setErrorMessage: (msg) => set((state) => ({ errorMessage: msg, processingState: msg ? 'error' : state.processingState })),
  setDownloadResult: (result) => {
    const { downloadResult } = get();
    if (downloadResult?.isObjectUrl) URL.revokeObjectURL(downloadResult.url);
    set({
      downloadResult: result,
      processingState: result ? 'completed' : 'idle',
    });
  },
  setToolConfig: (config) => set((state) => ({ toolConfig: { ...state.toolConfig, ...config } })),
  reset: () => {
    const { downloadResult } = get();
    if (downloadResult?.isObjectUrl) URL.revokeObjectURL(downloadResult.url);
    set({
      files: [],
      processingState: 'idle',
      progress: 0,
      errorMessage: null,
      downloadResult: null,
      toolConfig: {},
    });
  },
}));
