// ================= DNS =================
// dns 1.1.1.1 1.0.0.1

// ================= SOCKS PROXIES =================
var MATCH_JO     = "SOCKS 46.185.131.218:20001";   // MATCH (Gameplay) - Jordan-specific, low lag
var LOBBY_PROXY  = "SOCKS 212.35.66.45:8085";     // LOBBY / SOCIAL / CDN - Jordan-specific, low lag
var BLOCK        = "SOCKS 127.0.0.1:9";
var DIRECT       = "DIRECT";

// ================= JORDAN MATCH IPV4 (UPDATED & ULTRA-TIGHTENED FOR 2026 - STRICT NO LEAKS) =================
var JORDAN_MATCH_IPV4 = [
  ["82.212.64.0","255.255.192.0"],    // Orange core
  ["94.249.0.0","255.255.128.0"],     // Orange
  ["176.29.0.0","255.255.0.0"],       // Umniah
  ["46.185.128.0","255.255.128.0"],   // Orange/Umniah
  ["213.6.0.0","255.255.0.0"],        // General Jordan
  ["92.253.0.0","255.255.128.0"],     // Orange new 2026
  ["149.200.128.0","255.255.128.0"],  // Orange new 2026
  ["176.28.128.0","255.255.128.0"],   // Zain core
  ["46.32.96.0","255.255.224.0"],     // Zain
  ["46.248.192.0","255.255.224.0"],   // Umniah
  ["95.172.192.0","255.255.224.0"],   // Umniah
  ["109.107.224.0","255.255.224.0"],  // Umniah
  ["5.45.128.0","255.255.248.0"],     // Umniah
  ["37.123.128.0","255.255.128.0"],   // Zain
  ["87.236.232.0","255.255.248.0"],   // Zain
  ["176.241.0.0","255.255.0.0"],      // Zain
  ["37.18.0.0","255.255.0.0"],        // Umniah
  ["86.108.0.0","255.252.0.0"],       // Orange
  ["90.84.0.0","255.252.0.0"],        // Orange
  ["217.144.0.0","255.255.0.0"],      // Orange
  ["196.201.0.0","255.255.0.0"],      // Orange
  ["62.72.128.0","255.255.128.0"],    // Orange
  ["213.186.32.0","255.255.224.0"],   // Orange
  ["81.21.64.0","255.255.240.0"],     // Orange
  ["37.202.64.0","255.255.192.0"],    // Orange (updated)
  ["80.10.64.0","255.255.240.0"],     // Orange
  ["217.23.32.0","255.255.240.0"]     // Orange
];

// ================= JORDAN WIDE IPV4 (UPDATED & ULTRA-TIGHTENED FOR 2026 - CORE RANGES ONLY) =================
var JORDAN_WIDE_IPV4 = [
  ["82.212.64.0","255.255.192.0"],    // Orange
  ["94.249.0.0","255.255.128.0"],     // Orange
  ["176.29.0.0","255.255.0.0"],       // Umniah
  ["176.28.128.0","255.255.128.0"],   // Zain
  ["46.185.128.0","255.255.128.0"],   // Orange
  ["213.6.0.0","255.255.0.0"],        // General
  ["212.35.0.0","255.255.0.0"],       // General Jordan
  ["86.108.0.0","255.255.128.0"],     // Orange core updated
  ["92.253.0.0","255.255.128.0"],     // New 2026 Orange
  ["149.200.128.0","255.255.128.0"],  // New 2026 Orange
  ["79.173.192.0","255.255.192.0"],   // New from AS8376
  ["46.32.96.0","255.255.224.0"],     // Zain
  ["46.248.192.0","255.255.224.0"],   // Umniah
  ["95.172.192.0","255.255.224.0"],   // Umniah
  ["109.107.224.0","255.255.224.0"],  // Umniah
  ["37.220.112.0","255.255.240.0"],   // Umniah
  ["46.23.112.0","255.255.240.0"],    // Umniah
  ["5.45.128.0","255.255.248.0"],     // Umniah
  ["37.123.128.0","255.255.128.0"],   // Zain
  ["87.236.232.0","255.255.248.0"],   // Zain
  ["176.241.0.0","255.255.0.0"],      // Zain
  ["37.18.0.0","255.255.0.0"],        // Umniah
  ["85.159.216.0","255.255.248.0"],   // Umniah
  ["178.238.176.0","255.255.240.0"],  // Umniah
  ["141.105.56.0","255.255.248.0"],   // Umniah
  ["37.44.32.0","255.255.248.0"],     // Umniah
  ["37.152.0.0","255.255.248.0"],     // Umniah
  ["185.19.112.0","255.255.248.0"],   // Umniah
  ["185.80.104.0","255.255.248.0"],   // Umniah
  ["92.241.32.0","255.255.224.0"],    // Umniah
  ["196.201.0.0","255.255.0.0"],      // Orange
  ["62.72.128.0","255.255.128.0"],    // Orange
  ["213.186.32.0","255.255.224.0"],   // Orange
  ["81.21.64.0","255.255.240.0"],     // Orange
  ["86.108.0.0","255.252.0.0"],       // Orange
  ["90.84.0.0","255.252.0.0"],        // Orange
  ["217.144.0.0","255.255.0.0"],      // Orange
  ["37.202.64.0","255.255.192.0"],    // Orange
  ["80.10.64.0","255.255.240.0"],     // Orange
  ["217.23.32.0","255.255.240.0"]     // Orange
];

