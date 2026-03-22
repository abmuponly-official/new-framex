# FrameX Website

**Giải pháp 3-trong-1 cho phần khung và vỏ công trình**

---

## 🌐 URLs

| Môi trường | URL |
|---|---|
| **Production** | https://framex.pages.dev |
| **Sandbox Preview** | https://3000-iyfux5oufvxluzikcgtts-2b54fc91.sandbox.novita.ai/vi |
| **Admin Panel** | /admin/login |

---

## ✅ Tính năng đã hoàn thành

### Public Website
- **Bilingual (VI/EN)** — tự động detect IP (Vietnam → VI, khác → EN), manual switch
- **Homepage** với 9 sections: Hero, Guided Question, Bridge, Pain, Solution, Audience Split, Projects, Trust, Final CTA
- **Giải pháp 3-trong-1** — kết cấu thép tiền chế, cách nhiệt, chống thấm; 3 gói Basic/Premium/Custom
- **3 Persona pages** — Chủ đầu tư, Nhà thầu, Kiến trúc sư (pain points + value props riêng biệt)
- **Dự án** — danh sách từ Supabase, filter theo danh mục, proof chips (water-test, CO)
- **Blog/Tin tức** — danh sách bài viết từ Supabase, reading time
- **Legal** — Chính sách bảo mật, Điều khoản sử dụng
- **Trang liên hệ** — form gửi lead, lưu vào Supabase `leads`
- **SEO** — semantic HTML, JSON-LD (LocalBusiness, Service, Article), hreflang, canonical, sitemap.xml, robots.txt

### Admin CMS (`/admin`)
- **Login** — Supabase Auth email/password
- **Dashboard** — stats cards, recent leads, audit preview, quick actions
- **Dự án CRUD** — bilingual editor (4 tab: Basic, Nội dung, SEO, Media), slug auto-gen, publish/draft
- **Bài viết CRUD** — bilingual rich-text editor, category (4 content pillars), SEO fields
- **Leads** — table với inline status update, ghi chú, filter theo vai trò/trạng thái
- **Thư viện Media** — upload ảnh lên Supabase Storage, folder tabs, copy URL, xoá
- **Cài đặt** — bilingual site settings (email, phone, address, social links)
- **Nhật ký** — audit log INSERT/UPDATE/DELETE với JSON diff
- **Quản lý người dùng** — invite by email, phân quyền (Super Admin / Editor / Viewer), xoá

### CI/CD
- **GitHub Actions** — quality gate (TypeScript) → build → deploy Cloudflare Pages
- **Production** deploy khi push vào `main`
- **Preview** deploy khi push `develop` hoặc mở PR
- **Health check** sau deploy production

---

## 🏗️ Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, SSG + SSR) |
| Language | TypeScript strict |
| Styling | Tailwind CSS v3 |
| i18n | next-intl (VI/EN, locale prefix) |
| Database | Supabase PostgreSQL (D1-style via REST) |
| Auth | Supabase Auth (email/password + magic link invite) |
| Storage | Supabase Storage (framex-media bucket) |
| Deployment | Cloudflare Pages |
| CI/CD | GitHub Actions |

---

## 🗄️ Data Models

| Table | Mô tả |
|---|---|
| `projects` | Dự án — bilingual fields, gallery, proof docs, SEO |
| `posts` | Bài viết blog — bilingual, content pillars, SEO |
| `leads` | Khách hàng tiềm năng từ contact form |
| `user_roles` | RBAC: super_admin / editor / viewer |
| `audit_log` | Lịch sử thay đổi mọi bảng |
| `site_settings` | Cài đặt website dạng key-value song ngữ |

---

## 🚀 Setup mới (Beginner Guide)

### 1. Clone repo
```bash
git clone https://github.com/YOUR_ORG/framex.git
cd framex
npm install
```

### 2. Supabase Setup
1. Tạo project tại [supabase.com](https://supabase.com)
2. Chạy `supabase/migrations/0001_initial_schema.sql` trong SQL Editor
3. Chạy `supabase/migrations/0002_storage_and_users.sql` (tạo Storage bucket + RLS)
4. Chạy `supabase/seed.sql` (dữ liệu mẫu 3 dự án)
5. Copy credentials vào `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://framex.pages.dev
```

### 3. Tạo tài khoản Admin đầu tiên
- Supabase Dashboard → **Authentication → Users → Add User**
- Điền email + password → Save
- Đăng nhập tại `/admin/login`

### 4. Deploy lên Cloudflare Pages

```bash
# Setup GitHub Secrets (Settings → Secrets → Actions):
# CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL

# Push to main → auto deploy
git push origin main
```

### 5. Cloudflare Pages — thiết lập lần đầu
1. Vào [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create Project
2. Connect GitHub repo
3. Build settings: `npm run build`, output: `.next`
4. Thêm Environment Variables (từ `.env.local`)
5. Enable `nodejs_compat` flag trong Settings → Functions

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── [locale]/          # Public pages (vi + en)
│   │   ├── page.tsx       # Homepage
│   │   ├── du-an/         # Projects list + detail
│   │   ├── tin-tuc/       # Blog list + article
│   │   ├── giai-phap-3-trong-1/
│   │   ├── chu-dau-tu/    # Persona pages
│   │   ├── nha-thau/
│   │   ├── kien-truc-su/
│   │   ├── lien-he/
│   │   ├── ve-chung-toi/
│   │   ├── chinh-sach-bao-mat/
│   │   └── dieu-khoan-su-dung/
│   ├── admin/             # CMS (auth-protected)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── posts/
│   │   ├── leads/
│   │   ├── media/
│   │   ├── users/
│   │   ├── settings/
│   │   └── audit/
│   └── api/
│       ├── contact/       # Public contact form
│       └── admin/         # Protected API routes
│           ├── projects/
│           ├── posts/
│           ├── leads/
│           ├── upload/
│           ├── users/
│           └── settings/
├── components/
│   ├── admin/             # Admin UI components
│   ├── layout/            # Header, Footer
│   ├── sections/          # Homepage sections
│   └── seo/               # JsonLd, metadata helpers
├── lib/
│   ├── i18n/              # next-intl config
│   └── supabase/          # client, server, admin clients
├── messages/
│   ├── vi.json            # Vietnamese UI strings
│   └── en.json            # English UI strings
└── types/
    └── content.ts         # TypeScript types for DB models
supabase/
├── migrations/
│   ├── 0001_initial_schema.sql
│   └── 0002_storage_and_users.sql
└── seed.sql
.github/workflows/
├── deploy.yml             # Main CI/CD pipeline
└── preview-comment.yml    # PR preview comments
```

---

## 📌 Deployment Status

- **Platform**: Cloudflare Pages
- **Status**: 🟡 Ready to deploy — push to GitHub to trigger CI/CD
- **Tech Stack**: Next.js 14 + TypeScript + Tailwind + Supabase + Cloudflare Pages
- **Last Updated**: 2026-03-22
- **Build**: ✅ 46/46 pages compiling successfully
