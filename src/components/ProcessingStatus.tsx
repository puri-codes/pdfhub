import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToolStore } from '../store/useToolStore';

export function ProcessingStatus() {
  const { processingState, progress, errorMessage } = useToolStore();

  if (processingState === 'idle') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex flex-col items-center justify-center text-center">
        {processingState === 'error' ? (
          <>
            <div className="p-4 bg-red-50 rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Failed</h3>
            <p className="text-red-600 mb-6">{errorMessage || 'An unknown error occurred.'}</p>
            <button 
              onClick={() => useToolStore.getState().reset()}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Try Again
            </button>
          </>
        ) : processingState === 'completed' ? (
          <>
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="p-4 bg-green-50 rounded-full mb-4"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Completed Successfully!</h3>
            <p className="text-gray-500 mb-6">Your files are ready to download.</p>
          </>
        ) : (
          <>
            <div className="p-4 bg-indigo-50 rounded-full mb-4">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {processingState === 'uploading' && 'Uploading files...'}
              {processingState === 'processing' && 'Processing files...'}
              {processingState === 'converting' && 'Converting files...'}
            </h3>
            
            <div className="w-full max-w-md mt-6">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  className="bg-indigo-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
