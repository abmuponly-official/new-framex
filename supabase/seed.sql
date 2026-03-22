-- FrameX Seed Data — 3 dự án đầu tiên
-- Chạy trong SQL Editor của Supabase sau khi đã chạy migration

INSERT INTO projects (
  slug,
  title_vi, title_en,
  excerpt_vi, excerpt_en,
  content_vi, content_en,
  category,
  client_name, location, year,
  tags,
  has_watertest, has_co,
  featured, status, published_at,
  sort_order,
  meta_title_vi, meta_title_en,
  meta_desc_vi, meta_desc_en
) VALUES

-- 1. Tuệ House
(
  'tue-house',
  'Tuệ House — Nhà phố tích hợp 3-trong-1',
  'Tuệ House — 3-in-1 Urban Townhouse',
  'Nhà phố trong hẻm nhỏ, yêu cầu tiến độ gọn, không có chỗ cho nhiều đầu mối.',
  'A townhouse in a narrow alley — tight schedule, no room for multiple contractors.',
  '<h2>Bài toán</h2>
<p>Tuệ House là nhà phố trong hẻm nhỏ tại TP.HCM. Diện tích hạn chế, tiến độ cần gọn, chủ nhà không thể theo dõi nhiều đầu mối thi công cùng lúc.</p>
<h2>Phạm vi FrameX</h2>
<p>FrameX đảm nhận toàn bộ phần khung thép tiền chế, cách nhiệt mái và tường, và hệ chống thấm mái + sân thượng trong một gói duy nhất. Một bộ bản vẽ, một tiến độ, một đầu mối.</p>
<h2>Kết quả</h2>
<p>Hoàn thành phần khung và vỏ trong 6 tuần. Water-test được thực hiện 48 giờ trước nghiệm thu — không có điểm thấm. CO được phát hành đúng quy trình, không phát sinh mập mờ.</p>',
  '<h2>The Problem</h2>
<p>Tuệ House is a townhouse in a narrow alley in Ho Chi Minh City. Limited space, tight deadline, and the owner could not manage multiple contractors simultaneously.</p>
<h2>FrameX Scope</h2>
<p>FrameX handled the complete pre-engineered steel frame, roof and wall insulation, and roof + terrace waterproofing as a single package. One drawing set, one schedule, one contact.</p>
<h2>Outcome</h2>
<p>Frame and envelope completed in 6 weeks. Water-test conducted 48 hours before handover — zero leak points. Change orders issued transparently with no ambiguous extras.</p>',
  'residential',
  'Anh Tuệ', 'TP. Hồ Chí Minh', 2024,
  ARRAY['residential', 'steel-frame', 'waterproofing', 'insulation'],
  true, true,
  true, 'published', now(),
  1,
  'Tuệ House — Nhà phố 3-trong-1 | FrameX',
  'Tuệ House — 3-in-1 Townhouse | FrameX',
  'Nhà phố trong hẻm nhỏ, hoàn thành phần khung và vỏ trong 6 tuần với kết quả water-test đạt 100%.',
  'Urban townhouse with frame and envelope completed in 6 weeks, water-test passed with zero leak points.'
),

