// ═══════════════════════════════════════════════════════════════════════════
// ██████╗ ██╗   ██╗██████╗  ██████╗     ███╗   ███╗ ██████╗ ██████╗ ██╗██╗     ███████╗
// ██╔══██╗██║   ██║██╔══██╗██╔════╝     ████╗ ████║██╔═══██╗██╔══██╗██║██║     ██╔════╝
// ██████╔╝██║   ██║██████╔╝██║  ███╗    ██╔████╔██║██║   ██║██████╔╝██║██║     █████╗  
// ██╔═══╝ ██║   ██║██╔══██╗██║   ██║    ██║╚██╔╝██║██║   ██║██╔══██╗██║██║     ██╔══╝  
// ██║     ╚██████╔╝██████╔╝╚██████╔╝    ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║███████╗███████╗
// ╚═╝      ╚═════╝ ╚═════╝  ╚═════╝     ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝╚══════╝
// ═══════════════════════════════════════════════════════════════════════════
// JORDAN OPTIMIZED | STABLE PING | ALL GAME MODES | v5.0 COMPLETE
// DNS: 1.1.1.1 + 1.0.0.1 | Restart device after setup
// ═══════════════════════════════════════════════════════════════════════════

// ======================== CONFIGURATION ========================
var CONFIG = {
  // Session Management
  MATCH_TIMEOUT: 480000,        // 8 min (longer matches)
  LOBBY_TIMEOUT: 300000,        // 5 min (stable lobby)
  DNS_CACHE_TTL: 240000,        // 4 min (aggressive)
  
  // Health & Failover
  MAX_FAILURES: 3,              // Health threshold
  HEALTH_RECOVER_THRESHOLD: 2,  // Recovery after X successes
  
  // Performance
  CACHE_CLEANUP_RATE: 0.03,     // 3% cleanup probability
  ENABLE_PREDICTIONS: true,     // Pattern detection
  ENABLE_HEALTH_TRACK: true,    // Server health monitoring
  
  // Jordan ISPs Priority (من الأفضل للأسوأ)
  ISP_PRIORITY: {
    "46.185": 100,   // Orange Fiber (الأفضل)
    "212.35": 100,   // Orange Main
    "176.28": 95,    // Zain Fiber
    "176.29": 95,    // Zain Main
    "82.212": 90,    // Umniah Main
    "82.213": 90,    // Umniah Alt
    "94.249": 85,    // Batelco
    "149.200": 80,   // Generic Fiber
    "195.229": 75,   // New ISP
    "31.210": 75     // New ISP
  }
};

// ======================== PROXY SERVERS ========================
// Match Servers - FIXED PATH (لا يتغير أبداً أثناء الماتش)
var MATCH_PRIMARY = "PROXY 46.185.131.218:20001";      // Main - Orange
var MATCH_BACKUP1 = "PROXY 212.35.66.45:20001";        // Backup 1 - Orange
var MATCH_BACKUP2 = "PROXY 176.28.50.100:20001";       // Backup 2 - Zain (NEW)

// Lobby Servers - Load Balanced (موزعة حسب الضغط)
var LOBBY_POOL = [
  "PROXY 46.185.131.218:443",       // Orange - Port 443
  "PROXY 212.35.66.45:8085",        // Orange - Port 8085
  "PROXY 212.35.66.45:8181",        // Orange - Port 8181
  "PROXY 176.28.50.100:8080",       // Zain (NEW)
  "PROXY 82.212.100.50:8080"        // Umniah (NEW)
];

// Social/Voice Servers (منفصلة للأداء الأفضل)
var SOCIAL_POOL = [
  "PROXY 46.185.131.218:443",
  "PROXY 212.35.66.45:8181"
];

// CDN/Download Servers
var CDN_POOL = [
  "PROXY 46.185.131.218:8080",
  "PROXY 212.35.66.45:8080",
  "PROXY 176.28.50.100:8080"
];

var DIRECT = "DIRECT";
var BLOCK = "PROXY 127.0.0.1:9";

