// =====================================================
// PUBG JORDAN EXTREME ENGINEERING v4.0
// هندسة شبكات متقدمة - ULTRA LOW PING + MAX JORDAN PLAYERS
// تقنيات: Multi-layer routing, Latency optimization, Geo-pinning
// =====================================================

// =======================
// JORDAN ISP PROXIES - Optimized by Provider & City
// =======================

// Orange Jordan (Lowest latency - Amman)
var ORANGE_AMMAN =
“PROXY 176.29.153.95:9030; “ +
“PROXY 176.29.200.10:9030; “ +
“PROXY 82.212.125.1:9030; “ +
“PROXY 82.212.100.50:9030”;

// Zain Jordan (Fast mobile network)
var ZAIN_JORDAN =
“PROXY 188.123.200.50:9030; “ +
“PROXY 188.123.180.20:9030; “ +
“PROXY 188.247.100.15:9030”;

// Umniah (Good for north Jordan)
var UMNIAH_JORDAN =
“PROXY 37.202.100.25:9030; “ +
“PROXY 37.202.80.10:9030; “ +
“PROXY 37.48.150.5:9030”;

// Batelco/Damamax (Enterprise grade)
var BATELCO_JORDAN =
“PROXY 212.35.66.45:9030; “ +
“PROXY 91.106.50.10:9030”;

// Fixed broadband (Gaming optimized)
var JORDAN_FIXED =
“PROXY 46.185.150.20:9030; “ +
“PROXY 86.108.100.30:9030; “ +
“PROXY 92.253.50.5:9030”;

// Match proxies (Dedicated game traffic)
var MATCH_PRIMARY =
“PROXY 176.29.153.95:20001; “ +
“PROXY 82.212.125.1:20001; “ +
“PROXY 188.123.200.50:20001”;

var MATCH_SECONDARY =
“PROXY 212.35.66.45:20001; “ +
“PROXY 91.106.50.10:20001”;

// Voice proxies (Low jitter routes)
var VOICE_PRIMARY =
“PROXY 82.212.84.33:20001; “ +
“PROXY 176.29.153.95:20001”;

var VOICE_SECONDARY =
“PROXY 188.123.200.50:20001; “ +
“PROXY 37.202.100.25:20001”;

// Emergency Bahrain (Only if absolutely needed)
var BAHRAIN_EMERGENCY = “PROXY 185.125.190.10:9030”;

var BLOCK = “PROXY 127.0.0.1:9”;

// =======================
// SAFE & CDN DIRECT
// =======================
var SAFE_DIRECT = [
“captive.apple.com”, “time.apple.com”, “ocsp.apple.com”,
“clients3.google.com”, “gstatic.com”, “googleapis.com”,
“apple.com”, “icloud.com”, “mzstatic.com”
];

var CDN_DIRECT = [
“youtube.com”, “googlevideo.com”, “ytimg.com”,
“fbcdn.net”, “facebook.com”, “instagram.com”,
“cdninstagram.com”, “tiktokcdn.com”, “whatsapp.com”,
“discord.com”, “discordapp.com”
];

// =======================
// JORDAN IP RANGES - COMPLETE DATABASE
// =======================
var JO_TIER1 = {
// Tier 1: Major ISPs - Highest priority
“176.29.”: 1, “176.28.”: 1,        // Orange (biggest)
“82.212.”: 1,                       // Orange fiber
“188.123.”: 1, “188.247.”: 1,      // Zain
“37.202.”: 1,                       // Umniah
“212.35.”: 1, “91.106.”: 1         // Batelco/Damamax
};

var JO_TIER2 = {
// Tier 2: Fixed broadband & business
“46.185.”: 1, “46.32.”: 1,
“86.108.”: 1, “92.253.”: 1,
“94.249.”: 1, “149.200.”: 1,
“188.161.”: 1
};

var JO_TIER3 = {
// Tier 3: Extended ranges
“37.48.”: 1, “37.49.”: 1, “37.50.”: 1, “37.75.”: 1,
“78.135.”: 1, “78.138.”: 1,
“79.134.”: 1, “79.173.”: 1,
“80.90.”: 1, “81.21.”: 1, “81.28.”: 1,
“85.159.”: 1, “62.72.”: 1, “62.150.”: 1, “62.251.”: 1,
“109.107.”: 1, “109.237.”: 1,
“193.188.”: 1, “195.135.”: 1, “195.228.”: 1, “195.229.”: 1,
“213.6.”: 1, “213.42.”: 1, “213.139.”: 1,
“217.23.”: 1, “217.29.”: 1,
“5.45.”: 1, “5.198.”: 1, “5.199.”: 1
};

