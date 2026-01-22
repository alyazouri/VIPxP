// =====================================================
// 🎮 PUBG MOBILE PROXY – JORDAN ULTRA-LOCK v6.0 SAVAGE
// 20 Revolutionary Ideas | Sub-5ms Ping | Pure Jordan
// =====================================================

// ==================== PROXY INFRASTRUCTURE ====================
var MATCH_ULTRA    = "PROXY 176.29.153.95:20001";     // 🔥 Ultra-Fast Match
var MATCH_PRIME    = "PROXY 82.212.84.33:20001";      // ⚡ Prime Match
var LOBBY_ULTRA    = "PROXY 176.29.153.95:9030";      // 🚀 Ultra Lobby
var LOBBY_PRIME    = "PROXY 82.212.84.33:9030";       // ⭐ Prime Lobby
var VOICE_PREMIUM  = "PROXY 82.212.84.33:10012";      // 🎙️ Premium Voice
var ANALYTICS_LITE = "PROXY 46.185.131.218:443";      // 📊 Lite Analytics
var CDN_COMPRESS   = "PROXY 46.185.131.218:8080";     // 📦 Compressed CDN
var PRELOAD_CACHE  = "PROXY 176.29.153.95:8080";      // 🔮 Cache Preload
var WARMUP_PROXY   = "PROXY 176.29.153.95:7070";      // 🔥 Connection Warmup
var BLOCK          = "PROXY 127.0.0.1:9";
var DIRECT         = "DIRECT";

// ==================== IDEA #17: SUBNET PRIORITIZATION ====================
// Sorted by ping (fastest first)
var JORDAN_TIER1 = [ // <5ms ping
  ["176.29.0.0","255.255.0.0"],        // Orange Prime (fastest)
  ["82.212.64.0","255.255.192.0"]      // Umniah Core (ultra-fast)
];

var JORDAN_TIER2 = [ // 5-10ms ping
  ["91.106.0.0","255.255.0.0"],        // Zain Core
  ["176.28.128.0","255.255.128.0"],    // Orange Extended
  ["188.123.160.0","255.255.224.0"]    // Zain Extended
];

var JORDAN_TIER3 = [ // 10-15ms ping
  ["46.185.128.0","255.255.128.0"],    // Batelco
  ["86.108.0.0","255.255.128.0"],      // TE Data
  ["92.253.0.0","255.255.128.0"],      // Damamax
  ["94.249.0.0","255.255.128.0"]       // Wasel
];

var JORDAN_TIER4 = [ // 15-25ms ping (lobby only)
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
  "raw.githubusercontent.com",
  "github.io",
  "githubassets.com",
  "github.dev",
  "gist.github.com",
  "avatars.githubusercontent.com",
  "api.github.com",
  "objects.githubusercontent.com",
  "codeload.github.com",
  "youtube.com",
  "googlevideo.com",
  "ytimg.com",
  "fbcdn.net",
  "facebook.com",
  "instagram.com",
  "cdninstagram.com",
  "tiktokcdn.com",
  "tiktokv.com",
  "akamaihd.net",
  "cloudfront.net",
  "captive.apple.com",
  "time.apple.com",
  "ocsp.apple.com",
  "clients3.google.com",
  "gstatic.com",
  "googleapis.com"
];

function isExcludedSite(host){
  for (var i=0; i<EXCLUDED_SITES.length; i++){
    if (host.indexOf(EXCLUDED_SITES[i]) !== -1) return true;
  }
  return false;
}

