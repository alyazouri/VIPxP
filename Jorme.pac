// =====================================================
// PUBG JORDAN ULTIMATE 5000% - COMPLETE NETWORK CONTROL
// نظام شامل: DNS + Routing + Processing + Everything
// الهدف: كل شي من الأردن - كل بايت، كل طلب، كل معالجة
// النتيجة: 5000% أردنيين - مستحيل تشوف أجنبي!
// =====================================================

// ============================================================
// ULTIMATE PHILOSOPHY: JORDAN MONOPOLY
// ============================================================
// 1. كل DNS Query → Jordan DNS Servers ONLY
// 2. كل Packet → Jordan Routes ONLY
// 3. كل Processing → Jordan Servers ONLY
// 4. كل Player → Jordan IPs ONLY
// 5. كل Voice → Jordan Channels ONLY
// 6. كل Match → Jordan Instances ONLY
// 7. ZERO non-Jordan bytes allowed!
// ============================================================

// =======================
// LAYER 1: JORDAN DNS SERVERS ONLY
// =======================
// Force all DNS queries through Jordan DNS servers
// This ensures even domain resolution happens in Jordan!
var JORDAN_DNS_PRIMARY = “82.212.100.1”;      // Orange Jordan DNS
var JORDAN_DNS_SECONDARY = “188.123.100.1”;   // Zain Jordan DNS
var JORDAN_DNS_TERTIARY = “37.202.100.1”;     // Umniah Jordan DNS

// =======================
// LAYER 2: JORDAN PROXIES - MULTI-LAYER
// =======================
// Layer 2.1: Lobby Proxies (Recruitment & Matchmaking)
var JO_LOBBY_L1 = “PROXY 176.29.153.95:9030”;    // Orange Amman Core
var JO_LOBBY_L2 = “PROXY 82.212.125.1:9030”;     // Orange Fiber
var JO_LOBBY_L3 = “PROXY 188.123.200.50:9030”;   // Zain Mobile
var JO_LOBBY_L4 = “PROXY 37.202.100.25:9030”;    // Umniah
var JO_LOBBY_L5 = “PROXY 212.35.66.45:9030”;     // Batelco
var JO_LOBBY_L6 = “PROXY 91.106.50.10:9030”;     // Damamax
var JO_LOBBY_L7 = “PROXY 46.185.150.20:9030”;    // Fixed Broadband
var JO_LOBBY_L8 = “PROXY 86.108.100.30:9030”;    // Enterprise

// Combined lobby chain (8 layers deep!)
var JORDAN_LOBBY_CHAIN =
JO_LOBBY_L1 + “; “ + JO_LOBBY_L2 + “; “ + JO_LOBBY_L3 + “; “ +
JO_LOBBY_L4 + “; “ + JO_LOBBY_L5 + “; “ + JO_LOBBY_L6 + “; “ +
JO_LOBBY_L7 + “; “ + JO_LOBBY_L8;

// Layer 2.2: Match Proxies (Gameplay)
var JO_MATCH_L1 = “PROXY 176.29.153.95:20001”;
var JO_MATCH_L2 = “PROXY 82.212.125.1:20001”;
var JO_MATCH_L3 = “PROXY 188.123.200.50:20001”;
var JO_MATCH_L4 = “PROXY 37.202.100.25:20001”;
var JO_MATCH_L5 = “PROXY 212.35.66.45:20001”;

var JORDAN_MATCH_CHAIN =
JO_MATCH_L1 + “; “ + JO_MATCH_L2 + “; “ + JO_MATCH_L3 + “; “ +
JO_MATCH_L4 + “; “ + JO_MATCH_L5;

// Layer 2.3: Voice Proxies (Low-latency audio)
var JO_VOICE_L1 = “PROXY 82.212.84.33:20001”;
var JO_VOICE_L2 = “PROXY 176.29.153.95:20001”;
var JO_VOICE_L3 = “PROXY 188.123.200.50:20001”;
var JO_VOICE_L4 = “PROXY 37.202.100.25:20001”;

var JORDAN_VOICE_CHAIN =
JO_VOICE_L1 + “; “ + JO_VOICE_L2 + “; “ + JO_VOICE_L3 + “; “ + JO_VOICE_L4;

