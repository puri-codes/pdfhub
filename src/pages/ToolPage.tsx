import { useParams, Navigate } from 'react-router-dom';
import { toolsData } from '../utils/toolsData';
import { ToolLayout } from '../components/ToolLayout';
import { ToolInterface } from '../components/ToolInterface';
import { useToolStore } from '../store/useToolStore';
import { processTool } from '../utils/processTool';

export function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = toolsData.find(t => t.id === toolId);
  const {
    setProcessingState,
    setProgress,
    setDownloadResult,
    setErrorMessage,
    setToolConfig,
    toolConfig,
    files,
  } = useToolStore();

  if (!tool) {
    return <Navigate to="/" replace />;
  }

  const handleProcess = async () => {
    if (files.length === 0) return;

    try {
      setErrorMessage(null);
      setDownloadResult(null);
      setProcessingState('processing');
      setProgress(0);

      const result = await processTool({
        toolId: tool.id,
        files,
        toolConfig,
        onProgress: (stage, progress) => {
          setProcessingState(stage);
          setProgress(progress);
        },
      });

      const url = URL.createObjectURL(result.blob);
      setDownloadResult({
        url,
        filename: result.filename,
        mimeType: result.mimeType,
        size: result.blob.size,
        isObjectUrl: true,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong.';
      setErrorMessage(message);
    }
  };

  // Render specific options based on tool category or ID
  const renderOptions = () => {
    switch (tool.category) {
      case 'Compression':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Compression Level</label>
            <select
              value={String(toolConfig.compressionLevel ?? 'recommended')}
              onChange={(e) => setToolConfig({ compressionLevel: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="recommended">Recommended (Good quality, high compression)</option>
              <option value="extreme">Extreme (Less quality, highest compression)</option>
              <option value="less">Less (High quality, less compression)</option>
            </select>
          </div>
        );
      case 'Merge / Split':
        if (tool.id === 'split-pdf') {
          return (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Pages to extract</label>
              <input
                type="text"
                value={String(toolConfig.pageRanges ?? '')}
                onChange={(e) => setToolConfig({ pageRanges: e.target.value })}
                placeholder="e.g. 1-5, 8, 11-13"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="text-xs text-gray-500">Leave blank to split every page into a separate PDF (ZIP download).</p>
            </div>
          );
        }
        return null;
      default:
        if (tool.id === 'extract-pages' || tool.id === 'delete-pages') {
          const label = tool.id === 'extract-pages' ? 'Pages to keep' : 'Pages to delete';
          return (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                value={String(toolConfig.pageRanges ?? '')}
                onChange={(e) => setToolConfig({ pageRanges: e.target.value })}
                placeholder="e.g. 1-5, 8, 11-13"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          );
        }

        if (tool.id === 'rotate-pages') {
          return (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Rotate all pages</label>
              <select
                value={String(toolConfig.rotateDegrees ?? 90)}
                onChange={(e) => setToolConfig({ rotateDegrees: Number(e.target.value) })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="90">90°</option>
                <option value="180">180°</option>
                <option value="270">270°</option>
              </select>
            </div>
          );
        }

        if (tool.id === 'rearrange-pages') {
          return (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">New page order</label>
              <input
                type="text"
                value={String(toolConfig.pageOrder ?? '')}
                onChange={(e) => setToolConfig({ pageOrder: e.target.value })}
                placeholder="e.g. 3,1,2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          );
        }

        if (tool.id === 'insert-pages') {
          return (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Insert after page</label>
              <input
                type="number"
                min={0}
                value={String(toolConfig.insertAfter ?? '')}
                onChange={(e) => setToolConfig({ insertAfter: e.target.value })}
                placeholder="e.g. 2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="text-xs text-gray-500">
                Upload 2 PDFs to insert the second one, or upload 1 PDF to insert a blank page.
              </p>
            </div>
          );
        }

        return null;
    }
  };

  return (
    <ToolLayout tool={tool}>
      <ToolInterface 
        tool={tool} 
        onProcess={handleProcess}
        optionsComponent={renderOptions()}
      />
    </ToolLayout>
  );
}
