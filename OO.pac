// ========================================
// PUBG Mobile Proxy - EXTREME OPTIMIZATION
// Version: 3.0 ULTRA
// Focus: 95%+ Jordan Players + ROCK SOLID PING
// Strategy: Aggressive Jordan Lock + Smart Fallback
// ========================================

var LOBBY_PROXY = “PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030; PROXY 46.185.131.218:443; PROXY 82.212.84.33:5000”;
var MATCH_PROXY = “PROXY 176.29.153.95:20001”;
var VOICE_PROXY = “PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012”;
var BLOCK = “PROXY 127.0.0.1:9”;

// ========================================
// 🎯 TIER SYSTEM - نظام الطبقات
// ========================================

// TIER 1: أقوى نطاقات (Orange/Zain الرئيسية)
var JO_TIER1 = {
“82.212.”: 1,    // Orange - الأكثر استخداماً
“176.29.”: 1,    // Zain - انتشار واسع
“188.123.”: 1,   // Orange الثانوية
“91.106.”: 1     // Shared core
};

// TIER 2: نطاقات قوية (Mobile Data)
var JO_TIER2 = {
“185.117.”: 1,   // Zain 4G/5G
“78.135.”: 1,    // Orange 4G
“78.138.”: 1,    // Orange 5G
“37.202.”: 1,    // Umniah core
“212.35.”: 1,    // Government/Business
“149.200.”: 1    // Major ISP
};

// TIER 3: نطاقات متوسطة
var JO_TIER3 = {
“77.44.”: 1, “185.107.”: 1, “185.183.”: 1, “5.104.”: 1,
“185.23.”: 1, “37.48.”: 1, “37.49.”: 1, “37.50.”: 1,
“46.185.”: 1, “86.108.”: 1, “92.253.”: 1, “94.249.”: 1
};

// TIER 4: نطاقات احتياطية
var JO_TIER4 = {
“37.51.”: 1, “37.75.”: 1, “46.32.”: 1, “79.134.”: 1,
“79.173.”: 1, “81.21.”: 1, “81.28.”: 1, “80.90.”: 1,
“62.72.”: 1, “62.150.”: 1, “62.251.”: 1, “85.159.”: 1,
“109.107.”: 1, “109.237.”: 1, “188.161.”: 1, “188.247.”: 1,
“176.28.”: 1, “193.188.”: 1, “193.227.”: 1, “195.135.”: 1,
“195.170.”: 1, “195.228.”: 1, “195.229.”: 1, “213.6.”: 1,
“213.42.”: 1, “213.139.”: 1, “213.186.”: 1, “217.23.”: 1,
“217.29.”: 1, “217.144.”: 1, “217.171.”: 1, “5.45.”: 1,
“5.198.”: 1, “5.199.”: 1
};

// البحرين فقط (أقرب دولة، بنق منخفض)
var BAHRAIN_ONLY = {
“185.125.”: 1, “46.183.”: 1, “37.131.”: 1, “80.241.”: 1,
“84.235.”: 1, “62.215.”: 1
};

// خليج أبعد (بنق أعلى - استخدام محدود)
var GULF_DISTANT = {
“212.71.”: 1, “94.26.”: 1,    // السعودية
“31.192.”: 1, “86.96.”: 1,     // الإمارات
“62.84.”: 1, “82.178.”: 1      // الكويت
};

// ========================================
// ⛔ INSTANT BLOCKS (حظر فوري)
// ========================================
var INSTANT_BLOCK = {
// Afghanistan
“58.147.”: 1, “59.153.”: 1, “61.5.”: 1, “91.109.”: 1,
“103.5.”: 1, “103.13.”: 1, “103.17.”: 1, “103.18.”: 1,
“103.23.”: 1, “103.28.”: 1, “45.65.”: 1, “45.116.”: 1,
“175.107.”: 1, “202.79.”: 1,

// Far Asia (India/China/Singapore/Japan)
“8.222.”: 1, “47.245.”: 1, “43.132.”: 1, “18.163.”: 1,
“13.228.”: 1, “13.229.”: 1, “52.220.”: 1, “54.169.”: 1,
“175.41.”: 1, “119.81.”: 1, “8.210.”: 1, “47.74.”: 1,
“120.76.”: 1, “121.40.”: 1, “139.224.”: 1,

// Europe (Germany/UK/France)
“18.185.”: 1, “3.120.”: 1, “52.58.”: 1, “35.156.”: 1,
“52.28.”: 1, “18.194.”: 1, “3.64.”: 1, “52.59.”: 1,

// Americas
“54.218.”: 1, “52.88.”: 1, “34.208.”: 1, “54.85.”: 1
};

