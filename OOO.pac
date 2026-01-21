// =====================================================
// PUBG Mobile Proxy – ULTIMATE JORDAN-PURE BUILD
// Deterministic • Max Guard • No Time Logic
// Match = Jordan Strict ONLY | Funnel = Jordan Extended
// =====================================================

var LOBBY_PROXY =
  "PROXY 176.29.153.95:9030; " +
  "PROXY 212.35.66.45:9030; " +
  "PROXY 46.185.131.218:443; " +
  "PROXY 82.212.84.33:5000";

var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var VOICE_JO    = "PROXY 82.212.84.33:10012";
var VOICE_GULF  = "PROXY 82.212.84.33:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:9";

// =====================================================
// 🇯🇴 JORDAN STRICT (MATCH-ELIGIBLE ONLY)
// =====================================================
var JORDAN_STRICT = [
  ["82.212.64.0","255.255.192.0"],
  ["176.29.0.0","255.255.0.0"],
  ["176.28.128.0","255.255.128.0"],
  ["91.106.0.0","255.255.0.0"],
  ["188.123.160.0","255.255.224.0"],
  ["46.185.128.0","255.255.128.0"],
  ["86.108.0.0","255.255.128.0"],
  ["92.253.0.0","255.255.128.0"],
  ["94.249.0.0","255.255.128.0"]
];

// =====================================================
// 🇯🇴 JORDAN EXTENDED (FUNNEL ONLY – NO MATCH)
// =====================================================
var JORDAN_EXTENDED = [
  ["37.202.0.0","255.255.0.0"],
  ["185.23.0.0","255.255.0.0"],
  ["185.107.0.0","255.255.0.0"],
  ["193.188.0.0","255.255.0.0"]
];

// =====================================================
// REGION HELPERS
// =====================================================
function inList(ip, list){
  for (var i=0;i<list.length;i++)
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  return false;
}
function isJordanStrict(ip){ return ip && inList(ip, JORDAN_STRICT); }
function isJordanExtended(ip){ return ip && inList(ip, JORDAN_EXTENDED); }
function isNearGulf(ip){
  return ip && (
    isInNet(ip,"212.71.0.0","255.255.0.0") ||
    isInNet(ip,"62.84.0.0","255.255.0.0") ||
    ip.indexOf("31.192.")===0 ||
    ip.indexOf("5.62.")===0
  );
}

// =====================================================
// SESSION STATE (HARD LOCK + QUARANTINE)
// =====================================================
var SESSION = {
  matchIP: null,
  hardLockUntil: 0,
  quarantineIP: null,
  lobbyAttempts: 0
};
function now(){ return Date.now(); }

// =====================================================
// TRAFFIC DETECTION (EXTENDED)
// =====================================================
function isPUBG(h){
  return /(pubg|pubgm|intlgame|igamecj|tencent|krafton|lightspeed|wow|ugc)/.test(h);
}
function isLobby(u,h){
  return /(lobby|matchmaking|queue|room|dispatcher|region|allocation|gateway)/.test((u+h).toLowerCase());
}
function isFriends(u,h){
  return /(friend|friends|social|presence|invite|party|team|squad|group|clan|guild|crew)/.test((u+h).toLowerCase());
}
function isPreMatch(u,h){
  return /(ready|prepare|loadout|sync|confirm|select|spawn|briefing)/.test((u+h).toLowerCase());
}
function isMatch(u,h){
  return /(game|battle|gameserver|match|session|realtime|tick|state|replication|authority)/.test((u+h).toLowerCase());
}
function isArena(u,h){
  return /(arena|tdm|deathmatch|warehouse|training|practice|aim|range)/.test((u+h).toLowerCase());
}
function isVoice(u,h){
  return /(voice|rtc|webrtc|voip|audio|mic|talk|speech)/.test((u+h).toLowerCase());
}
function norm(h){ var i=h.indexOf(":"); return i>-1?h.substring(0,i):h; }
function ipOf(h){ var ip=dnsResolve(h); return (ip && ip.indexOf(".")!==-1)?ip:null; }

// =====================================================
// MAIN ENGINE – MAX GUARD
// =====================================================
function FindProxyForURL(url, host){
  host = norm(host.toLowerCase());
  if (!isPUBG(host)) return DIRECT;

  var ip = ipOf(host);
  if (!ip) return BLOCK;

  var JO_S = isJordanStrict(ip);
  var JO_E = isJordanExtended(ip);
  var GULF = isNearGulf(ip);
  var UNKNOWN = !JO_S && !JO_E && !GULF;

  // -------- VOICE (PINNED)
  if (isVoice(url,host)){
    if (JO_S) return VOICE_JO;
    if (GULF) return VOICE_GULF;
    return BLOCK;
  }

  // -------- FRIENDS / PARTY (LEADER BIAS VIA FUNNEL)
  if (isFriends(url,host)){
    return LOBBY_PROXY; // تكثيف أردني قبل أي قرار Match
  }

  // -------- PRE-MATCH (HARD GATE)
  if (isPreMatch(url,host)){
    if (JO_S || JO_E) return LOBBY_PROXY;
    return BLOCK;
  }

  // -------- MATCH (JORDAN STRICT ONLY + QUARANTINE)
  if (isMatch(url,host)){
    // حجر أي IP مشبوه
    if (SESSION.quarantineIP && ip === SESSION.quarantineIP) return BLOCK;

    if (SESSION.matchIP){
      if (ip === SESSION.matchIP) return MATCH_PROXY;
      // مخالفة القفل → حجر
      SESSION.quarantineIP = ip;
      return BLOCK;
    }

    if (JO_S){
      SESSION.matchIP = ip;
      SESSION.hardLockUntil = now() + 30000; // hysteresis
      return MATCH_PROXY;
    }

    // Extended / Gulf / Unknown ممنوع
    SESSION.quarantineIP = ip;
    return BLOCK;
  }

  // -------- ARENA (STRONG FUNNEL)
  if (isArena(url,host)){
    return (JO_S || JO_E) ? LOBBY_PROXY : BLOCK;
  }

  // -------- LOBBY (DETERMINISTIC FUNNEL)
  if (isLobby(url,host)){
    SESSION.lobbyAttempts++;

    if (JO_S || JO_E) return LOBBY_PROXY;

    if (GULF && SESSION.lobbyAttempts > 3) return LOBBY_PROXY;

    // DNS Anti-Poison: UNKNOWN → Lobby فقط
    if (UNKNOWN) return LOBBY_PROXY;

    return BLOCK;
  }

  return BLOCK;
}