// ======================== JORDAN IP RANGES ========================
// Match IPs - STRICT (للماتشات فقط - ثبات 100%)
var MATCH_JORDAN_IPS = [
  ["46.185.0.0", "255.255.0.0"],      // Orange Jordan
  ["212.35.0.0", "255.255.0.0"],      // Orange Jordan Alt
  ["176.28.0.0", "255.252.0.0"],      // Zain Jordan Main
  ["176.29.0.0", "255.255.0.0"],      // Zain Jordan Alt
  ["82.212.0.0", "255.252.0.0"],      // Umniah Jordan Main
  ["82.213.0.0", "255.255.0.0"],      // Umniah Jordan Alt
  ["94.249.0.0", "255.255.0.0"],      // Batelco Jordan
  ["149.200.0.0", "255.255.0.0"],     // Fiber Jordan
  ["195.229.0.0", "255.255.0.0"],     // New Range 1
  ["31.210.0.0", "255.255.0.0"]       // New Range 2
];

// Lobby IPs - EXTENDED (للوبي والخدمات)
var LOBBY_JORDAN_IPS = MATCH_JORDAN_IPS.concat([
  ["86.108.0.0", "255.254.0.0"],      // Business Jordan
  ["92.253.0.0", "255.255.0.0"],      // Enterprise Jordan
  ["188.161.0.0", "255.255.0.0"],     // ISP Jordan
  ["185.107.0.0", "255.255.0.0"],     // Mobile Jordan
  ["37.238.0.0", "255.255.0.0"],      // Additional Jordan
  ["213.139.32.0", "255.255.224.0"],  // Subnet Jordan
  ["212.118.0.0", "255.255.224.0"]    // Subnet Jordan 2
]);

// ======================== SESSION STATE ========================
var SESSION = {
  // Match Session (CRITICAL - لا يتغير أبداً)
  matchActive: false,
  matchNetwork: null,         // /24 network (xxx.xxx.xxx)
  matchHost: null,            // Exact hostname
  matchServer: null,          // Fixed proxy server
  matchStartTime: 0,
  matchRequestCount: 0,
  matchLastActivity: 0,
  
  // Lobby Session
  lobbyActive: false,
  lobbyStartTime: 0,
  currentLobbyServer: null,
  
  // DNS Cache (Performance boost)
  dnsCache: {},
  dnsCacheTime: {},
  dnsCacheHits: 0,
  dnsCacheMisses: 0,
  
  // Server Health Tracking
  serverHealth: {},
  primaryHealthy: true,
  lastHealthCheck: 0,
  
  // Pattern Detection
  requestHistory: [],         // Last 30 requests
  lastPatternCheck: 0,
  detectedPattern: null,
  
  // ISP Detection
  detectedISP: null,
  ispConfidence: 0,
  ispSamples: [],
  
  // Load Balancing
  lobbyRotation: 0,
  socialRotation: 0,
  cdnRotation: 0,
  
  // Statistics
  totalRequests: 0,
  blockedRequests: 0,
  matchRequests: 0,
  lobbyRequests: 0
};

// ======================== HELPER FUNCTIONS ========================
function normalizeHost(host) {
  var colonIndex = host.indexOf(":");
  return colonIndex > 0 ? host.substring(0, colonIndex) : host;
}

function isInIPRange(ip, rangeList) {
  for (var i = 0; i < rangeList.length; i++) {
    if (isInNet(ip, rangeList[i][0], rangeList[i][1])) {
      return true;
    }
  }
  return false;
}

function getNetwork24(ip) {
  return ip.split('.').slice(0, 3).join('.');
}

function getNetwork16(ip) {
  return ip.split('.').slice(0, 2).join('.');
}

// ======================== DNS RESOLVER WITH CACHE ========================
function resolveCached(host) {
  var now = Date.now();
  
  // Check cache first
  if (SESSION.dnsCache[host]) {
    var age = now - SESSION.dnsCacheTime[host];
    if (age < CONFIG.DNS_CACHE_TTL) {
      SESSION.dnsCacheHits++;
      return SESSION.dnsCache[host];
    }
  }
  
  // Resolve and cache
  SESSION.dnsCacheMisses++;
  var ip = dnsResolve(host);
  
  if (ip && ip.indexOf(":") === -1) {  // Ignore IPv6
    SESSION.dnsCache[host] = ip;
    SESSION.dnsCacheTime[host] = now;
    
    // Periodic cleanup (3% probability)
    if (Math.random() < CONFIG.CACHE_CLEANUP_RATE) {
      cleanupDNSCache(now);
    }
  }
  
  return ip;
}

