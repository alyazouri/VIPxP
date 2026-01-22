// =====================================================
// 🎮 PUBG MOBILE PROXY – JORDAN ULTRA-LOCK v6.0 FINAL
// FULL SCRIPT – NO INFO REMOVED – PING SAFE – TIER1 FORCE
// =====================================================

// ==================== PROXY INFRASTRUCTURE ====================
var MATCH_ULTRA    = "PROXY 176.29.153.95:20001";
var MATCH_PRIME    = "PROXY 82.212.84.33:20001";
var LOBBY_ULTRA    = "PROXY 176.29.153.95:9030";
var LOBBY_PRIME    = "PROXY 82.212.84.33:9030";
var VOICE_PREMIUM  = "PROXY 82.212.84.33:10012";
var ANALYTICS_LITE = "PROXY 46.185.131.218:443";
var CDN_COMPRESS   = "PROXY 46.185.131.218:8080";
var PRELOAD_CACHE  = "PROXY 176.29.153.95:8080";
var WARMUP_PROXY   = "PROXY 176.29.153.95:7070";
var BLOCK          = "PROXY 127.0.0.1:9";
var DIRECT         = "DIRECT";

// ==================== JORDAN TIERS (PING-BASED) ====================
// TIER1: أقل بنق
var JORDAN_TIER1 = [
  ["176.29.0.0","255.255.0.0"],
  ["82.212.64.0","255.255.192.0"],
  ["188.123.160.0","255.255.224.0"]
];

// TIER2: قوي جدًا
var JORDAN_TIER2 = [
  ["91.106.0.0","255.255.0.0"],
  ["176.28.128.0","255.255.128.0"],
  ["86.108.0.0","255.255.128.0"]
];

// TIER3: أوسع
var JORDAN_TIER3 = [
  ["46.185.128.0","255.255.128.0"],
  ["92.253.0.0","255.255.128.0"],
  ["94.249.0.0","255.255.128.0"],
  ["188.161.0.0","255.255.0.0"]
];

// TIER4: جميع النطاقات الأردنية
var JORDAN_TIER4 = [
  ["37.202.0.0","255.255.0.0"],
  ["185.23.0.0","255.255.0.0"],
  ["185.107.0.0","255.255.0.0"],
  ["193.188.0.0","255.255.0.0"],
  ["212.35.0.0","255.255.0.0"],
  ["31.170.0.0","255.255.0.0"],
  ["195.229.0.0","255.255.0.0"],
  ["213.178.0.0","255.255.0.0"],
  ["85.235.0.0","255.255.0.0"]
];

// ==================== SESSION CORE ====================
var SESSION = {
  matchIP: null,
  lobbyIP: null,
  voiceIP: null,

  lockUntil: 0,
  lockStrength: 18000,

  matchmakingAttempts: 0,
  maxMatchmakingAttempts: 6,

  preloadCache: {},
  preloadTimeout: 12000,

  dnsCache: {},
  dnsCacheTimeout: 30000,

  priorityQueue: [],
  maxPriority: 8,

  blockedIPs: {},
  permanentBlocks: {},
  blockDuration: 90000,

  verificationLevel: 3,
  connectionQuality: 100,
  qualityThreshold: 50
};

// ==================== HELPERS ====================
function now(){ return Date.now(); }
function norm(h){ var i=h.indexOf(":"); return i>-1?h.substring(0,i):h; }

function inList(ip,list){
  if(!ip) return false;
  for(var i=0;i<list.length;i++)
    if(isInNet(ip,list[i][0],list[i][1])) return true;
  return false;
}

function getIPTier(ip){
  if(inList(ip,JORDAN_TIER1)) return 1;
  if(inList(ip,JORDAN_TIER2)) return 2;
  if(inList(ip,JORDAN_TIER3)) return 3;
  if(inList(ip,JORDAN_TIER4)) return 4;
  return 0;
}

function isJordanAny(ip){ return getIPTier(ip)>0; }

