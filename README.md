# Locket_15s_Full_Source

**Tác giả:** Nguyen Tien Thuong

Source cho module rewrite Locket, gồm 4 file JavaScript và `Locket_15s.sgmodule`.

Module tải script từ repo GitHub công khai này. Link tải module:

https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule

Nhập module vào ứng dụng rewrite tương thích. Cần cấu hình module/MITM/chứng chỉ trên thiết bị; repo không tự bật các chức năng này. Chưa xác minh tương thích thực tế trên Shadowrocket/iPhone hoặc việc server chấp nhận video 15 giây.

Các URL theo nhánh `main`, nên nội dung script tải về có thể thay đổi khi repo được cập nhật. Repo công khai cho phép người khác đọc và tải source.

Kiểm tra cục bộ bằng Node.js:

```sh
node --test tests/source.test.cjs
```

Xem `AUDIT.vi.md` để biết kết quả kiểm tra và các lỗi còn tồn tại. Script RevenueCat sửa dữ liệu phản hồi, không tạo giao dịch mua thật.