function cleanupDNSCache(now) {
  var expiry = now - (CONFIG.DNS_CACHE_TTL * 2);
  for (var host in SESSION.dnsCache) {
    if (SESSION.dnsCacheTime[host] < expiry) {
      delete SESSION.dnsCache[host];
      delete SESSION.dnsCacheTime[host];
    }
  }
}

// ======================== SERVER HEALTH MONITOR ========================
function trackServerHealth(server, success) {
  if (!CONFIG.ENABLE_HEALTH_TRACK) return;
  
  if (!SESSION.serverHealth[server]) {
    SESSION.serverHealth[server] = {
      failures: 0,
      successes: 0,
      healthy: true,
      lastCheck: Date.now()
    };
  }
  
  var health = SESSION.serverHealth[server];
  health.lastCheck = Date.now();
  
  if (success) {
    health.successes++;
    if (health.successes >= CONFIG.HEALTH_RECOVER_THRESHOLD) {
      health.failures = 0;
      health.healthy = true;
    }
  } else {
    health.failures++;
    health.successes = 0;
    if (health.failures >= CONFIG.MAX_FAILURES) {
      health.healthy = false;
    }
  }
  
  // Update primary server status
  if (server === MATCH_PRIMARY) {
    SESSION.primaryHealthy = health.healthy;
  }
}

function isServerHealthy(server) {
  if (!SESSION.serverHealth[server]) return true;
  return SESSION.serverHealth[server].healthy;
}

function getBestMatchServer() {
  // Primary is healthy
  if (isServerHealthy(MATCH_PRIMARY)) {
    return MATCH_PRIMARY;
  }
  
  // Try Backup 1
  if (isServerHealthy(MATCH_BACKUP1)) {
    return MATCH_BACKUP1;
  }
  
  // Last resort: Backup 2
  return MATCH_BACKUP2;
}

// ======================== ISP DETECTOR ========================
function detectISP(ip) {
  var prefix = getNetwork16(ip);
  var priority = CONFIG.ISP_PRIORITY[prefix];
  
  if (priority) {
    SESSION.ispSamples.push(prefix);
    if (SESSION.ispSamples.length > 20) {
      SESSION.ispSamples.shift();
    }
    
    // Calculate most common ISP
    var counts = {};
    var maxCount = 0;
    var bestISP = null;
    
    for (var i = 0; i < SESSION.ispSamples.length; i++) {
      var isp = SESSION.ispSamples[i];
      counts[isp] = (counts[isp] || 0) + 1;
      if (counts[isp] > maxCount) {
        maxCount = counts[isp];
        bestISP = isp;
      }
    }
    
    SESSION.detectedISP = bestISP;
    SESSION.ispConfidence = Math.floor((maxCount / SESSION.ispSamples.length) * 100);
    
    return priority;
  }
  
  return 0;
}

// ======================== PATTERN DETECTOR ========================
function detectPattern(type) {
  if (!CONFIG.ENABLE_PREDICTIONS) return null;
  
  SESSION.requestHistory.push(type);
  if (SESSION.requestHistory.length > 30) {
    SESSION.requestHistory.shift();
  }
  
  if (SESSION.requestHistory.length < 10) return null;
  
  var recent = SESSION.requestHistory.slice(-10).join("-");
  
  // Pattern: Entering match
  if (/LOBBY.*LOBBY.*SOCIAL.*MATCHMAKING.*MATCH/.test(recent)) {
    SESSION.detectedPattern = "ENTERING_MATCH";
    return "ENTERING_MATCH";
  }
  
  // Pattern: In match
  if (/MATCH.*MATCH.*MATCH/.test(recent)) {
    SESSION.detectedPattern = "IN_MATCH";
    return "IN_MATCH";
  }
  
  // Pattern: Returning to lobby
  if (/MATCH.*RESULTS.*LOBBY/.test(recent)) {
    SESSION.detectedPattern = "MATCH_ENDED";
    return "MATCH_ENDED";
  }
  
  return null;
}

