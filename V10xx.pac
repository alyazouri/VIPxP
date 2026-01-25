// BY . YAZOURI
//1st ==> DNS 1.1.1.1 - 1.0.0.1
//2nd ==> Reset ur ipad or iphone
// ================= ADVANCED CONFIGURATION =================
var CONFIG = {
  DNS_CACHE_TTL: 300000,
  SESSION_TIMEOUT: 180000,
  MAX_FAILS: 2,
  ENABLE_FALLBACK: true,
  ENABLE_ADAPTIVE: true,
  ENABLE_MULTIPATH: true,
  ENABLE_CLUSTERING: true,
  ENABLE_PREDICTIVE: true,
  ENABLE_GEO_OPTIMIZE: true,
  ENABLE_TIME_ROUTING: true
};

// ================= PROXIES WITH GEOGRAPHIC INFO =================
var MATCH_SERVERS = {
  primary: {
    proxy: "PROXY 46.185.131.218:20001",
    location: {lat: 31.9454, lon: 35.9284, city: "Amman"},
    cluster: "JO-Orange"
  },
  secondary: {
    proxy: "PROXY 212.35.66.45:20001",
    location: {lat: 31.9522, lon: 35.9330, city: "Amman"},
    cluster: "JO-Zain"
  },
  backup: {
    proxy: "PROXY 212.35.66.45:8085",
    location: {lat: 31.9522, lon: 35.9330, city: "Amman"},
    cluster: "JO-Other"
  }
};

var LOBBY_POOL = [
  {proxy: "PROXY 212.35.66.45:8085", weight: 5, priority: 1, performance: 100},
  {proxy: "PROXY 212.35.66.45:8181", weight: 3, priority: 2, performance: 100},
  {proxy: "PROXY 46.185.131.218:443", weight: 4, priority: 1, performance: 100}
];

// ... [باقي نطاقات IP كما هي] ...

// ================= ENHANCED SESSION STATE =================
var SESSION = {
  // Match
  matchNet: null,
  matchHost: null,
  matchSessions: {},
  
  // DNS
  dnsCache: {},
  dnsCacheTime: {},
  
  // Performance tracking
  proxyPerformance: {},
  pathFailures: 0,
  lastPathSwitch: 0,
  currentPath: "primary",
  
  // Connection pooling
  connectionPool: {},
  
  // Patterns
  patterns: {},
  
  // Blacklist
  blacklistTemp: {},
  
  // Clustering
  activeCluster: null,
  
  // Rotation
  lobbyRotation: 0
};

// ================= INTELLIGENT FUNCTIONS =================

// 1. Adaptive Proxy Selection
function pickAdaptiveLobbyProxy(host) {
  if (!CONFIG.ENABLE_ADAPTIVE) return pickLobbyProxy(host);
  
  var bestProxy = null;
  var bestScore = -1;
  
  for (var i = 0; i < LOBBY_POOL.length; i++) {
    var pool = LOBBY_POOL[i];
    var perf = SESSION.proxyPerformance[pool.proxy] || {score: 100};
    var score = (perf.score * pool.weight * pool.priority) / 10;
    
    if (score > bestScore) {
      bestScore = score;
      bestProxy = pool.proxy;
    }
  }
  
  return bestProxy || LOBBY_POOL[0].proxy;
}

// 2. Time-Based Configuration
function applyTimeBasedConfig() {
  if (!CONFIG.ENABLE_TIME_ROUTING) return;
  
  var hour = new Date().getHours();
  var isPeak = hour >= 16 && hour <= 23;
  
  CONFIG.SESSION_TIMEOUT = isPeak ? 240000 : 180000;
  CONFIG.DNS_CACHE_TTL = isPeak ? 180000 : 600000;
}

// 3. Geographic Optimization
function getGeoOptimizedServer(ip) {
  if (!CONFIG.ENABLE_GEO_OPTIMIZE) return MATCH_SERVERS.primary.proxy;
  
  var prefix = ip.split('.').slice(0, 2).join('.');
  
  // Orange/Zain priority
  if (prefix === "46.185" || prefix === "212.35") {
    return MATCH_SERVERS.primary.proxy;
  }
  if (prefix === "176.29" || prefix === "176.28") {
    return MATCH_SERVERS.secondary.proxy;
  }
  
  return MATCH_SERVERS.primary.proxy;
}

