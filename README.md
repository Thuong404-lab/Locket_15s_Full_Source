# Locket 15s Full Source

**Tác giả:** Nguyen Tien Thuong

## Tính năng
- Mở rộng thời lượng quay video lên 15 giây.
- Tích hợp 280 caption tùy chỉnh, phân loại theo 10 chủ đề.
- Tùy chỉnh cấu hình Camera, thư viện ảnh và Live Photos.
- Điều chỉnh các tính năng âm thanh, microphone và widget.
- Tối ưu cấu hình mạng, CDN và bộ nhớ đệm.
- Tùy chỉnh giao diện, thông báo và các tính năng mạng xã hội.

## Công nghệ
- **JavaScript:** Xử lý logic và rewrite HTTP Request/Response.
- **Shadowrocket:** Quản lý module, script và MITM.
- **Firebase Remote Config:** Tùy chỉnh cấu hình ứng dụng.
- **RevenueCat:** Xử lý dữ liệu Entitlement.
- **Node.js:** Xây dựng và thực thi kiểm thử tự động.

## Lưu ý
- Kiểm thử chủ yếu bằng Unit Test và Mock Test.
- Chưa xác minh toàn bộ tính năng trên mọi thiết bị.
- Một số chức năng phụ thuộc vào Firebase Remote Config, máy chủ Locket và cấu hình MITM.
- Các thay đổi phía client không cấp thuê bao Gold chính thức.
- Shadowrocket cần duy trì hoạt động để thực hiện rewrite dữ liệu.
