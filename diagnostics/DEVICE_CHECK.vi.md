# Kiểm tra Gold, camera và caption — 31/10/2026

Thiết bị được người dùng xác nhận: Locket 2.70.0, cài module, mất Gold khi tắt **toàn bộ Shadowrocket**. Chưa có log script mới từ máy người bạn.

## Kết quả đã xác minh

| Hạng mục | Bằng chứng | Kết luận |
| --- | --- | --- |
| Gold | `Locket.js` sửa `subscriber.entitlements` và `subscriptions` trong `$response.body`; không có thao tác cấp quyền trên máy chủ | Chỉ sửa phản hồi đi qua thiết bị đang chạy rewrite. Không phải cấp thuê bao Gold cho tài khoản. Tắt Shadowrocket thì không còn đường rewrite này; thời điểm mất giao diện Gold phụ thuộc cache và lần kiểm tra tiếp theo của app. |
| Camera 15 giây | Bốn trường thời lượng trong `entries.camera` đều bằng 15 khi mock phản hồi đầy đủ | Source có yêu cầu 15 giây; chưa chứng minh Locket 2.70.0 nhận/áp dụng cấu hình trên máy người bạn. |
| Caption | Mock xuất 261 caption / 10 nhóm, gồm 6 mục cá nhân | Danh sách vẫn còn trong source. Chưa có bằng chứng giao diện trên máy người bạn nhận được danh sách. |
| Bộ lọc/Tạo diện mạo | Các cờ filter đặt `false`; commit `5977b4a` ghi nhận tắt tính năng này | Đây là thay đổi có chủ ý trong lịch sử, không phải tất cả tính năng đều đang bật. Chưa tự bật lại vì chưa có bằng chứng chúng hoạt động. |
| Video thư viện | Bốn cờ video thư viện đặt `false`, các duration bằng 0 | Bản hiện tại hướng đến ảnh thư viện và video quay trực tiếp; không phải bản mở mọi đường gửi video. |
| Bản công khai | GET HTTPS cả module và 4 script từ GitHub, `?v=12`, đều HTTP 200; nội dung khớp local sau chuẩn hóa xuống dòng | Không phát hiện thiếu upload hoặc bản GitHub cũ tại lúc kiểm tra. Việc này không xác nhận cache script trên iPhone đã cập nhật. |
| File xuất từ thiết bị | `Locket_15s.conf` dùng URL `?v=11`, module hiện tại dùng `?v=12` | Hai cấu hình khác phiên bản URL. Không đủ căn cứ coi đây là nguyên nhân vì URL vẫn trỏ cùng nhánh `main` và còn phụ thuộc cache thiết bị. File xuất chưa có `[Rule]` hay khai báo node VPS. |
| Capture cũ | SQLite có 36 dòng; có request RevenueCat subscriber và Firebase đúng project, trạng thái `ROUTING,DIRECT` | Xác nhận request đã xuất hiện trong capture ngày 30/10. `DIRECT` là tuyến mạng, không chứng minh script thành công hay MITM bị bỏ qua. Capture không chứa body phản hồi hoặc log chạy script. Không đại diện cho máy người bạn hiện tại. |
| Tự host | Source gồm script, module, profile DNS và kiểm thử; không có dịch vụ backend hay mã triển khai host | Không tìm thấy tính năng tự host có thể giữ quyền khi tắt Shadowrocket. Host các file JS chỉ thay nơi tải script; không thay thế việc chạy rewrite trên thiết bị. |

## Vì sao tắt Shadowrocket thì mất Gold

Trường hợp người dùng xác nhận là tắt cả Shadowrocket, không chỉ ngừng dùng một VPS. Bộ source dùng HTTP rewrite/MITM trên thiết bị. Khi bộ xử lý đó ngừng chạy, source không thể tiếp tục sửa phản hồi của lần kiểm tra quyền/cấu hình tiếp theo. Không có đoạn mã nào ghi Gold thật vào tài khoản trên máy chủ. Những thời hạn rất xa trong JSON không phải bằng chứng quyền mua được máy chủ công nhận.

Tách riêng ba việc: host file script để tải về; dùng VPS để chuyển tiếp lưu lượng; chạy Shadowrocket để sửa phản hồi. Không dùng VPS vẫn có thể thử tuyến DIRECT khi mạng truy cập được các endpoint, nhưng vẫn phải giữ Shadowrocket hoạt động. Tự host file hoặc cài DNS không bảo đảm giữ Gold sau khi tắt bộ rewrite.

## Cấu hình thử không dùng VPS

