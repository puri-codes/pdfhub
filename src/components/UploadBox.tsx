import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { cn } from '../utils/cn';
import { useToolStore } from '../store/useToolStore';

interface UploadBoxProps {
  acceptedFormats: Record<string, string[]>;
  maxFiles: number;
}

export function UploadBox({ acceptedFormats, maxFiles }: UploadBoxProps) {
  const { setFiles, setErrorMessage } = useToolStore();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      setErrorMessage(fileRejections[0].errors[0].message);
      return;
    }
    
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
    }
  }, [setFiles, setErrorMessage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    maxFiles,
    maxSize: 100 * 1024 * 1024, // 100MB
  } as any);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer bg-white group",
        isDragActive ? "border-indigo-500 bg-indigo-50/50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className={cn(
          "p-4 rounded-full mb-4 transition-colors duration-200",
          isDragActive ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-500"
        )}>
          <UploadCloud className="w-10 h-10" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isDragActive ? "Drop files here" : "Choose files or drag & drop"}
        </h3>
        
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          Supported formats: {Object.values(acceptedFormats).flat().join(', ').toUpperCase()}
          <br />
          Max file size: 100MB
        </p>
        
        <button 
          type="button"
          className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
        >
          Select Files
        </button>
      </div>
    </div>
  );
}
