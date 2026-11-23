# Locket 15s Full Source (v20)

**Tác giả:** Nguyen Tien Thuong

## Tính năng nổi bật
- **Mở khóa Locket Gold:** Tự động kích hoạt quyền Gold, vĩnh viễn không bị rớt nhờ cơ chế chặn 304 fallback và domain dự phòng `api.rc-backup.com`.
- **Mở rộng thời lượng quay video lên 15 giây:** Cả quay trực tiếp trên Camera và chọn Video từ Thư viện (Camera Roll) tải lên.
- **Tối ưu chất lượng hình ảnh & Video HD:** Bitrate 1.5 Mbps, nén ảnh 90% (2048px), hình ảnh gửi đi siêu nét.
- **Tích hợp 280 caption tùy chỉnh:** Phân loại theo 10 chủ đề đa dạng, cá tính.
- **Tùy chỉnh tính năng nâng cao:** Không quảng cáo, gỡ giới hạn bạn bè, khung widget tuỳ biến, streak recovery, huy hiệu profile.
- **Hỗ trợ đa nền tảng:** Shadowrocket, Loon, Quantumult X, Stash.

## Link cài đặt nhanh theo từng ứng dụng

### 1. Shadowrocket (Khuyên dùng)
- **Module:**
  ```text
  https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule
  ```
- **File Cấu hình Direct:**
  ```text
  https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s_Direct.conf
  ```

### 2. Loon
- **Plugin:**
  ```text
  https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.plugin
  ```

### 3. Quantumult X
- **Snippet (Rewrite):**
  ```text
  https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.snippet
  ```

### 4. Stash
- **Override:**
  ```text
  https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.stoverride
  ```

## Quy trình kích hoạt trên iPhone
1. Cài đặt Module/Plugin vào ứng dụng VPN tương ứng (Shadowrocket, Loon, QX, Stash).
2. Bật giải mã HTTPS (MITM) và **Tin cậy chứng chỉ Root** trong *Cài đặt iPhone $\rightarrow$ Cài đặt chung $\rightarrow$ Giới thiệu $\rightarrow$ Cài đặt tin cậy chứng chỉ*.
3. Bật kết nối VPN.
4. **Xóa app Locket** khỏi màn hình chính (để xóa sạch cache 12 tiếng của Firebase).
5. Vẫn giữ VPN bật, vào App Store tải lại Locket và đăng nhập để nhận ngay cấu hình 15s và Gold.