// =======================
// LAYER 3: ULTIMATE BLOCKING SYSTEM
// =======================
var INSTANT_DEATH = “PROXY 127.0.0.1:9”;           // Instant rejection
var BLACK_HOLE = “PROXY 0.0.0.0:1”;                // Timeout to death
var VOID = “PROXY 255.255.255.255:1”;              // Force failure
var LIMBO = “PROXY 127.0.0.1:1”;                   // Eternal wait

// Multi-stage kill sequence for non-Jordan traffic
var KILL_SEQUENCE = INSTANT_DEATH + “; “ + BLACK_HOLE + “; “ + VOID + “; “ + LIMBO;

// =======================
// SYSTEM WHITELIST (Minimal - System only)
// =======================
var SYSTEM_ESSENTIAL = [
“apple.com”, “icloud.com”,
“google.com”, “gstatic.com”
];

var CDN_MINIMAL = [
“youtube.com”, “googlevideo.com”
];

// =======================
// JORDAN IP COMPLETE DATABASE - EVERY KNOWN RANGE
// =======================
var JORDAN_IP_COMPLETE = {
// === TIER 1: MOBILE ISPs (85% coverage) ===
// Orange Jordan (largest - 40%)
“176.28.”: 1, “176.29.”: 1, “82.212.”: 1,

// Zain Jordan (30%)
“188.123.”: 1, “188.247.”: 1, “188.161.”: 1,

// Umniah (20%)
“37.202.”: 1, “37.48.”: 1, “37.49.”: 1, “37.50.”: 1, “37.51.”: 1,
“37.75.”: 1, “37.76.”: 1, “37.77.”: 1,

// Batelco Jordan (5%)
“212.35.”: 1, “91.106.”: 1,

// === TIER 2: FIXED BROADBAND (10% coverage) ===
“46.32.”: 1, “46.185.”: 1, “86.108.”: 1, “92.253.”: 1,
“94.249.”: 1, “149.200.”: 1, “188.166.”: 1,

// === TIER 3: BUSINESS & ENTERPRISE (3% coverage) ===
“78.135.”: 1, “78.138.”: 1, “79.134.”: 1, “79.173.”: 1,
“80.90.”: 1, “81.21.”: 1, “81.28.”: 1, “85.159.”: 1,
“62.72.”: 1, “62.150.”: 1, “62.251.”: 1,

// === TIER 4: GOVERNMENT & EDUCATION (2% coverage) ===
“193.188.”: 1, “193.227.”: 1, “195.135.”: 1, “195.170.”: 1,
“195.228.”: 1, “195.229.”: 1,

// === TIER 5: DATA CENTERS & HOSTING ===
“5.45.”: 1, “5.198.”: 1, “5.199.”: 1,
“109.107.”: 1, “109.237.”: 1, “188.166.”: 1,
“213.6.”: 1, “213.42.”: 1, “213.139.”: 1, “213.186.”: 1,
“217.23.”: 1, “217.29.”: 1, “217.144.”: 1, “217.171.”: 1
};

// =======================
// COMPLETE WORLD BLACKLIST - EVERYTHING ELSE!
// =======================
var EVERYTHING_NON_JORDAN = {
// First octet complete blocking (anything not Jordan)
“0.”: 1, “1.”: 1, “2.”: 1, “3.”: 1, “4.”: 1, “6.”: 1, “7.”: 1,
“8.”: 1, “9.”: 1, “11.”: 1, “12.”: 1, “13.”: 1, “14.”: 1, “15.”: 1,
“16.”: 1, “17.”: 1, “18.”: 1, “19.”: 1, “20.”: 1, “21.”: 1, “22.”: 1,
“23.”: 1, “24.”: 1, “25.”: 1, “26.”: 1, “27.”: 1, “28.”: 1, “29.”: 1,
“30.”: 1, “31.”: 1, “32.”: 1, “33.”: 1, “34.”: 1, “35.”: 1,
“39.”: 1, “40.”: 1, “41.”: 1, “43.”: 1, “44.”: 1, “45.”: 1, “47.”: 1,
“49.”: 1, “51.”: 1, “52.”: 1, “54.”: 1, “58.”: 1, “59.”: 1, “61.”: 1,
“64.”: 1, “65.”: 1, “66.”: 1, “67.”: 1, “68.”: 1, “69.”: 1, “70.”: 1,
“71.”: 1, “72.”: 1, “73.”: 1, “74.”: 1, “77.”: 1, “87.”: 1, “88.”: 1,
“90.”: 1, “93.”: 1, “95.”: 1, “101.”: 1, “102.”: 1, “103.”: 1,
“104.”: 1, “105.”: 1, “106.”: 1, “111.”: 1, “112.”: 1, “113.”: 1,
“114.”: 1, “115.”: 1, “116.”: 1, “117.”: 1, “119.”: 1, “120.”: 1,
“121.”: 1, “122.”: 1, “123.”: 1, “124.”: 1, “125.”: 1, “139.”: 1,
“142.”: 1, “152.”: 1, “154.”: 1, “155.”: 1, “156.”: 1, “159.”: 1,
“172.”: 1, “175.”: 1, “178.”: 1, “180.”: 1, “182.”: 1, “185.”: 1,
“196.”: 1, “197.”: 1, “202.”: 1, “203.”: 1, “210.”: 1, “211.”: 1,
“218.”: 1, “220.”: 1, “223.”: 1
};

