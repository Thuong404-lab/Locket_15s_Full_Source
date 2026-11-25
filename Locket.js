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
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

function rewriteRevenueCatResponse() {
  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  const headers = ($request && $request.headers) || {};
  const uaKey = Object.keys(headers).find(key => key.toLowerCase() === 'user-agent');
  const ua = (uaKey && typeof headers[uaKey] === 'string' && headers[uaKey].trim() !== '') ? headers[uaKey] : 'Locket';

  let obj;
  const isStatus304 = typeof $response !== 'undefined' && ($response.status === 304 || $response.status === "304");
  const isRawEmpty = typeof $response === 'undefined' || !$response.body || typeof $response.body !== 'string' || $response.body.trim() === '';

  if (isStatus304 || isRawEmpty) {
    obj = {
      subscriber: {
        subscriptions: {},
        entitlements: {},
        non_subscriptions: {},
        original_purchase_date: '2024-01-01T00:00:00Z',
        original_app_user_id: '$RCAnonymousID:locket_gold'
      }
    };
  } else {
    try {
      obj = JSON.parse($response.body);
    } catch (e) {
      obj = {
        subscriber: {
          subscriptions: {},
          entitlements: {},
          non_subscriptions: {},
          original_purchase_date: '2024-01-01T00:00:00Z',
          original_app_user_id: '$RCAnonymousID:locket_gold'
        }
      };
    }
  }

  if (!isObject(obj) || !isObject(obj.subscriber)) {
    obj = {
      subscriber: {
        subscriptions: {},
        entitlements: {},
        non_subscriptions: {},
        original_purchase_date: '2024-01-01T00:00:00Z',
        original_app_user_id: '$RCAnonymousID:locket_gold'
      }
    };
  }
  if (!isObject(obj.subscriber.subscriptions)) {
    obj.subscriber.subscriptions = {};
  }
  if (!isObject(obj.subscriber.entitlements)) {
    obj.subscriber.entitlements = {};
  }
  if (!obj.subscriber.non_subscriptions) {
    obj.subscriber.non_subscriptions = {};
  }

  obj.Attention = 'Congratulations! Please do not sell or share it with others!';
  const locket02 = {
    is_sandbox: false,
    ownership_type: 'PURCHASED',
    billing_issues_detected_at: null,
    period_type: 'normal',
    expires_date: '2099-12-18T01:04:17Z',
    grace_period_expires_date: null,
    unsubscribe_detected_at: null,
    original_purchase_date: '2024-01-01T00:00:00Z',
    purchase_date: '2024-01-01T00:00:00Z',
    store: 'app_store',
  };
  const locket01 = {
    grace_period_expires_date: null,
    purchase_date: '2024-01-01T00:00:00Z',
    product_identifier: 'com.locket02.premium.yearly',
    expires_date: '2099-12-18T01:04:17Z',
    ownership_type: 'PURCHASED',
    store: 'app_store',
    is_sandbox: false
  };
  const knownProducts = [
    'com.locket02.premium.yearly',
    'com.locket02.premium.monthly',
    'locket_gold_yearly',
    'locket_gold_monthly',
    'com.locket02.gold.yearly',
    'com.locket02.gold.monthly',
    'locket.gold.yearly',
    'locket.gold.monthly',
    'com.locket02.premium.lifetime',
    'locket_gold_lifetime'
  ];
  knownProducts.forEach(function (pid) {
    obj.subscriber.subscriptions[pid] = Object.assign({}, locket02);
  });
  const goldEntitlements = ['Gold', 'gold', 'locket_gold', 'premium', 'pro'];
  const match = Object.keys(mapping).find(key => ua.toLowerCase().includes(key.toLowerCase()));
  if (match) {
    const [entitlement, product] = mapping[match];
    if (product) {
      locket01.product_identifier = product;
      obj.subscriber.subscriptions[product] = locket02;
    }
    obj.subscriber.entitlements[entitlement] = locket01;
    if (match === 'Locket') {
      goldEntitlements.forEach(function (e) {
        obj.subscriber.entitlements[e] = locket01;
      });
    }
  } else {
    goldEntitlements.forEach(function (e) {
      obj.subscriber.entitlements[e] = locket01;
    });
  }
  const resHeaders = Object.assign({}, ($response && $response.headers) || {});
  let hasContentType = false;
  Object.keys(resHeaders).forEach(function (key) {
    const lower = key.toLowerCase();
    if (
      lower === 'etag' ||
      lower === 'content-encoding' ||
      lower === 'content-length' ||
      lower === 'cache-control' ||
      lower === 'expires' ||
      lower === 'pragma' ||
      lower === 'age'
    ) {
      delete resHeaders[key];
    } else if (lower === 'content-type') {
      hasContentType = true;
    }
  });
  resHeaders['cache-control'] = 'no-store';
  if (!hasContentType) {
    resHeaders['content-type'] = 'application/json; charset=utf-8';
  }
  const res = {
    status: 200,
    headers: resHeaders,
    body: JSON.stringify(obj)
  };
  return res;
}

$done(rewriteRevenueCatResponse());

})();
