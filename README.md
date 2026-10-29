# Locket_15s_Full_Source

**Tác giả:** Nguyen Tien Thuong

Source cho module rewrite Locket, gồm 4 file JavaScript và `Locket_15s.sgmodule`.

## Cập nhật RC v3

Thêm nhóm **✨ Caption của bạn** ở đầu `overlay_items`, gồm 8 câu theo đúng thứ tự yêu cầu: Nguyễn Tiến Thương; Trầm Lâm Trúc Ly; Nguyễn Hoàng Hảo; Tôi đẹp trai quá; đẹp gái quá; Yeu oi; Khỉ già vô tâm; Trúc Ly xinh gái.

Tổng dữ liệu hiện tại: **263 caption / 11 nhóm**. Test xác nhận 255 caption trong 10 nhóm cũ giữ nguyên mọi trường và thứ tự, không trùng ID với nhóm mới. Thứ tự này là thứ tự trong cấu hình; chưa xác nhận giao diện Locket 2.70.0 hiển thị hoặc sử dụng được.

Link tải bản mới:

https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=3

Module tên `Locket 15s Photo Only - RC v3`, URL script Remote Config có `?v=3`, log có tiền tố `[Locket RC v3]` và đếm caption theo dữ liệu xuất ra. Mock mới nhất: **29 test, 26 đạt, 3 lỗi cũ ở header/RevenueCat vẫn còn**. Các phần RC v2 bên dưới lưu mô tả đợt sửa trước.

Người dùng tiếp tục báo chưa thấy caption, bộ lọc hiện giao diện, nút **Tạo diện mạo** không có thông báo rõ ràng, và video có tiếng trong lịch sử máy gửi nhưng người nhận không nghe được. Chưa có log hoặc file video phía nhận để xác định nguyên nhân. Source bật `allows_custom_filters` và danh sách `filter_ids`; bật nút không xác nhận dịch vụ tạo bộ lọc hoạt động. Các cờ âm thanh không chứng minh bản upload có track audio hoặc người nhận phát có tiếng. Đợt RC v3 không thay bộ lọc, âm thanh, upload hay RevenueCat; cần kiểm tra phía nhận trong ứng dụng và file nhận thực tế trước khi sửa các phần này.

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