// ================= JORDAN ISP ALLOWLIST (UPDATED FOR 2026 - VERIFIED RANGES, TIGHTER) =================
function isJordanISP(ip){
  return (
    /* ZAIN (AS48832) - Tighter ranges */
    isInNet(ip, "176.28.128.0", "255.255.128.0") ||
    isInNet(ip, "46.32.96.0", "255.255.224.0") ||
    isInNet(ip, "37.123.128.0", "255.255.128.0") ||
    isInNet(ip, "87.236.232.0", "255.255.248.0") ||
    isInNet(ip, "176.241.0.0", "255.255.0.0") ||

    /* UMNIAH (AS9038) - Expanded tighter */
    isInNet(ip, "176.29.0.0", "255.255.0.0") ||
    isInNet(ip, "46.185.128.0", "255.255.128.0") ||
    isInNet(ip, "37.18.0.0", "255.255.0.0") ||
    isInNet(ip, "46.248.192.0", "255.255.224.0") ||
    isInNet(ip, "95.172.192.0", "255.255.224.0") ||
    isInNet(ip, "109.107.224.0", "255.255.224.0") ||
    isInNet(ip, "37.220.112.0", "255.255.240.0") ||
    isInNet(ip, "46.23.112.0", "255.255.240.0") ||
    isInNet(ip, "5.45.128.0", "255.255.248.0") ||
    isInNet(ip, "85.159.216.0", "255.255.248.0") ||
    isInNet(ip, "178.238.176.0", "255.255.240.0") ||
    isInNet(ip, "141.105.56.0", "255.255.248.0") ||
    isInNet(ip, "37.44.32.0", "255.255.248.0") ||
    isInNet(ip, "37.152.0.0", "255.255.248.0") ||
    isInNet(ip, "185.19.112.0", "255.255.248.0") ||
    isInNet(ip, "185.80.104.0", "255.255.248.0") ||
    isInNet(ip, "92.241.32.0", "255.255.224.0") ||

    /* ORANGE (AS8376) - Tighter and updated */
    isInNet(ip, "196.201.0.0", "255.255.0.0") ||
    isInNet(ip, "62.72.128.0", "255.255.128.0") ||
    isInNet(ip, "213.186.32.0", "255.255.224.0") ||
    isInNet(ip, "81.21.64.0", "255.255.240.0") ||
    isInNet(ip, "86.108.0.0", "255.252.0.0") ||
    isInNet(ip, "90.84.0.0", "255.252.0.0") ||
    isInNet(ip, "217.144.0.0", "255.255.0.0") ||
    isInNet(ip, "92.253.0.0", "255.255.128.0") ||
    isInNet(ip, "149.200.128.0", "255.255.128.0") ||
    isInNet(ip, "94.249.0.0", "255.255.128.0") ||
    isInNet(ip, "37.202.64.0", "255.255.192.0") ||
    isInNet(ip, "80.10.64.0", "255.255.240.0") ||
    isInNet(ip, "217.23.32.0", "255.255.240.0")
  );
}

// ================= SESSION =================
var SESSION = {
  matchNet: null,
  matchHost: null,
  dnsCache: {}
};

// ================= HELPERS =================
function norm(h){
  var i=h.indexOf(":");
  return i>-1?h.substring(0,i):h;
}

function isInList(ip, list){
  for (var i=0;i<list.length;i++)
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  return false;
}

