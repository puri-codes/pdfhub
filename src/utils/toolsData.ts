import { 
  FileArchive, 
  Minimize2, 
  Globe, 
  Combine, 
  SplitSquareHorizontal, 
  Copy, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Image as ImageIcon, 
  Scissors, 
  Trash2, 
  RotateCw, 
  ArrowDownUp, 
  PlusSquare 
} from 'lucide-react';

export type ToolCategory = 'Compression' | 'Merge / Split' | 'Conversion' | 'Image Conversion' | 'Page Management';

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: any;
  path: string;
  acceptedFormats: Record<string, string[]>;
  maxFiles: number;
  seoHeadline: string;
  benefits: string[];
  howTo: string[];
  faqs: { q: string; a: string }[];
}

export const toolsData: ToolMetadata[] = [
  // Compression
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    category: 'Compression',
    icon: FileArchive,
    path: '/tools/compress-pdf',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Compress PDF Files Online for Free',
    benefits: ['Reduce file size for email attachments', 'Save storage space', 'Maintain high visual quality'],
    howTo: ['Drag and drop your PDF file', 'Choose compression level', 'Click "Compress PDF"', 'Download your optimized file'],
    faqs: [
      { q: 'Is my data secure?', a: 'Yes, all files are processed securely and deleted automatically after 1 hour.' },
      { q: 'Will the quality be affected?', a: 'Our smart compression algorithm reduces size while maintaining readability.' }
    ]
  },
  {
    id: 'reduce-pdf-size',
    name: 'Reduce PDF Size',
    description: 'Make your PDF files smaller without losing quality.',
    category: 'Compression',
    icon: Minimize2,
    path: '/tools/reduce-pdf-size',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Reduce PDF Size Online',
    benefits: ['Fast processing', 'No installation required', 'Works on all devices'],
    howTo: ['Upload your PDF', 'Wait for the reduction process', 'Download the smaller PDF'],
    faqs: [
      { q: 'What is the maximum file size?', a: 'You can upload files up to 100MB.' }
    ]
  },
  {
    id: 'optimize-pdf-for-web',
    name: 'Optimize PDF for Web',
    description: 'Linearize PDFs for fast web viewing (Fast Web View).',
    category: 'Compression',
    icon: Globe,
    path: '/tools/optimize-pdf-for-web',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Optimize PDF for Fast Web Viewing',
    benefits: ['Pages load instantly in browsers', 'Better user experience', 'SEO friendly'],
    howTo: ['Upload your PDF', 'Click "Optimize"', 'Download the web-ready file'],
    faqs: [
      { q: 'What does web optimization do?', a: 'It restructures the PDF so browsers can display the first page before the entire file downloads.' }
    ]
  },

  // Merge / Split
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one unified document.',
    category: 'Merge / Split',
    icon: Combine,
    path: '/tools/merge-pdf',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 20,
    seoHeadline: 'Merge Multiple PDFs Online',
    benefits: ['Combine up to 20 files', 'Drag and drop to reorder', 'Fast and secure'],
    howTo: ['Select multiple PDF files', 'Drag to reorder them', 'Click "Merge PDF"', 'Download the combined file'],
    faqs: [
      { q: 'Can I reorder files before merging?', a: 'Yes, simply drag and drop the file cards to arrange them.' }
    ]
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages or split a PDF into multiple files.',
    category: 'Merge / Split',
    icon: SplitSquareHorizontal,
    path: '/tools/split-pdf',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Split PDF Files Online',
    benefits: ['Extract specific page ranges', 'Split into fixed size chunks', 'High processing speed'],
    howTo: ['Upload your PDF', 'Select split mode (ranges or fixed)', 'Enter page numbers', 'Download the split files'],
    faqs: [
      { q: 'Can I extract just one page?', a: 'Yes, you can specify a single page or a range like 1-5.' }
    ]
  },
  {
    id: 'split-pages',
    name: 'Split Pages',
    description: 'Split each page of a PDF into a separate file.',
    category: 'Merge / Split',
    icon: Copy,
    path: '/tools/split-pages',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Split Every Page into a Separate PDF',
    benefits: ['Automated page extraction', 'Get a ZIP of all pages', 'Original quality preserved'],
    howTo: ['Upload your PDF', 'Click "Split Pages"', 'Download a ZIP file containing all pages as separate PDFs'],
    faqs: [
      { q: 'How do I download the result?', a: 'The result will be provided as a ZIP archive containing all the individual PDF files.' }
    ]
  },

  // Conversion
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF to editable Word documents (DOCX).',
    category: 'Conversion',
    icon: FileText,
    path: '/tools/pdf-to-word',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Convert PDF to Word Online',
    benefits: ['Editable text', 'Preserves layout and formatting', 'No watermark'],
    howTo: ['Upload your PDF', 'Wait for the conversion', 'Download your DOCX file'],
    faqs: [
      { q: 'Will the formatting be preserved?', a: 'Yes, our converter attempts to keep the original layout intact.' }
    ]
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Word documents (DOCX) to PDF.',
    category: 'Conversion',
    icon: FileText,
    path: '/tools/word-to-pdf',
    acceptedFormats: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
    seoHeadline: 'Convert Word to PDF Online',
    benefits: ['Universal compatibility', 'Locks formatting', 'Fast conversion'],
    howTo: ['Upload your Word document', 'Click "Convert"', 'Download the PDF'],
    faqs: [
      { q: 'Does it support DOCX?', a: 'Yes, both DOC and DOCX formats are supported.' }
    ]
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Extract tables from PDF to Excel spreadsheets.',
    category: 'Conversion',
    icon: FileSpreadsheet,
    path: '/tools/pdf-to-excel',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Convert PDF to Excel Spreadsheets',
    benefits: ['Accurate table extraction', 'Editable data', 'Saves manual data entry'],
    howTo: ['Upload your PDF containing tables', 'Wait for extraction', 'Download the XLSX file'],
    faqs: [
      { q: 'Does it work with scanned PDFs?', a: 'Currently it works best with text-based PDFs. OCR for scanned documents is coming soon.' }
    ]
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets (XLSX) to PDF documents.',
    category: 'Conversion',
    icon: FileSpreadsheet,
    path: '/tools/excel-to-pdf',
    acceptedFormats: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    maxFiles: 1,
    seoHeadline: 'Convert Excel to PDF Online',
    benefits: ['Easy sharing', 'Prevents accidental edits', 'Maintains print layout'],
    howTo: ['Upload your Excel file', 'Click "Convert"', 'Download the PDF'],
    faqs: [
      { q: 'Are all sheets converted?', a: 'Yes, all active sheets in the workbook will be converted to PDF pages.' }
    ]
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    description: 'Convert PowerPoint presentations (PPTX) to PDF.',
    category: 'Conversion',
    icon: Presentation,
    path: '/tools/powerpoint-to-pdf',
    acceptedFormats: { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] },
    maxFiles: 1,
    seoHeadline: 'Convert PowerPoint to PDF',
    benefits: ['Perfect for sharing slides', 'No missing fonts', 'Smaller file size'],
    howTo: ['Upload your presentation', 'Click "Convert"', 'Download the PDF'],
    faqs: [
      { q: 'Will animations be preserved?', a: 'No, PDFs are static documents, so animations and transitions will be removed.' }
    ]
  },

  // Image Conversion
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images to PDF documents.',
    category: 'Image Conversion',
    icon: ImageIcon,
    path: '/tools/jpg-to-pdf',
    acceptedFormats: { 'image/jpeg': ['.jpg', '.jpeg'] },
    maxFiles: 20,
    seoHeadline: 'Convert JPG Images to PDF',
    benefits: ['Combine multiple images', 'Adjust margins and orientation', 'High quality'],
    howTo: ['Upload one or more JPG images', 'Adjust settings if needed', 'Click "Convert"', 'Download the PDF'],
    faqs: [
      { q: 'Can I upload multiple images?', a: 'Yes, you can upload up to 20 images and combine them into a single PDF.' }
    ]
  },
  {
    id: 'png-to-pdf',
    name: 'PNG to PDF',
    description: 'Convert PNG images to PDF documents.',
    category: 'Image Conversion',
    icon: ImageIcon,
    path: '/tools/png-to-pdf',
    acceptedFormats: { 'image/png': ['.png'] },
    maxFiles: 20,
    seoHeadline: 'Convert PNG Images to PDF',
    benefits: ['Preserves transparency (where applicable)', 'Combine multiple PNGs', 'Fast conversion'],
    howTo: ['Upload PNG images', 'Click "Convert"', 'Download the PDF'],
    faqs: [
      { q: 'Is there a file size limit?', a: 'Yes, up to 50MB per image.' }
    ]
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert various image formats to PDF.',
    category: 'Image Conversion',
    icon: ImageIcon,
    path: '/tools/image-to-pdf',
    acceptedFormats: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'] },
    maxFiles: 20,
    seoHeadline: 'Convert Any Image to PDF',
    benefits: ['Supports JPG, PNG, GIF, WEBP', 'Combine different formats', 'Easy to use'],
    howTo: ['Upload your images', 'Reorder them if necessary', 'Click "Convert"', 'Download the PDF'],
    faqs: [
      { q: 'Can I mix JPG and PNG files?', a: 'Yes, you can upload different image formats at the same time.' }
    ]
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Extract images or convert PDF pages to JPG.',
    category: 'Image Conversion',
    icon: ImageIcon,
    path: '/tools/pdf-to-jpg',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Convert PDF to JPG Images',
    benefits: ['High resolution output', 'Extract embedded images', 'Get a ZIP file of all pages'],
    howTo: ['Upload your PDF', 'Choose to convert pages or extract images', 'Download the ZIP file'],
    faqs: [
      { q: 'What resolution are the JPGs?', a: 'Pages are converted at high quality (300 DPI).' }
    ]
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    description: 'Convert PDF pages to high-quality PNG images.',
    category: 'Image Conversion',
    icon: ImageIcon,
    path: '/tools/pdf-to-png',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Convert PDF to PNG Images',
    benefits: ['Lossless quality', 'Great for graphics and text', 'Download as ZIP'],
    howTo: ['Upload your PDF', 'Click "Convert"', 'Download the ZIP containing PNGs'],
    faqs: [
      { q: 'Why choose PNG over JPG?', a: 'PNG provides lossless compression, which is better for text and sharp graphics.' }
    ]
  },

  // Page Management
  {
    id: 'extract-pages',
    name: 'Extract Pages',
    description: 'Extract specific pages from a PDF document.',
    category: 'Page Management',
    icon: Scissors,
    path: '/tools/extract-pages',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Extract Pages from PDF Online',
    benefits: ['Select exactly which pages you need', 'Creates a new PDF', 'Fast processing'],
    howTo: ['Upload your PDF', 'Select the pages you want to keep', 'Click "Extract"', 'Download the new PDF'],
    faqs: [
      { q: 'How do I select pages?', a: 'You can click on page thumbnails or enter page numbers (e.g., 1, 3, 5-10).' }
    ]
  },
  {
    id: 'delete-pages',
    name: 'Delete Pages',
    description: 'Remove unwanted pages from a PDF.',
    category: 'Page Management',
    icon: Trash2,
    path: '/tools/delete-pages',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Delete Pages from PDF',
    benefits: ['Easily remove blank or extra pages', 'Visual page selection', 'Secure'],
    howTo: ['Upload your PDF', 'Select the pages to delete', 'Click "Remove Pages"', 'Download the updated PDF'],
    faqs: [
      { q: 'Can I undo a deletion?', a: 'You can change your selection before clicking "Remove Pages".' }
    ]
  },
  {
    id: 'rotate-pages',
    name: 'Rotate Pages',
    description: 'Rotate PDF pages that are upside down.',
    category: 'Page Management',
    icon: RotateCw,
    path: '/tools/rotate-pages',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Rotate PDF Pages Online',
    benefits: ['Rotate individual pages or all pages', 'Permanent rotation', 'Visual interface'],
    howTo: ['Upload your PDF', 'Click rotate buttons on thumbnails', 'Apply changes', 'Download the PDF'],
    faqs: [
      { q: 'Does it permanently rotate the pages?', a: 'Yes, the downloaded PDF will have the pages permanently rotated.' }
    ]
  },
  {
    id: 'rearrange-pages',
    name: 'Rearrange Pages',
    description: 'Change the order of pages in a PDF.',
    category: 'Page Management',
    icon: ArrowDownUp,
    path: '/tools/rearrange-pages',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    seoHeadline: 'Rearrange PDF Pages',
    benefits: ['Drag and drop interface', 'Easy to use', 'Fast processing'],
    howTo: ['Upload your PDF', 'Drag and drop page thumbnails to reorder', 'Click "Apply"', 'Download the new PDF'],
    faqs: [
      { q: 'Is there a limit to how many pages I can reorder?', a: 'It works best with PDFs under 200 pages for performance reasons.' }
    ]
  },
  {
    id: 'insert-pages',
    name: 'Insert Pages',
    description: 'Insert blank pages or pages from another PDF.',
    category: 'Page Management',
    icon: PlusSquare,
    path: '/tools/insert-pages',
    acceptedFormats: { 'application/pdf': ['.pdf'] },
    maxFiles: 2,
    seoHeadline: 'Insert Pages into PDF',
    benefits: ['Add blank pages anywhere', 'Insert another PDF', 'Visual placement'],
    howTo: ['Upload your main PDF', 'Choose where to insert', 'Upload the second PDF or select blank page', 'Apply and download'],
    faqs: [
      { q: 'Can I insert multiple blank pages?', a: 'Yes, you can insert as many blank pages as needed.' }
    ]
  }
];

export const categories: ToolCategory[] = [
  'Compression',
  'Merge / Split',
  'Conversion',
  'Image Conversion',
  'Page Management'
];
