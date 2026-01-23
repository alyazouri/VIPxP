// ================= PUBG JORDAN FAME v5 (FINAL) =================
// Jordan ONLY (Lobby / Match / Recruit / Friends)
// Zero routing leak outside Jordan
// Self-learning + stability-first + rhythm-aware
// IPv4 ONLY
// ===============================================================

// ================= PROXIES =================
var MATCH_JO = "PROXY 176.29.153.95:20001"; // Match path (Jordan)
var LOBBY_JO = "PROXY 176.29.153.95:9030";  // Lobby/Social strongest local
var BLOCK    = "PROXY 127.0.0.1:9";
var DIRECT   = "DIRECT";

// ================= JORDAN ZONES =================
// CORE (lowest ping)
var JORDAN_CORE = [
  ["109.107.0.0","255.255.0.0"],
  ["188.123.160.0","255.255.224.0"],
  ["176.29.0.0","255.255.0.0"]
];
// METRO
var JORDAN_METRO = [
  ["31.153.0.0","255.255.0.0"],
  ["82.212.64.0","255.255.192.0"],
  ["37.48.0.0","255.255.0.0"]
];
// NATIONAL (last resort, still Jordan)
var JORDAN_NATIONAL = [
  ["91.106.0.0","255.255.0.0"],
  ["176.28.128.0","255.255.128.0"],
  ["213.6.0.0","255.255.0.0"],
  ["46.185.128.0","255.255.128.0"],
  ["185.107.0.0","255.255.0.0"]
];

// ================= SESSION (AI CORE) =================
var SESSION = {
  matchIP: null,
  stableIP: null,
  lockUntil: 0,
  lockTime: 42000,          // أطول = ثبات + تكرار
  attempts: 0,
  cooldownUntil: 0,
  dnsCache: {},

  // Learning & control
  SCORE: {},                // server reputation
  DENSITY: {},              // jordan density
  LAST_IP: null,            // anti-flap
  FLAPS: 0,
  FAILS: 0,
  RHYTHM_UNTIL: 0           // matchmaking rhythm window
};

// ================= HELPERS =================
function now(){ return Date.now(); }
function norm(h){ var i=h.indexOf(":"); return i>-1?h.substring(0,i):h; }
function inList(ip, list){
  for (var i=0;i<list.length;i++){
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  }
  return false;
}
function zoneOf(ip){
  if (inList(ip, JORDAN_CORE)) return 1;
  if (inList(ip, JORDAN_METRO)) return 2;
  if (inList(ip, JORDAN_NATIONAL)) return 3;
  return 0;
}
function fastResolve(host){
  if (SESSION.dnsCache[host]) return SESSION.dnsCache[host];
  var ip = dnsResolve(host);
  if (ip) SESSION.dnsCache[host] = ip;
  return ip;
}
function isPeak(){
  var h = new Date().getHours();
  return (h >= 19 && h <= 22); // ذروة الأردن
}

// Learning
function scoreUp(ip){ SESSION.SCORE[ip]=(SESSION.SCORE[ip]||0)+1; }
function scoreDown(ip){ SESSION.SCORE[ip]=(SESSION.SCORE[ip]||0)-1; }
function good(ip){ return SESSION.SCORE[ip] && SESSION.SCORE[ip]>=3; }
function bumpDensity(ip){ SESSION.DENSITY[ip]=(SESSION.DENSITY[ip]||0)+1; }
function dense(ip){ return SESSION.DENSITY[ip]>=2; }

// Stability-first
function keepStable(ip){
  if (!SESSION.stableIP) SESSION.stableIP = ip;
  return SESSION.stableIP;
}

// Anti-flap (route jitter)
function antiFlap(ip){
  if (SESSION.LAST_IP && ip !== SESSION.LAST_IP) SESSION.FLAPS++;
  SESSION.LAST_IP = ip;
  if (SESSION.FLAPS >= 2) return true;
  return false;
}

// Self-heal
function recordFail(){
  SESSION.FAILS++;
  if (SESSION.FAILS >= 3){
    SESSION.matchIP = null;
    SESSION.stableIP = null;
    SESSION.attempts = 0;
    SESSION.FLAPS = 0;
    SESSION.FAILS = 0;
  }
}

// Rhythm control (keep same window)
function inRhythm(){
  return now() < SESSION.RHYTHM_UNTIL;
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

  var ip = fastResolve(host);
  if (!ip) return BLOCK;

  // HARD RULES
  if (ip.indexOf(":")>-1) return BLOCK;      // IPv4 ONLY
  var zone = zoneOf(ip);
  if (zone===0) return BLOCK;                // Jordan ONLY

  // ================= MATCH =================
  if (isMatch(url, host)) {

    // Rhythm / cooldown keeps same pool
    if ((inRhythm() || now()<SESSION.cooldownUntil) && SESSION.matchIP){
      return MATCH_JO;
    }

    // Active lock
    if (SESSION.matchIP && now()<SESSION.lockUntil){
      return MATCH_JO;
    }

    SESSION.attempts++;
    bumpDensity(ip);

    // Decide allow
    var allow =
      (zone===1) ||
      (!isPeak() && zone===2 && SESSION.attempts>=2) ||
      (!isPeak() && zone===3 && SESSION.attempts>=4);

    if (good(ip) || dense(ip)) allow = true;

    // Anti-flap bias to stability
    if (antiFlap(ip)) ip = keepStable(ip);

    if (allow){
      ip = keepStable(ip);
      SESSION.matchIP = ip;
      SESSION.lockUntil = now()+SESSION.lockTime;
      SESSION.attempts = 0;
      scoreUp(ip);
      SESSION.cooldownUntil = now()+60000;   // دقيقة
      SESSION.RHYTHM_UNTIL = now()+90000;    // نافذة إيقاع
      SESSION.FLAPS = 0;
      SESSION.FAILS = 0;
      return MATCH_JO;
    }

    scoreDown(ip);
    recordFail();
    return MATCH_JO;
  }

  // ================= LOBBY / SOCIAL / CDN =================
  if (isLobby(url, host))  return LOBBY_JO;
  if (isSocial(url, host)) return LOBBY_JO;
  if (isCDN(url, host))    return LOBBY_JO;

  return LOBBY_JO;
}
