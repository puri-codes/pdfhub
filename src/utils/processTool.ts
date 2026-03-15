import JSZip from 'jszip';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as XLSX from 'xlsx';
import { getDocument } from './pdfjs';
import { safeBaseName, withExtension } from './filenames';
import { parsePageList, parsePageOrder, parsePageSegments } from './pageRanges';

export type ProcessStage = 'processing' | 'converting';

export type ProcessResult = {
  blob: Blob;
  filename: string;
  mimeType: string;
};

export type ProgressCallback = (stage: ProcessStage, progress: number) => void;

async function fileToUint8Array(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

function assertFiles(files: File[], min: number, max: number): void {
  if (files.length < min) throw new Error('Please add a file to continue.');
  if (files.length > max) throw new Error(`Please add no more than ${max} file(s).`);
}

async function pdfFromFile(file: File): Promise<PDFDocument> {
  const bytes = await fileToUint8Array(file);
  return PDFDocument.load(bytes);
}

async function createPdfFromText(text: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pageSize: [number, number] = [595.28, 841.89]; // A4
  const margin = 50;
  const fontSize = 12;
  const lineHeight = 14;
  const maxWidth = pageSize[0] - margin * 2;

  const wrapLine = (line: string): string[] => {
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [''];

    const lines: string[] = [];
    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const next = `${current} ${words[i]}`;
      if (font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
        current = next;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
    return lines;
  };

  const rawLines = text.replace(/\r\n/g, '\n').split('\n');
  let page = pdfDoc.addPage(pageSize);
  let y = pageSize[1] - margin;

  for (const rawLine of rawLines) {
    const wrapped = wrapLine(rawLine);
    for (const line of wrapped) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage(pageSize);
        y = pageSize[1] - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= lineHeight;
    }
  }

  return pdfDoc.save();
}

async function extractTextFromPdf(file: File, onProgress?: ProgressCallback): Promise<string> {
  const bytes = await fileToUint8Array(file);
  const pdf = await getDocument({ data: bytes }).promise;
  const lines: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    onProgress?.('converting', Math.round(((pageNum - 1) / pdf.numPages) * 100));
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((it: any) => (typeof it?.str === 'string' ? it.str : ''))
      .filter(Boolean)
      .join(' ')
      .trim();
    if (pageText) lines.push(pageText);
    lines.push(''); // page break
  }

  onProgress?.('converting', 100);
  return lines.join('\n');
}

async function docxToText(file: File): Promise<string> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const xml = await zip.file('word/document.xml')?.async('string');
  if (!xml) throw new Error('Invalid DOCX file.');

  const parsed = new DOMParser().parseFromString(xml, 'application/xml');
  const paragraphs = Array.from(parsed.getElementsByTagName('w:p')).map((p) =>
    Array.from(p.getElementsByTagName('w:t')).map((t) => t.textContent ?? '').join(''),
  );

  return paragraphs.join('\n').trim();
}

async function pptxToText(file: File): Promise<string> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slidePaths = Object.keys(zip.files)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p))
    .sort((a, b) => {
      const an = Number.parseInt(a.match(/slide(\d+)\.xml/)?.[1] ?? '0', 10);
      const bn = Number.parseInt(b.match(/slide(\d+)\.xml/)?.[1] ?? '0', 10);
      return an - bn;
    });

  if (slidePaths.length === 0) throw new Error('Invalid PPTX file.');

  const slideTexts: string[] = [];
  for (const slidePath of slidePaths) {
    const xml = await zip.file(slidePath)?.async('string');
    if (!xml) continue;
    const parsed = new DOMParser().parseFromString(xml, 'application/xml');
    const text = Array.from(parsed.getElementsByTagName('a:t'))
      .map((t) => t.textContent ?? '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) slideTexts.push(text);
    slideTexts.push('');
  }
  return slideTexts.join('\n').trim();
}

