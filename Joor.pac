// =====================================================
// PUBG ALL-IN JORDAN ULTRA — FINAL COMPLETE (PING FIXED)
// Priority: Jordan FIRST -> Gulf ONLY (NO EUROPE/ASIA/AMERICAS)
// =====================================================

// =======================
// PROXIES (STABLE)
// =======================
var LOBBY_PROXY =
  "PROXY 82.212.84.33:21000; " +
  "PROXY 212.35.66.45:21000";

var MATCH_PROXY = "PROXY 82.212.84.33:22000";

var VOICE_PROXY =
  "PROXY 82.212.84.33:22000; " +
  "PROXY 82.212.84.33:9100";

// ⬅️ FIX: prevent retry storm
var BLOCK = "DIRECT";

// =======================
// SAFE DIRECT (SYSTEM)
// =======================
var SAFE_DIRECT = [
  "captive.apple.com",
  "time.apple.com",
  "ocsp.apple.com",
  "clients3.google.com",
  "gstatic.com",
  "googleapis.com"
];

// =======================
// CDN / MEDIA DIRECT
// =======================
var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "fbcdn.net","facebook.com",
  "instagram.com","cdninstagram.com",
  "tiktokcdn.com","tiktokv.com",
  "akamaihd.net"
];

// =======================
// GEO CONFIG
// =======================
var CFG = { GEO_MODE: "JO_GULF_ONLY" };

// =======================
// JORDAN PREFIX
// =======================
var JO_TIGHT = {
  "82.212.":1,"212.35.":1,"176.29.":1,"91.106.":1,"46.32.":1,
  "46.185.":1,"86.108.":1,"92.253.":1,"94.249.":1,
  "188.247.":1,"149.200.":1
};

var JO_FULL = {
  "78.135.":1,"78.138.":1,
  "37.48.":1,"37.49.":1,"37.50.":1,"37.51.":1,
  "37.75.":1,"37.202.":1,
  "79.134.":1,"79.173.":1,
  "81.21.":1,"81.28.":1,"80.90.":1,
  "62.72.":1,"62.150.":1,"62.251.":1,
  "85.159.":1,
  "109.107.":1,"109.237.":1,
  "188.161.":1,
  "193.188.":1,"193.227.":1,
  "195.135.":1,"195.170.":1,"195.228.":1,"195.229.":1,
  "213.6.":1,"213.42.":1,"213.139.":1,"213.186.":1,
  "217.23.":1,"217.29.":1,"217.144.":1,"217.171.":1,
  "5.45.":1,"5.198.":1,"5.199.":1
};

// =======================
// GULF
// =======================
var GULF_NETS = {
  "185.125.":1,"46.183.":1,"37.131.":1,"80.241.":1,"84.235.":1,
  "212.71.":1,"185.193.":1,"185.194.":1,"185.195.":1,"185.196.":1,
  "94.26.":1,"95.177.":1,"46.152.":1,"37.224.":1,
  "5.62.":1,"31.192.":1,"31.193.":1,
  "86.96.":1,"94.200.":1,"94.201.":1,"94.202.":1,
  "217.164.":1,
  "62.84.":1,"82.178.":1,"91.140.":1,"94.128.":1,
  "37.210.":1,"89.211.":1,
  "185.64.":1,"5.36.":1
};

// =======================
// BLOCKED FAR REGIONS
// =======================
var BLOCKED = [
  "8.222.","47.245.","43.132.","18.163.","13.228.","13.229.",
  "13.250.","52.220.","54.169.","54.251.","175.41.","119.81.",
  "103.28.","203.104.","210.16.","52.74.","52.77.",
  "18.185.","3.120.","52.58.","35.156.","52.28.","52.29.",
  "54.218.","52.88.","34.208.","18.237.","52.36.","54.244."
];

// =======================
// DNS CACHE — FIX PING SPIKES
// =======================
var DNS_CACHE = {};
var DNS_TTL_MS = 30000;

function getCachedIPv4(host){
  var now = Date.now();
  var e = DNS_CACHE[host];
  if (e && (now - e.t) < DNS_TTL_MS) return e.ip;

  var ip = dnsResolve(host);
  if (ip && ip.indexOf(".") !== -1) {
    DNS_CACHE[host] = { ip: ip, t: now };
    return ip;
  }
  return null;
}

// =======================
// HELPERS
// =======================
function startsWithAny(ip, table){
  for (var k in table) if (ip.indexOf(k) === 0) return true;
  return false;
}

function isPUBG(host){
  return /(pubg|pubgm|intlgame|tencent|krafton|lightspeed|wow|ugc)/i.test(host);
}

function isLobbyTraffic(u,h){ return /(lobby|match|queue|room|recruit)/i.test(u+h); }
function isMatchTraffic(u,h){ return /(game|battle|gs\.|logic|session)/i.test(u+h); }
function isVoiceTraffic(u,h){ return /(voice|rtc|webrtc|voip)/i.test(u+h); }
function isWOWTraffic(u,h){ return /(wow|ugc|creative|room)/i.test(u+h); }

// =======================
// GEO CHECK
// =======================
function isJordanIP(ip){
  return startsWithAny(ip, JO_TIGHT) || startsWithAny(ip, JO_FULL) ||
         isInNet(ip,"82.212.64.0","255.255.192.0");
}
function isGulfIP(ip){
  return startsWithAny(ip, GULF_NETS);
}

// =======================
// MAIN
// =======================
function FindProxyForURL(url, host){

  host = host.toLowerCase();

  for (var i=0;i<SAFE_DIRECT.length;i++)
    if (dnsDomainIs(host, SAFE_DIRECT[i])) return "DIRECT";

  for (var j=0;j<CDN_DIRECT.length;j++)
    if (shExpMatch(host, "*"+CDN_DIRECT[j])) return "DIRECT";

  if (!isPUBG(host)) return "DIRECT";

  var ip = getCachedIPv4(host);
  if (!ip) return BLOCK;

  for (var b=0;b<BLOCKED.length;b++)
    if (ip.indexOf(BLOCKED[b])===0) return BLOCK;

  var JO = isJordanIP(ip);
  var GF = isGulfIP(ip);
  if (!(JO || GF)) return BLOCK;

  if (isWOWTraffic(url,host)) return LOBBY_PROXY;
  if (isLobbyTraffic(url,host)) return LOBBY_PROXY;
  if (isVoiceTraffic(url,host)) return VOICE_PROXY;
  if (isMatchTraffic(url,host)) return MATCH_PROXY;

  return MATCH_PROXY;
}
