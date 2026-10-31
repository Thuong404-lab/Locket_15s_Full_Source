// Temporary standalone notification test. No Locket request or network API used.
// At most three notification attempts per device for this test version.
(function () {
    function log(message) {
        if (typeof console !== "undefined" && typeof console.log === "function") console.log("[Locket notification test] " + message);
    }
    try {
        if (typeof $notification === "undefined" || typeof $notification.post !== "function") {
            log("notification API unavailable");
            return;
        }
        if (typeof $persistentStore === "undefined" || typeof $persistentStore.read !== "function" || typeof $persistentStore.write !== "function") {
            log("storage API unavailable; test skipped to preserve the attempt limit");
            return;
        }
        var key = "locket.notification.selftest.v1.attempts";
        var attempts = Number($persistentStore.read(key));
        if (!isFinite(attempts) || attempts < 0 || Math.floor(attempts) !== attempts) attempts = 0;
        if (attempts >= 3) return;
        // Record the attempt before posting, including when the notification API
        // fails or iOS suppresses the notification. Reinstalling does not reset it.
        if ($persistentStore.write(String(attempts + 1), key) !== true) {
            log("could not save attempt count; test skipped");
            return;
        }
        $notification.post(
            "Locket - thử thông báo",
            "Script hẹn giờ đã chạy",
            "Đã gọi API thông báo độc lập với Locket/Firebase. Chưa xác nhận camera hoặc caption. Tắt module Notification Self-Test sau khi kiểm tra."
        );
        log("notification API called; visible delivery still depends on iOS");
    } catch (e) {
        log("test API failed; no network or Locket data was accessed");
    } finally {
        $done({});
    }
})();
