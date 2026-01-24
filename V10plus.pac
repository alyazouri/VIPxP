// ================= PROXIES =================
var MATCH_JO = "PROXY 46.185.131.218:20001";

var LOBBY_POOL = [
  "PROXY 212.35.66.45:8085","PROXY 176.29.153.95:9030"
];

var BLOCK  = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ================= JORDAN MATCH (STRONG) =================
var JORDAN_MATCH_IPV4 = [
  ["82.212.64.0","255.255.128.0"],
  ["94.249.0.0","255.255.0.0"],
  ["176.28.0.0","255.255.0.0"],
  ["176.29.0.0","255.255.0.0"],
  ["46.185.0.0","255.255.0.0"],
  ["213.6.0.0","255.255.0.0"]
];

// ================= JORDAN LOBBY (STRICT) =================
var JORDAN_LOBBY_IPV4 = [
  ["82.212.0.0","255.255.0.0"],
  ["94.249.0.0","255.255.0.0"],
  ["46.185.0.0","255.255.0.0"],
  ["213.6.0.0","255.255.0.0"],
  ["212.35.0.0","255.255.0.0"]
];

// ================= SESSION =================
var SESSION = {
  matchNet:  null,
  matchHost: null,
  matchIP:   null,
  dnsCache:  {}
};

// ================= HELPERS =================
function norm(h){
  var i = h.indexOf(":");
  return i > -1 ? h.substring(0, i) : h;
}

function isInList(ip, list){
  for (var i=0; i<list.length; i++)
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  return false;
}

function resolvePinned(host){
  if (SESSION.dnsCache[host]) return SESSION.dnsCache[host];
  var ip = dnsResolve(host);
  if (ip) SESSION.dnsCache[host] = ip;
  return ip;
}

// ================= DETECTION (WIDENED & PRECISE) =================

// PUBG domains / publishers / infra
function isPUBG(h){
  return /pubg|pubgm|pubgmobile|tencent|krafton|lightspeed|levelinfinite|igamecj|proximabeta|vnggames/i
         .test(h);
}

// REALTIME GAME TRAFFIC (UDP-HEAVY)
function isPUBG_UDP(u,h){
  return /(udp|tick|ticks|sync|realtime|battle|combat|match|game|room|session|state|frame|physics|movement|shoot|fire|hit|damage)/i
         .test(u+h);
}

// MATCHMAKING / REGION / GATEWAY
function isLobby(u,h){
  return /(lobby|matchmaking|queue|dispatch|gateway|region|zone|join|recruit|pair|assign|entry)/i
         .test(u+h);
}

// SOCIAL / VOICE / SQUAD
function isSocial(u,h){
  return /(friend|invite|squad|team|party|clan|presence|social|voice|mic|talk|chat|whisper)/i
         .test(u+h);
}

// CDN / PATCH / ASSETS
function isCDN(u,h){
  return /(cdn|asset|resource|static|media|content|patch|update|download|bundle|pak|obb|manifest)/i
         .test(u+h);
}

// ================= MAIN =================
function FindProxyForURL(url, host) {

  host = norm(host.toLowerCase());

  // Only PUBG
  if (!isPUBG(host)) return DIRECT;

  var ip = resolvePinned(host);
  if (!ip || ip.indexOf(":") > -1) return BLOCK;

  // ================= MATCH (UDP HEAVY – HARD LOCK) =================
  if (isPUBG_UDP(url, host)) {

    if (!isInList(ip, JORDAN_MATCH_IPV4)) return BLOCK;

    var net24 = ip.split('.').slice(0,3).join('.');

    if (!SESSION.matchNet) {
      SESSION.matchNet  = net24;
      SESSION.matchHost = host;
      SESSION.matchIP   = ip;
      return MATCH_JO;
    }

    // Ultra lock
    if (host !== SESSION.matchHost) return BLOCK;
    if (net24 !== SESSION.matchNet) return BLOCK;
    if (ip   !== SESSION.matchIP)   return BLOCK;

    return MATCH_JO;
  }

  // ================= LOBBY / SOCIAL / CDN =================
  if (isLobby(url, host) || isSocial(url, host) || isCDN(url, host)) {
    if (!isInList(ip, JORDAN_LOBBY_IPV4)) return BLOCK;
    return LOBBY_POOL[0];
  }

  return BLOCK;
}
