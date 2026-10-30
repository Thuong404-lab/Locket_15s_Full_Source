# Locket_15s_Full_Source

**Tác giả:** Nguyen Tien Thuong

Source cho module rewrite Locket, gồm 4 file JavaScript và `Locket_15s.sgmodule`.

## Bản mới nhất: v7 — thử nghiệm âm thanh phía nhận

Bỏ ép `audio_session_deactivation_enabled = "true"`, giữ giá trị gốc từ Remote Config; nếu phản hồi không có trường này thì không thêm. Ba cờ `video_sound_enabled`, `microphone_enabled`, `camera_microphone_enabled` vẫn là `"true"`. Đây là thử nghiệm loại bỏ một override, chưa xác định ý nghĩa thực tế của cờ trong ứng dụng hoặc chứng minh sửa được lỗi mất tiếng. Không đổi các giá trị camera, thư viện, caption hay filter.

Module tên `Locket 15s Photo Only - v7 Audio Experiment`, script Remote Config dùng `?v=7`, log `[Locket RC v7]`. Link tải/cập nhật module: https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=7 . Cần tải lại module và script trên thiết bị để nhận bản mới; đuôi `?v=7` chỉ phân biệt URL phiên bản, không tự cập nhật script đã lưu trong máy.

Sau khi cập nhật nguồn và tải lại module/script trên thiết bị, kiểm tra log `[Locket RC v7] response rewritten`. Gửi một video mới 2–3 giây có lời nói và một video dài hơn để đối chiếu. Kiểm tra tiếng ở máy gửi và máy nhận, kể cả khi lưu ra Ảnh nếu có thể. Video cũ không được sửa âm thanh bởi thay đổi này. Nếu vẫn lỗi, chưa có căn cứ tiếp tục đổi cờ ngẫu nhiên; cần file video hoặc dữ liệu chẩn đoán bước gửi/nhận. Để hoàn tác riêng thử nghiệm âm thanh, thêm lại `audio_session_deactivation_enabled: "true"` cạnh ba cờ âm thanh và phát hành lại script với URL phiên bản mới.

Kiểm thử cục bộ: `node --test tests/source.test.cjs`. Test mock chỉ kiểm tra dữ liệu cấu hình, không kiểm tra ghi âm, upload hay phát video trên iPhone.

## Lịch sử v6 — tắt bộ lọc/Tạo diện mạo

Theo yêu cầu, tắt các cờ camera_filter, camera_filters_enabled, camera_filter_enabled, camera_filter_sheet_enabled; đặt allows_custom_filters/show_filter_button/sheet_enabled/open_sheet_immediately=false và bỏ danh sách filter Goofy/Looks cùng override bucket/cache bộ lọc. Giữ nguyên caption, camera, thư viện và âm thanh. Chưa kiểm tra giao diện trên iPhone sau cập nhật.

Người dùng đã thử phía nhận nhưng video vẫn không có tiếng; vấn đề âm thanh chưa được xác định nguyên nhân hoặc sửa trong bản này. **34/34 test mock đạt.**

Link cập nhật: https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=6

Module tên `Locket 15s Photo Only - v6`, Remote Config dùng `?v=6` và log `[Locket RC v6]`. Các phiên bản dưới đây là lịch sử.

## Lịch sử v5 — xóa nhóm caption cá nhân

Đã xóa 8 caption cá nhân đã thêm theo yêu cầu. Giữ nguyên toàn bộ **255 caption / 10 nhóm** trước đó. Các mục v4/RC v2 bên dưới là lịch sử thay đổi. Test mock mới nhất: **33/33 đạt**.

Link cập nhật: https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=5

Module tên `Locket 15s Photo Only - v5`, Remote Config dùng `?v=5` và log `[Locket RC v5]`. Script header/RevenueCat giữ bản sửa v4. Bản commit cũ vẫn lưu trong lịch sử Git.

## Lịch sử v4 — sửa 3 lỗi còn lại

Đã sửa xử lý tên header không phân biệt hoa/thường (gộp các bản ETag/quốc gia trùng tên), bảo vệ RevenueCat khi phản hồi lỗi hoặc thiếu subscriber/subscriptions/entitlements, và bỏ qua an toàn khi thiếu User-Agent. Đồng thời xử lý JSON sai, root null/array, header thiếu và User-Agent không phải chuỗi. Không tạo cấu trúc subscriber giả khi đầu vào thiếu. Luồng phản hồi hợp lệ và dữ liệu cấu hình/caption giữ như bản trước.