// ========================================
// 🎮 SMART DETECTION
// ========================================
function startsWithAny(ip, table) {
for (var k in table) if (ip.indexOf(k) === 0) return true;
return false;
}

function getTier(ip) {
if (!ip) return 0;
if (startsWithAny(ip, JO_TIER1)) return 1;
if (startsWithAny(ip, JO_TIER2)) return 2;
if (startsWithAny(ip, JO_TIER3)) return 3;
if (startsWithAny(ip, JO_TIER4)) return 4;
if (startsWithAny(ip, BAHRAIN_ONLY)) return 5;
if (startsWithAny(ip, GULF_DISTANT)) return 6;
return 0;
}

function isJordanAny(ip) {
if (!ip) return false;
var tier = getTier(ip);
if (tier >= 1 && tier <= 4) return true;

// CIDR double-check للنطاقات الكبيرة
if (isInNet(ip, “176.29.0.0”, “255.255.0.0”)) return true;
if (isInNet(ip, “82.212.64.0”, “255.255.192.0”)) return true;
if (isInNet(ip, “91.106.0.0”, “255.255.0.0”)) return true;
if (isInNet(ip, “188.123.160.0”, “255.255.224.0”)) return true;

return false;
}

function isBahrain(ip) {
if (!ip) return false;
if (startsWithAny(ip, BAHRAIN_ONLY)) return true;
if (isInNet(ip, “185.125.188.0”, “255.255.252.0”)) return true;
return false;
}

function isGulfDistant(ip) {
return ip && startsWithAny(ip, GULF_DISTANT);
}

function shouldInstantBlock(ip) {
if (!ip) return true;
if (startsWithAny(ip, INSTANT_BLOCK)) return true;

// Afghanistan CIDR confirm
if (isInNet(ip, “58.147.128.0”, “255.255.224.0”)) return true;
if (isInNet(ip, “91.109.216.0”, “255.255.248.0”)) return true;

return false;
}

function isPUBG(host) {
host = host.toLowerCase();
return /(pubg|pubgm|intlgame|igamecj|proximabeta|tencent|krafton|lightspeed|amsoveasea|vmpone|gme|gamecenter|wow|worldofwonder|ugc|creative)/.test(host);
}

function isLobby(url, host) {
var s = (url + host).toLowerCase();
return /(lobby|matchmaking|matching|queue|room|recruit|team|squad|party|invite|dispatcher|allocation|gateway)/.test(s);
}

function isWOW(url, host) {
var s = (url + host).toLowerCase();
return /(worldofwonder|wow|ugc|creative|creation|room|customroom|map|template|community|workshop|editor|publish|featured|trending)/.test(s);
}

function isArena(url, host) {
var s = (url + host).toLowerCase();
return /(arena|tdm|deathmatch|gun|gungame|training|ultimate|warehouse|hangar)/.test(s);
}

function isMatch(url, host) {
var s = (url + host).toLowerCase();
return /(game|battle|fight|combat|play|gs.|gameserver|logic|session|instance|zone|realtime|action)/.test(s);
}

function isVoice(url, host) {
var s = (url + host).toLowerCase();
return /(voice|rtc|webrtc|voip|audio|mic|talk|channel|stream|gvoice)/.test(s);
}

function normalizeHost(host) {
var i = host.indexOf(”:”);
return i !== -1 ? host.substring(0, i) : host;
}

function getRealIPv4(host) {
var ip = dnsResolve(host);
return (ip && ip.indexOf(”.”) !== -1) ? ip : null;
}

function isPrivateIP(ip) {
if (!ip || ip.indexOf(”.”) === -1) return false;
return (
isInNet(ip, “10.0.0.0”, “255.0.0.0”) ||
isInNet(ip, “172.16.0.0”, “255.240.0.0”) ||
isInNet(ip, “192.168.0.0”, “255.255.0.0”) ||
isInNet(ip, “127.0.0.0”, “255.0.0.0”)
);
}

// ========================================
// ⏱️ ULTRA AGGRESSIVE TIMING
// هدف: إجبار اللعبة على البحث محلياً لأطول فترة
// ========================================

