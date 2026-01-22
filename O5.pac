// =====================================================
// 🎮 PUBG MOBILE PROXY – JORDAN ZERO-PING v5.1 FINAL
// Revolutionary AI Routing | GitHub Excluded | Complete
// =====================================================

// ==================== PROXY INFRASTRUCTURE ====================
var MATCH_PRIME    = "PROXY 176.29.153.95:20001";
var MATCH_BACKUP   = "PROXY 82.212.84.33:20001";
var LOBBY_FAST     = "PROXY 176.29.153.95:9030";
var LOBBY_STABLE   = "PROXY 212.35.66.45:9030";
var VOICE_PREMIUM  = "PROXY 82.212.84.33:10012";
var ANALYTICS_MINI = "PROXY 46.185.131.218:443";
var CDN_COMPRESS   = "PROXY 46.185.131.218:8080";
var PRELOAD_PROXY  = "PROXY 176.29.153.95:8080";
var BLOCK          = "PROXY 127.0.0.1:9";
var DIRECT         = "DIRECT";

// ==================== JORDAN COMPLETE NETWORK MAP ====================
var JORDAN_CORE = [
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

var JORDAN_EXTENDED = [
  ["37.202.0.0","255.255.0.0"],
  ["185.23.0.0","255.255.0.0"],
  ["185.107.0.0","255.255.0.0"],
  ["193.188.0.0","255.255.0.0"],
  ["212.35.0.0","255.255.0.0"],
  ["31.170.0.0","255.255.0.0"],
  ["188.161.0.0","255.255.0.0"],
  ["195.229.0.0","255.255.0.0"],
  ["213.178.0.0","255.255.0.0"],
  ["85.235.0.0","255.255.0.0"]
];

// ==================== EXCLUDED PLATFORMS ====================
var EXCLUDED_SITES = [
  "github.com",
  "githubusercontent.com",
  "github.io",
  "githubassets.com",
  "github.dev"
];

function isExcludedSite(host){
  for (var i=0; i<EXCLUDED_SITES.length; i++){
    if (host.indexOf(EXCLUDED_SITES[i]) !== -1) return true;
  }
  return false;
}

// ==================== ADVANCED SESSION STATE ====================
var SESSION = {
  matchIP: null,
  lockUntil: 0,
  lockStrength: 20000,
  preloadCache: {},
  preloadTimeout: 10000,
  priorityQueue: [],
  maxPriority: 5,
  blockedIPs: {},
  blockDuration: 60000,
  connectionQuality: 100,
  qualityThreshold: 50,
  voiceIP: null,
  lobbyIP: null,
  matchAttempts: 0,
  lastMatchTime: 0,
  avgPingEstimate: 0,
  routeChanges: 0,
  successfulConnections: 0,
  failedConnections: 0,
  totalRequests: 0
};

// ==================== SMART DETECTION SYSTEM ====================
function isPUBG(h){
  return /(pubg|pubgm|intlgame|igamecj|tencent|krafton|lightspeed|wow|ugc|gdl|gamedownload|helpshift|adjust|appsflyer)/i.test(h);
}

function isMatch(u,h){
  return /(game|battle|match|session|realtime|tick|state|gameserver|authority|sync|udp|relay|room\d|server\d)/i.test(u+h);
}

function isPreMatch(u,h){
  return /(ready|prepare|loadout|warmup|countdown|spawn|briefing|loading|waiting)/i.test(u+h);
}

function isLobby(u,h){
  return /(lobby|matchmaking|queue|dispatcher|region|allocation|gateway|frontend)/i.test(u+h);
}

function isVoice(u,h){
  return /(voice|rtc|webrtc|voip|audio|mic|talk|agora|vivox)/i.test(u+h);
}

function isAnalytics(u,h){
  return /(analytics|telemetry|metrics|stats|tracking|log|crash|beacon|report|event)/i.test(u+h);
}

function isCDN(u,h){
  return /(cdn|asset|resource|download|patch|update|content|static|media|image|texture)/i.test(u+h);
}

function isFriends(u,h){
  return /(friend|social|presence|invite|party|team|squad|clan|guild|chat|message)/i.test(u+h);
}

function isAuth(u,h){
  return /(login|auth|token|oauth|passport|account|verify|sso|credential)/i.test(u+h);
}

function isKeepAlive(u,h){
  return /(ping|pong|heartbeat|health|status|alive|check)/i.test(u+h);
}

// ==================== REGION DETECTION ====================
function inList(ip, list){
  if (!ip) return false;
  for (var i=0; i<list.length; i++)
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  return false;
}

function isJordanCore(ip){ return inList(ip, JORDAN_CORE); }
function isJordanExtended(ip){ return inList(ip, JORDAN_EXTENDED); }
function isJordanAny(ip){ return isJordanCore(ip) || isJordanExtended(ip); }

// ==================== INTELLIGENT HELPERS ====================
function norm(h){
  var i = h.indexOf(":");
  return i > -1 ? h.substring(0, i) : h;
}

function ipOf(h){
  var ip = dnsResolve(h);
  return (ip && ip.indexOf(".") !== -1) ? ip : null;
}

function isValidIP(ip){
  if (!ip) return false;
  if (isInNet(ip, "127.0.0.0", "255.0.0.0")) return false;
  if (isInNet(ip, "10.0.0.0", "255.0.0.0")) return false;
  if (isInNet(ip, "172.16.0.0", "255.240.0.0")) return false;
  if (isInNet(ip, "192.168.0.0", "255.255.0.0")) return false;
  if (isInNet(ip, "169.254.0.0", "255.255.0.0")) return false;
  return true;
}

function now(){ return Date.now(); }

// ==================== IDEA #1: PREDICTIVE CACHING ====================
function shouldPreload(ip){
  return SESSION.preloadCache[ip] && (now() - SESSION.preloadCache[ip]) < SESSION.preloadTimeout;
}

function cacheForPreload(ip){
  if (ip){
    SESSION.preloadCache[ip] = now();
  }
}

function isPreloaded(ip){
  return SESSION.preloadCache[ip] !== undefined;
}

// ==================== IDEA #3: INTELLIGENT BLOCKING ====================
function isBlocked(ip){
  return SESSION.blockedIPs[ip] && (now() - SESSION.blockedIPs[ip]) < SESSION.blockDuration;
}

function blockIP(ip){
  if (ip){
    SESSION.blockedIPs[ip] = now();
    SESSION.failedConnections++;
  }
}

function unblockIP(ip){
  if (ip && SESSION.blockedIPs[ip]){
    delete SESSION.blockedIPs[ip];
  }
}

// ==================== IDEA #2: PRIORITY QUEUE SYSTEM ====================
function isPriority(ip){
  for (var i=0; i<SESSION.priorityQueue.length; i++)
    if (SESSION.priorityQueue[i] === ip) return true;
  return false;
}

function addToPriority(ip){
  if (ip && !isPriority(ip)){
    SESSION.priorityQueue.push(ip);
    if (SESSION.priorityQueue.length > SESSION.maxPriority)
      SESSION.priorityQueue.shift();
  }
}

function getPriorityScore(ip){
  for (var i=0; i<SESSION.priorityQueue.length; i++)
    if (SESSION.priorityQueue[i] === ip) return SESSION.maxPriority - i;
  return 0;
}

// ==================== IDEA #5: CONNECTION QUALITY SCORE ====================
function updateQuality(success){
  if (success){
    SESSION.connectionQuality = Math.min(100, SESSION.connectionQuality + 5);
    SESSION.successfulConnections++;
  } else {
    SESSION.connectionQuality = Math.max(0, SESSION.connectionQuality - 10);
    SESSION.failedConnections++;
  }
}

function getQualityLevel(){
  if (SESSION.connectionQuality >= 80) return "EXCELLENT";
  if (SESSION.connectionQuality >= 60) return "GOOD";
  if (SESSION.connectionQuality >= 40) return "FAIR";
  return "POOR";
}

function shouldUseBackup(){
  return SESSION.connectionQuality < SESSION.qualityThreshold;
}

// ==================== IDEA #6: DYNAMIC PROXY SELECTION ====================
function getMatchProxy(){
  SESSION.totalRequests++;
  
  if (shouldUseBackup()){
    SESSION.routeChanges++;
    return MATCH_BACKUP + "; " + MATCH_PRIME;
  }
  
  return MATCH_PRIME;
}

function getLobbyProxy(){
  if (SESSION.connectionQuality >= 70){
    return LOBBY_FAST;
  }
  
  return (SESSION.matchAttempts % 2 === 0) ? LOBBY_FAST : LOBBY_STABLE;
}

function getVoiceProxy(){
  return VOICE_PREMIUM;
}

// ==================== IDEA #9: AUTO CLEANUP SYSTEM ====================
function cleanupSession(){
  var currentTime = now();
  
  var cleanedBlocks = {};
  for (var ip in SESSION.blockedIPs){
    if ((currentTime - SESSION.blockedIPs[ip]) < SESSION.blockDuration){
      cleanedBlocks[ip] = SESSION.blockedIPs[ip];
    }
  }
  SESSION.blockedIPs = cleanedBlocks;
  
  var cleanedCache = {};
  for (var ip in SESSION.preloadCache){
    if ((currentTime - SESSION.preloadCache[ip]) < SESSION.preloadTimeout){
      cleanedCache[ip] = SESSION.preloadCache[ip];
    }
  }
  SESSION.preloadCache = cleanedCache;
  
  if (SESSION.priorityQueue.length > SESSION.maxPriority){
    SESSION.priorityQueue = SESSION.priorityQueue.slice(-SESSION.maxPriority);
  }
}

// ==================== SESSION MANAGEMENT ====================
function resetSession(){
  var timeSinceMatch = now() - SESSION.lastMatchTime;
  
  if (SESSION.matchIP && timeSinceMatch > 120000){
    SESSION.matchIP = null;
    SESSION.lockUntil = 0;
    SESSION.matchAttempts = 0;
    SESSION.connectionQuality = 100;
  }
  
  if (SESSION.matchIP && now() > SESSION.lockUntil + 30000){
    SESSION.matchIP = null;
    SESSION.lockUntil = 0;
  }
  
  cleanupSession();
}

// ==================== IDEA #4: SESSION HARD LOCK ====================
function lockMatchSession(ip){
  SESSION.matchIP = ip;
  SESSION.lockUntil = now() + SESSION.lockStrength;
  SESSION.lastMatchTime = now();
  addToPriority(ip);
  updateQuality(true);
}

function isSessionLocked(){
  return SESSION.matchIP !== null && now() < SESSION.lockUntil;
}

function unlockSession(){
  SESSION.matchIP = null;
  SESSION.lockUntil = 0;
}

// ==================== MAIN ROUTING ENGINE ====================
function FindProxyForURL(url, host){
  host = norm(host.toLowerCase());
  
  resetSession();
  
  // 🚀 EXCLUDED SITES (GitHub, etc.) → DIRECT
  if (isExcludedSite(host)){
    return DIRECT;
  }
  
  // ✅ Non-PUBG Traffic → Lobby (Controlled Path)
  if (!isPUBG(host)) return LOBBY_FAST;

  var ip = ipOf(host);
  
  if (!isValidIP(ip)) return BLOCK;
  
  // 🚫 IDEA #3: Intelligent Blocking
  if (isBlocked(ip)){
    return BLOCK;
  }

  var isJO_Core = isJordanCore(ip);
  var isJO_Ext = isJordanExtended(ip);
  var isJO = isJO_Core || isJO_Ext;

  // ==================== KEEP-ALIVE ====================
  if (isKeepAlive(url, host)){
    return ANALYTICS_MINI;
  }

  // ==================== IDEA #8: CDN COMPRESSION ====================
  if (isAnalytics(url, host)){
    return ANALYTICS_MINI;
  }

  if (isCDN(url, host)){
    return CDN_COMPRESS;
  }

  // ==================== AUTH ====================
  if (isAuth(url, host)){
    if (isJO) return LOBBY_FAST;
    return LOBBY_STABLE;
  }

  // ==================== FRIENDS/SOCIAL ====================
  if (isFriends(url, host)){
    if (SESSION.lobbyIP && ip === SESSION.lobbyIP) return getLobbyProxy();
    if (isJO){
      SESSION.lobbyIP = ip;
      return LOBBY_FAST;
    }
    return LOBBY_STABLE;
  }

  // ==================== IDEA #7: VOICE LOW-JITTER ====================
  if (isVoice(url, host)){
    if (SESSION.voiceIP && ip === SESSION.voiceIP) return getVoiceProxy();
    
    if (isJO){
      SESSION.voiceIP = ip;
      return getVoiceProxy();
    }
    
    blockIP(ip);
    return BLOCK;
  }

  // ==================== IDEA #1 & #10: PRE-MATCH PREDICTIVE ====================
  if (isPreMatch(url, host)){
    if (isJO_Core){
      cacheForPreload(ip);
      addToPriority(ip);
      return PRELOAD_PROXY;
    }
    if (isJO_Ext){
      cacheForPreload(ip);
      return LOBBY_FAST;
    }
    blockIP(ip);
    return BLOCK;
  }

  // ==================== IDEA #6: LOBBY INTELLIGENT ====================
  if (isLobby(url, host)){
    SESSION.matchAttempts++;
    
    if (SESSION.lobbyIP && ip === SESSION.lobbyIP) return getLobbyProxy();
    
    if (isJO_Core){
      SESSION.lobbyIP = ip;
      addToPriority(ip);
      return LOBBY_FAST;
    }
    
    if (isJO_Ext){
      SESSION.lobbyIP = ip;
      return LOBBY_STABLE;
    }
    
    if (SESSION.matchAttempts < 3) return LOBBY_STABLE;
    
    blockIP(ip);
    return BLOCK;
  }

  // 🎯 ==================== MATCH (ALL IDEAS COMBINED) ====================
  if (isMatch(url, host)){
    
    // ✅ IDEA #4: Session Hard Lock
    if (isSessionLocked()){
      if (ip === SESSION.matchIP){
        SESSION.lastMatchTime = now();
        updateQuality(true);
        return getMatchProxy();
      }
      
      blockIP(ip);
      updateQuality(false);
      return BLOCK;
    }

    // 🚀 IDEA #2: Priority Queue
    var priorityScore = getPriorityScore(ip);
    if (priorityScore > 0 && isJO_Core){
      lockMatchSession(ip);
      return getMatchProxy();
    }

    // 🔮 IDEA #1: Predictive Cache
    if (isPreloaded(ip) && isJO_Core){
      lockMatchSession(ip);
      return getMatchProxy();
    }

    // 🎯 Jordan Core Only
    if (isJO_Core){
      lockMatchSession(ip);
      return getMatchProxy();
    }

    // 🚫 IDEA #3: Block non-core
    blockIP(ip);
    updateQuality(false);
    return BLOCK;
  }

  // ==================== DEFAULT FALLBACK ====================
  if (isJO) return LOBBY_FAST;
  
  return LOBBY_STABLE;
}