**Test mock mới nhất: 33/33 đạt, 0 lỗi.** Các kết quả 26/29 và 25/28 ở bên dưới là lịch sử. Điều này chưa xác nhận sửa được âm thanh phía người nhận, Tạo diện mạo hoặc mọi giới hạn trên iPhone.

Link cập nhật module v4:

https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=4

Hai script RevenueCat/header dùng URL `?v=4` để phân biệt bản tải mới; Remote Config/caption vẫn dùng RC v3 và `?v=3`. Tên module là `Locket 15s Photo Only - v4`.

Module tải script từ repo GitHub công khai này. Link tải module:

https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule

Nhập module vào ứng dụng rewrite tương thích. Cần cấu hình module/MITM/chứng chỉ trên thiết bị; repo không tự bật các chức năng này. Chưa xác minh tương thích thực tế trên Shadowrocket/iPhone hoặc việc server chấp nhận video 15 giây.

Các URL theo nhánh `main`, nên nội dung script tải về có thể thay đổi khi repo được cập nhật. Repo công khai cho phép người khác đọc và tải source.

Kiểm tra cục bộ bằng Node.js:

```sh
node --test tests/source.test.cjs
```

Xem `AUDIT.vi.md` để biết kết quả kiểm tra và các lỗi còn tồn tại. Script RevenueCat sửa dữ liệu phản hồi, không tạo giao dịch mua thật.

## Trạng thái kiểm thử trên thiết bị

Người dùng báo cáo với Locket 2.70.0: chỉ quay 3 giây, không thấy caption mẫu, chưa có âm thanh và trở về mặc định khi tắt Shadowrocket. Đây là kết quả của bản trước RC v2; chưa có kết quả trên thiết bị cho RC v2. Các cờ trong source và mock không chứng minh app hỗ trợ hoặc áp dụng chúng.

RC v2 sửa điều kiện bỏ qua toàn bộ Remote Config khi User-Agent không chứa “Locket”. Script nhận diện theo URL project `locket-4252a` và endpoint `firebase:fetch`, bảo vệ JSON lỗi và chỉ sửa phản hồi đầy đủ `state=UPDATE` với object `entries`. Giữ nguyên dữ liệu khi nhận `NO_CHANGE` hoặc lỗi, tránh thay cache bằng một bộ cấu hình thiếu. Bản module bỏ `%APPEND%` vì giao diện thiết bị hiển thị nguyên chuỗi này trong hostname. Không thay các giá trị tính năng, caption hay script RevenueCat trong lần sửa này.

Cập nhật/nhập lại module từ link Raw ở trên và bảo đảm script Remote Config đã được tải lại; URL của nó có hậu tố `?v=2`. Chỉ giữ một bản cấu hình/module Locket đang hoạt động để tránh bản cũ ghi đè. Không tự xóa dữ liệu hoặc cài lại Locket để ép tải cấu hình.

Log chẩn đoán RC v2 dùng tiền tố `[Locket RC v2]`:

- `response rewritten`: đã sửa body ở proxy; chưa chứng minh app áp dụng hoặc server chấp nhận.
- `skipped: full UPDATE ...`: không có phản hồi cấu hình đầy đủ để sửa, có thể là `NO_CHANGE` hoặc cấu trúc khác.
- `skipped: response is not JSON` hoặc `invalid response or upstream error`: giữ nguyên phản hồi bất thường.
- `skipped: request URL outside configured project`: URL không khớp project/endpoint đã cấu hình.

Không có dòng log chưa đủ xác định nguyên nhân: cần kiểm tra cấu hình đang chọn, HTTPS/MITM, script đã tải và có request Firebase khớp rule hay chưa. Chỉ chia sẻ dòng trạng thái/lỗi cần thiết, không chia sẻ token, cookie hoặc toàn bộ request/response.

Mock RC v2: 28 test, 25 đạt, 3 không đạt. Ba lỗi cũ còn lại thuộc del_header.js (hoa/thường ETag) và Locket.js (thiếu subscriber/User-Agent), chưa sửa trong đợt này. Chưa hỗ trợ bảo đảm giữ tính năng khi tắt Shadowrocket. Các cờ microphone không cấp quyền microphone trên iOS.