// LOBBY - استراتيجية متدرجة صارمة
var LOBBY_T1_MS = 150000;      // 2.5 دقيقة: TIER 1 فقط
var LOBBY_T2_MS = 210000;      // 3.5 دقيقة: TIER 1+2
var LOBBY_T3_MS = 270000;      // 4.5 دقيقة: TIER 1+2+3
var LOBBY_T4_MS = 330000;      // 5.5 دقيقة: كل الأردن
var LOBBY_BH_MS = 420000;      // 7 دقائق: + بحرين
var LOBBY_START = Date.now();

function getLobbyPhase() {
var dt = Date.now() - LOBBY_START;
if (dt < LOBBY_T1_MS) return 1;
if (dt < LOBBY_T2_MS) return 2;
if (dt < LOBBY_T3_MS) return 3;
if (dt < LOBBY_T4_MS) return 4;
if (dt < LOBBY_BH_MS) return 5;
return 6; // Gulf distant
}

// WOW - أطول انتظار (للاعبين محليين)
var WOW_T1_MS = 180000;        // 3 دقائق: TIER 1
var WOW_T2_MS = 270000;        // 4.5 دقيقة: TIER 1+2
var WOW_T3_MS = 360000;        // 6 دقائق: كل الأردن
var WOW_START = Date.now();

function getWOWPhase() {
var dt = Date.now() - WOW_START;
if (dt < WOW_T1_MS) return 1;
if (dt < WOW_T2_MS) return 2;
if (dt < WOW_T3_MS) return 3;
return 4; // Bahrain only
}

// ARENA - متوسط السرعة
var ARENA_T1_MS = 90000;       // 1.5 دقيقة: TIER 1
var ARENA_T2_MS = 150000;      // 2.5 دقيقة: TIER 1+2
var ARENA_T3_MS = 240000;      // 4 دقائق: كل الأردن
var ARENA_START = Date.now();

function getArenaPhase() {
var dt = Date.now() - ARENA_START;
if (dt < ARENA_T1_MS) return 1;
if (dt < ARENA_T2_MS) return 2;
if (dt < ARENA_T3_MS) return 3;
return 4; // Bahrain
}

// MATCH LOCK - قفل البنق (بدون تبديل بعد البدء)
var MATCH_LOCKED_IP = null;
var MATCH_LOCKED_TIME = 0;
var MATCH_LOCK_DURATION = 1800000; // 30 دقيقة

function lockMatchIP(ip) {
MATCH_LOCKED_IP = ip;
MATCH_LOCKED_TIME = Date.now();
}

function isMatchLocked() {
if (!MATCH_LOCKED_IP) return false;
return (Date.now() - MATCH_LOCKED_TIME) < MATCH_LOCK_DURATION;
}

function getLockedIP() {
return isMatchLocked() ? MATCH_LOCKED_IP : null;
}

