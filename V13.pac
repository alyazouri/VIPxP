// ================= PROXIES =================
var MATCH_JO = "PROXY 212.35.66.45:20001"; // Gameplay / Arena / WoW (Jordan Core)
var LOBBY_POOL = [
  "PROXY 176.29.153.95:9030", // Mobile CGNAT (density)
  "PROXY 91.106.109.12:9030"  // Core fallback (JO)
];

var BLOCK = "PROXY 127.0.0.1:9";

// ================= JORDAN CORE (MATCH / ARENA / WOW) =================
var JORDAN_CORE = [
  ["82.212.64.0","255.255.192.0"], // Zain
  ["94.249.0.0","255.255.128.0"],
  ["176.29.0.0","255.255.0.0"],    // Orange
  ["176.28.128.0","255.255.128.0"],
  ["109.107.0.0","255.255.0.0"],   // Umniah
  ["31.153.0.0","255.255.0.0"],
  ["188.123.160.0","255.255.224.0"]
];

// ================= JORDAN MOBILE (IDENTITY / DENSITY) =================
var JORDAN_MOBILE = [
  ["100.64.0.0","255.192.0.0"], // CGNAT
  ["176.28.0.0","255.252.0.0"],
  ["176.29.0.0","255.255.0.0"],
  ["91.106.0.0","255.255.0.0"],
  ["82.212.0.0","255.255.0.0"],
  ["94.249.0.0","255.255.0.0"]
];

// ================= HELPERS =================
function norm(h){
  var i=h.indexOf(":");
  return i>-1?h.substring(0,i):h;
}
function inList(ip,list){
  for (var i=0;i<list.length;i++)
    if (isInNet(ip,list[i][0],list[i][1])) return true;
  return false;
}
function pickPool(host){
  var h=0;
  for (var i=0;i<host.length;i++)
    h=(h+host.charCodeAt(i))%LOBBY_POOL.length;
  return LOBBY_POOL[h];
}

// ================= DETECTION (NATURAL) =================
function isPUBG(h){
  return /(pubg|pubgm|tencent|krafton|lightspeed|levelinfinite)/i.test(h);
}
function isAuth(u,h){
  return /(auth|account|login|security|anticheat|integrity|telemetry)/i.test(u+" "+h);
}
function isPresence(u,h){
  return /(presence|heartbeat|status|keepalive|session)/i.test(u+" "+h);
}
function isLobby(u,h){
  return /(lobby|matchmaking|queue|recruit|join|party|friend)/i.test(u+" "+h);
}
function isVoice(u,h){
  return /(voice|rtc|webrtc|media|audio)/i.test(u+" "+h);
}
function isMatch(u,h){
  return /(match|battle|ingame|udp|tick|room|server|arena|wow|training)/i.test(u+" "+h);
}
function isCDN(u,h){
  return /(cdn|asset|patch|update|content|pak|obb)/i.test(u+" "+h);
}

// ================= MAIN =================
function FindProxyForURL(url, host){
  host = norm(host.toLowerCase());

  // أي شي مش PUBG = BLOCK
  if (!isPUBG(host)) return BLOCK;

  var ip = dnsResolve(host);
  if (!ip || ip.indexOf(":")>-1) return BLOCK;

  // AUTH / ANTI-CHEAT → Proxy أردني هادئ (بدون تحليل)
  if (isAuth(url, host)) {
    return pickPool(host);
  }

  // PRESENCE + VOICE → Mobile Jordan
  if (isPresence(url, host) || isVoice(url, host)) {
    if (!inList(ip, JORDAN_MOBILE)) return BLOCK;
    return pickPool(host);
  }

  // LOBBY / RECRUIT → Mobile Density
  if (isLobby(url, host)) {
    if (!inList(ip, JORDAN_MOBILE)) return BLOCK;
    return pickPool(host);
  }

  // MATCH / ARENA / WOW → Jordan Core ONLY
  if (isMatch(url, host)) {
    if (!inList(ip, JORDAN_CORE)) return BLOCK;
    return MATCH_JO;
  }

  // CDN → نمرره عبر نفس Pool اللوبي (بدون DIRECT)
  if (isCDN(url, host)) {
    return pickPool(host);
  }

  return BLOCK;
}