// Bahrain (Emergency only - closest GCC country)
var BAHRAIN_IPS = {
“185.125.”: 1, “46.183.”: 1, “37.131.”: 1
};

// =======================
// BLACKLIST - Everything non-Jordan
// =======================
var BLACKLIST = [
// Afghanistan (Complete block)
“58.147.”, “59.153.”, “61.5.”, “91.109.”,
“103.5.”, “103.13.”, “103.17.”, “103.18.”, “103.23.”, “103.28.”,
“45.65.”, “45.116.”,

// Pakistan
“39.32.”, “39.33.”, “111.68.”, “111.92.”, “116.71.”,
“182.176.”, “182.180.”, “202.141.”, “203.124.”,

// India
“106.51.”, “117.239.”, “122.166.”, “152.57.”,
“14.139.”, “14.140.”, “14.141.”, “14.192.”,
“103.21.”, “103.22.”, “103.246.”, “103.249.”,

// Saudi Arabia (Temporarily blocked for Jordan focus)
“212.71.”, “185.193.”, “185.194.”, “185.195.”, “185.196.”,
“94.26.”, “95.177.”, “46.152.”, “37.224.”,

// UAE (Temporarily blocked)
“5.62.”, “31.192.”, “31.193.”, “86.96.”,
“94.200.”, “94.201.”, “94.202.”, “217.164.”,

// Kuwait
“62.84.”, “82.178.”, “91.140.”, “94.128.”,

// Qatar
“37.210.”, “89.211.”,

// Oman
“185.64.”, “5.36.”,

// Egypt
“41.32.”, “41.33.”, “41.176.”, “41.177.”, “196.218.”,

// Turkey
“88.255.”, “78.186.”, “85.111.”, “176.41.”, “176.42.”,
“185.125.”, “94.54.”,

// Iraq
“37.236.”, “37.239.”, “185.101.”, “217.218.”,

// Asia Pacific - Singapore/HK/China
“8.210.”, “8.222.”, “13.228.”, “13.229.”, “13.250.”,
“18.140.”, “18.141.”, “18.163.”, “43.132.”, “43.251.”, “43.254.”,
“47.52.”, “47.74.”, “47.88.”, “47.91.”, “47.245.”,
“52.74.”, “52.77.”, “52.220.”, “54.169.”, “54.251.”,
“119.81.”, “120.76.”, “121.40.”, “139.224.”, “156.230.”,
“175.41.”, “203.104.”, “210.16.”,

// Europe - Frankfurt/Ireland/London
“3.64.”, “3.65.”, “3.66.”, “3.120.”, “3.121.”, “3.122.”, “3.123.”,
“18.157.”, “18.185.”, “18.194.”, “18.196.”,
“35.156.”, “52.28.”, “52.29.”, “52.30.”, “52.58.”, “52.59.”,

// Americas - US East/West
“18.232.”, “18.237.”, “34.192.”, “34.208.”, “34.220.”, “34.224.”,
“44.228.”, “52.24.”, “52.36.”, “52.88.”, “52.90.”,
“54.85.”, “54.200.”, “54.218.”, “54.244.”
];

// =======================
// HELPER FUNCTIONS
// =======================
function isPUBG(host) {
var h = host.toLowerCase();
return /(pubg|pubgm|pubgmobile|intlgame|igamecj|proximabeta|tencent|qq|qcloud|krafton|lightspeed|amsoveasea|vmpone|vmp|gme|gamecenter|gcloudsdk)/.test(h);
}

function isLobbyTraffic(url, host) {
var s = (url + host).toLowerCase();
return /(lobby|matchmaking|matching|match-making|queue|queuing|recruit|recruiting|team|squad|party|invite|inviting|gate|gateway|dispatcher|dispatch|router|routing|region|regional|allocation|allocate|join|joining|findplayer|find-player|nearby|friend|friends|social|presence|roster|group|grouping)/.test(s);
}

function isWOWTraffic(url, host) {
var s = (url + host).toLowerCase();
return /(worldofwonder|wow|ugc|user-generated|creative|creation|room|rooms|customroom|custom-room|custom|map|maps|template|templates|featured|trending|popular|recommend|recommended|daily|weekly|community|workshop|editor|publish|published|playtogether|play-together|arena|tdm|deathmatch|teamdeathmatch|team-deathmatch|gun|gungame|gun-game|training|warehouse|hangar|mode|evo|metro|payload)/.test(s);
}

function isVoiceTraffic(url, host) {
var s = (url + host).toLowerCase();
return /(voice|rtc|webrtc|voip|audio|mic|microphone|talk|talking|channel|stream|streaming|speech|sound|gvoice|agora|gmesdk|trtc)/.test(s);
}

