'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  // Build page number list with ellipsis
  function buildPages(): (number | '…')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    if (currentPage > 3) pages.push('…');
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
    return pages;
  }

  const btnBase: React.CSSProperties = {
    minWidth: 36,
    height: 36,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.55)',
    fontSize: '0.8125rem',
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    transition: 'all .15s',
    padding: '0 8px',
  };

  const btnActive: React.CSSProperties = {
    ...btnBase,
    border: '1px solid #FF6B35',
    background: 'rgba(255,107,53,0.12)',
    color: '#FF6B35',
    fontWeight: 600,
  };

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    opacity: 0.3,
    cursor: 'not-allowed',
  };

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '56px',
        flexWrap: 'wrap',
        opacity: pending ? 0.6 : 1,
        transition: 'opacity .15s',
      }}
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        style={currentPage === 1 ? btnDisabled : btnBase}
        aria-label="Trang trước"
      >
        ←
      </button>

      {/* Page numbers */}
      {buildPages().map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            style={{ ...btnBase, border: 'none', background: 'none', cursor: 'default' }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => goTo(p as number)}
            style={p === currentPage ? btnActive : btnBase}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={currentPage === totalPages ? btnDisabled : btnBase}
        aria-label="Trang tiếp"
      >
        →
      </button>
    </nav>
  );
}
