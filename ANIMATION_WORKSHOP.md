# Xưởng sản xuất phim hoạt hình

Tài liệu vận hành cho nhánh sản xuất phim hoạt hình của video-shotcraft. Mục tiêu là biến repo thành một dây chuyền có thể kiểm kê tài nguyên, viết kịch bản, phân cảnh, dựng animatic duyệt nhịp, dựng phim hoạt hình minh họa, ghép âm thanh/phụ đề và xuất MP4 — ưu tiên tài nguyên sẵn có.

## Nguyên tắc bắt buộc: asset-first

Không tạo lại thứ repo đã có. Mỗi cảnh phải đi qua thứ tự:

1. Kiểm kê thư viện và tìm cảnh/nhân vật/bối cảnh/đạo cụ/âm thanh có thể tái sử dụng.
2. Kiểm tra giấy phép, nguồn, độ phân giải, tỉ lệ khung hình và khả năng tương thích.
3. Nếu có cảnh phù hợp: dùng lại, chỉ thay đổi bố cục/chuyển động trong giới hạn của tài nguyên.
4. Nếu chỉ có motion recipe mà không có hình minh họa: tái sử dụng recipe cho chuyển động, không được coi recipe là một bối cảnh hoàn chỉnh.
5. Chỉ đánh dấu cần tạo cảnh mới khi không có tài nguyên phù hợp. Ghi rõ lý do thiếu gì và phạm vi tài nguyên mới cần bổ sung. Không tự động tạo ảnh hoặc tải tài nguyên ngoài.

## Những thư viện đã có trong repo

| Nhóm | Nguồn | Dùng cho |
|---|---|---|
| 124 motion recipes / 150 styles | `references/shots/`, `gallery/api/library.json` | Chọn ngôn ngữ chuyển động, máy quay, chuyển cảnh, nhịp |
| Demo chuyển động | `demos/` | Tham khảo mã nguồn và thông số đã được tinh chỉnh |
| Component dùng lại | `assets/lib/` | Caption, camera, flash cut, ticker, motion helpers |
| Nhân vật chibi | `template/src/chibi/MainBoy.tsx`, `ChibiDemo.tsx` | Nhân vật chính hiện có; biểu cảm, chớp mắt, vẫy tay, chỉ tay, miệng |
| Bối cảnh/visual template | `template/src/aifl/`, `template/src/themes/` | Layout, texture, màu, scene template; không mặc định là bối cảnh lịch sử |
| Nhạc nền | `assets/audio/bgm/` | Chỉ dùng sau khi kiểm tra attribution và phù hợp tông phim |
| SFX | `references/sfx-sourcing.md`, `assets/scripts/sfx-source.py` | Tìm/ghi nguồn và giấy phép; không tải tự động |
| Story animatic | `template/src/story/StoryAnimatic.tsx` | Bản xem trước kịch bản và nhịp cảnh |
| Illustrated film | `template/src/story/IllustratedStoryFilm.tsx`, `SceneStage.tsx` | Dựng phim minh họa 1920×1080/30fps từ toàn bộ cảnh; 9 sân khấu vector tái sử dụng; phụ đề lời kể; chuyển cảnh và SFX có nguồn |

**Giới hạn thư viện hiện tại:** repo có thư viện motion phong phú và một nhân vật chibi mẫu, nhưng chưa có thư viện hoàn chỉnh gồm nhân vật phụ, rig nhiều góc, bối cảnh lịch sử/đời sống Việt Nam, đạo cụ theo thời kỳ, khẩu hình tiếng Việt đồng bộ âm vị, giọng đọc tiếng Việt và phụ đề được căn thời gian. Không được quảng bá các phần này là đã hoàn thiện.

## Cấu trúc một dự án phim

Mỗi tập nên có một thư mục riêng dưới `projects/<slug>/`:

- `brief.md`: mục tiêu, khán giả, phong cách, thời lượng, ngôn ngữ, giới hạn dữ liệu.
- `script.md`: kịch bản đã duyệt; mỗi cảnh có bối cảnh, hành động, lời dẫn.
- `asset-map.json`: ánh xạ cảnh → tài nguyên hiện có, shot recipe, giấy phép và lý do tạo mới nếu thiếu.
- `storyboard.md`: góc máy, cỡ cảnh, thời lượng, hành động, chuyển cảnh, âm thanh.
- `src/`: Remotion composition và component riêng của tập.
- `public/characters`, `public/backgrounds`, `public/props`, `public/audio`: chỉ chứa tài nguyên thực sự cần cho tập; không nhân bản thư viện nếu có thể import/reuse.
- `out/qa/`: ảnh kiểm tra khung hình.
- `out/releases/`: MP4 và metadata phiên bản.

Không đưa video render lớn vào Git. Dùng GitHub Actions artifacts.

## Quy trình sản xuất

### 1. Tiếp nhận và nghiên cứu
Chốt chủ đề, phạm vi, độ dài, giọng kể, mức độ châm biếm, tiêu chuẩn nguồn và nội dung cần tránh. Với chủ đề lịch sử/xã hội: tách dữ kiện, nhận định, lời kể và châm biếm; không biến cáo buộc chưa kiểm chứng thành sự thật.

### 2. Kiểm kê và ánh xạ tài nguyên
Chạy:

```bash
node scripts/validate-animation-workshop.mjs --script=story_scripts/your-episode.md
```

Báo cáo JSON ở `template/out/animation-asset-audit.json` liệt kê tài nguyên, nhân vật có sẵn và các motion recipe có thể phù hợp. Các gợi ý theo từ khóa chỉ là ứng viên; phải mở recipe và demo gốc để xác nhận. Nếu không có ứng viên phù hợp, ghi rõ lý do trước khi tạo cảnh mới.

### 3. Kịch bản và storyboard
Mỗi cảnh nên khai báo:
- `**Bối cảnh:**`
- `**Hành động:**`
- `**Lời dẫn:**`
- `**Âm thanh/Chữ:**`
- tùy chọn `**Loại cảnh:**` một trong `alley`, `archive`, `map`, `teahouse`, `historic`, `countryside`, `modern`, `interior`, `generic`
- tùy chọn `**Nhân vật:**` là `main-boy` hoặc `none`
- tùy chọn `**Thời lượng:**` như `6s`, `180f`, `1 phút`
- tùy chọn: `**Đạo cụ:**`, `**Shot:**`

Shot phải là tên card hoặc style key có thật trong `gallery/api/library.json`. Không ghi tên shot tự nghĩ rồi coi là tài nguyên có sẵn.

### 4. Duyệt animatic và dựng phim
Dùng workflow **Story animatic**. Mặc định workflow thủ công và `npm run render:film` đều chạy `full`; chọn `test` nếu chỉ muốn render 10 cảnh đầu. Lệnh local: `cd template && npm run render:film` (cần Node.js, npm và ffprobe/FFmpeg). `npm run render:story:test` dùng cho bản thử nhanh. Mỗi lần chạy tạo hai MP4: `story-animatic.mp4` để duyệt nhịp và `story-film.mp4` là bản phim hoạt hình minh họa. Bản phim sử dụng sân khấu vector tái sử dụng (hẻm, hồ sơ, bản đồ, quán trà, phố lịch sử, đồng quê, đô thị hiện đại, nội thất, trung tính), nhân vật MainBoy có sẵn, camera drift và hiệu ứng chuyển cảnh. Có thể chọn sân khấu bằng `**Loại cảnh:**` và ẩn nhân vật bằng `**Nhân vật:** none`. Đây là phim minh họa vector, không phải tư liệu lịch sử hoặc footage thật.