function isMatchTraffic(url, host) {
var s = (url + host).toLowerCase();
return /(game|gaming|battle|fight|fighting|combat|gs.|gss.|gameserver|game-server|logic|session|instance|zone|shard|node|cell|scene|realtime|real-time|action|frame|sync|state)/.test(s);
}

function startsWithAny(ip, table) {
for (var k in table)
if (ip.indexOf(k) === 0) return true;
return false;
}

function normalizeHost(host) {
var i = host.indexOf(”:”);
return i !== -1 ? host.substring(0, i) : host;
}

function isIPv4(ip) {
return ip && /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/.test(ip);
}

function isPrivate(ip) {
if (!ip) return true;
return (
isInNet(ip, “10.0.0.0”, “255.0.0.0”) ||
isInNet(ip, “172.16.0.0”, “255.240.0.0”) ||
isInNet(ip, “192.168.0.0”, “255.255.0.0”) ||
isInNet(ip, “127.0.0.0”, “255.0.0.0”) ||
isInNet(ip, “169.254.0.0”, “255.255.0.0”) ||
isInNet(ip, “0.0.0.0”, “255.0.0.0”)
);
}

function getIP(host) {
try {
var ip = dnsResolve(host);
return isIPv4(ip) ? ip : null;
} catch(e) {
return null;
}
}

// =======================
// GEO DETECTION - ADVANCED
// =======================
function getJordanTier(ip) {
if (!ip) return 0;

// Check prefix tables first (fastest)
if (startsWithAny(ip, JO_TIER1)) return 1;
if (startsWithAny(ip, JO_TIER2)) return 2;
if (startsWithAny(ip, JO_TIER3)) return 3;

// CIDR checks for major Jordan ranges
// Orange Jordan
if (isInNet(ip, “176.28.128.0”, “255.255.128.0”)) return 1; // /17
if (isInNet(ip, “176.29.0.0”, “255.255.0.0”)) return 1;     // /16
if (isInNet(ip, “82.212.64.0”, “255.255.192.0”)) return 1;  // /18

// Zain Jordan
if (isInNet(ip, “188.123.160.0”, “255.255.224.0”)) return 1; // /19
if (isInNet(ip, “188.247.64.0”, “255.255.224.0”)) return 1;  // /19

// Umniah
if (isInNet(ip, “37.202.64.0”, “255.255.224.0”)) return 1;   // /19

// Batelco/Damamax
if (isInNet(ip, “91.106.0.0”, “255.255.0.0”)) return 1;      // /16
if (isInNet(ip, “212.35.64.0”, “255.255.224.0”)) return 1;   // /19

// Fixed broadband
if (isInNet(ip, “46.185.128.0”, “255.255.128.0”)) return 2;  // /17
if (isInNet(ip, “86.108.0.0”, “255.255.128.0”)) return 2;    // /17
if (isInNet(ip, “92.253.0.0”, “255.255.128.0”)) return 2;    // /17
if (isInNet(ip, “94.249.0.0”, “255.255.128.0”)) return 2;    // /17
if (isInNet(ip, “149.200.128.0”, “255.255.128.0”)) return 2; // /17

// Extended ranges
if (isInNet(ip, “78.135.0.0”, “255.255.128.0”)) return 3;    // /17
if (isInNet(ip, “79.134.0.0”, “255.255.254.0”)) return 3;    // /23

return 0; // Not Jordan
}

function isBahrain(ip) {
if (!ip) return false;
if (startsWithAny(ip, BAHRAIN_IPS)) return true;
if (isInNet(ip, “185.125.188.0”, “255.255.252.0”)) return true;
if (isInNet(ip, “46.183.216.0”, “255.255.252.0”)) return true;
return false;
}

function isBlacklisted(ip) {
if (!ip) return true;
for (var i = 0; i < BLACKLIST.length; i++)
if (ip.indexOf(BLACKLIST[i]) === 0) return true;

// Afghanistan CIDR blocks (Extra protection)
if (isInNet(ip, “58.147.128.0”, “255.255.224.0”)) return true;
if (isInNet(ip, “59.153.124.0”, “255.255.252.0”)) return true;
if (isInNet(ip, “103.5.172.0”, “255.255.252.0”)) return true;
if (isInNet(ip, “103.13.64.0”, “255.255.252.0”)) return true;

return false;
}

// =======================
// TIMING SYSTEM - Advanced Phasing
// =======================
var CYCLE_MS = 2000;           // Reset every 2 seconds (faster than 3)
var JO_STRICT_PHASE = 900000;  // 15 minutes strict Jordan
var ALLOW_BAHRAIN = 900000;    // Allow Bahrain after 15 min

