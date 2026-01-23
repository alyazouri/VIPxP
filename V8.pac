// ================= PUBG JORDAN DEBUG FORTRESS =================
// PURPOSE:
// - Show REAL routing (IP + Jordan range + ISP)
// - Detect & block any non-Jordan routing
// - Extended Jordan IPv4 ranges (long-term)
// - Same behavior as final script, with debug visibility
// IPv4 ONLY
// =============================================================


// ================= DEBUG SWITCH =================
// true  = يظهر Alerts للمسار الحقيقي
// false = صامت (استخدمه للعب العادي)
var DEBUG = true;


// ================= PROXIES =================
var MATCH_JO = "PROXY 176.29.153.95:20001";   // Match Jordan Core
var LOBBY_JO = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030; PROXY 91.106.109.12:9030; PROXY 82.212.84.33:9030";    // Lobby / Social Jordan
var BLOCK    = "PROXY 127.0.0.1:9";
var DIRECT   = "DIRECT";


// ================= EXTENDED JORDAN IPv4 RANGES =================
// موسّعة جدًا + مناسبة لسنوات
var JORDAN_IPV4 = [

  // ===== Umniah =====
  ["109.107.0.0","255.255.0.0","Umniah Core"],
  ["188.123.160.0","255.255.224.0","Umniah Fiber"],
  ["31.153.0.0","255.255.0.0","Umniah Backbone"],

  // ===== Orange Jordan =====
  ["176.29.0.0","255.255.0.0","Orange Core"],
  ["37.48.0.0","255.255.0.0","Orange Metro"],
  ["91.106.0.0","255.255.0.0","Orange Business"],
  ["176.28.128.0","255.255.128.0","Orange Extended"],

  // ===== Zain Jordan =====
  ["82.212.64.0","255.255.192.0","Zain Core"],
  ["94.249.0.0","255.255.128.0","Zain Extended"],

  // ===== Jordan IX / DC / Infra =====
  ["213.6.0.0","255.255.0.0","Jordan IX"],
  ["46.185.128.0","255.255.128.0","Jordan DC"],
  ["185.107.0.0","255.255.0.0","Jordan Data"],
  ["195.229.0.0","255.254.0.0","JTG Backbone"],

  // ===== Government / Enterprise / Education =====
  ["212.35.0.0","255.255.0.0","Government"],
  ["178.133.0.0","255.255.0.0","Enterprise"],
  ["85.235.0.0","255.255.0.0","Education"],
  ["62.150.0.0","255.255.128.0","Business"]
];


// ================= SESSION =================
var SESSION = {
  lastHost: null,
  lastIP: null,
  lastRange: null,
  blocked: 0,
  dnsCache: {},
  matchIP: null,
  lockUntil: 0,
  lockTime: 60000
};


// ================= HELPERS =================
function now(){ return Date.now(); }

function norm(h){
  var i = h.indexOf(":");
  return i > -1 ? h.substring(0,i) : h;
}

function resolveFast(host){
  if (SESSION.dnsCache[host]) return SESSION.dnsCache[host];
  var ip = dnsResolve(host);
  if (ip) SESSION.dnsCache[host] = ip;
  return ip;
}

function jordanMatch(ip){
  for (var i=0;i<JORDAN_IPV4.length;i++){
    if (isInNet(ip, JORDAN_IPV4[i][0], JORDAN_IPV4[i][1])) {
      return JORDAN_IPV4[i][2];
    }
  }
  return null;
}

function debug(msg){
  if (DEBUG) alert(msg);
}


// ================= DETECTION =================
function isPUBG(h){
  return /pubg|pubgm|tencent|krafton|lightspeed|levelinfinite/i.test(h);
}

function isMatch(u,h){
  return /match|battle|game|combat|realtime|sync|state|udp|tick|room|server/i.test(u+h);
}

function isLobby(u,h){
  return /lobby|matchmaking|queue|dispatch|gateway|region|join|connect/i.test(u+h);
}

function isSocial(u,h){
  return /friend|invite|recruit|squad|team|party|clan|crew|presence|social/i.test(u+h);
}

function isCDN(u,h){
  return /cdn|asset|resource|download|patch|update|media|content/i.test(u+h);
}


// ================= MAIN =================
function FindProxyForURL(url, host) {

  host = norm(host.toLowerCase());

  if (!isPUBG(host)) return DIRECT;

  var ip = resolveFast(host);
  if (!ip) {
    debug("❌ DNS FAILED\nHost: " + host);
    return BLOCK;
  }

  // IPv6 blocked
  if (ip.indexOf(":") > -1) {
    debug("❌ IPv6 BLOCKED\nIP: " + ip + "\nHost: " + host);
    return BLOCK;
  }

  var rangeName = jordanMatch(ip);

  // Block non-Jordan
  if (!rangeName) {
    SESSION.blocked++;
    debug(
      "🚫 NON-JORDAN ROUTE BLOCKED\n\n" +
      "Host: " + host + "\n" +
      "IP: " + ip + "\n" +
      "Blocked Attempts: " + SESSION.blocked
    );
    return BLOCK;
  }

  // Save debug state
  SESSION.lastHost  = host;
  SESSION.lastIP    = ip;
  SESSION.lastRange = rangeName;

  debug(
    "✅ JORDAN ROUTE CONFIRMED\n\n" +
    "Host: " + host + "\n" +
    "IP: " + ip + "\n" +
    "ISP / Range: " + rangeName + "\n" +
    "Traffic: " + (isMatch(url,host) ? "MATCH" : "LOBBY / SOCIAL")
  );

  // ===== MATCH =====
  if (isMatch(url, host)) {

    // Lock to avoid environment change
    if (SESSION.matchIP && now() < SESSION.lockUntil) {
      return MATCH_JO;
    }

    SESSION.matchIP = ip;
    SESSION.lockUntil = now() + SESSION.lockTime;

    return MATCH_JO;
  }

  // ===== LOBBY / SOCIAL / CDN =====
  if (isLobby(url, host))  return LOBBY_JO;
  if (isSocial(url, host)) return LOBBY_JO;
  if (isCDN(url, host))    return LOBBY_JO;

  return LOBBY_JO;
}


// ================= MANUAL DEBUG SNAPSHOT =================
// بعض المتصفحات تسمح باستدعائها يدويًا
function getDebugState(){
  return (
    "Last Host: "  + SESSION.lastHost  + "\n" +
    "Last IP: "    + SESSION.lastIP    + "\n" +
    "Last Range: " + SESSION.lastRange + "\n" +
    "Blocked: "    + SESSION.blocked
  );
}
