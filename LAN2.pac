// ================= PROXIES =================
var LOBBY_JO = "PROXY 2.59.53.74:443";   // Lobby Jordan Proxy
var MATCH_JO = "PROXY 37.44.38.20:443";  // Match Jordan Proxy (أقوى)
var BLOCK    = "PROXY 127.0.0.1:9";

// ================= JORDAN IPV4 ONLY =================
var JORDAN_IPV4 = [
  ["37.44.0.0",    "255.252.0.0"],   // Orange / Zain
  ["176.29.0.0",   "255.255.0.0"],   // Zain
  ["185.52.0.0",   "255.255.252.0"], // Umniah
  ["87.236.232.0", "255.255.248.0"]  // Jordan ISP
];

// ================= SESSION =================
var SESSION = {
  pinnedNet24: null,   // حسب تعريفك (أول خانتين)
  pinnedHost: null
};

// ================= HELPERS =================
function norm(h){
  var i = h.indexOf(":");
  return i > -1 ? h.substring(0, i) : h;
}

function isIPv6(ip){
  return ip.indexOf(":") > -1;
}

function isInList(ip, list){
  for (var i = 0; i < list.length; i++)
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  return false;
}

// موجود كما طلبت (slice 0,2)
function net24(ip){
  return ip.split('.').slice(0,2).join('.');
}

function isJordanIP(ip){
  return isInList(ip, JORDAN_IPV4);
}

// ================= PUBG DETECTION =================
function isPUBG(host){
  return /pubg|pubgm|pubgmobile|krafton|tencent|lightspeed|levelinfinite/i
    .test(host);
}

function isLobby(url, host){
  return /lobby|matchmaking|queue|dispatch|gateway|region|join/i
    .test(url + host);
}

function isMatch(url, host){
  return /match|battle|game|combat|realtime|sync|udp|tick|room/i
    .test(url + host);
}

// ================= MAIN =================
function FindProxyForURL(url, host) {

  host = norm(host.toLowerCase());

  // PUBG فقط
  if (!isPUBG(host)) return BLOCK;

  var ip = dnsResolve(host);
  if (!ip) return BLOCK;

  // منع IPv6
  if (isIPv6(ip)) return BLOCK;

  // 🇯🇴 الأردن فقط
  if (!isJordanIP(ip)) return BLOCK;

  // ================= MATCH (PINNING) =================
  if (isMatch(url, host)) {

    var curNet24 = net24(ip);

    // أول Match → تثبيت الشبكة + الهوست
    if (!SESSION.pinnedNet24) {
      SESSION.pinnedNet24 = curNet24;
      SESSION.pinnedHost  = host;
      return MATCH_JO;
    }

    // أي تغيير = BLOCK
    if (curNet24 !== SESSION.pinnedNet24) return BLOCK;
    if (host !== SESSION.pinnedHost)      return BLOCK;

    return MATCH_JO;
  }

  // ================= LOBBY =================
  if (isLobby(url, host)) {
    return LOBBY_JO;
  }

  // أي شيء ثاني من PUBG
  return BLOCK;
}