-- 2. Gold Coffee
(
  'gold-coffee',
  'Gold Coffee — Kiểm soát chống thấm trong không gian F&B',
  'Gold Coffee — Waterproofing Control for F&B Space',
  'Không gian F&B với yêu cầu kiểm soát độ ẩm và chống thấm nghiêm ngặt trong khí hậu mưa ẩm.',
  'An F&B space requiring strict moisture control and waterproofing in a humid tropical climate.',
  '<h2>Bài toán</h2>
<p>Gold Coffee là không gian F&B tại TP.HCM. Mái bằng, nhiều điểm giao nhau giữa kết cấu và vỏ bao, nguy cơ thấm cao trong mùa mưa. Chủ đầu tư đã từng xử lý thấm 2 lần mà không giải quyết được gốc rễ.</p>
<h2>Phạm vi FrameX</h2>
<p>FrameX phân tích toàn bộ điểm giao nhau giữa kết cấu thép, mái, và hệ tường bao. Thiết kế lại hệ chống thấm tích hợp từ layer kết cấu đến lớp hoàn thiện. Kết hợp cách nhiệt để giảm hiện tượng đọng sương bên trong.</p>
<h2>Kết quả</h2>
<p>Sau 1 mùa mưa đầu tiên — không có điểm thấm mới. Nhiệt độ bên trong giảm đáng kể so với trước khi cải tạo. CO minh bạch, toàn bộ phát sinh được xác nhận trước thi công.</p>',
  '<h2>The Problem</h2>
<p>Gold Coffee is an F&B space in Ho Chi Minh City. Flat roof, multiple interface points between structure and envelope, high leak risk during rainy season. The owner had addressed leaks twice previously without resolving the root cause.</p>
<h2>FrameX Scope</h2>
<p>FrameX analyzed all interface points between the steel structure, roof, and wall envelope. Redesigned an integrated waterproofing system from the structural layer to the finish layer. Combined with insulation to reduce internal condensation.</p>
<h2>Outcome</h2>
<p>After the first rainy season — no new leak points. Internal temperature noticeably reduced compared to before renovation. Transparent CO process; all cost changes confirmed before construction.</p>',
  'fnb',
  'Gold Coffee', 'TP. Hồ Chí Minh', 2024,
  ARRAY['fnb', 'waterproofing', 'insulation', 'renovation'],
  true, true,
  true, 'published', now(),
  2,
  'Gold Coffee — Chống thấm F&B | FrameX',
  'Gold Coffee — F&B Waterproofing | FrameX',
  'Giải quyết dứt điểm bài toán thấm cho không gian F&B sau 2 lần xử lý thất bại.',
  'Permanently resolved waterproofing issues for an F&B space after 2 failed previous attempts.'
),

-- 3. Cozy''s Homestay
(
  'cozys-homestay',
  'Cozy''s Homestay — Triển khai module trên địa hình sườn đồi',
  'Cozy''s Homestay — Modular Build on Hillside Terrain',
  'Triển khai cấu trúc thép module trên địa hình dốc, yêu cầu thi công nhanh và kiểm soát tải trọng chính xác.',
  'Deploying modular steel structures on sloped terrain, requiring fast construction and precise load control.',
  '<h2>Bài toán</h2>
<p>Cozy''s Homestay nằm trên sườn đồi tại vùng ngoại ô. Địa hình dốc, khó tiếp cận, không thể dùng phương pháp thi công truyền thống. Chủ đầu tư cần hoàn thành trước mùa mưa.</p>
<h2>Phạm vi FrameX</h2>
<p>FrameX thiết kế hệ kết cấu thép tiền chế dạng module, lắp ráp tại xưởng và vận chuyển lên công trình. Hệ cách nhiệt tường và mái được tích hợp sẵn vào module. Chống thấm toàn bộ điểm nối giữa các module và mặt đất.</p>
<h2>Kết quả</h2>
<p>Hoàn thành lắp đặt toàn bộ khung trong 3 tuần — nhanh hơn 40% so với ước tính ban đầu. Không có sự cố kết cấu sau 1 năm vận hành. Water-test toàn bộ mái và điểm nối: đạt.</p>',
  '<h2>The Problem</h2>
<p>Cozy''s Homestay is located on a hillside in a suburban area. Sloped terrain, difficult access, and conventional construction methods were not viable. The owner needed completion before the rainy season.</p>
<h2>FrameX Scope</h2>
<p>FrameX designed a modular pre-engineered steel structure system, fabricated in the workshop and transported to site. Wall and roof insulation was pre-integrated into the modules. Comprehensive waterproofing at all module joints and ground interfaces.</p>
<h2>Outcome</h2>
<p>Complete frame installation finished in 3 weeks — 40% faster than initial estimate. No structural issues after 1 year of operation. Water-test on all roofs and joints: passed.</p>',
  'hospitality',
  'Cozy''s Homestay', 'Vùng ngoại ô TP.HCM', 2023,
  ARRAY['hospitality', 'modular', 'steel-frame', 'hillside', 'waterproofing'],
  true, true,
  true, 'published', now(),
  3,
  'Cozy''s Homestay — Khung thép module sườn đồi | FrameX',
  'Cozy''s Homestay — Modular Steel on Hillside | FrameX',
  'Hoàn thành khung thép module trên địa hình dốc trong 3 tuần, nhanh hơn 40% ước tính.',
  'Completed modular steel frame on sloped terrain in 3 weeks — 40% faster than estimated.'
);