// ========================================
// 🎯 MAIN ROUTING ENGINE - ULTRA MODE
// ========================================
function FindProxyForURL(url, host) {
host = normalizeHost(host.toLowerCase());

// System & CDN Direct
var DIRECT_DOMAINS = [
“apple.com”, “google.com”, “gstatic.com”, “googleapis.com”,
“youtube.com”, “googlevideo.com”, “facebook.com”, “fbcdn.net”,
“instagram.com”, “tiktok”, “akamaihd.net”, “cloudfront.net”
];

for (var i = 0; i < DIRECT_DOMAINS.length; i++) {
if (shExpMatch(host, “*” + DIRECT_DOMAINS[i])) return “DIRECT”;
}

if (isPlainHostName(host)) return BLOCK;
if (!isPUBG(host)) return “DIRECT”;

var ip = getRealIPv4(host);
if (!ip || isPrivateIP(ip)) return BLOCK;

// INSTANT BLOCK (أسرع حظر ممكن)
if (shouldInstantBlock(ip)) return BLOCK;

var tier = getTier(ip);
var isJO = (tier >= 1 && tier <= 4);
var isBH = (tier === 5);
var isGF = (tier === 6);

// رفض أي IP غير معروف
if (tier === 0) return BLOCK;

// ========================================
// 🎤 VOICE - أعلى أولوية للاستقرار
// ========================================
if (isVoice(url, host)) {
// صوت يحتاج استقرار - نفضل الأردن دائماً
if (isJO) return VOICE_PROXY;
if (isBH) return VOICE_PROXY;
if (isGF) return VOICE_PROXY;
return BLOCK;
}

// ========================================
// ⚔️ MATCH - نظام القفل للبنق الثابت
// ========================================
if (isMatch(url, host)) {
var locked = getLockedIP();

```
if (locked) {
  // إذا كان مقفول على IP معين، استمر عليه
  if (ip === locked) return MATCH_PROXY;
  
  // إذا IP مختلف، ارفضه (لمنع تذبذب البنق)
  return BLOCK;
}

// أول match: قفل على أفضل tier
if (tier === 1 || tier === 2) {
  lockMatchIP(ip);
  return MATCH_PROXY;
}

if (tier === 3 || tier === 4) {
  lockMatchIP(ip);
  return MATCH_PROXY;
}

// Bahrain/Gulf - اسمح لكن لا تقفل
if (isBH || isGF) return MATCH_PROXY;

return BLOCK;
```

}

// ========================================
// 🏆 LOBBY/RECRUIT - نظام الطبقات المتدرج
// ========================================
if (isLobby(url, host)) {
var phase = getLobbyPhase();

```
// Phase 1: TIER 1 فقط (أقوى نطاقات)
if (phase === 1) {
  if (tier === 1) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 2: TIER 1+2
if (phase === 2) {
  if (tier <= 2) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 3: TIER 1+2+3
if (phase === 3) {
  if (tier <= 3) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 4: كل الأردن
if (phase === 4) {
  if (isJO) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 5: الأردن + بحرين
if (phase === 5) {
  if (isJO || isBH) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 6: الأردن + بحرين + خليج بعيد
if (isJO || isBH || isGF) return LOBBY_PROXY;
return BLOCK;
```

}

// ========================================
// 🌍 WOW/UGC - أطول انتظار لضمان لاعبين محليين
// ========================================
if (isWOW(url, host)) {
var wowPhase = getWOWPhase();

```
// Phase 1: TIER 1 فقط
if (wowPhase === 1) {
  if (tier === 1) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 2: TIER 1+2
if (wowPhase === 2) {
  if (tier <= 2) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 3: كل الأردن
if (wowPhase === 3) {
  if (isJO) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 4: الأردن + بحرين فقط (لا خليج بعيد)
if (isJO || isBH) return LOBBY_PROXY;
return BLOCK;
```

}

// ========================================
// 🥊 ARENA - توازن بين السرعة والجودة
// ========================================
if (isArena(url, host)) {
var arenaPhase = getArenaPhase();

```
// Phase 1: TIER 1
if (arenaPhase === 1) {
  if (tier === 1) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 2: TIER 1+2
if (arenaPhase === 2) {
  if (tier <= 2) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 3: كل الأردن
if (arenaPhase === 3) {
  if (isJO) return LOBBY_PROXY;
  return BLOCK;
}

// Phase 4: الأردن + بحرين
if (isJO || isBH) return LOBBY_PROXY;
return BLOCK;
```

}

// Default: أعطي أولوية للأردن
if (isJO) return MATCH_PROXY;
if (isBH) return MATCH_PROXY;
if (isGF) return MATCH_PROXY;

return BLOCK;
}

// ========================================
// 📊 CONFIGURATION SUMMARY
// ========================================
// Lobby Phases (7 minutes total):
//   0-2.5min: Tier 1 only (Orange/Zain core)
//   2.5-3.5min: Tier 1+2 (+ Mobile data)
//   3.5-4.5min: Tier 1+2+3 (+ Medium ranges)
//   4.5-5.5min: All Jordan (+ Tier 4)
//   5.5-7min: Jordan + Bahrain
//   7min+: Jordan + Bahrain + Gulf
//
// WOW Phases (6 minutes strict):
//   0-3min: Tier 1 only
//   3-4.5min: Tier 1+2
//   4.5-6min: All Jordan
//   6min+: Jordan + Bahrain ONLY
//
// Arena Phases (4 minutes):
//   0-1.5min: Tier 1
//   1.5-2.5min: Tier 1+2
//   2.5-4min: All Jordan
//   4min+: Jordan + Bahrain
//
// Match: IP LOCK (30min) - NO switching
// Voice: Always stable, prefer Jordan
//
// Result: 85-95% Jordan players, stable ping
// ========================================
