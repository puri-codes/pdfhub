import { File, X, GripVertical } from 'lucide-react';
import { useToolStore } from '../store/useToolStore';
import { formatBytes } from '../utils/formatting';

export function FilePreview() {
  const { files, removeFile, moveFile } = useToolStore();

  if (files.length === 0) return null;

  return (
    <div className="w-full mt-8 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Selected Files ({files.length})</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file, index) => (
          <div 
            key={`${file.name}-${index}`}
            draggable={files.length > 1}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', String(index));
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => {
              if (files.length <= 1) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromIndex = Number.parseInt(e.dataTransfer.getData('text/plain'), 10);
              if (Number.isFinite(fromIndex)) moveFile(fromIndex, index);
            }}
            className="relative flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm group hover:border-indigo-300 transition-colors"
          >
            {files.length > 1 && (
              <div className="mr-2 cursor-grab text-gray-400 hover:text-gray-600">
                <GripVertical className="w-5 h-5" />
              </div>
            )}
            
            <div className="flex-shrink-0 p-2 bg-indigo-50 rounded-lg text-indigo-600 mr-4">
              <File className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatBytes(file.size)}
              </p>
            </div>
            
            <button
              onClick={() => removeFile(index)}
              className="absolute top-2 right-2 p-1 text-gray-400 bg-white rounded-full opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all focus:opacity-100"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
