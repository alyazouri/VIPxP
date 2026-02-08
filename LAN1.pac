// ================= PROXIES =================
var LOBBY_JO = "PROXY 2.59.53.74:443";   // Lobby Jordan Proxy
var MATCH_JO = "PROXY 37.44.38.20:443";  // Match Jordan Proxy
var BLOCK    = "PROXY 127.0.0.1:9";

// ================= INTERNAL (LAN) =================
var INTERNAL_IPV4 = [
  ["10.0.0.0",    "255.0.0.0"],
  ["172.16.0.0",  "255.240.0.0"],
  ["192.168.0.0", "255.255.0.0"],
  ["127.0.0.0",   "255.0.0.0"],
  ["169.254.0.0", "255.255.0.0"]
];

// ================= JORDAN IPV4 (STRICT) =================
var JORDAN_IPV4 = [
  ["37.44.0.0",    "255.252.0.0"],   // Orange / Zain
  ["176.29.0.0",   "255.255.0.0"],   // Zain
  ["185.52.0.0",   "255.255.252.0"], // Umniah
  ["87.236.232.0", "255.255.248.0"]  // JO ISP
];

// ================= SESSION (PIN /24) =================
var SESSION = {
  pinnedNet24: null,
  pinnedHost: null
};

// ================= HELPERS =================
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
  return ip.split('.').slice(0,2).join('.');
}

// ================= PUBG DETECTION (STRONG) =================
function isPUBG(u,h){
  return /(pubg|pubgm|pubgmobile|krafton|tencent|lightspeed|
            levelinfinite|bluehole|vnggames|proxima|
            igame|gcloud|qcloud|aliyun|aws)/i
         .test(u + " " + h);
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
  if (!isPUBG(url, host)) return BLOCK;

  var ip = dnsResolve(host);
  if (!ip) return BLOCK;

  // IPv6 ممنوع
  if (ip.indexOf(":") > -1) return BLOCK;

  // Kill-Switch: لازم LAN أو أردني
  var isLAN    = isInList(ip, INTERNAL_IPV4);
  var isJordan = isInList(ip, JORDAN_IPV4);
  if (!isLAN && !isJordan) return BLOCK;

  // ================= MATCH (PIN /24) =================
  if (isMatch(url, host)) {

    var curNet24 = net24(ip);

    // أول Match → تثبيت الشبكة
    if (!SESSION.pinnedNet24) {
      SESSION.pinnedNet24 = curNet24;
      SESSION.pinnedHost  = host;
      return MATCH_JO;
    }

    // أي خروج عن الشبكة المثبتة = BLOCK
    if (curNet24 !== SESSION.pinnedNet24) return BLOCK;
    if (host !== SESSION.pinnedHost)      return BLOCK;

    return MATCH_JO;
  }

  // ================= LOBBY =================
  if (isLobby(url, host)) {
    return LOBBY_JO;
  }

  // أي شيء آخر من PUBG
  return BLOCK;
}
