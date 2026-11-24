# Quy trình dựng thử kịch bản

## Dựng bằng GitHub Actions (chỉ cần iPhone)

1. Mở tab **Actions** của repository.
2. Chọn workflow **Story animatic**.
3. Chọn **Run workflow**.
4. Giữ đường dẫn tập mặc định hoặc nhập một file Markdown nằm trong `story_scripts/`.
5. Chọn `test` (10 cảnh đầu) hoặc `full` (toàn bộ cảnh), rồi chạy.
6. Khi workflow hoàn tất, mở run tương ứng, vào **Artifacts** và tải ZIP về iPhone.

## Dựng trên máy có Node.js

Từ thư mục gốc repository:

```bash
bash template/scripts/render-story.sh story_scripts/01-nhung-hoi-kin-tung-lam-mua-lam-gio-o-viet-nam.md test
```

Đổi `test` thành `full` để dựng tất cả cảnh.

## Định dạng Markdown

Mỗi cảnh cần tiêu đề `### 01. Tên cảnh` và các trường:

- `**Bối cảnh:**`
- `**Hành động:**`
- `**Lời dẫn:**` (bắt buộc)
- `**Âm thanh/Chữ:**` (không bắt buộc)

Đây là **animatic phân cảnh** để kiểm tra thứ tự, nội dung lời dẫn và nhịp thời lượng. Chưa phải bản phim minh họa hoàn chỉnh; không tự tạo ảnh tư liệu, giọng đọc hay nhạc. Khi kịch bản được duyệt, mới phát triển hình minh họa, lời thoại/voice-over và thiết kế âm thanh.

## Quyền riêng tư và chi phí

Workflow chạy trên GitHub-hosted runner, không cần API key hay dịch vụ AI trả phí. MP4 được lưu dưới dạng GitHub Actions artifact trong 14 ngày; không commit video vào repository.
