# Thử endpoint DNS của profile — 30/10/2026

Mục tiêu: kiểm tra endpoint trong `DNS_Locket_P12_VIP_LeeKang (1).mobileconfig` có hoạt động như DNS-over-HTTPS trước khi tạo profile thử nghiệm. Không cài profile lên thiết bị hoặc sửa profile gốc. Không gửi định danh/tài khoản/token của người dùng.

## Kết quả từ môi trường máy tính hiện tại

| Endpoint / cách truy cập | Truy vấn | Kết quả |
| --- | --- | --- |
| api.p12.vn/dns-query, GET | api.revenuecat.com, firebaseremoteconfig.googleapis.com | HTTP 404, text/html |
| api.p12.vn/dns-query, POST | api.revenuecat.com, firebaseremoteconfig.googleapis.com | HTTP 404, text/html |
| api.p12.vn/dns-query, ép kết nối IP 1.1.1.1 như khai báo gốc | api.revenuecat.com, GET | HTTP 403, text/plain |
| cloudflare-dns.com/dns-query, đối chứng GET | api.revenuecat.com | HTTP 200, application/dns-message, DNS rcode=0, 4 answer records, ID phản hồi khớp truy vấn |

Yêu cầu dùng bản tin DNS chuẩn, Accept application/dns-message; POST có Content-Type application/dns-message. Giữ bật kiểm tra TLS. GET/POST theo [RFC 8484](https://www.rfc-editor.org/rfc/rfc8484.html#section-4.1). Chi tiết máy đọc được lưu trong `dns-check.json` cùng thư mục.

## Giới hạn và kết luận

Endpoint P12 chưa hoạt động như DoH trong các phép thử này. Kết quả chỉ phản ánh mạng/môi trường kiểm tra hiện tại, không khẳng định trạng thái từ mọi mạng hay từ iPhone. Không chứng minh dịch vụ có hoặc không có cơ chế chặn domain khi hoạt động.

Chưa tạo profile mới trỏ đến endpoint lỗi. Cần endpoint DoH hoạt động để tiếp tục kiểm tra DNS. Máy chủ Cloudflare chỉ dùng đối chứng giao thức, không phải dịch vụ giữ Gold. Chưa có thử nghiệm thành công nào xác nhận giữ Gold, camera 15 giây, caption hoặc âm thanh khi tắt Shadowrocket.

Không triển khai máy chủ, không cài chứng chỉ/profile, không bật MITM và không đẩy file gốc hoặc kết quả lên GitHub trong lần thử này.