// ==================== DNS CACHE ====================
function resolveWithCache(host){
  if(SESSION.dnsCache[host]){
    var c = SESSION.dnsCache[host];
    if(now()-c.time < SESSION.dnsCacheTimeout) return c.ip;
  }
  var ip = dnsResolve(host);
  if(ip) SESSION.dnsCache[host]={ip:ip,time:now()};
  return ip;
}

// ==================== BLOCKING ====================
function blockIP(ip,perm){
  if(!ip) return;
  if(perm) SESSION.permanentBlocks[ip]=now();
  else SESSION.blockedIPs[ip]=now();
}

function isBlocked(ip){
  if(SESSION.permanentBlocks[ip]) return true;
  return SESSION.blockedIPs[ip] &&
         (now()-SESSION.blockedIPs[ip])<SESSION.blockDuration;
}

// ==================== DETECTION (EXPANDED) ====================
function isPUBG(h){
  return /(pubg|pubgm|intlgame|igamecj|tencent|krafton|lightspeed|levelinfinite|vng)/i.test(h);
}

function isMatch(u,h){
  return /(game|battle|match|realtime|udp|relay|tick|state|sync|room\d|server\d|authority)/i.test(u+h);
}

function isPreMatch(u,h){
  return /(ready|prepare|warmup|spawn|countdown|loading|briefing)/i.test(u+h);
}

function isLobby(u,h){
  return /(lobby|matchmaking|queue|dispatcher|gateway|frontend|allocation|region)/i.test(u+h);
}

function isVoice(u,h){
  return /(voice|rtc|webrtc|voip|agora|vivox|audio|mic|talk)/i.test(u+h);
}

function isAnalytics(u,h){
  return /(analytics|telemetry|metrics|tracking|event|log|crash|beacon|report)/i.test(u+h);
}

function isCDN(u,h){
  return /(cdn|asset|static|resource|download|patch|update|media|texture|image)/i.test(u+h);
}

function isKeepAlive(u,h){
  return /(ping|pong|heartbeat|alive|health|status|keep)/i.test(u+h);
}

// ==================== PROXY SELECTION ====================
function getMatchProxy(){
  if(SESSION.matchIP && getIPTier(SESSION.matchIP)===1)
    return MATCH_ULTRA;
  return MATCH_PRIME;
}

// ==================== MAIN ENGINE ====================
function FindProxyForURL(url, host){
  host = norm(host.toLowerCase());

  if(!isPUBG(host)) return LOBBY_ULTRA;

  var ip = resolveWithCache(host);
  if(!ip) return BLOCK;
  if(isBlocked(ip)) return BLOCK;

  var tier = getIPTier(ip);

  // KEEPALIVE → MATCH PROXY (PING SAFE)
  if(isKeepAlive(url,host)){
    return getMatchProxy();
  }

  if(isAnalytics(url,host)) return ANALYTICS_LITE;
  if(isCDN(url,host)) return CDN_COMPRESS;

  // VOICE
  if(isVoice(url,host)){
    if(tier<=2) return VOICE_PREMIUM;
    blockIP(ip,false);
    return BLOCK;
  }

  // ================= LOBBY (FORCE TIER1) =================
  if(isLobby(url,host)){
    SESSION.matchmakingAttempts++;

    if(tier === 1){
      SESSION.matchmakingAttempts = 0;
      return LOBBY_ULTRA;
    }

    if(SESSION.matchmakingAttempts >= SESSION.maxMatchmakingAttempts){
      SESSION.matchmakingAttempts = 0;
      if(tier <= 2) return LOBBY_PRIME;
    }

    blockIP(ip,false);
    return BLOCK;
  }

  // ================= MATCH =================
  if(isMatch(url,host)){

    if(SESSION.matchIP && now()<SESSION.lockUntil){
      if(ip===SESSION.matchIP) return getMatchProxy();
      blockIP(ip,true);
      return getMatchProxy(); // PING SAFE
    }

    if(tier <= 2){
      SESSION.matchIP = ip;
      SESSION.lockUntil = now()+SESSION.lockStrength;
      return getMatchProxy();
    }

    blockIP(ip,true);
    return getMatchProxy(); // PING SAFE
  }

  return LOBBY_ULTRA;
}
