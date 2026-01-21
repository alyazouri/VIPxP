// ========================================
// PUBG Mobile Proxy - EXTREME OPTIMIZATION
// Version: 3.0 ULTRA
// Focus: 95%+ Jordan Players + ROCK SOLID PING
// Strategy: Aggressive Jordan Lock + Smart Fallback
// ========================================

var LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var VOICE_PROXY = "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";
var BLOCK = "PROXY 127.0.0.1:9";

// ========================================
// 🎯 TIER SYSTEM - نظام الطبقات
// ========================================

// TIER 1: شبكات المحمول الرئيسية (أكثر اللاعبين)
var JO_TIER1 = {
// Orange Jordan (الأوسع انتشاراً)
"82.212.": 1, "188.123.": 1, "78.135.": 1, "78.138.": 1,
"37.48.": 1, "37.49.": 1, "37.50.": 1, "37.51.": 1,

// Zain Jordan (تغطية كبيرة)
"176.29.": 1, "176.28.": 1, "185.117.": 1, "185.183.": 1,
"5.104.": 1,

// Umniah (منتشر)
"37.202.": 1, "77.44.": 1, "185.107.": 1,

// Shared core (الجميع عليه)
"91.106.": 1, "149.200.": 1, "212.35.": 1
};

// TIER 2: شبكات منزلية و DSL (لاعبين كثير)
var JO_TIER2 = {
"46.185.": 1, "46.32.": 1, "86.108.": 1, "92.253.": 1,
"94.249.": 1, "188.247.": 1, "188.161.": 1, "37.75.": 1,
"185.23.": 1, "79.134.": 1, "79.173.": 1, "213.6.": 1,
"213.42.": 1, "213.139.": 1, "213.186.": 1
};

// TIER 3: شبكات أقدم و Business (لاعبين متوسط)
var JO_TIER3 = {
"81.21.": 1, "81.28.": 1, "80.90.": 1, "62.72.": 1,
"62.150.": 1, "62.251.": 1, "85.159.": 1, "109.107.": 1,
"109.237.": 1, "217.23.": 1, "217.29.": 1, "217.144.": 1,
"217.171.": 1, "5.45.": 1, "5.198.": 1, "5.199.": 1,
"193.188.": 1, "193.227.": 1
};

// TIER 4: نطاقات نادرة و قديمة
var JO_TIER4 = {
"195.135.": 1, "195.170.": 1, "195.228.": 1, "195.229.": 1
};

// البحرين فقط (أقرب دولة، بنق منخفض)
var BAHRAIN_ONLY = {
"185.125.": 1, "46.183.": 1, "37.131.": 1, "80.241.": 1,
"84.235.": 1, "62.215.": 1
};

// خليج أبعد (بنق أعلى - استخدام محدود)
var GULF_DISTANT = {
"212.71.": 1, "94.26.": 1,    // السعودية
"31.192.": 1, "86.96.": 1,     // الإمارات
"62.84.": 1, "82.178.": 1      // الكويت
};

// ========================================
// ⛔ INSTANT BLOCKS (حظر فوري)
// ========================================
var INSTANT_BLOCK = {
// Afghanistan
"58.147.": 1, "59.153.": 1, "61.5.": 1, "91.109.": 1,
"103.5.": 1, "103.13.": 1, "103.17.": 1, "103.18.": 1,
"103.23.": 1, "103.28.": 1, "45.65.": 1, "45.116.": 1,
"175.107.": 1, "202.79.": 1,

// Far Asia (India/China/Singapore/Japan)
"8.222.": 1, "47.245.": 1, "43.132.": 1, "18.163.": 1,
"13.228.": 1, "13.229.": 1, "52.220.": 1, "54.169.": 1,
"175.41.": 1, "119.81.": 1, "8.210.": 1, "47.74.": 1,
"120.76.": 1, "121.40.": 1, "139.224.": 1,

// Europe (Germany/UK/France)
"18.185.": 1, "3.120.": 1, "52.58.": 1, "35.156.": 1,
"52.28.": 1, "18.194.": 1, "3.64.": 1, "52.59.": 1,

// Americas
"54.218.": 1, "52.88.": 1, "34.208.": 1, "54.85.": 1
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
if (isInNet(ip, "176.29.0.0", "255.255.0.0")) return true;
if (isInNet(ip, "82.212.64.0", "255.255.192.0")) return true;
if (isInNet(ip, "91.106.0.0", "255.255.0.0")) return true;
if (isInNet(ip, "188.123.160.0", "255.255.224.0")) return true;

return false;
}

function isBahrain(ip) {
if (!ip) return false;
if (startsWithAny(ip, BAHRAIN_ONLY)) return true;
if (isInNet(ip, "185.125.188.0", "255.255.252.0")) return true;
return false;
}

function isGulfDistant(ip) {
return ip && startsWithAny(ip, GULF_DISTANT);
}

function shouldInstantBlock(ip) {
if (!ip) return true;
if (startsWithAny(ip, INSTANT_BLOCK)) return true;

// Afghanistan CIDR confirm
if (isInNet(ip, "58.147.128.0", "255.255.224.0")) return true;
if (isInNet(ip, "91.109.216.0", "255.255.248.0")) return true;

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
var i = host.indexOf(":");
return i !== -1 ? host.substring(0, i) : host;
}

function getRealIPv4(host) {
var ip = dnsResolve(host);
return (ip && ip.indexOf(".") !== -1) ? ip : null;
}

