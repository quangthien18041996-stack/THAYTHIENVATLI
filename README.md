# ⚛️ SÁCH NỔI 3D POP-UP VẬT LÍ 12 - KẾT NỐI TRI THỨC
### CHƯƠNG I: VẬT LÍ NHIỆT — BÀI 1: CẤU TRÚC CỦA CHẤT. SỰ CHUYỂN THỂ

Ứng dụng web 3D tương tác mô phỏng sách giáo khoa Vật lí 12 theo hình thức **Sách Nổi 3D Pop-Up** tiên tiến, kết hợp đồ họa không gian ba chiều (Three.js), mô phỏng vi mô phân tử thời gian thực, bảng tương tác khoa học và giọng đọc thuyết minh tiếng Việt tự động.

---

## 🌟 Các Mô Hình 3D & Hiện Tượng Tương Tác

1. **Trang 6: Thí nghiệm chuyển động Brown (Hình 1.1)**
   - Quả cầu giọt nước 3D tương tác hạt phấn hoa bị hàng trăm phân tử nước va đập tạo đường ziczac thời gian thực.
   - Thanh trượt điều chỉnh nhiệt độ từ $0^\circ\text{C}$ đến $100^\circ\text{C}$.
   - **Hologram Nhà khoa học Robert Brown (1827)** và **Albert Einstein (1905)** tái hiện lịch sử phát minh kèm giọng đọc thuyết minh.

2. **Trang 7: So sánh 3 thể Rắn - Lỏng - Khí & Piston nén (Hình 1.3)**
   - 3 khối hộp mô phỏng sự sắp xếp và chuyển động của phân tử ở thể rắn, lỏng và khí.
   - Cần gạt Piston nén khí và nén lỏng trực quan.

3. **Trang 7: Tam giác chuyển thể của chất (Hình 1.4)**
   - 3 buồng chuyển thể kết hợp 6 dòng hạt năng lượng phát sáng minh họa: Nóng chảy - Đông đặc, Hóa hơi - Ngưng tụ, Thăng hoa - Ngưng kết.
   - Thẻ thông tin khoa học chi tiết cho từng quá trình.

4. **Trang 8: Thí nghiệm đun nóng chảy & sôi (Hình 1.5)**
   - Ngọn lửa đèn cồn 3D bập bùng, nhiệt kế đo độ và làn hơi nước bốc lên sống động.
   - Đồ thị nhiệt độ - thời gian thời gian thực.

5. **Trang 8: Mạng tinh thể muối ăn NaCl (Hình 1.6)**
   - Khối lập phương tinh thể $3 \times 3 \times 3$ gồm các ion $\text{Na}^+$ và $\text{Cl}^-$ phát sáng xoay 360°.

6. **Trang 9: Đồ thị nóng chảy của chất rắn kết tinh (Hình 1.7)**
   - Bảng tọa độ Hologram 3D phát sáng các trục $T$ ($^\circ\text{C}$) và $t$ (thời gian).
   - Đoạn nằm ngang đặc trưng $b$ ($T = t_c$ không đổi) minh họa trực quan quá trình bẻ gãy mạng tinh thể.
   - Cột quan sát vi mô mô phỏng mạng tinh thể rung động và tan chảy thành chất lỏng.
   - Thuyết minh giải thích chuẩn câu hỏi 1 & 2 SGK.

7. **Trang 9: Thể Plasma Mặt Trời (Hình 1.8)**
   - Quả cầu Plasma bề mặt Mặt Trời với vân nhiễu loạn bề mặt, 3 cung từ trường và đám mây ion hóa.
   - Giọng đọc thuyết minh về trạng thái plasma.

---

## 🎮 Hướng Dẫn Điều Khiển & Trải Nghiệm

- **Lật trang sách:** Bấm nút **Bìa Sách**, **Lật Tiếp ❯** hoặc **❮ Lật Về Trước** trên thanh điều khiển.
- **Chạm nổi Pop-up 3D:** Chạm chuột/ngón tay trực tiếp vào các hình ảnh, huy hiệu phát sáng trên trang sách hoặc các nút bấm tương ứng dưới chân trang.
- **Điều chỉnh góc nhìn:**
  - `🔍 Cận Cảnh`: Tự động lướt camera bay đến ngay trước mặt mô hình đang mở, phóng to trực diện.
  - `📐`: Góc nhìn thẳng 90° từ trên xuống.
  - `🎯`: Trở về góc toàn cảnh sách 45°.
  - Kéo chuột trái để xoay không gian 3D, chuột phải để di chuyển, cuộn chuột để zoom.

---

## 🚀 Hướng Dẫn Khởi Chạy Local

1. Khởi động server Python nội bộ:
```bash
python server.py
```
2. Mở trình duyệt web và truy cập:
```
http://localhost:8000/
```