### 5. Dựng hình và hoạt họa
Dùng Remotion hiện có, 1920×1080, 30fps. Tái sử dụng character components, motion cards, camera/effects, theme assets. Mỗi cảnh có continuity notes cho nhân vật, trang phục, vị trí, thời gian và đạo cụ. Không dùng một demo chuyển động như thể nó là toàn bộ bối cảnh.

### 6. Âm thanh và phụ đề
Tách narration, BGM, SFX và subtitles. SFX chuyển cảnh dùng hai file Mixkit có ghi attribution trong `template/public/audio/ATTRIBUTION.md`. Có thể thêm voiceover và BGM do người dùng cung cấp trong `template/public/audio/`, rồi khai báo ở đầu kịch bản:

```md
**Giọng đọc:** audio/episode-voice.mp3
**Nhạc nền:** audio/episode-music.mp3
```

Parser xác minh đường dẫn và file tồn tại. Nếu không khai báo `**Thời lượng:**`, thời lượng cảnh tự tính theo số từ lời dẫn (tốc độ mặc định khoảng 2,6 từ/giây cộng 2 giây đệm) để phụ đề không bị lướt quá nhanh; có thể ghi thời lượng cụ thể để ghi đè. Không có voiceover thì lời dẫn hiển thị dưới dạng phụ đề, không giả lập giọng nói. Hiện chưa có lip-sync âm vị tiếng Việt; không tuyên bố miệng nhân vật khớp lời đọc.

### 7. QA và xuất bản
Sau khi render, `scripts/qa-rendered-film.mjs` dùng `ffprobe` kiểm tra file tồn tại, dung lượng, video stream, 1920×1080, 30fps, thời lượng và audio stream của phim. Báo cáo `template/out/render-qa.json` được đính kèm artifact. Đây là QA kỹ thuật đầu ra; vẫn cần người duyệt nội dung, bố cục, continuity và âm thanh thực tế.

Kiểm tra toàn bộ cảnh: không mất chữ, không tràn khung, không nhảy nhân vật, không sai continuity, âm thanh không clipping, phụ đề đúng lời và đúng thời gian. Lưu metadata gồm commit SHA, script hash, asset map, fps, độ phân giải, thời lượng và nguồn/giấy phép. Xuất H.264 MP4 qua GitHub Actions.

## Ranh giới hiện trạng

- Đã có: Remotion renderer; technical MP4 QA bằng ffprobe; 124 shot cards/150 styles; gallery; reusable motion helpers; Workbench; JianYing export; MainBoy chibi; Markdown parser; asset audit; StoryAnimatic; IllustratedStoryFilm; 9 sân khấu vector; phụ đề lời dẫn; SFX chuyển cảnh; voiceover/BGM tùy chọn; xuất hai MP4 qua GitHub Actions.
- Còn thiếu để thành studio sản xuất hoạt hình chuyên nghiệp: nhiều nhân vật/rig và góc nhìn; thư viện bối cảnh/đạo cụ lịch sử có metadata; scene/asset browser chuyên dụng; timeline biên tập nhiều track; lip-sync tiếng Việt theo âm vị; ghi âm/thu giọng tích hợp; sound mixer/mastering; kiểm tra continuity và QA tự động theo từng khung hình.
- Kết luận hiện trạng: đã có dây chuyền tối thiểu xuất được phim hoạt hình minh họa từ kịch bản; chưa phải studio nhiều nhân vật với hoạt họa chi tiết và hậu kỳ âm thanh hoàn chỉnh.
- Những mục thiếu này phải được triển khai theo từng lớp và kiểm thử. Không đánh đồng tài liệu hướng dẫn hoặc animatic với tính năng đã chạy.

## Chi phí và vận hành

Dùng GitHub Actions miễn phí trong hạn mức tài khoản. Không gọi API tạo ảnh/giọng đọc trả phí, không phụ thuộc máy tính cá nhân hoặc công cụ lập trình trả phí. iPhone có thể sửa Markdown và kích hoạt workflow trong GitHub.