function isPrivateIP(ip) {
if (!ip || ip.indexOf(".") === -1) return false;
return (
isInNet(ip, "10.0.0.0", "255.0.0.0") ||
isInNet(ip, "172.16.0.0", "255.240.0.0") ||
isInNet(ip, "192.168.0.0", "255.255.0.0") ||
isInNet(ip, "127.0.0.0", "255.0.0.0")
);
}

// ========================================
// ⏱️ ULTRA AGGRESSIVE TIMING
// ========================================

// LOBBY - استراتيجية أسرع وأوسع
var LOBBY_T1_MS = 60000;
var LOBBY_T2_MS = 120000;
var LOBBY_T3_MS = 180000;
var LOBBY_BH_MS = 240000;
var LOBBY_START = Date.now();

function getLobbyPhase() {
var dt = Date.now() - LOBBY_START;
if (dt < LOBBY_T1_MS) return 1;
if (dt < LOBBY_T2_MS) return 2;
if (dt < LOBBY_T3_MS) return 3;
if (dt < LOBBY_BH_MS) return 4;
return 5;
}

// WOW
var WOW_T1_MS = 90000;
var WOW_T2_MS = 150000;
var WOW_T3_MS = 210000;
var WOW_START = Date.now();

function getWOWPhase() {
var dt = Date.now() - WOW_START;
if (dt < WOW_T1_MS) return 1;
if (dt < WOW_T2_MS) return 2;
if (dt < WOW_T3_MS) return 3;
return 4;
}

// ARENA
var ARENA_T1_MS = 45000;
var ARENA_T2_MS = 90000;
var ARENA_T3_MS = 150000;
var ARENA_START = Date.now();

function getArenaPhase() {
var dt = Date.now() - ARENA_START;
if (dt < ARENA_T1_MS) return 1;
if (dt < ARENA_T2_MS) return 2;
if (dt < ARENA_T3_MS) return 3;
return 4;
}

// MATCH LOCK
var MATCH_LOCKED_IP = null;
var MATCH_LOCKED_TIME = 0;
var MATCH_LOCK_DURATION = 1800000;

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
// 🎯 MAIN ROUTING ENGINE
// ========================================
function FindProxyForURL(url, host) {
host = normalizeHost(host.toLowerCase());

var DIRECT_DOMAINS = [
"apple.com", "google.com", "gstatic.com", "googleapis.com",
"youtube.com", "googlevideo.com", "facebook.com", "fbcdn.net",
"instagram.com", "tiktok", "akamaihd.net", "cloudfront.net"
];

for (var i = 0; i < DIRECT_DOMAINS.length; i++) {
if (shExpMatch(host, "*" + DIRECT_DOMAINS[i])) return "DIRECT";
}

if (isPlainHostName(host)) return BLOCK;
if (!isPUBG(host)) return "DIRECT";

var ip = getRealIPv4(host);
if (!ip || isPrivateIP(ip)) return BLOCK;
if (shouldInstantBlock(ip)) return BLOCK;

var tier = getTier(ip);
var isJO = (tier >= 1 && tier <= 4);
var isBH = (tier === 5);
var isGF = (tier === 6);

if (tier === 0) return BLOCK;

// VOICE
if (isVoice(url, host)) {
if (isJO || isBH || isGF) return VOICE_PROXY;
return BLOCK;
}

// MATCH
if (isMatch(url, host)) {
var locked = getLockedIP();
if (locked) {
if (ip === locked) return MATCH_PROXY;
return BLOCK;
}

if (tier === 1 || tier === 2 || tier === 3 || tier === 4) {
lockMatchIP(ip);
return MATCH_PROXY;
}

if (isBH || isGF) return MATCH_PROXY;
return BLOCK;
}

// LOBBY
if (isLobby(url, host)) {
var phase = getLobbyPhase();
if (phase === 1) {
if (tier === 1) return LOBBY_PROXY;
return BLOCK;
}

if (phase === 2) {
if (tier <= 2) return LOBBY_PROXY;
return BLOCK;
}

if (phase === 3) {
if (isJO) return LOBBY_PROXY;
return BLOCK;
}

if (phase === 4) {
if (isJO || isBH) return LOBBY_PROXY;
return BLOCK;
}

if (isJO || isBH || isGF) return LOBBY_PROXY;
return BLOCK;
}

// WOW
if (isWOW(url, host)) {
var wowPhase = getWOWPhase();
if (wowPhase === 1) {
if (tier === 1) return LOBBY_PROXY;
return BLOCK;
}

if (wowPhase === 2) {
if (tier <= 2) return LOBBY_PROXY;
return BLOCK;
}

if (wowPhase === 3) {
if (isJO) return LOBBY_PROXY;
return BLOCK;
}

if (isJO || isBH) return LOBBY_PROXY;
return BLOCK;
}

// ARENA
if (isArena(url, host)) {
var arenaPhase = getArenaPhase();
if (arenaPhase === 1) {
if (tier === 1) return LOBBY_PROXY;
return BLOCK;
}

if (arenaPhase === 2) {
if (tier <= 2) return LOBBY_PROXY;
return BLOCK;
}

if (arenaPhase === 3) {
if (isJO) return LOBBY_PROXY;
return BLOCK;
}

if (isJO || isBH) return LOBBY_PROXY;
return BLOCK;
}

if (isJO || isBH || isGF) return MATCH_PROXY;
return BLOCK;
}