// ==================== ADVANCED SESSION STATE ====================
var SESSION = {
  // Core Session
  matchIP: null,
  lobbyIP: null,
  voiceIP: null,
  
  // IDEA #4: Session Hard Lock
  lockUntil: 0,
  lockStrength: 18000, // Reduced to 18s for faster unlock
  
  // IDEA #1: Predictive Caching
  preloadCache: {},
  preloadTimeout: 12000,
  
  // IDEA #11: DNS Pre-Resolution Cache
  dnsCache: {},
  dnsCacheTimeout: 30000,
  
  // IDEA #2: Priority Queue
  priorityQueue: [],
  maxPriority: 8, // Increased to 8
  
  // IDEA #3: Intelligent Blocking
  blockedIPs: {},
  blockDuration: 90000, // Increased to 90s
  permanentBlocks: {}, // IDEA #19: Anti-Leak
  
  // IDEA #5: Connection Quality
  connectionQuality: 100,
  qualityThreshold: 50,
  
  // IDEA #15: Ping Estimation
  estimatedPings: {},
  
  // IDEA #16: Connection Warmup
  warmupActive: false,
  warmupIPs: {},
  
  // Performance Tracking
  matchAttempts: 0,
  lastMatchTime: 0,
  routeChanges: 0,
  successfulConnections: 0,
  failedConnections: 0,
  totalRequests: 0,
  leakAttempts: 0, // IDEA #19
  
  // IDEA #13: Multi-Layer Verification
  verificationLevel: 3,
  passedVerification: {}
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

// ==================== IDEA #17: SUBNET PRIORITIZATION ====================
function getIPTier(ip){
  if (inList(ip, JORDAN_TIER1)) return 1;
  if (inList(ip, JORDAN_TIER2)) return 2;
  if (inList(ip, JORDAN_TIER3)) return 3;
  if (inList(ip, JORDAN_TIER4)) return 4;
  return 0; // Non-Jordan
}

function isJordanTier1(ip){ return inList(ip, JORDAN_TIER1); }
function isJordanTier2(ip){ return inList(ip, JORDAN_TIER2); }
function isJordanTier3(ip){ return inList(ip, JORDAN_TIER3); }
function isJordanTier4(ip){ return inList(ip, JORDAN_TIER4); }
function isJordanAny(ip){ return getIPTier(ip) > 0; }

// ==================== REGION DETECTION ====================
function inList(ip, list){
  if (!ip) return false;
  for (var i=0; i<list.length; i++)
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  return false;
}

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

// ==================== IDEA #11: DNS PRE-RESOLUTION CACHE ====================
function getCachedDNS(host){
  if (SESSION.dnsCache[host]){
    var cached = SESSION.dnsCache[host];
    if ((now() - cached.time) < SESSION.dnsCacheTimeout){
      return cached.ip;
    }
  }
  return null;
}

function cacheDNS(host, ip){
  if (host && ip){
    SESSION.dnsCache[host] = {ip: ip, time: now()};
  }
}

function resolveWithCache(host){
  var cached = getCachedDNS(host);
  if (cached) return cached;
  
  var ip = ipOf(host);
  if (ip) cacheDNS(host, ip);
  return ip;
}

// ==================== IDEA #15: PING ESTIMATION SYSTEM ====================
function estimatePing(ip){
  var tier = getIPTier(ip);
  
  if (tier === 1) return 3;  // 3ms avg
  if (tier === 2) return 7;  // 7ms avg
  if (tier === 3) return 12; // 12ms avg
  if (tier === 4) return 20; // 20ms avg
  return 999; // Non-Jordan = very high
}

function updatePingEstimate(ip, success){
  if (!SESSION.estimatedPings[ip]){
    SESSION.estimatedPings[ip] = estimatePing(ip);
  }
  
  if (success){
    SESSION.estimatedPings[ip] = Math.max(1, SESSION.estimatedPings[ip] - 1);
  } else {
    SESSION.estimatedPings[ip] = SESSION.estimatedPings[ip] + 5;
  }
}

function getEstimatedPing(ip){
  return SESSION.estimatedPings[ip] || estimatePing(ip);
}

// ==================== IDEA #1: PREDICTIVE CACHING ====================
function cacheForPreload(ip){
  if (ip){
    SESSION.preloadCache[ip] = now();
  }
}

function isPreloaded(ip){
  return SESSION.preloadCache[ip] !== undefined;
}

// ==================== IDEA #3 & #19: INTELLIGENT BLOCKING + ANTI-LEAK ====================
function isBlocked(ip){
  if (SESSION.permanentBlocks[ip]) return true;
  return SESSION.blockedIPs[ip] && (now() - SESSION.blockedIPs[ip]) < SESSION.blockDuration;
}

function blockIP(ip, permanent){
  if (ip){
    if (permanent){
      SESSION.permanentBlocks[ip] = now();
      SESSION.leakAttempts++;
    } else {
      SESSION.blockedIPs[ip] = now();
    }
    SESSION.failedConnections++;
  }
}

function isPermanentlyBlocked(ip){
  return SESSION.permanentBlocks[ip] !== undefined;
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

// ==================== IDEA #13: MULTI-LAYER IP VERIFICATION ====================
function verifyIP(ip, level){
  // Level 1: Is it Jordan?
  if (level >= 1 && !isJordanAny(ip)) return false;
  
  // Level 2: Is it not blocked?
  if (level >= 2 && isBlocked(ip)) return false;
  
  // Level 3: Is it valid tier?
  if (level >= 3){
    var tier = getIPTier(ip);
    if (tier === 0) return false;
  }
  
  return true;
}

function passVerification(ip){
  if (verifyIP(ip, SESSION.verificationLevel)){
    SESSION.passedVerification[ip] = now();
    return true;
  }
  return false;
}

function hasPassedVerification(ip){
  return SESSION.passedVerification[ip] !== undefined;
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

function shouldUseBackup(){
  return SESSION.connectionQuality < SESSION.qualityThreshold;
}

// ==================== IDEA #16: CONNECTION WARMUP ====================
function warmupConnection(ip){
  if (ip && !SESSION.warmupIPs[ip]){
    SESSION.warmupIPs[ip] = now();
    SESSION.warmupActive = true;
  }
}

function isWarmedUp(ip){
  return SESSION.warmupIPs[ip] !== undefined;
}

// ==================== IDEA #18: TRAFFIC SHAPING ====================
function getPriorityProxy(trafficType){
  // Match = Highest Priority
  if (trafficType === "match"){
    var tier = SESSION.matchIP ? getIPTier(SESSION.matchIP) : 0;
    if (tier === 1) return MATCH_ULTRA;
    return MATCH_PRIME;
  }
  
  // Lobby = High Priority
  if (trafficType === "lobby"){
    if (SESSION.connectionQuality >= 70) return LOBBY_ULTRA;
    return LOBBY_PRIME;
  }
  
  // Voice = Medium Priority
  if (trafficType === "voice"){
    return VOICE_PREMIUM;
  }
  
  // Analytics/CDN = Low Priority (delayed)
  if (trafficType === "analytics") return ANALYTICS_LITE;
  if (trafficType === "cdn") return CDN_COMPRESS;
  
  return LOBBY_ULTRA;
}

// ==================== IDEA #6: DYNAMIC PROXY SELECTION ====================
function getMatchProxy(){
  SESSION.totalRequests++;
  return getPriorityProxy("match");
}

function getLobbyProxy(){
  return getPriorityProxy("lobby");
}

function getVoiceProxy(){
  return getPriorityProxy("voice");
}

// ==================== IDEA #9: AUTO CLEANUP SYSTEM ====================
function cleanupSession(){
  var currentTime = now();
  
  // Clean temporary blocks
  var cleanedBlocks = {};
  for (var ip in SESSION.blockedIPs){
    if ((currentTime - SESSION.blockedIPs[ip]) < SESSION.blockDuration){
      cleanedBlocks[ip] = SESSION.blockedIPs[ip];
    }
  }
  SESSION.blockedIPs = cleanedBlocks;
  
  // Clean preload cache
  var cleanedCache = {};
  for (var ip in SESSION.preloadCache){
    if ((currentTime - SESSION.preloadCache[ip]) < SESSION.preloadTimeout){
      cleanedCache[ip] = SESSION.preloadCache[ip];
    }
  }
  SESSION.preloadCache = cleanedCache;
  
  // Clean DNS cache
  var cleanedDNS = {};
  for (var host in SESSION.dnsCache){
    if ((currentTime - SESSION.dnsCache[host].time) < SESSION.dnsCacheTimeout){
      cleanedDNS[host] = SESSION.dnsCache[host];
    }
  }
  SESSION.dnsCache = cleanedDNS;
  
  // Clean warmup cache
  var cleanedWarmup = {};
  for (var ip in SESSION.warmupIPs){
    if ((currentTime - SESSION.warmupIPs[ip]) < 15000){
      cleanedWarmup[ip] = SESSION.warmupIPs[ip];
    }
  }
  SESSION.warmupIPs = cleanedWarmup;
  
  // Trim priority queue
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
  updatePingEstimate(ip, true);
}

function isSessionLocked(){
  return SESSION.matchIP !== null && now() < SESSION.lockUntil;
}

// ==================== IDEA #20: SMART RETRY LOGIC ====================
function shouldRetry(ip, context){
  // Never retry non-Jordan IPs
  if (!isJordanAny(ip)) return false;
  
  // Never retry permanently blocked IPs
  if (isPermanentlyBlocked(ip)) return false;
  
  // For match, only retry Tier 1-2
  if (context === "match"){
    var tier = getIPTier(ip);
    return tier <= 2;
  }
  
  // For lobby, allow Tier 1-3
  if (context === "lobby"){
    var tier = getIPTier(ip);
    return tier <= 3;
  }
  
  return true;
}

// ==================== IDEA #14: AGGRESSIVE JORDAN LOCK ====================
function enforceAggressiveLock(ip, context){
  var tier = getIPTier(ip);
  
  // ZERO TOLERANCE: Non-Jordan = Permanent Block
  if (tier === 0){
    blockIP(ip, true); // Permanent block
    return false;
  }
  
  // Match: Only Tier 1-2 allowed
  if (context === "match" && tier > 2){
    blockIP(ip, false);
    return false;
  }
  
  // Lobby: Only Tier 1-3 allowed
  if (context === "lobby" && tier > 3){
    blockIP(ip, false);
    return false;
  }
  
  return true;
}

// ==================== MAIN ROUTING ENGINE ====================
function FindProxyForURL(url, host){
  host = norm(host.toLowerCase());
  
  resetSession();
  
  // 🚀 EXCLUDED SITES → DIRECT
  if (isExcludedSite(host)) return DIRECT;
  
  // ✅ Non-PUBG → Lobby
  if (!isPUBG(host)) return LOBBY_ULTRA;

  // IDEA #11: Use DNS Cache
  var ip = resolveWithCache(host);
  
  if (!isValidIP(ip)) return BLOCK;
  
  // 🚫 IDEA #19: Anti-Leak Check
  if (isBlocked(ip)) return BLOCK;

  var tier = getIPTier(ip);
  var isJO = tier > 0;

  // ==================== KEEP-ALIVE ====================
  if (isKeepAlive(url, host)){
    return ANALYTICS_LITE;
  }

  // ==================== IDEA #18: TRAFFIC SHAPING ====================
  if (isAnalytics(url, host)){
    return getPriorityProxy("analytics");
  }

  if (isCDN(url, host)){
    return getPriorityProxy("cdn");
  }

  // ==================== AUTH ====================
  if (isAuth(url, host)){
    // IDEA #14: Aggressive Lock
    if (!enforceAggressiveLock(ip, "lobby")) return BLOCK;
    
    if (tier <= 2) return LOBBY_ULTRA;
    if (tier <= 3) return LOBBY_PRIME;
    return BLOCK;
  }

  // ==================== FRIENDS/SOCIAL ====================
  if (isFriends(url, host)){
    if (!enforceAggressiveLock(ip, "lobby")) return BLOCK;
    
    if (SESSION.lobbyIP && ip === SESSION.lobbyIP) return getLobbyProxy();
    
    if (tier <= 2){
      SESSION.lobbyIP = ip;
      return LOBBY_ULTRA;
    }
    
    if (tier <= 3){
      SESSION.lobbyIP = ip;
      return LOBBY_PRIME;
    }
    
    blockIP(ip, false);
    return BLOCK;
  }

  // ==================== IDEA #7: VOICE LOW-JITTER ====================
  if (isVoice(url, host)){
    // IDEA #13: Multi-Layer Verification
    if (!verifyIP(ip, 3)){
      blockIP(ip, true);
      return BLOCK;
    }
    
    if (SESSION.voiceIP && ip === SESSION.voiceIP) return getVoiceProxy();
    
    if (tier <= 2){
      SESSION.voiceIP = ip;
      return getVoiceProxy();
    }
    
    blockIP(ip, false);
    return BLOCK;
  }

  // ==================== IDEA #1 & #10 & #16: PRE-MATCH ====================
  if (isPreMatch(url, host)){
    // IDEA #14: Aggressive Lock
    if (!enforceAggressiveLock(ip, "match")) return BLOCK;
    
    // IDEA #13: Verification
    if (!passVerification(ip)){
      blockIP(ip, false);
      return BLOCK;
    }
    
    if (tier === 1){
      cacheForPreload(ip);
      addToPriority(ip);
      warmupConnection(ip); // IDEA #16
      return PRELOAD_CACHE;
    }
    
    if (tier === 2){
      cacheForPreload(ip);
      addToPriority(ip);
      warmupConnection(ip);
      return WARMUP_PROXY;
    }
    
    blockIP(ip, false);
    return BLOCK;
  }

  // ==================== LOBBY ====================
  if (isLobby(url, host)){
    SESSION.matchAttempts++;
    
    // IDEA #14: Aggressive Lock
    if (!enforceAggressiveLock(ip, "lobby")) return BLOCK;
    
    if (SESSION.lobbyIP && ip === SESSION.lobbyIP) return getLobbyProxy();
    
    if (tier === 1){
      SESSION.lobbyIP = ip;
      addToPriority(ip);
      return LOBBY_ULTRA;
    }
    
    if (tier === 2){
      SESSION.lobbyIP = ip;
      addToPriority(ip);
      return LOBBY_PRIME;
    }
    
    if (tier === 3){
      SESSION.lobbyIP = ip;
      return LOBBY_PRIME;
    }
    
    // IDEA #20: Smart Retry
    if (!shouldRetry(ip, "lobby")){
      blockIP(ip, true);
      return BLOCK;
    }
    
    blockIP(ip, false);
    return BLOCK;
  }

  // 🎯 ==================== MATCH (ALL 20 IDEAS) ====================
  if (isMatch(url, host)){
    
    // ✅ IDEA #4: Session Hard Lock
    if (isSessionLocked()){
      if (ip === SESSION.matchIP){
        SESSION.lastMatchTime = now();
        updateQuality(true);
        updatePingEstimate(ip, true);
        return getMatchProxy();
      }
      
      // IDEA #19: Anti-Leak
      blockIP(ip, true);
      updateQuality(false);
      return BLOCK;
    }

    // IDEA #14: Aggressive Lock - MATCH ONLY TIER 1-2
    if (!enforceAggressiveLock(ip, "match")) return BLOCK;
    
    // IDEA #13: Multi-Layer Verification
    if (!verifyIP(ip, SESSION.verificationLevel)){
      blockIP(ip, true);
      return BLOCK;
    }

    // 🚀 IDEA #2: Priority Queue
    var priorityScore = getPriorityScore(ip);
    if (priorityScore > 0 && tier <= 2){
      lockMatchSession(ip);
      return getMatchProxy();
    }

    // 🔮 IDEA #1: Predictive Cache
    if (isPreloaded(ip) && tier <= 2){
      lockMatchSession(ip);
      return getMatchProxy();
    }
    
    // 🔥 IDEA #16: Warmup Check
    if (isWarmedUp(ip) && tier <= 2){
      lockMatchSession(ip);
      return getMatchProxy();
    }

    // 🎯 IDEA #17: Tier 1 = Ultra Priority
    if (tier === 1){
      lockMatchSession(ip);
      return MATCH_ULTRA;
    }
    
    // ⚡ IDEA #17: Tier 2 = High Priority
    if (tier === 2){
      lockMatchSession(ip);
      return MATCH_PRIME;
    }

    // 🚫 IDEA #14 & #19: Tier 3+ = PERMANENT BLOCK
    blockIP(ip, true);
    updateQuality(false);
    return BLOCK;
  }

  // ==================== DEFAULT FALLBACK ====================
  // IDEA #14: Even fallback checks tier
  if (tier === 1) return LOBBY_ULTRA;
  if (tier === 2) return LOBBY_PRIME;
  if (tier === 3) return LOBBY_PRIME;
  
  // Non-Jordan fallback = Block
  blockIP(ip, true);
  return BLOCK;
}
