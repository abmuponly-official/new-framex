# FrameX Website

## Tổng quan dự án
Website chính thức của **FrameX** — giải pháp 3-trong-1 cho phần khung và vỏ công trình: kết cấu thép tiền chế, cách nhiệt hiệu suất cao và chống thấm toàn diện.

## URL
- **Preview (sandbox):** https://3000-iyfux5oufvxluzikcgtts-2b54fc91.sandbox.novita.ai/vi
- **Production:** https://framex.vn _(sau khi deploy)_
- **Admin CMS:** `/admin` _(Phase 2)_

## Tính năng đã hoàn thành (Phase 1)

### Pages
| Route (VI) | Vai trò |
|---|---|
| `/vi` | Homepage — 9 sections đầy đủ |
| `/vi/giai-phap-3-trong-1` | Giải thích giải pháp 3-trong-1 |
| `/vi/chu-dau-tu` | Persona page — Chủ đầu tư |
| `/vi/nha-thau` | Persona page — Nhà thầu |
| `/vi/kien-truc-su` | Persona page — Kiến trúc sư |
| `/vi/du-an` | Danh sách dự án (SSG + Supabase) |
| `/vi/du-an/[slug]` | Chi tiết dự án (ISR 60s) |
| `/vi/tin-tuc` | Blog / Tin tức (SSG + Supabase) |
| `/vi/tin-tuc/[slug]` | Chi tiết bài viết (ISR 60s) |
| `/vi/lien-he` | Liên hệ + Contact form |
| `/vi/ve-chung-toi` | Về chúng tôi |
| `/vi/chinh-sach-bao-mat` | Privacy Policy |
| `/vi/dieu-khoan-su-dung` | Terms of Use |

**Tất cả pages đều có bản EN song song**, ví dụ `/en/giai-phap-3-trong-1`.

### Tính năng kỹ thuật
- ✅ **Song ngữ VI/EN** nghiêm ngặt, không mix
- ✅ **Auto language detection** theo IP (Cloudflare `CF-IPCountry` header)
- ✅ **Fallback chain**: Cookie → CF-IP → Accept-Language → VI default
- ✅ **Language switcher** manual trên header
- ✅ **SEO đầy đủ**: JSON-LD schemas, hreflang, canonical, sitemap.xml, robots.txt
- ✅ **Contact form** → Supabase `leads` table
- ✅ **Supabase RLS** — public chỉ đọc published content
- ✅ **Build verified** — 26 static pages, tất cả pass TypeScript strict

## Kiến trúc

```
Next.js 14 (App Router)
├── Frontend: Tailwind CSS v3 + lucide-react
├── i18n: next-intl (SSG-compatible với setRequestLocale)
├── Backend: Supabase (PostgreSQL + Auth + Storage)
├── Deploy: Cloudflare Pages (code trên GitHub)
└── Edge Middleware: IP detection + admin auth guard
```

## Database (Supabase)

### Tables
| Table | Mục đích |
|---|---|
| `projects` | Case studies / Dự án tiêu biểu |
| `posts` | Blog articles |
| `leads` | Contact form submissions |
| `user_roles` | Admin RBAC |
| `audit_log` | Lịch sử thay đổi |
| `site_settings` | Cài đặt site (contact info, etc.) |

### Bilingual pattern
Mỗi field text có `_vi` và `_en` suffix:
```
title_vi, title_en
content_vi, content_en
excerpt_vi, excerpt_en
meta_title_vi, meta_title_en
```

## Setup

### 1. Clone & install
```bash
git clone https://github.com/your-org/framex.git
cd framex
npm install
```

### 2. Supabase setup
1. Tạo project trên [supabase.com](https://supabase.com)
2. Chạy migration: paste `supabase/migrations/0001_initial_schema.sql` vào SQL Editor
3. Copy credentials

### 3. Environment variables
```bash
cp .env.example .env.local
# Điền vào:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
```

### 4. Run locally
```bash
npm run build
npm start
# hoặc dùng PM2:
pm2 start ecosystem.config.cjs
```

### 5. Deploy lên Cloudflare Pages
```bash
# Setup Cloudflare API key
npx wrangler login

# Deploy
npm run build
npx wrangler pages deploy .next --project-name framex
```

## Chưa triển khai (Phase 2+)

- [ ] **Admin CMS** — `/admin` với bilingual editor (Tiptap), media upload, lead management
- [ ] **Audit log viewer** trong admin
- [ ] **User management** (Super Admin / Editor / Viewer)
- [ ] **File upload** form attachment → Supabase Storage
- [ ] **GitHub Actions** CI/CD workflow file
- [ ] **Seed data** — dự án Tuệ House, Gold Coffee, Cozy's Homestay
- [ ] **Custom 404** cho locale pages
- [ ] **Performance optimization** — image CDN, font preload

## Recommended next steps

1. **Kết nối Supabase thật** — điền `.env.local` với credentials thực tế
2. **Seed initial projects** qua Supabase dashboard → `projects` table
3. **Deploy lên Cloudflare Pages** và set environment variables
4. **Build Admin CMS** (Phase 2)
5. **Review pháp lý** Privacy Policy và Terms of Use trước khi public

## Tech stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v3
- **i18n**: next-intl
- **Database**: Supabase (PostgreSQL)
- **Deploy**: Cloudflare Pages
- **Process manager**: PM2

---
*Last updated: 2026-03-22*
