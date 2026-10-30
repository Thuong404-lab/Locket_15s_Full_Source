// Shared module control: enabled=false bypasses every rewrite in this script.
(function () {
    if (typeof $argument !== "undefined") {
        var control = typeof $argument === "string" ? /^enabled=(true|false)$/i.exec($argument.trim()) : null;
        if (!control || control[1].toLowerCase() === "false") {
            if (typeof console !== "undefined" && typeof console.log === "function") {
                console.log("[Locket v12] bypass: " + (control ? "enabled=false" : "invalid module argument"));
            }
            $done({});
            return;
        }
    }
// Author: Nguyen Tien Thuong
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
            $done({ body: JSON.stringify(body), headers: headers });
        } else {
            $done({});
        }
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}

})();