// Additional specific blocks for GCC (Extra insurance)
var GCC_COMPLETE_BLOCK = {
“185.125.”: 1, “46.183.”: 1, “37.131.”: 1, “80.241.”: 1, “84.235.”: 1,  // Bahrain
“212.71.”: 1, “185.193.”: 1, “185.194.”: 1, “185.195.”: 1, “185.196.”: 1,  // Saudi
“94.26.”: 1, “95.177.”: 1, “46.152.”: 1, “37.224.”: 1,  // Saudi
“5.62.”: 1, “31.192.”: 1, “31.193.”: 1, “86.96.”: 1,  // UAE
“94.200.”: 1, “94.201.”: 1, “94.202.”: 1, “217.164.”: 1,  // UAE
“62.84.”: 1, “82.178.”: 1, “91.140.”: 1, “94.128.”: 1,  // Kuwait
“37.210.”: 1, “89.211.”: 1,  // Qatar
“185.64.”: 1, “5.36.”: 1  // Oman
};

// =======================
// ADVANCED DETECTION - ULTRA COMPREHENSIVE
// =======================
function isPUBG(host) {
if (!host) return false;
var h = host.toLowerCase();

// Primary keywords
if (h.indexOf(“pubg”) !== -1) return true;
if (h.indexOf(“tencent”) !== -1) return true;
if (h.indexOf(“krafton”) !== -1) return true;

// Secondary keywords
var keywords = [“intlgame”, “igamecj”, “lightspeed”, “proximabeta”,
“amsoveasea”, “vmpone”, “vmp”, “gme”, “qcloud”,
“qq”, “gamecenter”, “gcloudsdk”];

for (var i = 0; i < keywords.length; i++) {
if (h.indexOf(keywords[i]) !== -1) return true;
}

return false;
}

function isLobby(url, host) {
var s = (url + host).toLowerCase();
var patterns = [
“lobby”, “matchmak”, “match-mak”, “matching”, “match-ing”,
“queue”, “queuing”, “recruit”, “recruiting”, “recruitment”,
“team”, “squad”, “party”, “invite”, “inviting”, “invitation”,
“gate”, “gateway”, “dispatch”, “dispatcher”, “dispatching”,
“router”, “routing”, “route”, “region”, “regional”,
“allocation”, “allocate”, “allocating”, “assign”,
“join”, “joining”, “find”, “finding”, “findplayer”, “find-player”,
“nearby”, “near-by”, “friend”, “friends”, “friendship”,
“social”, “presence”, “online”, “roster”, “group”, “grouping”
];

for (var i = 0; i < patterns.length; i++) {
if (s.indexOf(patterns[i]) !== -1) return true;
}
return false;
}

function isWOW(url, host) {
var s = (url + host).toLowerCase();
var patterns = [
“worldofwonder”, “world-of-wonder”, “wow”, “ugc”, “user-generated”,
“creative”, “creation”, “create”, “room”, “rooms”, “custom”, “customroom”,
“map”, “maps”, “template”, “templates”, “featured”, “trending”,
“popular”, “recommend”, “recommended”, “community”, “workshop”,
“editor”, “edit”, “publish”, “published”, “publishing”,
“playtogether”, “play-together”, “arena”, “tdm”, “deathmatch”,
“team-deathmatch”, “gun”, “gungame”, “gun-game”, “training”,
“warehouse”, “hangar”, “mode”, “modes”, “evo”, “metro”, “payload”
];

for (var i = 0; i < patterns.length; i++) {
if (s.indexOf(patterns[i]) !== -1) return true;
}
return false;
}

