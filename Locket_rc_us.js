// Shared module control: enabled=false bypasses every rewrite in this script.
(function () {
    var diagnosticsEnabled = false;
    if (typeof $argument !== "undefined") {
        var control = typeof $argument === "string" ? /^enabled=(true|false)(?:&diagnostics=(true|false))?$/i.exec($argument.trim()) : null;
        if (!control || control[1].toLowerCase() === "false") {
            if (typeof console !== "undefined" && typeof console.log === "function") {
                console.log("[Locket v12] bypass: " + (control ? "enabled=false" : "invalid module argument"));
            }
            $done({});
            return;
        }
        diagnosticsEnabled = !!control[2] && control[2].toLowerCase() === "true";
    }
// Author: Nguyen Tien Thuong
function notifyDiagnostic(outcome, message) {
    if (!diagnosticsEnabled) return;
    try {
        if (typeof $notification === "undefined" || typeof $notification.post !== "function") return;
        var key = "locket.rc.diagnostics.request." + outcome;
        var now = Date.now();
        var store = typeof $persistentStore !== "undefined" ? $persistentStore : null;
        if (store && typeof store.read === "function") {
            var last = Number(store.read(key));
            if (last > 0 && now >= last && now - last < 60000) return;
        }
        $notification.post("Locket RC - chẩn đoán", "Request: " + outcome, message);
        if (store && typeof store.write === "function") store.write(String(now), key);
    } catch (e) {
        // Diagnostic API/storage failures must not block the rewrite.
    }
}
var target = /^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/namespaces\/firebase:fetch(?:\?|$)/;
if (target.test($request.url || "") && $request.method === "POST" && $request.body) {
    try {
        var body = typeof $request.body === "string" ? JSON.parse($request.body) : $request.body;

        if (body && typeof body === "object" && !Array.isArray(body)) {
            body.country_code = "us";
            body.time_zone = "America/New_York";
            // body.language_code = "en_US";
            // Ask for a full config on actual fetches so a cached NO_CHANGE
            // does not prevent the response script from applying new captions.
            // This cannot bypass the SDK's local minimum fetch interval.
            var headers = Object.assign({}, $request.headers || {});
            Object.keys(headers).forEach(function (key) {
                if (key.toLowerCase() === "if-none-match") delete headers[key];
            });
            if (typeof console !== "undefined" && typeof console.log === "function") {
                console.log("[Locket RC v12] request rewritten: full config requested");
            }
            notifyDiagnostic("rewritten", "Đã bắt được lượt tải Remote Config và yêu cầu cấu hình đầy đủ. Chưa xác nhận phản hồi hoặc giao diện Locket.");
            $done({ body: JSON.stringify(body), headers: headers });
        } else {
            notifyDiagnostic("skipped", "Đã bắt được request nhưng body không phải object JSON hợp lệ; giữ nguyên request.");
            $done({});
        }
    } catch (e) {
        notifyDiagnostic("skipped", "Không đọc được JSON của request; giữ nguyên request.");
        $done({});
    }
} else {
    if (target.test($request.url || "")) {
        notifyDiagnostic("skipped", "Đã gọi script đúng endpoint nhưng request không có POST/body cần thiết; giữ nguyên request.");
    }
    $done({});
}

})();
