export function stripExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot <= 0) return filename;
  return filename.slice(0, lastDot);
}

export function withExtension(filename: string, extensionWithDot: string): string {
  const base = stripExtension(filename);
  return `${base}${extensionWithDot}`;
}

export function safeBaseName(filename: string): string {
  const base = stripExtension(filename).trim() || 'file';
  return base.replace(/[\\/:*?"<>|]+/g, '_');
}

