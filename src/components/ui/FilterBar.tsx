'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export interface FilterOption {
  value: string;   // '' = all
  label: string;
}

interface Props {
  options: FilterOption[];
  paramKey?: string;   // URL param name, default 'cat'
  currentValue: string;
}

export default function FilterBar({ options, paramKey = 'cat', currentValue }: Props) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function handleSelect(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    // Reset to page 1 whenever filter changes
    params.delete('page');
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        opacity: pending ? 0.6 : 1,
        transition: 'opacity .15s',
      }}
      role="group"
      aria-label="Filter"
    >
      {options.map((opt) => {
        const active = currentValue === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            aria-pressed={active}
            style={{
              padding: '6px 16px',
              borderRadius: '2px',
              border: active
                ? '1px solid #FF6B35'
                : '1px solid rgba(255,255,255,0.12)',
              background: active
                ? 'rgba(255,107,53,0.12)'
                : 'rgba(255,255,255,0.04)',
              color: active ? '#FF6B35' : 'rgba(255,255,255,0.55)',
              fontSize: '0.75rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: active ? 600 : 400,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all .15s',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