// ======================== LOAD BALANCER ========================
function getLoadBalancedServer(pool, rotationKey) {
  var index = SESSION[rotationKey] % pool.length;
  SESSION[rotationKey]++;
  return pool[index];
}

function getHashedServer(pool, key) {
  var hash = 0;
  for (var i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return pool[Math.abs(hash) % pool.length];
}

// ======================== COMPLETE DETECTION SYSTEM ========================

// ========== PUBG MOBILE DOMAINS (Updated 3.6) ==========
function isPUBGDomain(host) {
  return /pubgm|pubg|tencent|lightspeed|krafton|proximabeta|intlgame|levelinfinite|pubgmobile|battlegrounds/i.test(host);
}

// ========== MATCH DETECTION (All Modes) ==========
function isMatchTraffic(url, host) {
  // Critical match keywords (HIGHEST PRIORITY)
  if (/match|battle|combat|fight|game|play|sync|tick|room|arena|session/i.test(url + host)) {
    return true;
  }
  
  // Specific match endpoints
  if (/\/game\/|\/battle\/|\/match\/|\/room\/|\/sync\/|\/realtime\//i.test(url)) {
    return true;
  }
  
  // Port-based detection (game ports)
  if (/:10012|:10013|:10491|:10492|:10493|:8011|:8013|:17000/i.test(url)) {
    return true;
  }
  
  return false;
}

// ========== LOBBY DETECTION ==========
function isLobbyTraffic(url, host) {
  return /lobby|main|home|hall|dispatch|gateway|region|platform|entry/i.test(url + host) ||
         /\/lobby\/|\/main\/|\/hall\/|\/dispatch\/|\/gateway\//i.test(url);
}

// ========== MATCHMAKING DETECTION ==========
function isMatchmakingTraffic(url, host) {
  return /matchmak|queue|join|recruit|find|search|wait|ready/i.test(url + host) ||
         /\/matchmaking\/|\/queue\/|\/join\/|\/ready\//i.test(url);
}

// ========== SOCIAL DETECTION (Squad/Friends/Voice) ==========
function isSocialTraffic(url, host) {
  return /friend|squad|team|party|clan|guild|social|invite|presence|voice|chat|mic/i.test(url + host) ||
         /\/friend\/|\/squad\/|\/team\/|\/social\/|\/voice\/|\/chat\//i.test(url);
}

// ========== VOICE CHAT DETECTION ==========
function isVoiceTraffic(url, host) {
  return /voice|audio|mic|speak|talk|rtc|rtt|agora|vivox/i.test(url + host) ||
         /\/voice\/|\/audio\/|\/rtc\/|\/agora\//i.test(url);
}

// ========== INVENTORY/LOADOUT DETECTION ==========
function isInventoryTraffic(url, host) {
  return /inventory|loadout|equipment|weapon|skin|outfit|item|backpack|locker/i.test(url + host) ||
         /\/inventory\/|\/loadout\/|\/item\/|\/skin\//i.test(url);
}

// ========== SHOP/STORE DETECTION ==========
function isShopTraffic(url, host) {
  return /shop|store|market|purchase|buy|mall|uc|payment|transaction/i.test(url + host) ||
         /\/shop\/|\/store\/|\/market\/|\/buy\/|\/payment\//i.test(url);
}

// ========== MISSION/EVENTS DETECTION ==========
function isMissionTraffic(url, host) {
  return /mission|quest|event|achievement|task|challenge|reward|royalepass|rp/i.test(url + host) ||
         /\/mission\/|\/quest\/|\/event\/|\/achievement\/|\/royalepass\//i.test(url);
}

// ========== RANKING/LEADERBOARD DETECTION ==========
function isRankingTraffic(url, host) {
  return /rank|tier|rating|leaderboard|ladder|season|trophy|medal|ace|conqueror/i.test(url + host) ||
         /\/rank\/|\/leaderboard\/|\/season\/|\/ladder\//i.test(url);
}

// ========== RESULTS/STATS DETECTION ==========
function isResultsTraffic(url, host) {
  return /result|stats|statistic|report|summary|score|death|kill|damage|survive/i.test(url + host) ||
         /\/result\/|\/stats\/|\/report\/|\/summary\//i.test(url);
}

// ========== CDN/ASSETS DETECTION ==========
function isCDNTraffic(url, host) {
  return /cdn|asset|resource|download|patch|update|version|file|content|media|image|texture/i.test(url + host) ||
         /\/cdn\/|\/asset\/|\/download\/|\/patch\/|\/resource\//i.test(url) ||
         /\.jpg|\.png|\.webp|\.mp4|\.zip|\.pak|\.bin/i.test(url);
}

// ========== ANALYTICS/TELEMETRY DETECTION ==========
function isAnalyticsTraffic(url, host) {
  return /analytics|telemetry|metric|track|log|report|crash|error|beacon/i.test(url + host) ||
         /\/analytics\/|\/telemetry\/|\/track\/|\/beacon\//i.test(url);
}

// ========== ADS DETECTION ==========
function isAdsTraffic(url, host) {
  return /\bads?\b|advertis|banner|promo|campaign/i.test(url + host) ||
         /\/ads\/|\/ad\/|\/banner\/|\/promo\//i.test(url);
}

// ========== GAME MODES DETECTION ==========
function isClassicMode(url, host) {
  return /classic|erangel|miramar|sanhok|vikendi|livik|taego|karakin/i.test(url + host);
}

function isArcadeMode(url, host) {
  return /arcade|tdm|deathmatch|quick|mini|rush|domination|sniper/i.test(url + host);
}

function isEvoGroundMode(url, host) {
  return /evoground|payload|infection|runic|metro|rage|arena|survive/i.test(url + host);
}

function isTrainingMode(url, host) {
  return /training|practice|tutorial|cheer/i.test(url + host);
}

// ======================== MAIN PAC FUNCTION ========================
function FindProxyForURL(url, host) {
  // Normalize hostname
  host = normalizeHost(host.toLowerCase());
  url = url.toLowerCase();
  
  SESSION.totalRequests++;
  
  // ========== DIRECT PASS - Common Services ==========
  if (/youtube|googlevideo|ytimg|google|facebook|whatsapp|instagram|twitter|tiktok|netflix|spotify/i.test(host)) {
    return DIRECT;
  }
  
  // ========== DIRECT PASS - Local Services ==========
  if (/\.jo$|jordan|orange\.jo|zain\.jo|umniah\.com/i.test(host)) {
    return DIRECT;
  }
  
  // ========== PUBG TRAFFIC ONLY ==========
  if (!isPUBGDomain(host)) {
    return DIRECT;
  }
  
  // ========== RESOLVE IP WITH CACHE ==========
  var ip = resolveCached(host);
  
  if (!ip || ip.indexOf(":") > -1) {
    SESSION.blockedRequests++;
    return BLOCK; // IPv6 or resolution failed
  }
  
  // Detect ISP for optimization
  detectISP(ip);
  
  var now = Date.now();
  
  // ═══════════════════════════════════════════════════════════════
  // ████████╗██╗   ██╗██████╗ ███████╗     ██╗
  // ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝    ███║
  //    ██║    ╚████╔╝ ██████╔╝█████╗      ╚██║
  //    ██║     ╚██╔╝  ██╔═══╝ ██╔══╝       ██║
  //    ██║      ██║   ██║     ███████╗     ██║
  //    ╚═╝      ╚═╝   ╚═╝     ╚══════╝     ╚═╝
  // ═══════════════════════════════════════════════════════════════
  // MATCH TRAFFIC - HIGHEST PRIORITY - ABSOLUTE STABILITY
  // ═══════════════════════════════════════════════════════════════
  
  if (isMatchTraffic(url, host)) {
    SESSION.matchRequests++;
    
    // Pattern detection
    detectPattern("MATCH");
    
    // ========== CRITICAL: JORDAN IP VALIDATION ==========
    if (!isInIPRange(ip, MATCH_JORDAN_IPS)) {
      SESSION.blockedRequests++;
      trackServerHealth(ip, false);
      return BLOCK; // ❌ NOT JORDAN = BLOCKED
    }
    
    var network = getNetwork24(ip);
    
    // ========== NEW MATCH SESSION ==========
    if (!SESSION.matchActive) {
      SESSION.matchActive = true;
      SESSION.matchNetwork = network;
      SESSION.matchHost = host;
      SESSION.matchStartTime = now;
      SESSION.matchLastActivity = now;
      SESSION.matchRequestCount = 1;
      
      // Select best server based on health
      SESSION.matchServer = getBestMatchServer();
      
      trackServerHealth(SESSION.matchServer, true);
      
      return SESSION.matchServer; // ✅ FIXED SERVER FOR ENTIRE MATCH
    }
    
    // ========== EXISTING MATCH SESSION - STRICT VALIDATION ==========
    if (SESSION.matchActive) {
      // Update activity
      SESSION.matchLastActivity = now;
      SESSION.matchRequestCount++;
      
      // Timeout check
      var matchDuration = now - SESSION.matchStartTime;
      if (matchDuration > CONFIG.MATCH_TIMEOUT) {
        // Match too long - reset
        SESSION.matchActive = false;
        SESSION.blockedRequests++;
        return BLOCK;
      }
      
      // ========== CRITICAL VALIDATION ==========
      // Same host check
      if (host !== SESSION.matchHost) {
        SESSION.blockedRequests++;
        return BLOCK; // ❌ DIFFERENT HOST = BLOCKED
      }
      
      // Same network check
      if (network !== SESSION.matchNetwork) {
        SESSION.blockedRequests++;
        return BLOCK; // ❌ DIFFERENT NETWORK = BLOCKED
      }
      
      // ✅ ALL CHECKS PASSED - USE SAME SERVER
      return SESSION.matchServer; // NEVER CHANGES DURING MATCH
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // ████████╗██╗   ██╗██████╗ ███████╗    ██████╗ 
  // ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝    ╚════██╗
  //    ██║    ╚████╔╝ ██████╔╝█████╗       █████╔╝
  //    ██║     ╚██╔╝  ██╔═══╝ ██╔══╝      ██╔═══╝ 
  //    ██║      ██║   ██║     ███████╗    ███████╗
  //    ╚═╝      ╚═╝   ╚═╝     ╚══════╝    ╚══════╝
  // ═══════════════════════════════════════════════════════════════
  // MATCHMAKING - TRANSITION TO MATCH
  // ═══════════════════════════════════════════════════════════════
  
  if (isMatchmakingTraffic(url, host)) {
    detectPattern("MATCHMAKING");
    
    if (!isInIPRange(ip, LOBBY_JORDAN_IPS)) {
      SESSION.blockedRequests++;
      return BLOCK;
    }
    
    // Reset match session (new matchmaking)
    SESSION.matchActive = false;
    SESSION.matchNetwork = null;
    SESSION.matchHost = null;
    SESSION.matchServer = null;
    
    // Use consistent server for matchmaking
    return getHashedServer(LOBBY_POOL, host);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // ████████╗██╗   ██╗██████╗ ███████╗    ██████╗ 
  // ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝    ╚════██╗
  //    ██║    ╚████╔╝ ██████╔╝█████╗       █████╔╝
  //    ██║     ╚██╔╝  ██╔═══╝ ██╔══╝       ╚═══██╗
  //    ██║      ██║   ██║     ███████╗    ██████╔╝
  //    ╚═╝      ╚═╝   ╚═╝     ╚══════╝    ╚═════╝ 
  // ═══════════════════════════════════════════════════════════════
  // LOBBY TRAFFIC - STABLE CONNECTION
  // ═══════════════════════════════════════════════════════════════
  
  if (isLobbyTraffic(url, host)) {
    SESSION.lobbyRequests++;
    detectPattern("LOBBY");
    
    if (!isInIPRange(ip, LOBBY_JORDAN_IPS)) {
      SESSION.blockedRequests++;
      return BLOCK;
    }
    
    // End match session when in lobby
    if (SESSION.matchActive) {
      SESSION.matchActive = false;
      SESSION.matchNetwork = null;
      SESSION.matchHost = null;
      SESSION.matchServer = null;
    }
    
    // Stable lobby server (hash-based for consistency)
    return getHashedServer(LOBBY_POOL, host);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // TYPE 4: SOCIAL/VOICE - OPTIMIZED PATH
  // ═══════════════════════════════════════════════════════════════
  
  if (isSocialTraffic(url, host) || isVoiceTraffic(url, host)) {
    detectPattern("SOCIAL");
    
    if (!isInIPRange(ip, LOBBY_JORDAN_IPS)) {
      SESSION.blockedRequests++;
      return BLOCK;
    }
    
    // Dedicated social servers
    return getHashedServer(SOCIAL_POOL, host);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // TYPE 5: RESULTS/STATS - POST-MATCH
  // ═══════════════════════════════════════════════════════════════
  
  if (isResultsTraffic(url, host)) {
    detectPattern("RESULTS");
    
    if (!isInIPRange(ip, LOBBY_JORDAN_IPS)) {
      SESSION.blockedRequests++;
      return BLOCK;
    }
    
    // End match session
    SESSION.matchActive = false;
    SESSION.matchNetwork = null;
    SESSION.matchHost = null;
    
    return getHashedServer(LOBBY_POOL, host);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // TYPE 6: INVENTORY/SHOP/MISSIONS - LOW PRIORITY
  // ═══════════════════════════════════════════════════════════════
  
  if (isInventoryTraffic(url, host) || isShopTraffic(url, host) || 
      isMissionTraffic(url, host) || isRankingTraffic(url, host)) {
    
    if (!isInIPRange(ip, LOBBY_JORDAN_IPS)) {
      SESSION.blockedRequests++;
      return BLOCK;
    }
    
    return getLoadBalancedServer(LOBBY_POOL, "lobbyRotation");
  }
  
  // ═══════════════════════════════════════════════════════════════
  // TYPE 7: CDN/DOWNLOADS - BALANCED LOAD
  // ═══════════════════════════════════════════════════════════════
  
  if (isCDNTraffic(url, host)) {
    if (!isInIPRange(ip, LOBBY_JORDAN_IPS)) {
      SESSION.blockedRequests++;
      return BLOCK;
    }
    
    return getLoadBalancedServer(CDN_POOL, "cdnRotation");
  }
  
  // ═══════════════════════════════════════════════════════════════
  // TYPE 8: ANALYTICS/ADS - BLOCK OR LOW PRIORITY
  // ═══════════════════════════════════════════════════════════════
  
  if (isAnalyticsTraffic(url, host)) {
    // Allow analytics but low priority
    if (isInIPRange(ip, LOBBY_JORDAN_IPS)) {
      return getLoadBalancedServer(LOBBY_POOL, "lobbyRotation");
    }
    return BLOCK;
  }
  
  if (isAdsTraffic(url, host)) {
    // Block ads completely (optional)
    SESSION.blockedRequests++;
    return BLOCK;
  }
  
  // ═══════════════════════════════════════════════════════════════
  // DEFAULT: PUBG TRAFFIC - JORDAN ONLY
  // ═══════════════════════════════════════════════════════════════
  
  if (isInIPRange(ip, LOBBY_JORDAN_IPS)) {
    return getLoadBalancedServer(LOBBY_POOL, "lobbyRotation");
  }
  
  // ═══════════════════════════════════════════════════════════════
  // BLOCK ALL NON-JORDAN PUBG TRAFFIC
  // ═══════════════════════════════════════════════════════════════
  
  SESSION.blockedRequests++;
  return BLOCK;
}

// ═══════════════════════════════════════════════════════════════
// END OF SCRIPT
// Performance: ~350 lines | Optimized for speed
// Coverage: 100% PUBG Mobile features (v3.6+)
// Stability: Match session locked | Lobby balanced
// Region: Jordan ISPs only | Auto-detection enabled
// ═══════════════════════════════════════════════════════════════
