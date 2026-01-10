// =====================================================
// PUBG MOBILE PAC - ENHANCED VERSION
// =====================================================

// PROXY CONFIGURATIONS
var LOBBY_PROXY = “PROXY 82.212.84.33:21000”;  
var MATCH_PROXY = “PROXY 82.212.84.33:22000”;
var UDP_PROXY   = “PROXY 82.212.84.33:40000-41004”;
var VOICE_PROXY = “PROXY 82.212.84.33:9100”;
var BACKUP_PROXY = “PROXY 82.212.84.33:23000”; // NEW: Backup for failover
var BLOCK = “DIRECT”;

// =====================================================
// SAFE SYSTEM DIRECT (CRITICAL FOR iOS/CONNECTIVITY)
// =====================================================
var SAFE_DIRECT = [
“captive.apple.com”,“time.apple.com”,“ocsp.apple.com”,
“apple.com”,“icloud.com”,
“clients3.google.com”,“gstatic.com”,“googleapis.com”,
// NEW: Additional system services
“time.windows.com”,“connectivity-check.ubuntu.com”,
“android.clients.google.com”,“device-provisioning.googleapis.com”
];

// =====================================================
// CDN DIRECT (PREVENT PROXY OVERLOAD)
// =====================================================
var CDN_DIRECT = [
“youtube.com”,“googlevideo.com”,“ytimg.com”,
“fbcdn.net”,“facebook.com”,
“instagram.com”,“cdninstagram.com”,
“tiktokcdn.com”,“tiktokv.com”,
“akamaihd.net”,“cloudfront.net”,
// NEW: Game update servers (direct for speed)
“download.pubgm.com”,“dl.pubgm.com”,“cdn.pubgm.com”
];

// =====================================================
// JORDAN NETWORKS (PRIMARY - LOWEST PING)
// =====================================================
var JO_EXTENDED = {
“82.212.”:1,“212.35.”:1,“176.29.”:1,“91.106.”:1,
“46.32.”:1,“46.185.”:1,“86.108.”:1,“92.253.”:1,
“94.249.”:1,“188.247.”:1,“149.200.”:1,
“78.135.”:1,“78.138.”:1,“79.134.”:1,“79.173.”:1,
“37.48.”:1,“37.49.”:1,“37.50.”:1,“37.51.”:1,
“37.75.”:1,“37.202.”:1,
“81.21.”:1,“81.28.”:1,“80.90.”:1,
“62.72.”:1,“62.150.”:1,“62.251.”:1,
“85.159.”:1,“109.107.”:1,“109.237.”:1,
“193.188.”:1,“193.227.”:1,
“195.135.”:1,“195.170.”:1,“195.228.”:1,“195.229.”:1,
“213.6.”:1,“213.42.”:1,“213.139.”:1,“213.186.”:1,
“217.23.”:1,“217.29.”:1,“217.144.”:1,“217.171.”:1,
“5.45.”:1,“5.198.”:1,“5.199.”:1
};

// =====================================================
// GULF NETWORKS (SECONDARY - BACKUP)
// =====================================================
var GULF_NETS = {
“185.125.”:1,“46.183.”:1,“37.131.”:1,“80.241.”:1,
“212.71.”:1,“94.26.”:1,“95.177.”:1,“46.152.”:1,
“5.62.”:1,“31.192.”:1,“31.193.”:1,
“86.96.”:1,“94.200.”:1,“94.201.”:1,“94.202.”:1
};

// =====================================================
// BLOCKED FAR REGIONS (HIGH PING/UNDESIRED)
// =====================================================
var BLOCKED = [
“8.222.”,“47.245.”,“43.132.”,“18.163.”,
“13.228.”,“13.229.”,“13.250.”,
“52.220.”,“54.169.”,“54.251.”,
“175.41.”,“119.81.”,“103.28.”,
“203.104.”,“210.16.”,
“18.185.”,“3.120.”,“52.58.”,“35.156.”,
“54.218.”,“52.88.”,“34.208.”,
// NEW: Additional far regions
“18.141.”,“52.74.”,“13.212.”,“54.254.”,
“35.247.”,“34.87.”,“35.200.”
];

// =====================================================
// DNS CACHE SYSTEM (REDUCE LATENCY SPIKES)
// =====================================================
var DNS_CACHE = {};
var DNS_TTL = 45000; // 45 seconds
var DNS_MAX_ENTRIES = 100;

function getIP(host) {
var now = Date.now();

// Check cache first
if (DNS_CACHE[host] && now - DNS_CACHE[host].t < DNS_TTL) {
return DNS_CACHE[host].ip;
}

// Resolve DNS
var ip = dnsResolve(host);

if (ip) {
// Cache size management (prevent memory overflow)
var keys = [];
for (var k in DNS_CACHE) keys.push(k);
if (keys.length >= DNS_MAX_ENTRIES) {
delete DNS_CACHE[keys[0]]; // Remove oldest
}

```
DNS_CACHE[host] = {ip: ip, t: now};
```

}

return ip;
}

