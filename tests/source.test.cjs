const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const scripts = ['Locket.js', 'del_header.js', 'Locket_Unlocked_Clean.js', 'Locket_rc_us.js'];

// Run only local source with mocked proxy globals. No network or device access.
function execute(file, { headers = { 'User-Agent': 'Locket/1.0' }, body = '{"state":"UPDATE","entries":{}}', requestBody, method = 'POST', url = 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch', logs = [], options, argument } = {}) {
  const completions = [];
  let source = read(file);
  if (options) source = source.replace('function rewriteLocketConfig()',
    `Object.assign(LOCKET_OPTIONS, ${JSON.stringify(options)});\nfunction rewriteLocketConfig()`);
  vm.runInNewContext(source, {
    ...(argument === undefined ? {} : { $argument: argument }),
    $request: { headers, method, body: requestBody, url },
    $response: { body },
    console: { log: (message) => logs.push(message) },
    $done: (value) => completions.push(JSON.parse(JSON.stringify(value))),
  }, { timeout: 1000, filename: file });
  assert.equal(completions.length, 1, 'Every invocation must complete exactly once');
  return completions[0];
}

function remoteConfig(options) {
  return JSON.parse(execute('Locket_Unlocked_Clean.js', options).body);
}

test('compatible module enables all four scripts without template substitution', () => {
  const moduleText = read('Locket_15s.sgmodule');
  assert.ok(!moduleText.includes('{{{'));
  assert.ok(!/^#!arguments/m.test(moduleText));
  const lines = moduleText.split(/\r?\n/).filter(line => line.includes('script-path='));
  assert.equal(lines.length, 4);
  for (const line of lines) {
    assert.ok(line.includes('argument="enabled=true"'));
    assert.match(line, /script-path=[^,\s]+\?v=11(?:,|$)/);
    const file = new URL(line.match(/script-path=([^,\s]+)/)[1]).pathname.split('/').pop();
    const argument = line.match(/argument="([^"]+)"/)[1];
    const input = { body: '{"state":"UPDATE","entries":{},"subscriber":{"subscriptions":{},"entitlements":{}}}', requestBody: '{"country_code":"vn"}' };
    const result = execute(file, { ...input, argument });
    assert.notDeepEqual(result, {}, 'The module must activate the script, not bypass it');
    assert.deepEqual(result, execute(file, input));
    if (file === 'Locket_Unlocked_Clean.js') {
      const sections = JSON.parse(JSON.parse(result.body).entries.overlay_items);
      assert.ok(sections.find(section => section.section === '🎨 Tình yêu & Cơm chó 💕').items.some(item => item.overlay_id === 'caption:thuong_men_nguyen_tien_thuong'));
    }
  }
});

for (const file of scripts) {
  test(`master bypass completes once without reading traffic: ${file}`, () => {
    for (const argument of ['enabled=false', ' ENABLED=FALSE ', 'enabled={{{enabled}}}', 'invalid', '', null, 42]) {
      const outputs = [];
      // Deliberately no $request/$response: bypass must happen before traffic access.
      vm.runInNewContext(read(file), {
        $argument: argument,
        console: { log() {} },
        $done(value) { outputs.push(JSON.parse(JSON.stringify(value))); },
      }, { timeout: 1000 });
      assert.deepEqual(outputs, [{}]);
    }
  });
  test(`enabled=true keeps normal behavior: ${file}`, () => {
    const input = { body: '{"state":"UPDATE","entries":{},"subscriber":{"subscriptions":{},"entitlements":{}}}', requestBody: '{"country_code":"vn"}' };
    assert.deepEqual(execute(file, { ...input, argument: 'enabled=true' }), execute(file, input));
  });
}

for (const file of scripts) {
  test(`JavaScript syntax: ${file}`, () => { new vm.Script(read(file), { filename: file }); });
}

test('module references all four existing scripts and declares only its two MITM hosts', () => {
  const moduleText = read('Locket_15s.sgmodule');
  const references = [...moduleText.matchAll(/script-path=([^,\s]+)/g)].map((m) => new URL(m[1]).pathname.split('/').pop());
  assert.deepEqual(references.sort(), [...scripts].sort());
  const hosts = moduleText.match(/^hostname\s*=\s*(.+)$/m)[1].split(',').map((h) => h.trim());
  assert.deepEqual(hosts, ['api.revenuecat.com', 'firebaseremoteconfig.googleapis.com']);
});

test('deployment readiness: script paths must be real HTTPS locations', () => {
  const paths = [...read('Locket_15s.sgmodule').matchAll(/script-path=([^,\s]+)/g)].map((m) => m[1]);
  assert.ok(paths.every((p) => /^https:\/\//.test(p) && !p.includes('SCRIPT_BASE_URL')), 'SCRIPT_BASE_URL is still a placeholder');
});

test('profile banner override disables the upsell without requesting automatic paywalls', () => {
  const config = JSON.parse(remoteConfig().entries.paywall_presentation_config);
  assert.equal(config.profile_banner, false);
  for (const key of ['onboarding', 'after_sent_moment', 'on_foreground']) assert.equal(config[key], false);
});

test('all four direct camera duration aliases are 15 seconds', () => {
  const camera = JSON.parse(remoteConfig().entries.camera);
  for (const key of ['gold_max_duration', 'goldMaxDuration', 'max_duration', 'maxDuration']) assert.equal(camera[key], 15, key);
});

test('gallery photos remain enabled while video flags are disabled', () => {
  const { entries } = remoteConfig();
  assert.equal(JSON.parse(entries.feature_gates).camera_roll, 'enabled');
  assert.equal(JSON.parse(entries.upsell_features).camera_roll, true);
  assert.equal(entries.camera_roll_preview_enabled, 'true');
  for (const key of ['camera_roll_video_enabled', 'camera_roll_video_upload_enabled', 'internal_camera_roll_video_upload_enabled', 'longer_camera_roll_videos_enabled']) assert.equal(entries[key], 'false', key);
  const gallery = JSON.parse(entries.camera_roll);
  const limits = Object.entries(gallery).filter(([key]) => /duration/i.test(key));
  assert.equal(limits.length, 9);
  for (const [key, value] of limits) assert.equal(value, 0, key);
});

test('sound and microphone configuration stays enabled', () => {
  const { entries } = remoteConfig();
  for (const key of ['video_sound_enabled', 'microphone_enabled', 'camera_microphone_enabled']) assert.equal(entries[key], 'true', key);
});

test('audio experiment preserves upstream session settings without inventing a missing value', () => {
  for (const value of ['true', 'false']) {
    const { entries } = remoteConfig({ body: JSON.stringify({ state: 'UPDATE', entries: {
      audio_session_deactivation_enabled: value,
    } }) });
    assert.equal(entries.audio_session_deactivation_enabled, value);
    for (const key of ['video_sound_enabled', 'microphone_enabled', 'camera_microphone_enabled']) {
      assert.equal(entries[key], 'true', key);
    }
  }
  assert.equal(Object.hasOwn(remoteConfig().entries, 'audio_session_deactivation_enabled'), false);
});

const groupExamples = {
  captions: ['overlay_items', 'overlay_dynamic_captions', 'captions_enabled', 'music_caption_enabled', 'poll_caption'],
  camera: ['camera', 'camera_roll', 'camera_filter_config', 'camera_filters_enabled', 'live_photos', 'upload_main', 'capture_classification_config'],
  audio: ['video_sound_enabled', 'microphone_enabled', 'camera_microphone_enabled'],
  widget: ['widget_frame_event', 'android_widget_frame_event_enabled', 'widget_rewind_event', 'widget_stale_state_enabled', 'widget_last_sent_indicator'],
  network: ['cdn_domain_replacements', 'storage_bucket_video', 'friends_cache_max_age_sec', 'fetch_users_from_cloud_function'],
  social: ['streak_config', 'max_friends_count', 'share_history_config', 'rollcall_enabled'],
  appearance: ['profile_menu_v2_enabled', 'journal_settings', 'paywall_presentation_config'],
  other: ['history_ads_mode', 'sentry_sample_rate', 'support_v2'],
};

test('every combination of switches preserves disabled groups and applies enabled groups', () => {
  const defaults = remoteConfig().entries;
  const groups = Object.keys(groupExamples);
  const entries = { unrelated_sentinel: 'keep', audio_session_deactivation_enabled: 'false' };
  for (const keys of Object.values(groupExamples)) {
    for (const key of keys) entries[key] = 'original-' + key;
  }
  entries.streak_config = '{"minimum_recovery_count":9,"minimum_display_count":8}';
  for (let mask = 0; mask < (1 << groups.length); mask++) {
    const options = Object.fromEntries(groups.map((group, i) => [group, Boolean(mask & (1 << i))]));
    const logs = [];
    const output = execute('Locket_Unlocked_Clean.js', { options, logs, body: JSON.stringify({ state: 'UPDATE', entries }) });
    if (mask === 0) {
      assert.deepEqual(output, {});
      continue;
    }
    const actual = JSON.parse(output.body).entries;
    for (const [group, keys] of Object.entries(groupExamples)) {
      for (const key of keys) assert.equal(actual[key], options[group] ? defaults[key] : entries[key], `${mask}: ${group}/${key}`);
    }
    assert.equal(actual.unrelated_sentinel, 'keep');
    assert.equal(actual.audio_session_deactivation_enabled, 'false');
    if (!options.audio) assert.ok(logs.every(line => !line.includes('sound=true')));
    if (!options.captions) assert.ok(logs.every(line => !line.includes('captions=261')));
  }
});

test('audio only does not add unrelated settings to an empty config', () => {
  const { entries } = remoteConfig({ options: { captions: false, camera: false, audio: true, widget: false, network: false, social: false, appearance: false, other: false } });
  assert.deepEqual(entries, { video_sound_enabled: 'true', microphone_enabled: 'true', camera_microphone_enabled: 'true' });
});

test('mixed feature gates preserve disabled features and unknown upstream fields', () => {
  const original = { camera_roll: 'original-camera', long_captions: 'original-caption', custom_widget_frames: 'original-widget', app_icon_picker: 'original-other', unknown: 'keep' };
  const input = { state: 'UPDATE', entries: { feature_gates: JSON.stringify(original), upsell_features: JSON.stringify(original) } };
  const options = { captions: true, camera: false, audio: false, widget: false, network: false, social: false, appearance: false, other: false };
  const { entries } = remoteConfig({ options, body: JSON.stringify(input) });
  const gates = JSON.parse(entries.feature_gates);
  assert.deepEqual(gates, { ...original, long_captions: 'enabled' });
  // There are no caption overrides in upsell_features, so preserve its exact string.
  assert.equal(entries.upsell_features, input.entries.upsell_features);
});

test('partial feature rewrites keep malformed upstream objects untouched', () => {
  for (const value of ['broken', 'null', '[]', '42']) {
    const { entries } = remoteConfig({ options: { camera: false }, body: JSON.stringify({ state: 'UPDATE', entries: { feature_gates: value, upsell_features: value } }) });
    assert.equal(entries.feature_gates, value);
    assert.equal(entries.upsell_features, value);
  }
});

test('Goofy/Looks and custom appearance UI are disabled even when upstream enables them', () => {
  const { entries } = remoteConfig({ body: JSON.stringify({ state: 'UPDATE', entries: {
    camera_filters_enabled: 'true',
    camera_filter_config: JSON.stringify({ allows_custom_filters: true, show_filter_button: true }),
    unrelated_sentinel: 'keep',
  } }) });
  for (const key of ['camera_filter', 'camera_filters_enabled', 'camera_filter_enabled', 'camera_filter_sheet_enabled']) {
    assert.equal(entries[key], 'false', key);
  }
  const config = JSON.parse(entries.camera_filter_config);
  for (const key of ['allows_custom_filters', 'show_filter_button', 'sheet_enabled', 'open_sheet_immediately']) {
    assert.equal(config[key], false, key);
  }
  assert.deepEqual(config.sheet_filters, []);
  assert.deepEqual(config.picker_filters, []);
  assert.equal(entries.unrelated_sentinel, 'keep');
});

test('every structured Remote Config string is valid JSON', () => {
  for (const [key, value] of Object.entries(remoteConfig().entries)) {
    if (typeof value === 'string' && /^[\[{]/.test(value)) assert.doesNotThrow(() => JSON.parse(value), key);
  }
});

test('caption IDs are unique and every item has a caption type', () => {
  const sections = JSON.parse(remoteConfig().entries.overlay_items);
  assert.ok(sections.length > 0);
  const items = sections.flatMap((section) => {
    assert.equal(typeof section.section, 'string');
    assert.ok(Array.isArray(section.items));
    return section.items;
  });
  assert.ok(items.length > 0);
  assert.equal(new Set(items.map((item) => item.overlay_id)).size, items.length);
  for (const item of items) {
    assert.match(item.overlay_id, /^caption:.+/);
    assert.equal(typeof item.caption.type, 'string');
    if (item.caption.type === 'static_content') assert.equal(typeof item.caption.text, 'string');
  }
});

test('all six requested captions retain their emoji', () => {
  const items = JSON.parse(remoteConfig().entries.overlay_items).flatMap((section) => section.items);
  for (const [text, emoji] of [
    ['Deadline dí, tôi dí lại', '🏃‍♂️'],
    ['404: Không tìm thấy người yêu', '🫠'],
    ['Code chạy là được, đừng hỏi', '💻'],
    ['Crush seen, tim tôi lag', '💔'],
    ['Yêu đương gì, đi ăn đã', '🍜'],
    ['Đẹp sẵn, filter thất nghiệp', '🪞'],
  ]) {
    const item = items.find((item) => item.caption.text === text);
    assert.ok(item, text);
    assert.equal(item.caption.icon.type, 'emoji');
    assert.equal(item.caption.icon.data, emoji);
  }
});

test('six personal captions lead the love section and all original captions remain intact', () => {
  const sections = JSON.parse(remoteConfig().entries.overlay_items);
  assert.equal(sections.length, 10);
  assert.equal(sections.flatMap((section) => section.items).length, 261);
  const index = sections.findIndex(section => section.section === '🎨 Tình yêu & Cơm chó 💕');
  assert.ok(index >= 0);
  assert.equal(sections[index - 1].section, '🎨 Decorative by Locket');
  assert.ok(!sections.some(section => section.section === '🎨 Thương mến 💌'));
  assert.deepEqual(sections[index].items.slice(0, 6).map(item => item.caption.text), [
    'Trầm Lâm Trúc Ly', 'Nguyễn Hoàng Hảo', 'Nguyễn Tiến Thương',
    'Ngoan xinh yêu của anh', 'Thích ăn Mắm', 'yêu oiiii',
  ]);
  assert.ok(sections.flatMap((section) => section.items).every((item) => !item.overlay_id.startsWith('caption:priority_')));
  // Digest captured from RC v2 before the addition: preserves every old field and its order.
  const originalSections = sections.map((section, i) => i === index ? { ...section, items: section.items.slice(6) } : section);
  assert.equal(createHash('sha256').update(JSON.stringify(originalSections)).digest('hex'),
    'ba71a054892e40d389f7f17cd5b761e3227166fb1d94e668f9e8c3de16b1e040');
});

test('unmentioned entries and top-level response metadata survive', () => {
  const input = { state: 'UPDATE', entries: { unrelated_sentinel: 'keep' } };
  const result = remoteConfig({ body: JSON.stringify(input) });
  assert.equal(result.state, 'UPDATE');
  assert.equal(result.entries.unrelated_sentinel, 'keep');
});

test('other Firebase projects pass through even with a Locket user agent', () => {
  const input = { entries: { camera: 'original' }, state: 'NO_CHANGE' };
  assert.deepEqual(execute('Locket_Unlocked_Clean.js', { url: 'https://firebaseremoteconfig.googleapis.com/v1/projects/other-app/namespaces/firebase:fetch', body: JSON.stringify(input) }), {});
});

test('matching project works with SDK user agent or missing headers', () => {
  for (const headers of [{ 'User-Agent': 'FirebaseRemoteConfig/12.0' }, {}]) {
    const result = remoteConfig({ headers, body: '{"state":"UPDATE","entries":{"camera":"{\\"max_duration\\":3}"}}' });
    assert.equal(JSON.parse(result.entries.camera).max_duration, 15);
    assert.equal(JSON.parse(result.entries.overlay_items).flatMap((section) => section.items).length, 261);
    assert.equal(result.entries.video_sound_enabled, 'true');
  }
});

test('request query does not prevent matching and diagnostics omit query secrets', () => {
  const logs = [];
  const result = remoteConfig({ url: 'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetch?key=mock-secret', logs });
  assert.equal(JSON.parse(result.entries.camera).max_duration, 15);
  assert.ok(logs.some((line) => line.includes('[Locket RC v11] response rewritten') && line.includes('captions=261')));
  assert.ok(logs.every((line) => !line.includes('mock-secret')));
});

test('wrong host, project prefix, namespace, or endpoint must pass through', () => {
  for (const url of [
    'https://firebaseremoteconfig.googleapis.com.evil.test/v1/projects/locket-4252a/namespaces/firebase:fetch',
    'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a-other/namespaces/firebase:fetch',
    'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/other:fetch',
    'https://firebaseremoteconfig.googleapis.com/v1/projects/locket-4252a/namespaces/firebase:fetchOther',
  ]) assert.deepEqual(execute('Locket_Unlocked_Clean.js', { url }), {});
});

test('cached states and malformed entries stay untouched and produce diagnostics', () => {
  for (const input of [
    { state: 'NO_CHANGE' }, { state: 'EMPTY_CONFIG' }, { state: 'NO_TEMPLATE' },
    { error: { message: 'mock-upstream-error' } }, { state: 'UPDATE', entries: [] },
    { state: 'UPDATE', entries: null }, { state: 'UPDATE', entries: 'invalid' },
    { entries: {} }, [],
  ]) {
    const logs = [];
    assert.deepEqual(execute('Locket_Unlocked_Clean.js', { body: JSON.stringify(input), logs }), {});
    assert.ok(logs.some((line) => line.includes('[Locket RC v11] skipped:')));
    assert.ok(logs.every((line) => !line.includes('mock-upstream-error')));
  }
});

test('lowercase user-agent header is recognized', () => {
  assert.equal(JSON.parse(remoteConfig({ headers: { 'user-agent': 'locket/1.0' } }).entries.camera).max_duration, 15);
});

test('malformed streak JSON does not block other camera changes', () => {
  const result = remoteConfig({ body: '{"state":"UPDATE","entries":{"streak_config":"broken"}}' });
  assert.equal(result.entries.streak_config, 'broken');
  assert.equal(JSON.parse(result.entries.camera).max_duration, 15);
});

test('robustness: invalid Remote Config JSON must pass through safely', () => {
  assert.deepEqual(execute('Locket_Unlocked_Clean.js', { body: '<html>error</html>' }), {});
});

test('robustness: null Remote Config response must pass through safely', () => {
  assert.deepEqual(execute('Locket_Unlocked_Clean.js', { body: 'null' }), {});
});

test('US request rewrite preserves unrelated request fields', () => {
  const result = execute('Locket_rc_us.js', { requestBody: JSON.stringify({ country_code: 'vn', time_zone: 'Asia/Ho_Chi_Minh', token: 'mock-only' }) });
  assert.deepEqual(JSON.parse(result.body), { country_code: 'us', time_zone: 'America/New_York', token: 'mock-only' });
});

test('US request rewrite handles invalid JSON and GET without changing body', () => {
  assert.deepEqual(execute('Locket_rc_us.js', { requestBody: 'invalid' }), {});
  assert.deepEqual(execute('Locket_rc_us.js', { method: 'GET', requestBody: '{}' }), {});
});

test('header script preserves unrelated headers and clears normal ETag casing', () => {
  const result = execute('del_header.js', { headers: { Authorization: 'mock-only', 'X-RevenueCat-ETag': 'old' } });
  assert.equal(result.headers.Authorization, 'mock-only');
  assert.equal(result.headers['X-RevenueCat-ETag'], '');
  assert.equal(result.headers['CF-IPCountry'], 'US');
});

test('robustness: header rewrite must not leave a differently cased ETag', () => {
  const result = execute('del_header.js', { headers: { 'X-Revenuecat-Etag': 'old' } });
  const etags = Object.entries(result.headers).filter(([key]) => key.toLowerCase() === 'x-revenuecat-etag');
  assert.equal(etags.length, 1, 'HTTP header names are case insensitive');
  assert.equal(etags[0][1], '');
});

test('robustness: RevenueCat error response must pass through safely', () => {
  assert.deepEqual(execute('Locket.js', { body: '{"message":"upstream error"}' }), {});
});

test('robustness: RevenueCat response without User-Agent must pass through safely', () => {
  assert.deepEqual(execute('Locket.js', { headers: {}, body: '{"subscriber":{"subscriptions":{},"entitlements":{}}}' }), {});
});

test('RevenueCat invalid JSON and malformed subscriber fields pass through exactly once', () => {
  for (const body of [
    '', '<html>error</html>', 'null', '[]', '"text"',
    '{"subscriber":null}', '{"subscriber":[]}', '{"subscriber":{}}',
    '{"subscriber":{"subscriptions":[],"entitlements":{}}}',
    '{"subscriber":{"subscriptions":{},"entitlements":null}}',
  ]) assert.deepEqual(execute('Locket.js', { body }), {});
  for (const headers of [null, { 'User-Agent': 42 }, { 'User-Agent': '' }]) {
    assert.deepEqual(execute('Locket.js', { headers }), {});
  }
});

test('RevenueCat valid response keeps other subscriber data and original Locket mapping', () => {
  const input = {
    request_date: 'mock-date',
    subscriber: {
      original_app_user_id: 'mock-user',
      subscriptions: { existing: { sentinel: true } },
      entitlements: { existing: { sentinel: true } },
    },
  };
  for (const headers of [{ 'User-Agent': 'Locket/2.70.0' }, { 'USER-AGENT': 'Locket/2.70.0' }]) {
    const output = JSON.parse(execute('Locket.js', { headers, body: JSON.stringify(input) }).body);
    assert.equal(output.request_date, input.request_date);
    assert.equal(output.subscriber.original_app_user_id, input.subscriber.original_app_user_id);
    assert.deepEqual(output.subscriber.subscriptions.existing, input.subscriber.subscriptions.existing);
    assert.deepEqual(output.subscriber.entitlements.existing, input.subscriber.entitlements.existing);
    assert.equal(output.subscriber.entitlements.Gold.product_identifier, 'com.locket02.premium.yearly');
    assert.equal(output.subscriber.entitlements.Gold.expires_date, '9999-12-18T01:04:17Z');
    assert.equal(output.subscriber.subscriptions['com.locket02.premium.yearly'].store, 'app_store');
  }
});

test('header rewrite collapses case variants while preserving unrelated input', () => {
  const headers = {
    'X-Revenuecat-Etag': 'first', 'x-revenuecat-etag': 'second',
    'cf-ipcountry': 'VN', 'CF-IPCountry': 'DE', Authorization: 'mock-only',
  };
  const original = { ...headers };
  const output = execute('del_header.js', { headers }).headers;
  for (const [name, value] of [['x-revenuecat-etag', ''], ['cf-ipcountry', 'US']]) {
    const matches = Object.entries(output).filter(([key]) => key.toLowerCase() === name);
    assert.equal(matches.length, 1);
    assert.equal(matches[0][1], value);
  }
  assert.equal(output.Authorization, 'mock-only');
  assert.deepEqual(headers, original, 'Proxy input object should not be mutated');
});

test('header rewrite handles absent headers', () => {
  const output = execute('del_header.js', { headers: null });
  assert.equal(output.headers['X-RevenueCat-ETag'], '');
  assert.equal(output.headers['CF-IPCountry'], 'US');
});
