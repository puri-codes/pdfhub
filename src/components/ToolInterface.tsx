import { ToolMetadata } from '../utils/toolsData';
import { UploadBox } from './UploadBox';
import { FilePreview } from './FilePreview';
import { ProcessingStatus } from './ProcessingStatus';
import { DownloadCard } from './DownloadCard';
import { useToolStore } from '../store/useToolStore';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, ReactNode } from 'react';

interface ToolInterfaceProps {
  tool: ToolMetadata;
  optionsComponent?: ReactNode;
  onProcess: () => void;
}

export function ToolInterface({ tool, optionsComponent, onProcess }: ToolInterfaceProps) {
  const { files, processingState, reset } = useToolStore();

  // Reset store when tool changes
  useEffect(() => {
    reset();
  }, [tool.id, reset]);

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10">
      {processingState === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <UploadBox acceptedFormats={tool.acceptedFormats} maxFiles={tool.maxFiles} />
          <FilePreview />
          
          {files.length > 0 && optionsComponent && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>
              {optionsComponent}
            </div>
          )}
          
          {files.length > 0 && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={onProcess}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              >
                <Play className="w-5 h-5 fill-current" />
                {tool.name}
              </button>
            </div>
          )}
        </motion.div>
      )}
      
      {(processingState === 'uploading' || processingState === 'processing' || processingState === 'converting' || processingState === 'error') && (
        <ProcessingStatus />
      )}
      
      {processingState === 'completed' && (
        <DownloadCard />
      )}
    </div>
  );
}
