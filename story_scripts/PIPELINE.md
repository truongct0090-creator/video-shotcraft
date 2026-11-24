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
- `**Âm thanh/Chữ:**` (không bắt buộc)\n- `**Loại cảnh:**` tùy chọn: `alley`, `archive`, `map`, `teahouse`, `historic`, `countryside`, `modern`, `interior`, `generic` để chọn bối cảnh thư viện thay vì tự nhận diện\n- `**Nhân vật:**` tùy chọn: `main-boy` hoặc `none`

Workflow hiện xuất song song hai sản phẩm: **StoryAnimatic** để duyệt bố cục/lời dẫn và **IllustratedStoryFilm** là bản phim hoạt hình minh họa có bối cảnh vector chuyển động, nhân vật chibi tái sử dụng, chuyển cảnh và phụ đề lời kể. Cảnh nền được chọn từ thư viện bối cảnh dựng sẵn theo nội dung; nếu chưa có bối cảnh phù hợp, dùng sân khấu minh họa trung tính và ghi nhận cần bổ sung asset.\n\nCó thể thêm hai dòng metadata ở đầu Markdown để ghép âm thanh do bạn cung cấp (đặt file trong `template/public/audio/`):\n\n```md\n**Giọng đọc:** audio/episode-voice.mp3\n**Nhạc nền:** audio/episode-music.mp3\n```\n\nNếu không có giọng đọc, phim vẫn xuất được với phụ đề lời kể; không giả lập giọng đọc. Chỉ dùng audio mà bạn có quyền sử dụng và ghi attribution khi cần. Phim minh họa là tái hiện đồ họa, không phải footage tư liệu.

## Quyền riêng tư và chi phí

Workflow chạy trên GitHub-hosted runner, không cần API key hay dịch vụ AI trả phí. MP4 được lưu dưới dạng GitHub Actions artifact trong 14 ngày; không commit video vào repository.
