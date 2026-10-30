# Locket_15s_Full_Source

**Tác giả:** Nguyen Tien Thuong

Source cho module rewrite Locket, gồm 4 file JavaScript và `Locket_15s.sgmodule`.

## Bản mới nhất: v12 — cập nhật cấu hình và sáu caption cá nhân

Sáu caption cá nhân vẫn nằm đầu nhóm `🎨 Tình yêu & Cơm chó 💕`, tổng 261 caption / 10 nhóm. Bản v12 bổ sung xử lý cache: bỏ `If-None-Match` trên request fetch đúng project Locket để yêu cầu bộ cấu hình đầy đủ; phản hồi đã sửa dùng ETag theo nội dung mới để SDK phân biệt với bản cũ. Giữ nguyên phản hồi `NO_CHANGE`, lỗi hoặc thiếu cấu hình; không tạo bộ cấu hình giả từ phản hồi thiếu dữ liệu.

Cơ chế dựa trên [mã nguồn Firebase Apple SDK](https://github.com/firebase/firebase-ios-sdk/blob/main/FirebaseRemoteConfig/Sources/RCNConfigFetch.m): SDK gửi ETag đã lưu khi fetch và kiểm tra thời gian tối thiểu giữa các lần fetch. Đây là sửa một điểm thiếu trong xử lý cache của module; chưa có log trên thiết bị để khẳng định đây là nguyên nhân sáu caption chưa hiển thị. Proxy không ép được app gửi request khi SDK đang dùng cache cục bộ và không bảo đảm Locket áp dụng giao diện mới.

Cập nhật từ [module v12](https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=12), tải lại script nếu cần, chỉ bật một module Locket rồi đóng hẳn và mở lại app. Log mới: `[Locket RC v12] request rewritten: full config requested`, tiếp theo là `response rewritten` với `personal-captions=6` và `config-tag=...`. Số 6 xác nhận sáu mục đã được đưa vào phản hồi, chưa xác nhận hiển thị trên iPhone. Không cần xóa dữ liệu hoặc cài lại Locket.

Kiểm thử: **53/53 test mock đạt**, gồm bảo toàn header và dữ liệu xác thực, phạm vi endpoint, ETag ổn định theo nội dung, không sửa phản hồi lỗi/NO_CHANGE, và đủ sáu caption. Giữ cấu hình ẩn banner của v11. Chưa sửa âm thanh phía nhận.

## Lịch sử v11 — caption và banner hồ sơ

Đặt `paywall_presentation_config.profile_banner=false` thay cho `true`; cấu hình này thuộc nhóm `appearance`. Đây là yêu cầu ẩn banner quảng bá Gold, không phải xác nhận ứng dụng 2.70.0 sẽ áp dụng cờ hoặc tài khoản có thuê bao Gold thật. Chưa xác minh giao diện trên iPhone và chưa sửa âm thanh phía nhận.

Module và cả bốn URL script chuyển sang `?v=11`; log dùng `[Locket RC v11]` / `[Locket v11]`. Cập nhật module từ [link v11](https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=11), tải lại script nếu ứng dụng chưa tự tải, chỉ bật một module Locket rồi đóng hẳn và mở lại Locket. Xem nhóm caption `🎨 Tình yêu & Cơm chó 💕` để kiểm tra sáu mục cá nhân ở đầu nhóm.

Nếu giao diện chưa đổi, kiểm tra log `[Locket RC v11] response rewritten`: log này xác nhận phản hồi đã được sửa, chưa chứng minh app áp dụng. Nếu gặp `NO_CHANGE` hoặc thông báo yêu cầu `full UPDATE`, app chưa nhận bộ cấu hình đầy đủ mới; script giữ nguyên phản hồi để tránh ghi đè cache bằng cấu hình thiếu. Không cần xóa dữ liệu hoặc cài lại app.

Kiểm thử: **49/49 test mock đạt**, bao gồm cờ banner, 256 tổ hợp nhóm và caption 261 mục / 10 nhóm. Các mục bên dưới là lịch sử.

## Cập nhật caption trước v11

Gộp sáu caption cá nhân từ `🎨 Thương mến 💌` vào đầu nhóm `🎨 Tình yêu & Cơm chó 💕`. Tổng cộng **261 caption / 10 nhóm**; nội dung và thứ tự tương đối của 255 caption cũ được giữ nguyên. Đây là thay đổi sắp xếp caption, chưa sửa lỗi phát âm thanh phía nhận. Các mục bên dưới ghi lại lịch sử phiên bản.

## Lịch sử v10 — bỏ phụ thuộc vào biến tham số module

Module dùng `argument="enabled=true"` trực tiếp trên cả bốn rule, bỏ `#!arguments` và biến `{{{enabled}}}`. Điều này loại bỏ trường hợp ứng dụng truyền nguyên biến chưa được thay thế làm script v9 bỏ qua sửa đổi. Log được cung cấp chỉ xác nhận có request Firebase đúng project, chưa chứng minh đây là nguyên nhân caption không hiện trên thiết bị.

Tên module: `Locket 15s Photo Only - v10 Compatible Arguments`. Link cập nhật: https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=10 . Tải lại module và cả bốn script; URL script chuyển sang `?v=10` để phân biệt bản tải. Nội dung bốn script không đổi nên log vẫn dùng `[Locket RC v9]` / `[Locket v9]`.

Chỉ giữ một bản module Locket hoạt động. Khi cần đối chiếu, tắt toàn bộ module trong ứng dụng; bảng tham số `enabled` của v9 không còn được dùng. Các script vẫn hỗ trợ `enabled=false` khi được truyền trực tiếp, nhưng sửa một rule không tắt ba rule còn lại.

Giữ nguyên tám nhóm cấu hình và section `🎨 Thương mến 💌` với sáu caption (261 caption / 11 nhóm). Kiểm thử **48/48 test mock đạt**, bao gồm chạy cả bốn script với tham số thực lấy từ module và xác nhận Remote Config xuất đủ section mới. Chưa kiểm chứng caption trên iPhone hoặc sửa được âm thanh phía nhận.

## Lịch sử v9 — nhóm nhỏ hơn và công tắc đối chiếu

Section `🎨 Thương mến 💌` nằm ngay sau `🎨 Decorative by Locket`, gồm: Trầm Lâm Trúc Ly; Nguyễn Hoàng Hảo; Nguyễn Tiến Thương; Ngoan xinh yêu của anh; Thích ăn Mắm; yêu oiiii. Tổng cộng **261 caption / 11 nhóm**; 255 caption cũ giữ nguyên nội dung và thứ tự. Các bản trùng ID trong nhóm Tình yêu đã được bỏ.

`LOCKET_OPTIONS` trong `Locket_Unlocked_Clean.js` có tám nhóm, mặc định đều `true` để giữ các cấu hình v7/v8, kèm section caption mới:

| Nhóm | Phạm vi |
| --- | --- |
| `captions` | Caption và overlay |
| `camera` | Camera, thư viện, filter, Live Photos, zoom và chất lượng upload |
| `audio` | Ba cờ âm thanh/micro; không ép cờ audio session |
| `widget` | Widget, khung và sự kiện widget rewind |
| `network` | CDN, bucket, cache, fetch và refresh dữ liệu |
| `social` | Bạn bè, chat, phản ứng, streak, nhóm, lịch và kỷ niệm |
| `appearance` | Icon, profile, journal, thông báo và Live Activities |
| `other` | Quảng cáo, telemetry, onboarding, hỗ trợ và các trường còn lại |

Ví dụ chỉ thử các cờ âm thanh, giữ cấu hình gốc của bảy nhóm còn lại:

```js
var LOCKET_OPTIONS = {
    captions: false,
    camera: false,
    audio: true,
    widget: false,
    network: false,
    social: false,
    appearance: false,
    other: false
};
```

Các tính năng trong `feature_gates`/`upsell_features` cũng được phân nhóm: icon và profile badge thuộc appearance; lượt xem, bạn bè và khôi phục streak thuộc social; camera/caption/widget giữ nhóm tương ứng. Những trường không xác định thuộc other. Tắt nhóm giữ dữ liệu gốc từ phản hồi, không có nghĩa là tắt tính năng trong app. Nếu dùng ví dụ v8 cũ, cần thêm ba công tắc mới; chỉ đặt `other: false` không còn bỏ qua CDN/cache/bạn bè/giao diện.

### Công tắc tổng để đối chiếu

Module khai báo `#!arguments=enabled:true` và truyền cùng giá trị `enabled` tới **cả bốn script**. Trong ứng dụng có hỗ trợ tham số module, đổi tham số `enabled` thành `false` để mọi script gọi `$done({})` đúng một lần trước khi đọc/sửa lưu lượng. Đặt lại `true` để dùng cấu hình nhóm. Không cần sửa bốn file. Cơ chế khai báo tham số và `$argument` theo tài liệu [Surge Module](https://manual.nssurge.com/profile/module.html) và [Surge Scripting](https://manual.nssurge.com/scripting/overview.html).

Chưa xác minh khả năng hỗ trợ tham số trên Shadowrocket/iPhone hoặc mọi phiên bản Surge. Nếu ứng dụng không có giao diện tham số, **tắt toàn bộ module Locket trong danh sách module** để đối chiếu; không bật song song module cũ. Tham số còn nguyên `{{{enabled}}}` hoặc sai định dạng làm các script bỏ qua sửa đổi và log `[Locket v9] bypass: invalid module argument`. Khi chạy script riêng không có `$argument`, mặc định script hoạt động như trước; không coi việc mất tham số là đã bật chế độ đối chiếu.

Chế độ `enabled=false` giữ MITM/proxy theo cấu hình ứng dụng và chỉ ngừng sửa dữ liệu từ bốn script của bộ này. Nó không tắt các module khác, không xóa cache hay thay đổi đã lưu trước đó, không bảo đảm Gold/camera 15 giây vẫn còn. Tắt module cũng không tự hoàn tác cache. Kiểm tra bằng video mới sau khi app có dịp lấy lại cấu hình gốc; không xóa dữ liệu/cài lại app chỉ để ép refresh. Log `[Locket v9] bypass: enabled=false` xác nhận script đã nhận công tắc, chưa chứng minh nội dung cache của app đã về mặc định.

Module/script dùng v9 (`?v=9`), log Remote Config `[Locket RC v9]`. Thay đổi hiện cần được phát hành lên nguồn GitHub và tải lại module/script trên thiết bị để dùng. Bản này không thêm cách sửa âm thanh mới; lỗi mất tiếng phía nhận vẫn chưa được xác định nguyên nhân.

Kiểm thử: **48/48 test mock đạt**, gồm toàn bộ **256 tổ hợp** nhóm, bỏ qua sớm cả bốn script, tham số sai/chưa được thay thế, và đường hoạt động `enabled=true`. Trước khi thêm section mới, dữ liệu đầu ra mặc định được đối chiếu với v7; sau khi thêm, checksum xác nhận 255 caption cũ giữ nguyên. Chạy `node --test tests/source.test.cjs`.

## Lịch sử v8 — chọn nhóm cần sửa

Chỉnh `LOCKET_OPTIONS` ở đầu `Locket_Unlocked_Clean.js`. `true` áp dụng các thay đổi có sẵn của nhóm; `false` giữ dữ liệu gốc từ phản hồi Locket, không có nghĩa là tắt tính năng trong ứng dụng. Mặc định cả năm nhóm là `true` để giữ kết quả cấu hình như v7.

| Công tắc | Phạm vi |
| --- | --- |
| `captions` | Danh sách caption, kiểu caption và các cờ caption/overlay |
| `camera` | Camera, thư viện, filter, Live Photos, zoom, cấu hình chất lượng upload và phân loại ảnh chụp |
| `audio` | Ba cờ âm thanh/micro; giữ nguyên giá trị gốc của `audio_session_deactivation_enabled` như v7 |
| `widget` | Các cờ widget, khung widget và sự kiện widget rewind |
| `other` | Các thay đổi còn lại: CDN, bucket, cache, bạn bè, chat, quảng cáo, streak, journal, thông báo và Live Activities |

Ví dụ chỉ can thiệp âm thanh:

```js
var LOCKET_OPTIONS = {
    captions: false,
    camera: false,
    audio: true,
    widget: false,
    other: false
};
```

Chế độ này không ép camera 15 giây hoặc giữ các thay đổi caption/widget. Nếu cần thử camera 15 giây cùng âm thanh thì đặt thêm `camera: true`. Tắt tất cả nhóm làm script trả nguyên phản hồi. Khi tắt caption, script không đọc/đếm danh sách caption gốc nên phản hồi thiếu hoặc sai định dạng caption không gây lỗi ở bước log.

Các trường JSON `feature_gates` và `upsell_features` được phân theo từng tính năng: `camera_roll`, `camera_theme`, `longer_video`, `video` thuộc camera; `long_captions` thuộc caption; `custom_widget_frames` thuộc widget; còn lại thuộc other. Khi chỉ bật một số nhóm, giữ các trường của nhóm đã tắt và trường chưa biết từ phản hồi gốc. Nếu object gốc không đọc được, giữ nguyên cả trường để tránh làm mất cấu hình của nhóm đã tắt.

Các công tắc chỉ điều khiển script Remote Config này. `Locket.js`, `del_header.js` và `Locket_rc_us.js` vẫn hoạt động theo các rule riêng trong module. Live Activities/journal thuộc `other`, không thuộc `widget`. Việc tắt nhóm giữ phản hồi gốc trong các lần fetch tiếp theo; không tự xóa cấu hình cũ đang cache trong ứng dụng. Script vẫn bỏ qua phản hồi `NO_CHANGE` như trước.

Log phiên bản `[Locket RC v8]` ghi các nhóm được bật và chỉ ghi thông tin camera/âm thanh/caption tương ứng. Module dùng tên `Locket 15s Photo Only - v8 Selectable Groups` và URL script `?v=8`. Thay đổi ở máy tính cần được cập nhật lên nguồn GitHub và tải lại module/script trên thiết bị mới có hiệu lực; chưa xác minh hành vi trên iPhone hoặc khắc phục âm thanh phía nhận.

Kiểm thử: **39/39 test mock đạt**, gồm 32 tổ hợp công tắc, chế độ chỉ âm thanh, bảo toàn nhóm bị tắt và JSON tính năng không hợp lệ. Đối chiếu đầu ra mặc định với v7 khớp cho phản hồi trống và phản hồi có dữ liệu gốc. Chạy `node --test tests/source.test.cjs` để kiểm tra cục bộ.

## Lịch sử v7 — thử nghiệm âm thanh phía nhận

Bỏ ép `audio_session_deactivation_enabled = "true"`, giữ giá trị gốc từ Remote Config; nếu phản hồi không có trường này thì không thêm. Ba cờ `video_sound_enabled`, `microphone_enabled`, `camera_microphone_enabled` vẫn là `"true"`. Đây là thử nghiệm loại bỏ một override, chưa xác định ý nghĩa thực tế của cờ trong ứng dụng hoặc chứng minh sửa được lỗi mất tiếng. Không đổi các giá trị camera, thư viện, caption hay filter.

Module tên `Locket 15s Photo Only - v7 Audio Experiment`, script Remote Config dùng `?v=7`, log `[Locket RC v7]`. Link tải/cập nhật module: https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=7 . Cần tải lại module và script trên thiết bị để nhận bản mới; đuôi `?v=7` chỉ phân biệt URL phiên bản, không tự cập nhật script đã lưu trong máy.

Sau khi cập nhật nguồn và tải lại module/script trên thiết bị, kiểm tra log `[Locket RC v7] response rewritten`. Gửi một video mới 2–3 giây có lời nói và một video dài hơn để đối chiếu. Kiểm tra tiếng ở máy gửi và máy nhận, kể cả khi lưu ra Ảnh nếu có thể. Video cũ không được sửa âm thanh bởi thay đổi này. Nếu vẫn lỗi, chưa có căn cứ tiếp tục đổi cờ ngẫu nhiên; cần file video hoặc dữ liệu chẩn đoán bước gửi/nhận. Để hoàn tác riêng thử nghiệm âm thanh, thêm lại `audio_session_deactivation_enabled: "true"` cạnh ba cờ âm thanh và phát hành lại script với URL phiên bản mới.

Kiểm thử cục bộ: `node --test tests/source.test.cjs`. Test mock chỉ kiểm tra dữ liệu cấu hình, không kiểm tra ghi âm, upload hay phát video trên iPhone.

## Lịch sử v6 — tắt bộ lọc/Tạo diện mạo

Theo yêu cầu, tắt các cờ camera_filter, camera_filters_enabled, camera_filter_enabled, camera_filter_sheet_enabled; đặt allows_custom_filters/show_filter_button/sheet_enabled/open_sheet_immediately=false và bỏ danh sách filter Goofy/Looks cùng override bucket/cache bộ lọc. Giữ nguyên caption, camera, thư viện và âm thanh. Chưa kiểm tra giao diện trên iPhone sau cập nhật.

Người dùng đã thử phía nhận nhưng video vẫn không có tiếng; vấn đề âm thanh chưa được xác định nguyên nhân hoặc sửa trong bản này. **34/34 test mock đạt.**

Link cập nhật: https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=6

Module tên `Locket 15s Photo Only - v6`, Remote Config dùng `?v=6` và log `[Locket RC v6]`. Các phiên bản dưới đây là lịch sử.

## Lịch sử v5 — xóa nhóm caption cá nhân

Đã xóa 8 caption cá nhân đã thêm theo yêu cầu. Giữ nguyên toàn bộ **255 caption / 10 nhóm** trước đó. Các mục v4/RC v2 bên dưới là lịch sử thay đổi. Test mock mới nhất: **33/33 đạt**.

Link cập nhật: https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=5

Module tên `Locket 15s Photo Only - v5`, Remote Config dùng `?v=5` và log `[Locket RC v5]`. Script header/RevenueCat giữ bản sửa v4. Bản commit cũ vẫn lưu trong lịch sử Git.

## Lịch sử v4 — sửa 3 lỗi còn lại

Đã sửa xử lý tên header không phân biệt hoa/thường (gộp các bản ETag/quốc gia trùng tên), bảo vệ RevenueCat khi phản hồi lỗi hoặc thiếu subscriber/subscriptions/entitlements, và bỏ qua an toàn khi thiếu User-Agent. Đồng thời xử lý JSON sai, root null/array, header thiếu và User-Agent không phải chuỗi. Không tạo cấu trúc subscriber giả khi đầu vào thiếu. Luồng phản hồi hợp lệ và dữ liệu cấu hình/caption giữ như bản trước.

**Test mock mới nhất: 33/33 đạt, 0 lỗi.** Các kết quả 26/29 và 25/28 ở bên dưới là lịch sử. Điều này chưa xác nhận sửa được âm thanh phía người nhận, Tạo diện mạo hoặc mọi giới hạn trên iPhone.

Link cập nhật module v4:

https://raw.githubusercontent.com/Thuong404-lab/Locket_15s_Full_Source/main/Locket_15s.sgmodule?v=4

Hai script RevenueCat/header dùng URL `?v=4` để phân biệt bản tải mới; Remote Config/caption vẫn dùng RC v3 và `?v=3`. Tên module là `Locket 15s Photo Only - v4`.

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
