// ================= PROXIES =================
var LOBBY_JO = "PROXY 2.59.53.74:443";
var MATCH_JO = "PROXY 37.44.38.20:443";
var BLOCK    = "PROXY 127.0.0.1:9";

// ================= JORDAN IPV4 =================
var JORDAN_IPV4 = [
  ["37.44.0.0",    "255.252.0.0"],
  ["176.29.0.0",   "255.255.0.0"],
  ["185.52.0.0",   "255.255.252.0"],
  ["87.236.232.0", "255.255.248.0"]
];

// ================= SESSION =================
var SESSION = {
  netCount: {},        // عدّ كل net24
  pinnedNet: null,
  pinnedHost: null,
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

// net24 حسب تعريفك (أول خانتين = ضغط أعلى)
function net24(ip){
  return ip.split('.').slice(0,2).join('.');
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

  // 🧱 الأردن فقط
  if (!isInList(ip, JORDAN_IPV4)) return BLOCK;

  // ================= MATCH =================
  if (isMatch(url, host)) {

    var curNet = net24(ip);
    SESSION.totalMatchReq++;

    // عدّ الشبكات الأردنية
    if (!SESSION.netCount[curNet])
      SESSION.netCount[curNet] = 0;
    SESSION.netCount[curNet]++;

    // 🔒 لو قفلنا خلاص
    if (SESSION.LOCKED) {
      if (curNet !== SESSION.pinnedNet) return BLOCK;
      if (host !== SESSION.pinnedHost)  return BLOCK;
      return MATCH_JO;
    }

    // ⏳ مرحلة الضغط (ما نسمح بالتشتت)
    if (SESSION.totalMatchReq <= 3) {
      return MATCH_JO;
    }

    // 🧠 اختيار net24 الغالب
    var bestNet = null;
    var bestCnt = 0;
    for (var n in SESSION.netCount) {
      if (SESSION.netCount[n] > bestCnt) {
        bestCnt = SESSION.netCount[n];
        bestNet = n;
      }
    }

    // 🔐 تثبيت قهري
    SESSION.pinnedNet  = bestNet;
    SESSION.pinnedHost = host;
    SESSION.LOCKED     = true;

    // آخر فحص
    if (curNet !== SESSION.pinnedNet) return BLOCK;

    return MATCH_JO;
  }

  // ================= LOBBY =================
  if (isLobby(url, host)) {
    return LOBBY_JO;
  }

  return BLOCK;
}