async function imagesToPdf(files: File[], onProgress?: ProgressCallback): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.('converting', Math.round((i / files.length) * 100));

    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to render image.');
    ctx.drawImage(bitmap, 0, 0);

    const isJpeg = /jpe?g$/i.test(file.name) || file.type === 'image/jpeg';
    const mime = isJpeg ? 'image/jpeg' : 'image/png';
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Unable to encode image.'))), mime, 0.92);
    });

    const bytes = new Uint8Array(await blob.arrayBuffer());
    const embedded = isJpeg ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);
    const page = pdfDoc.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
  }

  onProgress?.('converting', 100);
  return pdfDoc.save();
}

async function pdfToImagesZip(
  file: File,
  format: 'png' | 'jpg',
  onProgress?: ProgressCallback,
): Promise<Blob> {
  const bytes = await fileToUint8Array(file);
  const pdf = await getDocument({ data: bytes }).promise;
  const zip = new JSZip();

  const base = safeBaseName(file.name);
  const mime = format === 'png' ? 'image/png' : 'image/jpeg';
  const ext = format === 'png' ? 'png' : 'jpg';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    onProgress?.('converting', Math.round(((pageNum - 1) / pdf.numPages) * 100));
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to render PDF page.');

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Unable to encode image.'))), mime, 0.92);
    });

    zip.file(`${base}_page_${pageNum}.${ext}`, blob);
  }

  onProgress?.('converting', 100);
  return zip.generateAsync({ type: 'blob' });
}

async function splitPdfToZip(
  file: File,
  pageSegments: number[][],
  onProgress?: ProgressCallback,
): Promise<Blob> {
  const source = await pdfFromFile(file);
  const pageCount = source.getPageCount();
  const segments = pageSegments.length > 0 ? pageSegments : Array.from({ length: pageCount }, (_, i) => [i]);
  const zip = new JSZip();
  const base = safeBaseName(file.name);

  for (let i = 0; i < segments.length; i++) {
    onProgress?.('processing', Math.round((i / segments.length) * 100));
    const target = await PDFDocument.create();
    const pagesToCopy = segments[i].filter((p) => p >= 0 && p < pageCount);
    const copied = await target.copyPages(source, pagesToCopy);
    copied.forEach((p) => target.addPage(p));
    const bytes = await target.save();
    zip.file(`${base}_part_${i + 1}.pdf`, new Blob([bytes], { type: 'application/pdf' }));
  }

  onProgress?.('processing', 100);
  return zip.generateAsync({ type: 'blob' });
}

