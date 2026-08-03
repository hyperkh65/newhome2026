import { NextRequest, NextResponse } from 'next/server';
import { LIGHT_ENTRIES } from '@/lib/english/catalog';

const PAGE_SIZE = 40;

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = (searchParams.get('q') ?? '').trim().toLowerCase();
  const level = searchParams.get('level') ?? 'all';
  const category = searchParams.get('category') ?? 'all';
  const source = searchParams.get('source') ?? 'all';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));

  let entries = LIGHT_ENTRIES;

  if (q) {
    entries = entries.filter(
      e =>
        e.expression.toLowerCase().includes(q) ||
        e.korean.includes(q) ||
        e.definition.toLowerCase().includes(q),
    );
  }
  if (level !== 'all') entries = entries.filter(e => e.level === level);
  if (category !== 'all') entries = entries.filter(e => e.categories.includes(category));
  if (source !== 'all') entries = entries.filter(e => e.source === source);

  const total = entries.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const items = entries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return NextResponse.json({ items, total, page: currentPage, totalPages });
}
