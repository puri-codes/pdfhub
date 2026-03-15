function parsePositiveInt(value: string): number | null {
  const n = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function clampPage(page1Based: number, pageCount: number): number {
  return Math.min(Math.max(page1Based, 1), pageCount);
}

export function parsePageList(input: string, pageCount: number): number[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const pages = new Set<number>();
  const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeParts = part.split('-').map((p) => p.trim()).filter(Boolean);
    if (rangeParts.length === 1) {
      const page1Based = parsePositiveInt(rangeParts[0]);
      if (page1Based == null) continue;
      const clamped = clampPage(page1Based, pageCount);
      pages.add(clamped - 1);
      continue;
    }

    if (rangeParts.length === 2) {
      const start1Based = parsePositiveInt(rangeParts[0]);
      const end1Based = parsePositiveInt(rangeParts[1]);
      if (start1Based == null || end1Based == null) continue;

      const start = clampPage(start1Based, pageCount);
      const end = clampPage(end1Based, pageCount);
      const [lo, hi] = start <= end ? [start, end] : [end, start];
      for (let p = lo; p <= hi; p++) pages.add(p - 1);
      continue;
    }
  }

  return [...pages].sort((a, b) => a - b);
}

export function parsePageSegments(input: string, pageCount: number): number[][] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const segments: number[][] = [];
  const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeParts = part.split('-').map((p) => p.trim()).filter(Boolean);
    if (rangeParts.length === 1) {
      const page1Based = parsePositiveInt(rangeParts[0]);
      if (page1Based == null) continue;
      const clamped = clampPage(page1Based, pageCount);
      segments.push([clamped - 1]);
      continue;
    }

    if (rangeParts.length === 2) {
      const start1Based = parsePositiveInt(rangeParts[0]);
      const end1Based = parsePositiveInt(rangeParts[1]);
      if (start1Based == null || end1Based == null) continue;

      const start = clampPage(start1Based, pageCount);
      const end = clampPage(end1Based, pageCount);
      const [lo, hi] = start <= end ? [start, end] : [end, start];
      const pages: number[] = [];
      for (let p = lo; p <= hi; p++) pages.push(p - 1);
      segments.push(pages);
      continue;
    }
  }

  return segments;
}

export function parsePageOrder(input: string, pageCount: number): number[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);
  const order: number[] = [];
  const seen = new Set<number>();

  for (const part of parts) {
    const page1Based = parsePositiveInt(part);
    if (page1Based == null) continue;
    if (page1Based < 1 || page1Based > pageCount) continue;
    const page0Based = page1Based - 1;
    if (seen.has(page0Based)) continue;
    seen.add(page0Based);
    order.push(page0Based);
  }

  return order;
}