function getCycle() {
return Math.floor(Date.now() / CYCLE_MS);
}

function getPhase() {
var cycle = getCycle();
var elapsed = (cycle * CYCLE_MS) % 1000000; // Wrap around

if (elapsed < JO_STRICT_PHASE) return “STRICT_JO”;
if (elapsed < ALLOW_BAHRAIN) return “JO_PRIORITY”;
return “JO_OR_BAHRAIN”;
}

// =======================
// PROXY SELECTION - Intelligent Routing
// =======================
function selectLobbyProxy(tier, phase) {
if (phase === “STRICT_JO” || phase === “JO_PRIORITY”) {
// Use best proxies based on ISP tier
if (tier === 1) return ORANGE_AMMAN;
if (tier === 2) return ZAIN_JORDAN;
if (tier === 3) return UMNIAH_JORDAN;
return ORANGE_AMMAN; // Default to Orange (biggest network)
}

// Fallback phase
if (tier === 1) return ORANGE_AMMAN;
if (tier === 2) return ZAIN_JORDAN;
return BATELCO_JORDAN;
}

function selectMatchProxy(tier) {
if (tier === 1 || tier === 2) return MATCH_PRIMARY;
return MATCH_SECONDARY;
}

function selectVoiceProxy(tier) {
if (tier === 1 || tier === 2) return VOICE_PRIMARY;
return VOICE_SECONDARY;
}

// =======================
// MAIN ROUTING ENGINE - EXTREME OPTIMIZATION
// =======================
function FindProxyForURL(url, host) {
host = normalizeHost(host.toLowerCase());

// Safe direct (System & CDN)
for (var i = 0; i < SAFE_DIRECT.length; i++)
if (dnsDomainIs(host, SAFE_DIRECT[i])) return “DIRECT”;

for (var j = 0; j < CDN_DIRECT.length; j++)
if (shExpMatch(host, “*” + CDN_DIRECT[j])) return “DIRECT”;

if (isPlainHostName(host)) return BLOCK;

// Non-PUBG traffic
if (!isPUBG(host)) return “DIRECT”;

// Resolve IP
var ip = getIP(host);
if (!ip || isPrivate(ip)) return BLOCK;

// HARD BLOCK blacklisted regions
if (isBlacklisted(ip)) return BLOCK;

// Determine Jordan tier (0 = not Jordan)
var jordanTier = getJordanTier(ip);
var isBH = isBahrain(ip);
var phase = getPhase();

// Block everything except Jordan/Bahrain
if (jordanTier === 0 && !isBH) return BLOCK;

// ==========================================
// LOBBY & RECRUIT - MAXIMUM JORDAN FOCUS
// ==========================================
if (isLobbyTraffic(url, host)) {
if (phase === “STRICT_JO”) {
// 15 minutes: Jordan ONLY
if (jordanTier > 0) return selectLobbyProxy(jordanTier, phase);
return BLOCK;
}

```
if (phase === "JO_PRIORITY") {
  // Jordan priority, no Bahrain yet
  if (jordanTier > 0) return selectLobbyProxy(jordanTier, phase);
  return BLOCK;
}

// After 15 min: Jordan first, Bahrain emergency
if (jordanTier > 0) return selectLobbyProxy(jordanTier, phase);
if (isBH) return BAHRAIN_EMERGENCY;
return BLOCK;
```

}

// ==========================================
// WOW / ROOMS / ARENA - JORDAN FOCUS
// ==========================================
if (isWOWTraffic(url, host)) {
if (jordanTier > 0) return selectLobbyProxy(jordanTier, phase);
if (isBH && phase === “JO_OR_BAHRAIN”) return BAHRAIN_EMERGENCY;
return BLOCK;
}

// ==========================================
// VOICE - LOW LATENCY ROUTES
// ==========================================
if (isVoiceTraffic(url, host)) {
if (jordanTier > 0) return selectVoiceProxy(jordanTier);
if (isBH && phase === “JO_OR_BAHRAIN”) return VOICE_SECONDARY;
return BLOCK;
}

// ==========================================
// MATCH - OPTIMIZED GAME TRAFFIC
// ==========================================
if (isMatchTraffic(url, host)) {
if (jordanTier > 0) return selectMatchProxy(jordanTier);
if (isBH && phase === “JO_OR_BAHRAIN”) return MATCH_SECONDARY;
return BLOCK;
}

// Default PUBG traffic
if (jordanTier > 0) return selectMatchProxy(jordanTier);
if (isBH && phase === “JO_OR_BAHRAIN”) return BAHRAIN_EMERGENCY;
return BLOCK;
}
