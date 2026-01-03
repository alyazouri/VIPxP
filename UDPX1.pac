// ============================================================================
// 🏆 🇯🇴 TEAM1_TOURNAMENT_EXTREME++ (FINAL + RECRUIT BOOST) - ES5 SAFE
// الهدف: أعلى نسبة لاعبين أردنيين باللوبي/التجنيد + مباريات أردنية قدر الإمكان
// ---------------------------------------------------------------------------
// DIRECT: YouTube/GitHub فقط
// Non-PUBG: DIRECT
// Recruit/Teamfinder/Lobby: FORCE JO (9030)
// Lobby/Search CORE: JO_WIDE classify + JO lock (first 180s)
// Match: 10012 ONLY + MAX JO ONLY strict check
// If MATCH IPv4 NOT in JO_MATCH_STRICT => SOFTBLOCK during 15 minutes
// After enter: Sticky (no scattering)
// ============================================================================

// ===== DIRECT exceptions =====
var DIRECT_DOMAINS = [
  "github.com","raw.githubusercontent.com","gist.githubusercontent.com",
  "youtube.com","googlevideo.com","ytimg.com","youtubei.googleapis.com"
];

// ===== Proxies =====
var SEARCH_JO   = "PROXY 212.35.66.45:9030";
var SEARCH_NON  = "PROXY 212.35.66.45:443";
var MATCH_ONLY  = "PROXY 212.35.66.45:10012";
var VOICE_ONLY  = "PROXY 212.35.66.45:3478";
var CDN_ONLY    = "PROXY 212.35.66.45:443";
var SOFTBLOCK   = "PROXY 0.0.0.0:0";

// ===== PUBG detect =====
var PUBG_HINTS = ["pubg","tencent","igamecj","proximabeta","gcloud","qcloud","qq.com"];

// ===== Hints =====
var SEARCH_CORE = [
  "matchmaking","dispatch","route","region","matchcfg","broker","gateway",
  "login","auth","passport","account","token","session","connect","config","cfg","setting"
];

var SEARCH_NOISE = [
  "friends","social","clan","nearby","party","squad","teamfinder","recruit",
  "im","chat","message","notify","push","state","sync","presence","lobby"
];

var MATCH_HINTS = ["match","battle","game","room","arena","session","rank","zone","server"];
var VOICE_HINTS = ["voice","rtc","voip","agora","rtm"];
var CDN_HINTS   = ["cdn","update","patch","assets","resource","download","static"];

// ===== JO LOBBY (WIDE) =====
var JO_LOBBY_WIDE = [
  "5.45.128.0/20","37.17.192.0/20","37.123.64.0/19","37.202.64.0/18","37.220.112.0/20",
  "46.23.112.0/20","46.32.96.0/19","46.185.128.0/17","46.248.192.0/19","62.72.160.0/19",
  "77.245.0.0/20","79.134.128.0/19","79.173.192.0/18","80.90.160.0/20","81.21.0.0/20",
  "81.28.112.0/20","82.212.64.0/18","84.18.32.0/19","84.18.64.0/19","86.108.0.0/17",
  "91.106.96.0/20","91.186.224.0/19","92.241.32.0/19","92.253.0.0/17","94.142.32.0/19",
  "94.249.0.0/17","95.141.208.0/20","95.172.192.0/19","109.107.224.0/19","109.237.192.0/20",
  "149.200.128.0/17","176.28.128.0/17","176.29.0.0/16","176.57.0.0/19","178.77.128.0/18",
  "178.238.176.0/20","188.123.160.0/19","188.247.64.0/19","193.188.64.0/19","194.165.128.0/19",
  "212.34.0.0/19","212.35.64.0/19","212.118.0.0/19","213.139.32.0/19","213.186.160.0/19",
  "217.23.32.0/20","217.29.240.0/20","217.144.0.0/20"
];

// ===== JO MATCH (MAX JO ONLY - ULTRA STRICT) =====
var JO_MATCH_STRICT = [
  "176.28.128.0/17",
  "176.29.0.0/16",
  "212.35.64.0/19",
  "82.212.64.0/18"
];

// ===== Sticky =====
var ST_SEARCH = "";
var ST_MATCH  = "";
var ST_VOICE  = "";
var ST_CDN    = "";

// ===== Windows =====
var START_MS = (new Date()).getTime();
var LOCK_MS  = 180000;    // 3 minutes country-lock
var TOURNAMENT_MS = 900000; // 15 minutes strict match forcing
var COUNTRY_LOCK = "";    // "", "JO", "NON"

function inWindow(ms){
  return (((new Date()).getTime() - START_MS) < ms);
}

// ===== Helpers =====
function lc(s){ return String(s||"").toLowerCase(); }

function hasAny(h, arr){
  h = lc(h);
  for (var i=0;i<arr.length;i++) if (h.indexOf(arr[i]) !== -1) return true;
  return false;
}

function hostInList(h, list){
  for (var i=0;i<list.length;i++){
    var d = list[i];
    if (h === d || shExpMatch(h, "*." + d)) return true;
  }
  return false;
}