// =====================================================
// SMART HELPERS
// =====================================================
function matchPrefix(ip, obj) {
for (var k in obj) {
if (ip.indexOf(k) === 0) return true;
}
return false;
}

function isPUBG(h) {
return /(pubg|pubgm|intlgame|tencent|krafton|lightspeed|wow|ugc|proxima|anticheat)/i.test(h);
}

function isLobby(u, h) {
return /(lobby|queue|recruit|room|match|login|auth|account)/i.test(u + h);
}

function isMatch(u, h) {
return /(battle|game|logic|session|state|sync|player|world)/i.test(u + h);
}

function isVoice(u, h) {
return /(voice|voip|rtc|webrtc|audio|mic)/i.test(u + h);
}

function isUpdate(u, h) {
return /(update|patch|download|cdn|asset|resource)/i.test(u + h);
}

function isAntiCheat(u, h) {
return /(anticheat|security|verify|check|monitor)/i.test(u + h);
}

// NEW: Port-based detection
function isUDPPort(u) {
return /:10[0-9]{3}|:20[0-9]{3}|:80[0-9]{2}/.test(u);
}

// =====================================================
// JORDAN STICKINESS + FAILOVER LOGIC
// =====================================================
var jordanTries = 0;
var MAX_JORDAN_TRIES = 15;
var failoverCount = 0;
var MAX_FAILOVER = 3;
var lastMatchTime = 0;
var MATCH_SESSION_TIMEOUT = 300000; // 5 minutes

// Session management
function resetSession() {
jordanTries = 0;
failoverCount = 0;
lastMatchTime = 0;
}

function updateMatchTime() {
lastMatchTime = Date.now();
}

function isSessionActive() {
return (Date.now() - lastMatchTime) < MATCH_SESSION_TIMEOUT;
}

// =====================================================
// MAIN PROXY LOGIC
// =====================================================
function FindProxyForURL(url, host) {
host = host.toLowerCase();
var lowerUrl = url.toLowerCase();

// –– 1. CRITICAL SYSTEM DIRECT ––
for (var i = 0; i < SAFE_DIRECT.length; i++) {
if (dnsDomainIs(host, SAFE_DIRECT[i])) return “DIRECT”;
}

// –– 2. CDN/UPDATE DIRECT ––
for (var j = 0; j < CDN_DIRECT.length; j++) {
if (shExpMatch(host, “*” + CDN_DIRECT[j])) return “DIRECT”;
}

// NEW: Update servers direct
if (isUpdate(lowerUrl, host)) return “DIRECT”;

// –– 3. NON-PUBG TRAFFIC BLOCK ––
if (!isPUBG(host)) return BLOCK;

// –– 4. DNS RESOLUTION ––
var ip = getIP(host);
if (!ip) {
// Failover: retry or backup
if (failoverCount < MAX_FAILOVER) {
failoverCount++;
return BACKUP_PROXY;
}
return BLOCK;
}

// –– 5. BLOCK FAR REGIONS ––
for (var b = 0; b < BLOCKED.length; b++) {
if (ip.indexOf(BLOCKED[b]) === 0) return BLOCK;
}

// –– 6. NETWORK DETECTION ––
var JO = matchPrefix(ip, JO_EXTENDED) ||
isInNet(ip, “82.212.64.0”, “255.255.192.0”);
var GF = matchPrefix(ip, GULF_NETS);

if (!(JO || GF)) return BLOCK;

// –– 7. LOBBY TRAFFIC (RESET SESSION) ––
if (isLobby(lowerUrl, host)) {
resetSession();
return LOBBY_PROXY;
}

// –– 8. VOICE TRAFFIC (DEDICATED) ––
if (isVoice(lowerUrl, host)) {
return VOICE_PROXY;
}

// –– 9. ANTI-CHEAT (DIRECT FOR SECURITY) ––
if (isAntiCheat(lowerUrl, host)) {
return “DIRECT”;
}

// –– 10. MATCH TRAFFIC (SMART ROUTING) ––
if (isMatch(lowerUrl, host) || isUDPPort(url)) {
updateMatchTime();

```
// Primary: Jordan (low ping)
if (JO && jordanTries < MAX_JORDAN_TRIES) {
  jordanTries++;
  return UDP_PROXY + "; " + BACKUP_PROXY; // Failover chain
}

// Secondary: Gulf
if (GF) {
  return UDP_PROXY + "; " + BACKUP_PROXY;
}

// Fallback
return MATCH_PROXY + "; " + BACKUP_PROXY;
```

}

// –– 11. DEFAULT MATCH TRAFFIC ––
return MATCH_PROXY + “; “ + BACKUP_PROXY;
}

// =====================================================
// DEBUG HELPERS (OPTIONAL - COMMENT OUT IN PRODUCTION)
// =====================================================
/*
function logDecision(host, ip, decision) {
alert(“Host: “ + host + “\nIP: “ + ip + “\nDecision: “ + decision);
}
*/
