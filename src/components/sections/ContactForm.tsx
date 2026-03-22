'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default function ContactForm({ locale }: Props) {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    role: '', message: '', privacyAgreed: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyAgreed) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start justify-center min-h-[300px]">
        <div className="w-8 h-8 bg-brand-black text-brand-white rounded-sm flex items-center justify-center text-lg mb-6">
          ✓
        </div>
        <p className="text-xl font-semibold text-brand-black">{t('success')}</p>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3 border border-brand-gray-200 rounded-sm text-brand-black text-sm ' +
    'focus:outline-none focus:border-brand-black transition-colors bg-transparent ' +
    'placeholder:text-brand-gray-400';

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-brand-gray-600 mb-1.5">
            {t('name')} *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
            placeholder={locale === 'vi' ? 'Nguyễn Văn A' : 'John Smith'}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-brand-gray-600 mb-1.5">
            {t('phone')}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+84 xxx xxx xxx"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-medium text-brand-gray-600 mb-1.5">
          {t('email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-xs font-medium text-brand-gray-600 mb-1.5">
          {t('role')}
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">—</option>
          <option value="investor">{t('role_investor')}</option>
          <option value="contractor">{t('role_contractor')}</option>
          <option value="architect">{t('role_architect')}</option>
          <option value="homeowner">{t('role_homeowner')}</option>
          <option value="other">{t('role_other')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-medium text-brand-gray-600 mb-1.5">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={inputClass + ' resize-none'}
          placeholder={locale === 'vi' ? 'Mô tả ngắn về dự án của bạn...' : 'Brief description of your project...'}
        />
      </div>

      {/* Privacy consent */}
      <div className="flex items-start gap-3">
        <input
          id="privacyAgreed"
          name="privacyAgreed"
          type="checkbox"
          checked={formData.privacyAgreed}
          onChange={handleChange}
          className="mt-0.5 w-4 h-4 rounded-sm border-brand-gray-300 accent-brand-black"
        />
        <label htmlFor="privacyAgreed" className="text-sm text-brand-gray-500 leading-relaxed">
          {t('privacy_agree')}{' '}
          <a href={`/${locale}/chinh-sach-bao-mat`} className="underline hover:text-brand-black transition-colors">
            {t('privacy_link')}
          </a>
        </label>
      </div>

      <p className="text-xs text-brand-gray-400">{t('promise')}</p>

      {status === 'error' && (
        <p className="text-sm text-red-500">{t('error')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting' || !formData.privacyAgreed || !formData.name}
        className="w-full py-3.5 bg-brand-black text-brand-white text-sm font-medium
          hover:bg-brand-gray-800 transition-colors rounded-sm
          disabled:opacity-50 disabled:pointer-events-none"
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
