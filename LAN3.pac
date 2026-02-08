// ================= PROXIES =================
var LOBBY_JO = "PROXY 2.59.53.74:443";
var MATCH_JO = "PROXY 37.44.38.20:443";
var BLOCK    = "PROXY 127.0.0.1:9";

// ================= JORDAN GAMING IPV4 (ORDERED) =================
// PRIORITY: ZAIN -> UMNIAH -> ORANGE
var ZAIN_IPV4 = [
  ["176.29.0.0",   "255.255.0.0"]    // Zain Jordan
];

var UMNIAH_IPV4 = [
  ["185.52.0.0",   "255.255.252.0"], // Umniah
  ["185.132.0.0",  "255.255.252.0"]
];

var ORANGE_IPV4 = [
  ["37.44.0.0",    "255.252.0.0"],   // Orange
  ["87.236.232.0", "255.255.248.0"]
];

// ================= SESSION =================
var SESSION = {
  netCount: {},
  pinnedNet: null,
  pinnedHost: null,
  pinnedISP: null,
  totalMatchReq: 0,
  LOCKED: false
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

function net24(ip){
  // حسب تعريفك (أول خانتين = ضغط أعلى)
  return ip.split('.').slice(0,2).join('.');
}

function getISP(ip){
  if (isInList(ip, ZAIN_IPV4))   return "ZAIN";
  if (isInList(ip, UMNIAH_IPV4)) return "UMNIAH";
  if (isInList(ip, ORANGE_IPV4)) return "ORANGE";
  return null;
}

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

  if (!isPUBG(host)) return BLOCK;

  var ip = dnsResolve(host);
  if (!ip) return BLOCK;
  if (isIPv6(ip)) return BLOCK;

  // لازم يكون ضمن مزود أردني معروف
  var isp = getISP(ip);
  if (!isp) return BLOCK;

  // ================= MATCH =================
  if (isMatch(url, host)) {

    var curNet = net24(ip);
    SESSION.totalMatchReq++;

    if (!SESSION.netCount[curNet])
      SESSION.netCount[curNet] = 0;
    SESSION.netCount[curNet]++;

    // 🔐 إذا قفلنا خلاص
    if (SESSION.LOCKED) {
      if (curNet !== SESSION.pinnedNet) return BLOCK;
      if (host !== SESSION.pinnedHost)  return BLOCK;
      if (isp  !== SESSION.pinnedISP)   return BLOCK;
      return MATCH_JO;
    }

    // 🎯 تثبيت سريع حسب الأولوية
    if (
      (isp === "ZAIN"   && SESSION.netCount[curNet] >= 1) ||
      (isp === "UMNIAH" && SESSION.netCount[curNet] >= 2) ||
      (isp === "ORANGE" && SESSION.netCount[curNet] >= 3) ||
      SESSION.totalMatchReq >= 5
    ) {
      SESSION.pinnedNet  = curNet;
      SESSION.pinnedHost = host;
      SESSION.pinnedISP  = isp;
      SESSION.LOCKED     = true;
      return MATCH_JO;
    }

    return MATCH_JO;
  }

  // ================= LOBBY =================
  if (isLobby(url, host)) {
    return LOBBY_JO;
  }

  return BLOCK;
}