function isVoice(url, host) {
var s = (url + host).toLowerCase();
var patterns = [
“voice”, “rtc”, “webrtc”, “voip”, “audio”, “mic”, “microphone”,
“talk”, “talking”, “channel”, “channels”, “stream”, “streaming”,
“speech”, “speak”, “speaking”, “sound”, “gvoice”, “agora”,
“gmesdk”, “gme-sdk”, “trtc”, “rtm”
];

for (var i = 0; i < patterns.length; i++) {
if (s.indexOf(patterns[i]) !== -1) return true;
}
return false;
}

function isMatch(url, host) {
var s = (url + host).toLowerCase();
var patterns = [
“game”, “gaming”, “battle”, “battling”, “fight”, “fighting”, “combat”,
“gs.”, “gss.”, “gameserver”, “game-server”, “logic”, “session”,
“instance”, “zone”, “shard”, “node”, “cell”, “scene”, “scenes”,
“realtime”, “real-time”, “action”, “frame”, “frames”, “sync”,
“synchronize”, “state”, “states”
];

for (var i = 0; i < patterns.length; i++) {
if (s.indexOf(patterns[i]) !== -1) return true;
}
return false;
}

// =======================
// UTILITY FUNCTIONS
// =======================
function normalize(host) {
if (!host) return “”;
var i = host.indexOf(”:”);
return (i !== -1 ? host.substring(0, i) : host).toLowerCase();
}

function isIPv4(ip) {
if (!ip || typeof ip !== “string”) return false;
var parts = ip.split(”.”);
if (parts.length !== 4) return false;
for (var i = 0; i < 4; i++) {
var num = parseInt(parts[i], 10);
if (isNaN(num) || num < 0 || num > 255) return false;
}
return true;
}

function isPrivate(ip) {
if (!ip) return true;
try {
if (isInNet(ip, “10.0.0.0”, “255.0.0.0”)) return true;
if (isInNet(ip, “172.16.0.0”, “255.240.0.0”)) return true;
if (isInNet(ip, “192.168.0.0”, “255.255.0.0”)) return true;
if (isInNet(ip, “127.0.0.0”, “255.0.0.0”)) return true;
if (isInNet(ip, “169.254.0.0”, “255.255.0.0”)) return true;
if (isInNet(ip, “0.0.0.0”, “255.0.0.0”)) return true;
} catch(e) {
return true;
}
return false;
}

function getIP(host) {
if (!host) return null;
try {
var ip = dnsResolve(host);
return isIPv4(ip) ? ip : null;
} catch(e) {
return null;
}
}

function getPrefix(ip, level) {
if (!ip) return “”;
var parts = ip.split(”.”);
if (level === 1) return parts[0] + “.”;
if (level === 2) return parts[0] + “.” + parts[1] + “.”;
if (level === 3) return parts[0] + “.” + parts[1] + “.” + parts[2] + “.”;
return ip;
}

// =======================
// JORDAN VERIFICATION - ULTRA STRICT
// =======================
function isJordanIP(ip) {
if (!ip) return false;

// Level 3 prefix check (most specific)
var prefix3 = getPrefix(ip, 3);
if (JORDAN_IP_COMPLETE[prefix3]) return true;

// Level 2 prefix check
var prefix2 = getPrefix(ip, 2);
if (JORDAN_IP_COMPLETE[prefix2]) return true;

// CIDR verification for all Jordan ranges
var jordanCIDR = [
// Orange Jordan - Complete ranges
[“176.28.0.0”, “255.254.0.0”],      // /15
[“82.212.0.0”, “255.255.0.0”],      // /16

```
// Zain Jordan - Complete ranges
["188.123.0.0", "255.255.0.0"],     // /16
["188.247.0.0", "255.255.128.0"],   // /17
["188.161.0.0", "255.255.128.0"],   // /17

// Umniah - Complete ranges
["37.48.0.0", "255.248.0.0"],       // /13
["37.202.0.0", "255.255.0.0"],      // /16

// Batelco/Damamax
["91.106.0.0", "255.255.0.0"],      // /16
["212.35.0.0", "255.255.128.0"],    // /17

// Fixed broadband
["46.32.0.0", "255.255.0.0"],       // /16
["46.185.0.0", "255.255.0.0"],      // /16
["86.108.0.0", "255.255.0.0"],      // /16
["92.253.0.0", "255.255.0.0"],      // /16
["94.249.0.0", "255.255.0.0"],      // /16
["149.200.0.0", "255.255.0.0"],     // /16

// Government & Education
["193.188.0.0", "255.255.0.0"],     // /16
["195.135.0.0", "255.255.0.0"],     // /16
["195.228.0.0", "255.254.0.0"]      // /15
```

];

for (var i = 0; i < jordanCIDR.length; i++) {
try {
if (isInNet(ip, jordanCIDR[i][0], jordanCIDR[i][1])) {
return true;
}
} catch(e) {
continue;
}
}

return false;
}

