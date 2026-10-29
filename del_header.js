const version = 'V1.0.3';

function setHeaderValue(e, a, d) {
    var r = a.toLowerCase();
    r in e ? e[r] = d : e[a] = d;
}

var modifiedHeaders = $request.headers;

setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");

setHeaderValue(modifiedHeaders, "X-Forwarded-For", "8.8.8.8");
setHeaderValue(modifiedHeaders, "CF-Connecting-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "True-Client-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "Fastly-Client-IP", "8.8.8.8");
setHeaderValue(modifiedHeaders, "X-Real-IP", "8.8.8.8");    
setHeaderValue(modifiedHeaders, "CF-IPCountry", "US");   

$done({ headers: modifiedHeaders });