function resolvePinned(host){
  if (SESSION.dnsCache[host]) return SESSION.dnsCache[host];
  var ip = dnsResolve(host);
  if (ip) SESSION.dnsCache[host] = ip;
  return ip;
}

function resetSession(){
  SESSION.matchNet  = null;
  SESSION.matchHost = null;
}

// ================= PORT / UDP INFERENCE =================
function getPort(url){
  var m = url.match(/:(\d+)/);
  return m ? parseInt(m[1],10) : 0;
}

function isMatchPort(url){
  var p = getPort(url);
  return (p >= 7000 && p <= 9000);
}

function isUDPFirst(u,h){
  return isMatchPort(u) || /udp|realtime|tick|sync|frame|state/i.test(u+h);
}

// ================= PUBG DOMAIN ALLOWLIST =================
function isPUBG(host){
  return (
    shExpMatch(host, "*.pubgmobile.com") ||
    shExpMatch(host, "*.pubgmobile.net") ||
    shExpMatch(host, "*.igamecj.com") ||
    shExpMatch(host, "*.tencent.com") ||
    shExpMatch(host, "*.gcloudcs.com") ||
    shExpMatch(host, "*.qcloud.com") ||
    shExpMatch(host, "*.levelinfinite.com") ||
    shExpMatch(host, "*.krafton.com") ||
    shExpMatch(host, "*.amazonaws.com") ||
    shExpMatch(host, "*.cloudfront.net") ||
    shExpMatch(host, "*.akamaized.net") ||
    shExpMatch(host, "*.akamai.net")
  );
}

// ================= DETECTION (EVEN STRICTER FOR MATCH - NO LEAKS) =================
function isMatch(u,h){
  return (
    isMatchPort(u) ||
    isUDPFirst(u,h) ||
    /match|battle|game|combat|room|server|logic|classic|ranked|arena|tdm|payload|metro|zombie|wow|training|custom|event|team|squad|opponent/i.test(u+h)  // Expanded for team/opponent no leaks
  );
}

function isLobby(u,h){
  return /lobby|matchmaking|queue|dispatch|gateway|region|prepare|entry/i.test(u+h);
}

function isSocial(u,h){
  return /friend|invite|squad|team|party|clan|presence|chat|voice/i.test(u+h);
}

function isCDN(u,h){
  return /cdn|asset|resource|patch|update|download|media|pak|obb/i.test(u+h);
}

// ================= MAIN =================
function FindProxyForURL(url, host) {

  host = norm(host.toLowerCase());
  if (!isPUBG(host)) return BLOCK;

  var ip = resolvePinned(host);
  if (!ip || ip.indexOf(":")>-1) return BLOCK;

  // ===== ULTRA-STRICT JORDAN ISP ONLY (BLOCK EARLY IF NOT LOCAL - NO LEAKS) =====
  if (!isJordanISP(ip)) return BLOCK;

  // ===== MATCH (PINNED / PORT / UDP-FIRST) - ULTRA STRICT PINNING FOR NO LEAKS =====
  if (isMatch(url, host)) {

    if (!isInList(ip, JORDAN_MATCH_IPV4) || !isJordanISP(ip)) return BLOCK;  // Double check for no leaks

    var net24 = ip.split('.').slice(0,3).join('.');

    if (!SESSION.matchNet) {
      SESSION.matchNet  = net24;
      SESSION.matchHost = host;
      return MATCH_JO;
    }

    // Ultra strict: Reset and block if ANY deviation in host or net - prevents team/opponent leaks
    if (host !== SESSION.matchHost || net24 !== SESSION.matchNet) {
      resetSession();
      return BLOCK;
    }

    return MATCH_JO;
  }

  // ===== LOBBY (AUTO RESET) - STRICT NO LEAKS =====
  if (isLobby(url, host)) {
    resetSession();
    if (!isInList(ip, JORDAN_WIDE_IPV4)) return BLOCK;
    return LOBBY_PROXY;
  }

  // ===== SOCIAL / CDN - USE DIRECT IF JORDAN FOR LOW LAG, ELSE BLOCK =====
  if (isSocial(url, host) || isCDN(url, host)) {
    if (!isInList(ip, JORDAN_WIDE_IPV4)) return BLOCK;
    return isInList(ip, JORDAN_WIDE_IPV4) ? DIRECT : LOBBY_PROXY;  // Direct for low lag if fully Jordan
  }

  // Default: Strict block if not wide Jordan - no leaks
  if (!isInList(ip, JORDAN_WIDE_IPV4)) return BLOCK;
  return LOBBY_PROXY;
}
