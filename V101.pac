// ================= PROXIES =================
var MATCH_JO = "PROXY 46.185.131.218:20001";

var LOBBY_POOL = [
  "PROXY 212.35.66.45:8085",
  "PROXY 212.35.66.45:8181",
  "PROXY 46.185.131.218:443"
];

var BLOCK  = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ================= JORDAN MATCH (موسّع للاستقرار) =================
var JORDAN_MATCH_IPV4 = [
  // النطاقات الأصلية
  ["46.185.128.0","255.255.128.0"],
  ["77.245.0.0","255.255.240.0"],
  ["79.134.128.0","255.255.224.0"],
  ["79.173.192.0","255.255.192.0"],
  ["80.90.160.0","255.255.240.0"],
  ["149.200.128.0","255.255.128.0"],
  
  // إضافات لتغطية سيرفرات أردنية إضافية
  ["46.32.0.0","255.224.0.0"],      // Zain الكامل
  ["176.29.0.0","255.255.0.0"],     // Zain Mobile
  ["178.77.0.0","255.255.0.0"],     // Zain LTE/5G
  ["37.202.0.0","255.255.0.0"],     // Orange
  ["85.159.0.0","255.255.0.0"],     // Orange
  ["176.57.0.0","255.255.0.0"],     // Umniah
  ["188.123.0.0","255.255.0.0"]     // Umniah Fixed
];

// ================= JORDAN WIDE (نفس القديم) =================
var JORDAN_WIDE_IPV4 = [
  ["46.32.0.0",    "255.224.0.0"],
  ["79.134.128.0", "255.255.128.0"],
  ["176.29.0.0",   "255.255.0.0"],
  ["77.245.0.0",   "255.255.0.0"],
  ["178.77.0.0",   "255.255.0.0"],
  ["62.72.0.0",    "255.255.0.0"],
  ["37.202.0.0",   "255.255.0.0"],
  ["85.159.0.0",   "255.255.0.0"],
  ["93.93.0.0",    "255.255.0.0"],
  ["93.95.0.0",    "255.255.0.0"],
  ["37.252.0.0",   "255.255.0.0"],
  ["94.127.0.0",   "255.255.0.0"],
  ["212.34.0.0",   "255.255.0.0"],
  ["213.139.64.0", "255.255.192.0"],
  ["176.57.0.0",   "255.255.0.0"],
  ["188.123.0.0",  "255.255.0.0"],
  ["188.247.0.0",  "255.255.0.0"],
  ["193.188.64.0", "255.255.224.0"],
  ["149.200.0.0",  "255.255.0.0"]
];

// ================= BLACKLIST (نفسها) =================
var GEO_BLACKLIST = [
  ["5.0.0.0","255.0.0.0"],
  ["50.0.0.0","255.0.0.0"],
  ["51.0.0.0","255.0.0.0"],
  ["5.136.0.0","255.248.0.0"],
  ["31.128.0.0","255.192.0.0"],
  ["46.16.0.0","255.240.0.0"],
  ["95.24.0.0","255.248.0.0"],
  ["178.64.0.0","255.192.0.0"],
  ["1.0.0.0","255.0.0.0"],
  ["14.0.0.0","255.0.0.0"],
  ["27.0.0.0","255.0.0.0"],
  ["36.0.0.0","255.0.0.0"],
  ["39.0.0.0","255.0.0.0"],
  ["42.0.0.0","255.0.0.0"],
  ["49.0.0.0","255.0.0.0"],
  ["58.0.0.0","255.0.0.0"],
  ["59.0.0.0","255.0.0.0"],
  ["60.0.0.0","255.0.0.0"]
];

// ================= SESSION =================
var SESSION = {
  matchNet: null,
  matchHost: null,
  dnsCache: {},
  matchAttempts: 0  // عدّاد جديد لمحاولات الاتصال
};

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
function isPUBG(h){
  return /pubg|pubgm|tencent|krafton|lightspeed|levelinfinite/i.test(h);
}
function isMatch(u,h){
  return /match|battle|game|combat|realtime|sync|udp|tick|room/i.test(u+h);
}
function isLobby(u,h){
  return /lobby|matchmaking|queue|dispatch|gateway|region|join|recruit/i.test(u+h);
}
function isSocial(u,h){
  return /friend|invite|squad|team|party|clan|presence|social/i.test(u+h);
}
function isCDN(u,h){
  return /cdn|asset|resource|patch|update|media|content/i.test(u+h);
}

// ================= MAIN =================
function FindProxyForURL(url, host) {

  host = norm(host.toLowerCase());
  if (!isPUBG(host)) return DIRECT;

  var ip = resolvePinned(host);
  if (!ip || ip.indexOf(":")>-1) return BLOCK;

  // حظر جغرافي صارم
  if (isInList(ip, GEO_BLACKLIST)) return BLOCK;

  // منطق المباراة المحسّن
  if (isMatch(url, host)) {
    // تحقق أولاً: هل الـ IP من الأردن؟
    if (!isInList(ip, JORDAN_MATCH_IPV4)) {
      // إذا كان من النطاق الواسع لكن مش من نطاق المباريات، اسمح له
      if (isInList(ip, JORDAN_WIDE_IPV4)) return MATCH_JO;
      // وإلا احظره
      return BLOCK;
    }

    var net24 = ip.split('.').slice(0,3).join('.');
    
    // إذا لم يكن هناك session نشطة، ابدأ واحدة جديدة
    if (!SESSION.matchNet) {
      SESSION.matchNet = net24;
      SESSION.matchHost = host;
      SESSION.matchAttempts = 0;
      return MATCH_JO;
    }
    
    // السماح بتبديل الـ host إذا كان نفس الشبكة (للاستقرار)
    if (net24 === SESSION.matchNet) {
      SESSION.matchHost = host;
      return MATCH_JO;
    }
    
    // إذا تغيرت الشبكة، اسمح بـ 3 محاولات قبل الحظر
    SESSION.matchAttempts++;
    if (SESSION.matchAttempts <= 3) {
      return MATCH_JO;
    }
    
    return BLOCK;
  }

  // الباقي (Lobby/Social/CDN)
  if (isLobby(url, host) || isSocial(url, host) || isCDN(url, host)) {
    if (!isInList(ip, JORDAN_WIDE_IPV4)) return BLOCK;
    return pickLobbyProxy(host);
  }

  return pickLobbyProxy(host);
}
