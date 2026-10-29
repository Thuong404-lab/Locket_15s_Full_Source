# Kiểm tra source Locket — 30/10/2026

> Bản v4 mới nhất: đã sửa cả 3 lỗi mock còn lại. del_header.js tìm/gộp tên header không phân biệt hoa/thường và không sửa trực tiếp object đầu vào. Locket.js kiểm tra User-Agent, JSON, subscriber, subscriptions và entitlements trước khi sửa; phản hồi bất thường được giữ nguyên qua $done({}) đúng một lần trong test. Thêm kiểm tra đầu vào sai, header trùng và bảo toàn dữ liệu hợp lệ. **33/33 test đạt, 0 lỗi.** Module trỏ hai script đã sửa qua ?v=4; Remote Config/caption vẫn là RC v3. Các lỗi/kết quả bên dưới là lịch sử. Chưa có bằng chứng sửa được vấn đề âm thanh phía người nhận hoặc Tạo diện mạo trên thiết bị.

> Đợt RC v3: thêm 8 caption cá nhân theo thứ tự người dùng yêu cầu vào nhóm đầu. Tổng 263 caption / 11 nhóm, không trùng ID. Test checksum xác nhận toàn bộ 10 nhóm/255 caption của RC v2 giữ nguyên nội dung và thứ tự. Mock: 29 test, 26 đạt, 3 lỗi cũ header/RevenueCat. Người dùng báo video có tiếng trong lịch sử máy gửi nhưng phía nhận không nghe, bộ lọc hiện giao diện nhưng chưa dùng được Tạo diện mạo. Chưa có log/file phía nhận; chưa kết luận nguyên nhân hoặc sửa âm thanh/bộ lọc. Chưa xác nhận caption mới trên iPhone. Log phiên bản mới là [Locket RC v3]; xem README.md.

> Đợt RC v2: người dùng báo Locket 2.70.0 chỉ quay 3 giây, không thấy caption/âm thanh mong muốn và mất thay đổi khi tắt Shadowrocket. Đã tái hiện bằng mock: User-Agent không chứa Locket làm bản cũ bỏ qua toàn bộ cấu hình. Chưa có log để xác nhận đây là nguyên nhân trên thiết bị. Bản mới nhận diện theo URL project/endpoint, chỉ sửa phản hồi UPDATE có entries hợp lệ, thêm log trạng thái, bỏ macro hostname xuất hiện nguyên văn trên thiết bị và thêm ?v=2 vào URL script để phân biệt bản tải. Mock mới: 28 test, 25 đạt, 3 lỗi cũ ở RevenueCat/header còn tồn tại. Chưa có kết quả kiểm thử RC v2 trên iPhone. Xem README.md cho cách chẩn đoán. Các mục dưới đây là lịch sử kiểm tra, không phải trạng thái mới nhất.

> Cập nhật sau lần kiểm tra ban đầu: người dùng đã chọn công khai repo. Module đã thay SCRIPT_BASE_URL bằng URL Raw của repo Thuong404-lab/Locket_15s_Full_Source, nhánh main. Chạy lại mock: 24 test, 19 đạt, 5 không đạt; mục URL HTTPS đã đạt, 5 lỗi xử lý đầu vào/header vẫn tồn tại. Phần bên dưới lưu kết quả kiểm tra ban đầu. Chưa kiểm thử trên iPhone.

## Kết luận

Đủ thành phần của bộ rewrite: 4 script JavaScript và 1 module. Chưa phải bộ cài đặt sẵn dùng: module còn SCRIPT_BASE_URL và chưa kiểm thử trên iPhone. Đây không phải source ứng dụng Locket hay IPA độc lập.

Đã đọc 7 file ban đầu, phân tích cú pháp toàn bộ JavaScript, duyệt cấu trúc cấu hình/caption và chạy mock cục bộ. Chỉ bổ sung báo cáo này và tests/source.test.cjs; giữ nguyên 4 script, module và README. Không triển khai server, tải script ngoài hoặc bật MITM.

## Kiểm kê và đối chiếu