function isPUBG(h){
  h = lc(h);
  return hasAny(h, PUBG_HINTS) || shExpMatch(h, "*pubg*");
}

function dnsIP(host){
  try { var r = dnsResolve(host); return r ? r : ""; }
  catch(e){ return ""; }
}

function isIPv4(ip){
  if (!ip) return false;
  if (ip.indexOf(":") !== -1) return false;
  var p = ip.split(".");
  if (p.length !== 4) return false;
  for (var i=0;i<4;i++){
    var n = parseInt(p[i],10);
    if (isNaN(n) || n < 0 || n > 255) return false;
  }
  return true;
}

function ipToLong(ip){
  var p = ip.split(".");
  return (((parseInt(p[0],10) << 24) >>> 0) +
          ((parseInt(p[1],10) << 16) >>> 0) +
          ((parseInt(p[2],10) << 8)  >>> 0) +
          ( parseInt(p[3],10)        >>> 0)) >>> 0;
}

function cidrHas(ip, cidr){
  if (!isIPv4(ip)) return false;
  var parts = cidr.split("/");
  if (parts.length !== 2) return false;
  var net = parts[0];
  var bits = parseInt(parts[1],10);
  if (isNaN(bits) || bits < 0 || bits > 32) return false;
  var mask = (bits === 0) ? 0 : ((0xFFFFFFFF << (32 - bits)) >>> 0);
  return ((ipToLong(ip) & mask) >>> 0) === ((ipToLong(net) & mask) >>> 0);
}

function inAny(ip, cidrs){
  if (!isIPv4(ip)) return false;
  for (var i=0;i<cidrs.length;i++){
    if (cidrHas(ip, cidrs[i])) return true;
  }
  return false;
}

function sticky(type, val){
  if (type === "SEARCH") { if (ST_SEARCH) return ST_SEARCH; ST_SEARCH = val; return ST_SEARCH; }
  if (type === "MATCH")  { if (ST_MATCH)  return ST_MATCH;  ST_MATCH  = val; return ST_MATCH; }
  if (type === "VOICE")  { if (ST_VOICE)  return ST_VOICE;  ST_VOICE  = val; return ST_VOICE; }
  if (type === "CDN")    { if (ST_CDN)    return ST_CDN;    ST_CDN    = val; return ST_CDN; }
  return val;
}

function determineCountry(ip){
  // unknown/IPv6 => JO (حتى ما نخسر الأردن بسبب DNS)
  if (!isIPv4(ip)) return "JO";
  return inAny(ip, JO_LOBBY_WIDE) ? "JO" : "NON";
}

function pickSearchProxy(ip){
  // lock in first 3 minutes
  if (inWindow(LOCK_MS) && !COUNTRY_LOCK) COUNTRY_LOCK = determineCountry(ip);
  var c = COUNTRY_LOCK ? COUNTRY_LOCK : determineCountry(ip);
  return (c === "JO") ? SEARCH_JO : SEARCH_NON;
}

// ===================== MAIN =====================
function FindProxyForURL(url, host){
  var h = lc(host);

  // Direct exceptions
  if (hostInList(h, DIRECT_DOMAINS)) return "DIRECT";

  // Non-PUBG direct
  if (!isPUBG(h)) return "DIRECT";

  // CDN / Voice
  if (hasAny(h, CDN_HINTS))   return sticky("CDN", CDN_ONLY);
  if (hasAny(h, VOICE_HINTS)) return sticky("VOICE", VOICE_ONLY);

  // MATCH (ULTRA STRICT)
  if (hasAny(h, MATCH_HINTS)) {
    if (ST_MATCH) return ST_MATCH;

    var ipm = dnsIP(host);

    if (isIPv4(ipm) && !inAny(ipm, JO_MATCH_STRICT)) {
      if (inWindow(TOURNAMENT_MS)) return SOFTBLOCK;
      return sticky("MATCH", MATCH_ONLY);
    }

    return sticky("MATCH", MATCH_ONLY);
  }

  // SEARCH / LOBBY / RECRUIT (BOOST)
  if (hasAny(h, SEARCH_CORE) || hasAny(h, SEARCH_NOISE)) {
    if (ST_SEARCH) return ST_SEARCH;

    // ✅ Recruit/teamfinder/lobby/social => FORCE JO path for higher JO visibility
    var isRecruit = (
      h.indexOf("teamfinder") !== -1 ||
      h.indexOf("recruit") !== -1 ||
      h.indexOf("lobby") !== -1 ||
      h.indexOf("nearby") !== -1 ||
      h.indexOf("party") !== -1 ||
      h.indexOf("squad") !== -1 ||
      h.indexOf("clan") !== -1 ||
      h.indexOf("friends") !== -1 ||
      h.indexOf("social") !== -1 ||
      h.indexOf("presence") !== -1
    );

    if (isRecruit) {
      ST_SEARCH = SEARCH_JO;
      return ST_SEARCH;
    }

    // CORE: classify + lock
    var ips = dnsIP(host);
    ST_SEARCH = pickSearchProxy(ips);
    return ST_SEARCH;
  }

  // Default PUBG traffic -> MATCH stable
  return sticky("MATCH", MATCH_ONLY);
}