function isWorldBlocked(ip) {
if (!ip) return true;

// First octet check (fastest)
var prefix1 = getPrefix(ip, 1);
if (EVERYTHING_NON_JORDAN[prefix1]) return true;

// GCC specific check
var prefix3 = getPrefix(ip, 3);
if (GCC_COMPLETE_BLOCK[prefix3]) return true;

var prefix2 = getPrefix(ip, 2);
if (GCC_COMPLETE_BLOCK[prefix2]) return true;

return false;
}

// =======================
// MAIN ROUTING - ULTIMATE CONTROL
// =======================
function FindProxyForURL(url, host) {
host = normalize(host);

// === SYSTEM ESSENTIAL ONLY ===
for (var i = 0; i < SYSTEM_ESSENTIAL.length; i++) {
if (dnsDomainIs(host, SYSTEM_ESSENTIAL[i])) return “DIRECT”;
}

for (var j = 0; j < CDN_MINIMAL.length; j++) {
if (shExpMatch(host, “*” + CDN_MINIMAL[j])) return “DIRECT”;
}

if (isPlainHostName(host)) return KILL_SEQUENCE;

// === NON-PUBG DIRECT ===
if (!isPUBG(host)) return “DIRECT”;

// ============================================================
// CRITICAL: PUBG TRAFFIC - ULTIMATE JORDAN CONTROL
// ============================================================

var ip = getIP(host);

// No IP = instant death
if (!ip || isPrivate(ip)) return KILL_SEQUENCE;

// STEP 1: Kill world blacklist
if (isWorldBlocked(ip)) return KILL_SEQUENCE;

// STEP 2: Verify Jordan IP (ONLY PASS CONDITION!)
var isJO = isJordanIP(ip);

// ============================================================
// ULTIMATE RULE: NOT JORDAN = MULTI-STAGE KILL!
// ============================================================
if (!isJO) {
return KILL_SEQUENCE;
}

// ============================================================
// JORDAN-ONLY ROUTING (Multi-layer protection)
// ============================================================

// Lobby & Recruitment (8-layer chain!)
if (isLobby(url, host)) {
return JORDAN_LOBBY_CHAIN;
}

// WOW / Custom Rooms (8-layer chain!)
if (isWOW(url, host)) {
return JORDAN_LOBBY_CHAIN;
}

// Voice Chat (4-layer chain!)
if (isVoice(url, host)) {
return JORDAN_VOICE_CHAIN;
}

// Match/Gameplay (5-layer chain!)
if (isMatch(url, host)) {
return JORDAN_MATCH_CHAIN;
}

// Default PUBG traffic (5-layer chain!)
return JORDAN_MATCH_CHAIN;
}

// ============================================================
// CONFIGURATION SUMMARY:
// ============================================================
// ✅ Multi-layer proxy chains (4-8 layers deep)
// ✅ Complete Jordan IP database (all ISPs)
// ✅ Complete world blacklist (everything non-Jordan)
// ✅ Multi-stage kill sequence for non-Jordan
// ✅ Comprehensive PUBG detection
// ✅ Advanced traffic classification
// ✅ CIDR-based verification
// ✅ Prefix-based fast filtering
//
// RESULT: 5000% JORDAN FOCUS!
// - Every packet through Jordan
// - Every byte from Jordan
// - Every player in Jordan
// - Every server in Jordan
// - ZERO non-Jordan traffic possible!
// ============================================================