| File | Vai trò | Nhận xét |
| --- | --- | --- |
| Locket.js | Sửa phản hồi RevenueCat, giả lập quyền Gold | Có đủ file; không tạo giao dịch mua. Thiếu kiểm tra JSON, User-Agent và cấu trúc subscriber. Có nhánh sửa subscription/entitlement cả khi không khớp Locket. |
| del_header.js | Xóa giá trị ETag và đặt header IP/quốc gia | Có đủ file; không đổi IP công khai. Hàm tìm header chỉ nhận đúng tên hoặc tên viết thường, không xử lý mọi kiểu hoa/thường. |
| Locket_Unlocked_Clean.js | Sửa Firebase Remote Config | Có camera, thư viện, âm thanh, caption, widget và nhiều chức năng khác. Không bảo vệ JSON.parse ở đầu file. |
| Locket_rc_us.js | Đặt country_code=us, time_zone=America/New_York cho body POST | Có try/catch; giữ các trường JSON không liên quan trong thử nghiệm object. Không phải công cụ đổi địa chỉ mạng hay vùng tài khoản. |
| Locket_15s.sgmodule | Điều phối 4 script và khai báo MITM | Tên khác Locket.sgmodule trong bàn giao nhưng đủ 4 tham chiếu đúng tên file. Cả 4 script-path còn SCRIPT_BASE_URL. |
| README.txt | Mô tả yêu cầu HTTPS/rewrite | Có thông tin tối thiểu; chưa có hướng dẫn kiểm thử thiết bị. |
| README.md | Tên dự án | Chỉ có tiêu đề. |

Không có bản gốc trong thư mục. Commit duy nhất trong Git chỉ chứa README.md; các script đang untracked tại thời điểm kiểm tra. Vì vậy chưa thể làm diff bản gốc/bản sửa hoặc chứng minh mọi caption và chức năng cũ đã được giữ nguyên. Bảng sau chỉ đối chiếu với mô tả bàn giao của người dùng:

| Hạng mục | Bản cũ theo bàn giao | Source hiện tại |
| --- | --- | --- |
| Camera trực tiếp | 4 giới hạn = 60 | Cả 4 = 15 |
| Giới hạn video thư viện | 30 | 9 trường duration = 0 |
| 4 cờ video/upload thư viện | true | Chuỗi "false" |
| Ảnh thư viện | Giữ bật | feature_gates.camera_roll="enabled", upsell_features.camera_roll=true, preview="true" |
| Âm thanh/microphone | true | 3 cờ giữ chuỗi "true" |
| Caption mẫu | Bổ sung 6 câu | Có đủ cả nội dung và emoji tương ứng |

## Kết quả kiểm tra

Chạy bằng Node.js v22.19.0, không cài thư viện:

```powershell
node --test tests/source.test.cjs
```

Kết quả: **24 test, 18 đạt, 6 không đạt**, exit code 1. Các test không đạt được giữ nguyên để thể hiện lỗi/tình trạng hiện tại, chưa sửa production code cho lần kiểm tra này.

Các kiểm tra đạt gồm: cú pháp của 4 JS; đủ tham chiếu module; camera 15 giây; cấu hình ảnh/video thư viện; âm thanh; JSON lồng trong Remote Config; caption ID/schema cơ bản; 6 caption mẫu; giữ entry không bị script gán đè; xử lý User-Agent viết thường; lỗi streak_config cục bộ; request vùng US và header ở cách viết thông thường.

Sáu kiểm tra không đạt:

1. **Module chưa sẵn dùng:** script-path chưa phải URL HTTPS thực, còn SCRIPT_BASE_URL.
2. **Remote Config không phải JSON:** JSON.parse tại dòng 2 ném lỗi, không gọi $done.
3. **Remote Config là null:** gán Attention tại dòng 5 ném lỗi.
4. **Header khác kiểu hoa/thường:** input X-Revenuecat-Etag còn giá trị cũ đồng thời xuất hiện X-RevenueCat-ETag mới; có hai key cùng tên theo quy tắc không phân biệt hoa/thường của HTTP.
5. **RevenueCat trả object lỗi không có subscriber:** truy cập subscriptions ném lỗi.
6. **RevenueCat thiếu User-Agent:** gọi includes trên undefined ném lỗi.

Phân tích AST bằng parser Acorn đi kèm bản Node đang cài còn phát hiện:

- Duplicate key thực sự: rollcall_profile_memories_enabled trong cùng object tại Locket_Unlocked_Clean.js:640 và :647. Hai giá trị đều "true", nên hiện chưa gây khác biệt đầu ra.
- Gán lại khác giá trị: show_no_friends_bottom_sheet, widget_stale_state_enabled, widget_last_sent_indicator và share_history_prompt_enabled đều từ "false" thành "true" ở cuối script.
- share_history_config bị thay prompt_enabled từ false thành true.
- Một số key khác được gán lại cùng giá trị: time_travel_rewind_v2_enabled, calendar_rewind_enabled, locket_yearbook_story_sharing_encouraged, rollcall_enabled, rollcall_profile_button, rollcall_profile_memories_enabled, birthday_feature_config.
- JSON được xuất ra hợp lệ; không phát hiện lỗi parse trong các entry chứa object/array JSON.
- 255 caption/10 nhóm, không trùng overlay_id. Đây là kiểm tra cấu trúc cơ bản, không xác nhận iOS hỗ trợ mọi kiểu caption, biểu tượng hoặc màu.

