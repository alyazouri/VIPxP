// ================= PROXIES =================
var LOBBY_JO = "PROXY 2.59.53.74:443";   // Lobby Proxy (Jordan)
var MATCH_JO = "PROXY 37.44.38.20:443";  // Match Proxy (Stronger Jordan)
var BLOCK    = "PROXY 127.0.0.1:9";

// ================= JORDAN IPV4 ONLY =================
var JORDAN_IPV4 = [
  ["37.44.0.0",    "255.252.0.0"],   // Orange / Zain
  ["176.29.0.0",   "255.255.0.0"],   // Zain
  ["185.52.0.0",   "255.255.252.0"], // Umniah
  ["87.236.232.0", "255.255.248.0"]  // Jordan ISP
];

// ================= HELPERS (UNCHANGED) =================
function norm(h){
  var i = h.indexOf(":");
  return i > -1 ? h.substring(0, i) : h;
}

function isInList(ip, list){
  for (var i = 0; i < list.length; i++)
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  return false;
}

function net24(ip){
  // موجود كما طلبت (غير مستخدم بالقرار)
  return ip.split('.').slice(0,2).join('.');
}

// ================= PUBG DETECTION =================
function isPUBG(h){
  return /pubg|pubgm|pubgmobile|krafton|tencent|lightspeed|levelinfinite/i.test(h);
}

function isLobby(u,h){
  return /lobby|matchmaking|queue|dispatch|gateway|region|join/i.test(u+h);
}

function isMatch(u,h){
  return /match|battle|game|combat|realtime|sync|udp|tick|room/i.test(u+h);
}

// ================= MAIN =================
function FindProxyForURL(url, host) {

  host = norm(host.toLowerCase());

  // PUBG فقط
  if (!isPUBG(host)) return BLOCK;

  var ip = dnsResolve(host);
  if (!ip) return BLOCK;

  // منع IPv6
  if (ip.indexOf(":") > -1) return BLOCK;

  // 🇯🇴 الأردن فقط
  if (!isInList(ip, JORDAN_IPV4)) return BLOCK;

  // ================= MATCH =================
  if (isMatch(url, host)) {
    return MATCH_JO;
  }

  // ================= LOBBY =================
  if (isLobby(url, host)) {
    return LOBBY_JO;
  }

  // أي شيء آخر من PUBG
  return BLOCK;
}
