// Shared module control: enabled=false bypasses every rewrite in this script.
(function () {
    if (typeof $argument !== "undefined") {
        var clean = typeof $argument === "string" ? $argument.trim().replace(/^["']|["']$/g, "") : "";
        var control = /^enabled=(true|false)$/i.exec(clean);
        if (!control || control[1].toLowerCase() === "false") {
            if (typeof console !== "undefined" && typeof console.log === "function") {
                console.log("[Locket v13] bypass: " + (control ? "enabled=false" : "invalid module argument"));
            }
            $done({});
            return;
        }
    }
// Author: Nguyen Tien Thuong
const version = 'V1.0.6';

function setHeaderValue(e, a, d) {
    var r = a.toLowerCase();
    var matches = Object.keys(e).filter(function (key) {
        return key.toLowerCase() === r;
    });
    var name = matches.length ? matches[0] : a;
    matches.forEach(function (key) { delete e[key]; });
    e[name] = d;
}

var modifiedHeaders = Object.assign({}, $request.headers || {});

// Strip conditional caching headers so RevenueCat server returns 200 OK with full payload instead of 304 Not Modified
Object.keys(modifiedHeaders).forEach(function (key) {
    var lower = key.toLowerCase();
    if (lower === "if-none-match" || lower === "if-modified-since") {
        delete modifiedHeaders[key];
    }
});

setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");
setHeaderValue(modifiedHeaders, "Accept-Encoding", "identity");

setHeaderValue(modifiedHeaders, "X-Forwarded-For", "8.8.8.8");
setHeaderValue(modifiedHeaders, "CF-Connecting-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "True-Client-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "Fastly-Client-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "X-Real-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "CF-IPCountry", "US");

$done({ headers: modifiedHeaders });

})();