// 4. Cluster-Based Routing
function getClusterServer(ip) {
  if (!CONFIG.ENABLE_CLUSTERING) return MATCH_SERVERS.primary.proxy;
  
  var prefix = ip.split('.').slice(0, 2).join('.');
  
  // JO-Orange cluster
  if (prefix === "46.185" || prefix === "212.35") {
    SESSION.activeCluster = "JO-Orange";
    return MATCH_SERVERS.primary.proxy;
  }
  
  // JO-Zain cluster
  if (prefix === "176.29" || prefix === "176.28") {
    SESSION.activeCluster = "JO-Zain";
    return MATCH_SERVERS.secondary.proxy;
  }
  
  // JO-Other cluster
  SESSION.activeCluster = "JO-Other";
  return MATCH_SERVERS.backup.proxy;
}

// 5. Multi-Path Failover
function getMultiPathServer() {
  if (!CONFIG.ENABLE_MULTIPATH) return MATCH_SERVERS.primary.proxy;
  
  if (SESSION.pathFailures >= 3) {
    var now = Date.now();
    if (now - SESSION.lastPathSwitch > 60000) {
      SESSION.currentPath = SESSION.currentPath === "primary" ? "secondary" : "primary";
      SESSION.pathFailures = 0;
      SESSION.lastPathSwitch = now;
    }
  }
  
  return MATCH_SERVERS[SESSION.currentPath].proxy;
}

// ================= MAIN FUNCTION (ENHANCED) =================
function FindProxyForURL(url, host) {
  host = norm(host.toLowerCase());
  
  if (!isPUBG(host)) return DIRECT;
  
  // Apply time-based config
  applyTimeBasedConfig();
  
  var ip = resolvePinned(host);
  if (!ip || ip.indexOf(":") > -1) return BLOCK;
  
  // Check blacklist
  if (isBlacklisted(ip)) return BLOCK;
  
  // ========== MATCH SERVER (INTELLIGENT ROUTING) ==========
  if (isMatch(url, host)) {
    if (!isInList(ip, MATCH_ALLOWED_IPV4)) return BLOCK;
    
    var net24 = ip.split('.').slice(0, 3).join('.');
    var sessionKey = host + "_" + net24;
    var now = Date.now();
    
    // New session
    if (!SESSION.matchNet) {
      SESSION.matchNet = net24;
      SESSION.matchHost = host;
      SESSION.matchSessions[sessionKey] = {
        created: now,
        lastUsed: now,
        count: 1
      };
      
      // Select best server based on multiple factors
      var server = MATCH_SERVERS.primary.proxy;
      
      if (CONFIG.ENABLE_GEO_OPTIMIZE) {
        server = getGeoOptimizedServer(ip);
      } else if (CONFIG.ENABLE_CLUSTERING) {
        server = getClusterServer(ip);
      } else if (CONFIG.ENABLE_MULTIPATH) {
        server = getMultiPathServer();
      }
      
      return server;
    }
    
    // Validate existing session
    if (SESSION.matchSessions[sessionKey]) {
      var session = SESSION.matchSessions[sessionKey];
      
      if (now - session.lastUsed > CONFIG.SESSION_TIMEOUT) {
        delete SESSION.matchSessions[sessionKey];
        SESSION.matchNet = null;
        SESSION.matchHost = null;
        return BLOCK;
      }
      
      session.lastUsed = now;
      session.count++;
      
      if (host !== SESSION.matchHost || net24 !== SESSION.matchNet) {
        return BLOCK;
      }
      
      // Return clustered server
      return getClusterServer(ip);
    }
    
    return BLOCK;
  }
  
  // ========== LOBBY (ADAPTIVE SELECTION) ==========
  if (isLobby(url, host)) {
    if (!isInList(ip, LOBBY_ALLOWED_IPV4)) return BLOCK;
    
    if (CONFIG.ENABLE_ADAPTIVE) {
      return pickAdaptiveLobbyProxy(host);
    }
    return pickLobbyProxy(host);
  }
  
  // ========== SOCIAL ==========
  if (isSocial(url, host)) {
    if (!isInList(ip, LOBBY_ALLOWED_IPV4)) return BLOCK;
    return pickAdaptiveLobbyProxy(host);
  }
  
  // ========== CDN (TIERED) ==========
  if (isCDN(url, host)) {
    if (!isInList(ip, LOBBY_ALLOWED_IPV4)) return BLOCK;
    
    var tier = getCDNTier(url);
    var pool = CDN_TIERS[tier];
    var index = (SESSION.lobbyRotation++) % pool.length;
    return pool[index];
  }
  
  return BLOCK;
}

// Helper function for blacklist check
function isBlacklisted(ip) {
  var now = Date.now();
  if (SESSION.blacklistTemp[ip]) {
    if (now - SESSION.blacklistTemp[ip] < 600000) { // 10 min
      return true;
    }
    delete SESSION.blacklistTemp[ip];
  }
  return false;
}
