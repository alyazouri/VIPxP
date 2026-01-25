// ================= PROXIES =================
var MATCH_JO = "PROXY 46.185.131.218:20001";

var LOBBY_POOL = [
  "PROXY 212.35.66.45:8085",
  "PROXY 212.35.66.45:8181",
  "PROXY 46.185.131.218:443"
];

var BLOCK  = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ================= MATCH (JORDAN ONLY – HARD) =================
var MATCH_ALLOWED_IPV4 = [
  ["46.185.128.0","255.255.128.0"],
  ["176.29.0.0","255.255.0.0"],
  ["176.28.128.0","255.255.128.0"],
  ["82.212.64.0","255.255.192.0"],
  ["94.249.0.0","255.255.128.0"],
  ["149.200.128.0","255.255.128.0"],
  ["92.253.0.0","255.255.128.0"],
  ["86.108.0.0","255.255.128.0"]
];

// ================= LOBBY / CDN (ALLOW LIST ONLY) =================
var LOBBY_ALLOWED_IPV4 = [

  // ===== JORDAN =====
  ["46.185.0.0","255.255.0.0"],
  ["176.28.0.0","255.252.0.0"],
  ["176.29.0.0","255.255.0.0"],
  ["82.212.0.0","255.255.0.0"],
  ["94.249.0.0","255.255.0.0"],
  ["149.200.128.0","255.255.128.0"],
  ["86.108.0.0","255.255.128.0"],
  ["92.253.0.0","255.255.128.0"],
  ["212.35.64.0","255.255.224.0"],
  ["212.118.0.0","255.255.224.0"],
  ["213.139.32.0","255.255.224.0"],

  // ===== SAUDI ARABIA =====
  ["5.42.0.0","255.255.0.0"],
  ["5.45.0.0","255.255.0.0"],
  ["31.56.0.0","255.248.0.0"],
  ["37.224.0.0","255.248.0.0"],
  ["46.151.0.0","255.255.0.0"],
  ["78.93.0.0","255.255.0.0"],
  ["86.51.0.0","255.255.0.0"],
  ["95.177.0.0","255.255.0.0"],
  ["178.86.0.0","255.255.0.0"],
  ["188.54.0.0","255.255.0.0"],

  // ===== LEBANON =====
  ["78.40.0.0","255.255.0.0"],
  ["89.108.0.0","255.255.0.0"],
  ["185.1.0.0","255.255.0.0"],
  ["185.22.0.0","255.255.0.0"],

  // ===== PALESTINE =====
  ["185.153.0.0","255.255.0.0"],
  ["185.244.0.0","255.255.0.0"]
];

// ================= SESSION =================
var SESSION = { matchNet: null, matchHost: null, dnsCache: {} };

// ================= HELPERS =================
function norm(h){ var i=h.indexOf(":"); return i>-1?h.substring(0,i):h; }
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
function pickLobbyProxy(host){
  var h=0;
  for (var i=0;i<host.length;i++)
    h=(h+host.charCodeAt(i))%LOBBY_POOL.length;
  return LOBBY_POOL[h];
}

// ================= DETECTION =================
function isPUBG(h){ return /pubg|pubgm|tencent|krafton|lightspeed|levelinfinite/i.test(h); }
function isMatch(u,h){ return /match|battle|game|combat|realtime|sync|udp|tick|room/i.test(u+h); }
function isLobby(u,h){ return /lobby|matchmaking|queue|dispatch|gateway|region|join|recruit/i.test(u+h); }
function isSocial(u,h){ return /friend|invite|squad|team|party|clan|presence|social/i.test(u+h); }
function isCDN(u,h){ return /cdn|asset|resource|patch|update|media|content/i.test(u+h); }

// ================= MAIN =================
function FindProxyForURL(url, host) {
  host = norm(host.toLowerCase());
  if (!isPUBG(host)) return DIRECT;

  var ip = resolvePinned(host);
  if (!ip || ip.indexOf(":")>-1) return BLOCK;

  if (isMatch(url, host)) {
    if (!isInList(ip, MATCH_ALLOWED_IPV4)) return BLOCK;

    var net24 = ip.split('.').slice(0,3).join('.');
    if (!SESSION.matchNet) {
      SESSION.matchNet = net24;
      SESSION.matchHost = host;
      return MATCH_JO;
    }
    if (host !== SESSION.matchHost) return BLOCK;
    if (net24 !== SESSION.matchNet) return BLOCK;

    return MATCH_JO;
  }

  if (isLobby(url, host) || isSocial(url, host) || isCDN(url, host)) {
    if (!isInList(ip, LOBBY_ALLOWED_IPV4)) return BLOCK;
    return pickLobbyProxy(host);
  }

  return BLOCK; // Default-Deny
}