## Giữ chức năng cũ và rủi ro ngoài phạm vi

- Script thay toàn bộ các object camera, camera_roll, feature_gates và toàn bộ overlay_items bằng cấu hình cố định. Trường mới/caption có sẵn trong phản hồi nhưng không nằm trong danh sách này sẽ không được giữ. Không có baseline để xác nhận danh sách caption cũ của bộ source vẫn đầy đủ.
- File Remote Config còn sửa ads, Sentry, bạn bè, cache, CDN, onboarding, quyền riêng tư, widget và nhiều cờ khác. Không thể chứng minh đây là thay đổi mới hay phần đã có từ bản gốc. Chưa chỉnh các phần này.
- widget_rewind_event cố định cho tháng 9/2026, kết thúc 01/10/2026, đã qua tại ngày kiểm tra. Chưa đổi vì ngoài mục tiêu.
- live_photos.video vẫn true. Cờ này không tự chứng minh có thể chọn/gửi video từ thư viện; cần kiểm tra riêng đường gửi Live Photo trên iPhone.
- Giá trị duration=0 không được coi là bằng chứng app cấm video. Kết luận thư viện chỉ ảnh ở mức mock dựa thêm vào 4 cờ video=false; cách app diễn giải các key này chưa kiểm chứng.

## URL ngoài, dữ liệu và MITM

Không phát hiện lời gọi HTTP trực tiếp, eval, import/require hay API lưu trữ của proxy trong 4 script. Điều này không chứng minh an toàn tuyệt đối hoặc tính toàn vẹn của bản script sẽ được host trong tương lai.

Các URL HTTPS trong JavaScript hiện tại:

- https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png — ảnh widget bên thứ ba. Nếu app tải ảnh, máy chủ đó có thể quan sát request và IP của phía tải; chưa xác minh máy chủ hoặc nội dung ảnh.
- https://storage.googleapis.com/locket-public/journal_calendar_assets/holiday_indicators/halloween_indicator%403x.png — icon caption.
- https://public.locketcamera.com/locket-public/overlays/forgotten_island/forgotten_island_bg.png — nền caption.

Cấu hình còn có cdn.locketcamera.com và các bucket gs://locket-filters, gs://locket-img, gs://locket-video. Chưa xác minh quyền sở hữu, tính khả dụng hay request thực tế của các địa chỉ này; không có URL chứa token phát hiện trong source.

Module khai báo MITM hai host api.revenuecat.com và firebaseremoteconfig.googleapis.com. Rule Firebase giới hạn project locket-4252a; hai rule RevenueCat không giới hạn riêng app Locket. del_header.js không kiểm tra app, còn Locket.js có nhánh mặc định sửa entitlement pro khi User-Agent không khớp mapping. Vì vậy có nguy cơ sửa lưu lượng của app khác dùng RevenueCat khi rule khớp.

MITM có thể cho công cụ proxy/script tiếp cận header, body, định danh và token trong request/response được giải mã. Kiểm tra này chỉ dùng giá trị mock, không đọc token thực, không kết nối API Locket và không bật MITM. Các URL script còn là placeholder nên chưa có chuỗi cung cấp script từ xa để xác minh hoặc khóa phiên bản.

## Phần chưa kiểm thử và kế hoạch nếu sửa

Chưa thử trên Shadowrocket/iPhone: cú pháp module và tham số theo phiên bản ứng dụng; việc rule có khớp request thực tế; quyền microphone iOS; video quay đủ 15 giây có âm thanh; gửi/nhận/phát video; server chấp nhận thời lượng; chỉ chọn được ảnh; đường Live Photo; hiển thị caption và widget.

Thứ tự sửa đề xuất: (1) bảo vệ JSON/shape đầu vào và bảo đảm $done đúng một lần; (2) xử lý tên header không phân biệt hoa/thường; (3) giới hạn tác động RevenueCat theo app; (4) xử lý key trùng sau khi thống nhất giá trị cần giữ; (5) chỉ cấu hình URL host do người dùng chọn; (6) có baseline rồi mới thay chiến lược merge để bảo toàn trường/caption cũ. Mọi thay đổi cần chạy lại mock trước khi kiểm thử thiết bị. Không tự triển khai host hoặc bật MITM.
