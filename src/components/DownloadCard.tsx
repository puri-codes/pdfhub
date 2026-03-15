import { motion } from 'framer-motion';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { useToolStore } from '../store/useToolStore';
import { formatBytes } from '../utils/formatting';

export function DownloadCard() {
  const { downloadResult, reset } = useToolStore();

  if (!downloadResult) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto mt-8 p-8 bg-gradient-to-br from-indigo-50 to-white rounded-3xl shadow-lg border border-indigo-100"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your File is Ready!</h2>
        {downloadResult.size > 0 && (
          <p className="text-gray-500 mb-8">New file size: {formatBytes(downloadResult.size)}</p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <a 
            href={downloadResult.url}
            download={downloadResult.filename}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download Result
          </a>
          
          <button 
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(downloadResult.url);
              } catch {
                // ignore: clipboard not available
              }
            }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Share2 className="w-5 h-5" />
            Copy Link
          </button>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200 w-full flex justify-center">
          <button 
            onClick={reset}
            className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Process another file
          </button>
        </div>
      </div>
    </motion.div>
  );
}
