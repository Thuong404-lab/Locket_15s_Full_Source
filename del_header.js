// Author: Nguyen Tien Thuong
const version = 'V1.0.4';

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

setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");

setHeaderValue(modifiedHeaders, "X-Forwarded-For", "8.8.8.8");
setHeaderValue(modifiedHeaders, "CF-Connecting-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "True-Client-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "Fastly-Client-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "X-Real-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "CF-IPCountry", "US");

$done({ headers: modifiedHeaders });