Đã thêm `Locket_15s_Direct.conf`: một profile riêng có `FINAL,DIRECT`, bốn rule giống hệt module v12, không kèm node hay chứng chỉ riêng. Chưa kiểm thử parser/giao diện Shadowrocket trên iPhone. Không sửa file xuất `Locket_15s.conf` hiện có.

1. Nhập [URL Raw của `Locket_15s_Direct.conf`](https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s_Direct.conf) làm cấu hình riêng, hoặc nhập file local cùng tên.
2. Trong cấu hình này, tạo/cài và bật tin cậy chứng chỉ MITM riêng của thiết bị; bật HTTPS decryption/MITM. File mới không chứa chứng chỉ của máy khác.
3. Chọn định tuyến theo cấu hình/rule để sử dụng `FINAL,DIRECT`; giữ Shadowrocket bật. Cấu hình này cho toàn bộ lưu lượng kết nối trực tiếp, nên không dùng làm cấu hình VPN chung nếu còn cần các tuyến proxy khác.
4. Chỉ dùng một bộ rule Locket, tải lại bốn script trong Shadowrocket. Đóng hẳn rồi mở lại Locket. Khởi động lại app không bảo đảm Firebase bỏ qua cache.
5. Kiểm tra log script Remote Config khi app thực sự fetch; không chỉ xem danh sách kết nối.

| Log/hiện tượng | Ý nghĩa và bước tiếp theo |
| --- | --- |
| Không có `[Locket RC v12]` | Chưa xác nhận script được gọi. Kiểm tra cấu hình đang chọn, script tải thành công, MITM/chứng chỉ và có request Firebase mới hay không. |
| `request rewritten: full config requested` | Script request đã chạy; chưa đủ xác nhận script response hoặc app áp dụng. |
| `skipped: full UPDATE with entries required` | Không có cấu hình đầy đủ để sửa. Script giữ nguyên dữ liệu, không tự dựng cấu hình thay thế từ `NO_CHANGE`. |
| `response rewritten` có `camera=15s`, `captions=261`, `personal-captions=6` | Proxy đã tạo phản hồi mong muốn. Nếu giao diện vẫn 3 giây/không có caption, cần kiểm tra bước activate/cache và tính tương thích schema của Locket 2.70.0; chưa được kết luận đã sửa xong. |
| Quay >3 giây được nhưng gửi/nhận lỗi | Kiểm tra riêng đường upload/phát phía nhận; mock Remote Config không xác nhận server chấp nhận video. |

Firebase tách fetch và activate, đồng thời có khoảng chờ tối thiểu giữa các lần fetch; cấu hình mặc định của SDK Apple là 12 giờ, app có thể đặt khác. Không biết Locket 2.70.0 đặt giá trị nào. Script mạng không ép SDK tạo request khi SDK dùng cache cục bộ. [Tài liệu Firebase iOS](https://firebase.google.com/docs/remote-config/ios/get-started).

Nếu đã có log `response rewritten` mà Gold vẫn không nhận, cần kiểm tra riêng phản hồi RevenueCat và quyết định của ứng dụng. RevenueCat có hỗ trợ kiểm tra chữ ký phản hồi; chưa có bằng chứng Locket 2.70.0 dùng kết quả đó để từ chối. Không coi đây là nguyên nhân đã xác nhận. [Trusted Entitlements](https://www.revenuecat.com/docs/customers/trusted-entitlements).

## Kiểm chứng cục bộ và giới hạn

- `node --test tests/source.test.cjs`: **53/53 đạt** trên source v12, gồm dữ liệu camera/caption và 256 tổ hợp nhóm. Đây là mock globals, không phải kiểm thử trên iPhone hay parser Shadowrocket.
- Ba MP4 có sẵn trong thư mục đều khoảng 5,23–5,26 giây và có stream AAC. Không thể dùng chúng để khẳng định máy người bạn hiện quay được hơn 3 giây; cũng không khẳng định track có nội dung nghe được chỉ từ metadata.
- Chưa có log script/response mới trên máy người bạn; vì vậy nguyên nhân cụ thể của **camera 3 giây + không caption khi Shadowrocket vẫn bật** còn chưa xác định. Không thay ngẫu nhiên schema, không bật lại bộ lọc/video thư viện và không phát hành thêm phiên bản script chỉ để đổi số.
- Phần làm được trên máy tính đã hoàn tất: kiểm tra source/public files/capture/metadata, chạy mock và chuẩn bị cấu hình DIRECT. Xác nhận sửa lỗi thực tế còn cần thử cấu hình trên thiết bị và log kết quả.