export async function processTool(args: {
  toolId: string;
  files: File[];
  toolConfig: Record<string, any>;
  onProgress?: ProgressCallback;
}): Promise<ProcessResult> {
  const { toolId, files, toolConfig, onProgress } = args;

  const first = files[0];
  const base = first ? safeBaseName(first.name) : 'file';

  switch (toolId) {
    case 'compress-pdf':
    case 'reduce-pdf-size':
    case 'optimize-pdf-for-web': {
      assertFiles(files, 1, 1);
      onProgress?.('processing', 10);
      const pdf = await pdfFromFile(first);
      onProgress?.('processing', 70);
      const bytes = await pdf.save();
      onProgress?.('processing', 100);
      return { blob: new Blob([bytes], { type: 'application/pdf' }), filename: withExtension(`${base}_optimized`, '.pdf'), mimeType: 'application/pdf' };
    }

    case 'merge-pdf': {
      assertFiles(files, 2, 20);
      const merged = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        onProgress?.('processing', Math.round((i / files.length) * 100));
        const src = await pdfFromFile(files[i]);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      onProgress?.('processing', 100);
      const bytes = await merged.save();
      return { blob: new Blob([bytes], { type: 'application/pdf' }), filename: 'merged.pdf', mimeType: 'application/pdf' };
    }

    case 'split-pdf': {
      assertFiles(files, 1, 1);
      const source = await pdfFromFile(first);
      const segments = parsePageSegments(String(toolConfig.pageRanges ?? ''), source.getPageCount());
      const zipBlob = await splitPdfToZip(first, segments, onProgress);
      return { blob: zipBlob, filename: `${base}_split.zip`, mimeType: 'application/zip' };
    }

    case 'split-pages': {
      assertFiles(files, 1, 1);
      const source = await pdfFromFile(first);
      const pageCount = source.getPageCount();
      const segments = Array.from({ length: pageCount }, (_, i) => [i]);
      const zipBlob = await splitPdfToZip(first, segments, onProgress);
      return { blob: zipBlob, filename: `${base}_pages.zip`, mimeType: 'application/zip' };
    }

    case 'extract-pages': {
      assertFiles(files, 1, 1);
      const source = await pdfFromFile(first);
      const pageCount = source.getPageCount();
      const pages = parsePageList(String(toolConfig.pageRanges ?? ''), pageCount);
      if (pages.length === 0) throw new Error('Enter pages to extract (e.g., 1-5, 8, 11-13).');

      onProgress?.('processing', 30);
      const target = await PDFDocument.create();
      const copied = await target.copyPages(source, pages);
      copied.forEach((p) => target.addPage(p));
      onProgress?.('processing', 90);
      const bytes = await target.save();
      onProgress?.('processing', 100);
      return { blob: new Blob([bytes], { type: 'application/pdf' }), filename: `${base}_extracted.pdf`, mimeType: 'application/pdf' };
    }

    case 'delete-pages': {
      assertFiles(files, 1, 1);
      const source = await pdfFromFile(first);
      const pageCount = source.getPageCount();
      const toDelete = new Set(parsePageList(String(toolConfig.pageRanges ?? ''), pageCount));
      if (toDelete.size === 0) throw new Error('Enter pages to delete (e.g., 2, 4-6).');

      const keep: number[] = [];
      for (let i = 0; i < pageCount; i++) if (!toDelete.has(i)) keep.push(i);
      if (keep.length === 0) throw new Error('You cannot delete every page.');

      onProgress?.('processing', 30);
      const target = await PDFDocument.create();
      const copied = await target.copyPages(source, keep);
      copied.forEach((p) => target.addPage(p));
      onProgress?.('processing', 90);
      const bytes = await target.save();
      onProgress?.('processing', 100);
      return { blob: new Blob([bytes], { type: 'application/pdf' }), filename: `${base}_deleted_pages_removed.pdf`, mimeType: 'application/pdf' };
    }

    case 'rotate-pages': {
      assertFiles(files, 1, 1);
      const rotation = Number(toolConfig.rotateDegrees ?? 90);
      if (![90, 180, 270].includes(rotation)) throw new Error('Rotation must be 90, 180, or 270.');

      const doc = await pdfFromFile(first);
      const pageCount = doc.getPageCount();
      for (let i = 0; i < pageCount; i++) {
        onProgress?.('processing', Math.round((i / pageCount) * 100));
        doc.getPage(i).setRotation(degrees(rotation));
      }
      onProgress?.('processing', 100);
      const bytes = await doc.save();
      return { blob: new Blob([bytes], { type: 'application/pdf' }), filename: `${base}_rotated.pdf`, mimeType: 'application/pdf' };
    }

    case 'rearrange-pages': {
      assertFiles(files, 1, 1);
      const source = await pdfFromFile(first);
      const pageCount = source.getPageCount();
      const order = parsePageOrder(String(toolConfig.pageOrder ?? ''), pageCount);
      if (order.length === 0) throw new Error('Enter a new page order (e.g., 3,1,2).');

      onProgress?.('processing', 40);
      const target = await PDFDocument.create();
      const copied = await target.copyPages(source, order);
      copied.forEach((p) => target.addPage(p));
      onProgress?.('processing', 90);
      const bytes = await target.save();
      onProgress?.('processing', 100);
      return { blob: new Blob([bytes], { type: 'application/pdf' }), filename: `${base}_rearranged.pdf`, mimeType: 'application/pdf' };
    }

    case 'insert-pages': {
      assertFiles(files, 1, 2);
      const main = await pdfFromFile(files[0]);
      const mainCount = main.getPageCount();
      const insertAfter = Number.parseInt(String(toolConfig.insertAfter ?? mainCount), 10);
      const after = Number.isFinite(insertAfter) ? Math.min(Math.max(insertAfter, 0), mainCount) : mainCount;

      const target = await PDFDocument.create();
      const mainBefore = Array.from({ length: after }, (_, i) => i);
      const mainAfter = Array.from({ length: mainCount - after }, (_, i) => i + after);

      onProgress?.('processing', 20);
      const beforePages = await target.copyPages(main, mainBefore);
      beforePages.forEach((p) => target.addPage(p));

      if (files.length === 2) {
        const insertDoc = await pdfFromFile(files[1]);
        const insertPages = await target.copyPages(insertDoc, insertDoc.getPageIndices());
        insertPages.forEach((p) => target.addPage(p));
      } else {
        target.addPage();
      }

      onProgress?.('processing', 70);
      const afterPages = await target.copyPages(main, mainAfter);
      afterPages.forEach((p) => target.addPage(p));

      onProgress?.('processing', 100);
      const bytes = await target.save();
      return { blob: new Blob([bytes], { type: 'application/pdf' }), filename: `${base}_inserted.pdf`, mimeType: 'application/pdf' };
    }

    case 'jpg-to-pdf':
    case 'png-to-pdf':
    case 'image-to-pdf': {
      assertFiles(files, 1, 20);
      const bytes = await imagesToPdf(files, onProgress);
      return { blob: new Blob([bytes], { type: 'application/pdf' }), filename: `${base}.pdf`, mimeType: 'application/pdf' };
    }

    case 'pdf-to-jpg': {
      assertFiles(files, 1, 1);
      const zipBlob = await pdfToImagesZip(first, 'jpg', onProgress);
      return { blob: zipBlob, filename: `${base}_jpg.zip`, mimeType: 'application/zip' };
    }

    case 'pdf-to-png': {
      assertFiles(files, 1, 1);
      const zipBlob = await pdfToImagesZip(first, 'png', onProgress);
      return { blob: zipBlob, filename: `${base}_png.zip`, mimeType: 'application/zip' };
    }

    case 'pdf-to-word': {
      assertFiles(files, 1, 1);
      const text = await extractTextFromPdf(first, onProgress);
      const paragraphs = text
        .split('\n')
        .map((line) => line.trimEnd())
        .map((line) => new Paragraph({ children: [new TextRun(line || ' ')] }));
      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      return {
        blob,
        filename: `${base}.docx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
    }

    case 'word-to-pdf': {
      assertFiles(files, 1, 1);
      if (!/\.docx$/i.test(first.name)) throw new Error('Only DOCX is supported. Please save your file as .docx and try again.');
      onProgress?.('converting', 30);
      const text = await docxToText(first);
      onProgress?.('converting', 70);
      const pdfBytes = await createPdfFromText(text || '(No text found.)');
      onProgress?.('converting', 100);
      return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), filename: `${base}.pdf`, mimeType: 'application/pdf' };
    }

    case 'pdf-to-excel': {
      assertFiles(files, 1, 1);
      const text = await extractTextFromPdf(first, onProgress);
      const rows = text.split('\n').map((line) => [line]);
      const sheet = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'Text');
      const array = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([array], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      return { blob, filename: `${base}.xlsx`, mimeType: blob.type };
    }

    case 'excel-to-pdf': {
      assertFiles(files, 1, 1);
      if (!/\.xlsx$/i.test(first.name)) throw new Error('Only XLSX is supported. Please save your file as .xlsx and try again.');
      onProgress?.('converting', 30);
      const bytes = await fileToUint8Array(first);
      const wb = XLSX.read(bytes, { type: 'array' });
      const firstSheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[firstSheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      onProgress?.('converting', 70);
      const pdfBytes = await createPdfFromText(csv || '(No content found.)');
      onProgress?.('converting', 100);
      return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), filename: `${base}.pdf`, mimeType: 'application/pdf' };
    }

    case 'powerpoint-to-pdf': {
      assertFiles(files, 1, 1);
      if (!/\.pptx$/i.test(first.name)) throw new Error('Only PPTX is supported. Please save your file as .pptx and try again.');
      onProgress?.('converting', 30);
      const text = await pptxToText(first);
      onProgress?.('converting', 70);
      const pdfBytes = await createPdfFromText(text || '(No text found.)');
      onProgress?.('converting', 100);
      return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), filename: `${base}.pdf`, mimeType: 'application/pdf' };
    }

    default: {
      throw new Error('This tool is not implemented yet.');
    }
  }
}
