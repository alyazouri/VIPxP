// ================= BY . YAZOURI =================
// 1st ==> DNS 1.1.1.1 - 1.0.0.1
// 2nd ==> Reset ur ipad or iphone

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

var CDN_TIERS = {
  high: ["PROXY 212.35.66.45:8085"],
  medium: ["PROXY 212.35.66.45:8181", "PROXY 46.185.131.218:443"],
  low: ["PROXY 46.185.131.218:443"]
};

var BLOCK = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ================= JORDAN IP RANGES (OPTIMIZED & EXPANDED) =================
var MATCH_ALLOWED_IPV4 = [
  // Orange Jordan - الأكثر شيوعاً (أولوية قصوى)
  ["46.185.0.0","255.255.0.0"],
  ["212.35.0.0","255.255.0.0"],
  
  // Zain Jordan - ثاني أكبر مزود
  ["176.29.0.0","255.255.0.0"],
  ["176.28.0.0","255.254.0.0"],
  
  // Umniah - ثالث مزود
  ["82.212.0.0","255.254.0.0"],
  
  // Batelco Jordan
  ["94.249.0.0","255.255.0.0"],
  
  // Fiber Networks & Business
  ["149.200.0.0","255.255.0.0"],
  ["86.108.0.0","255.254.0.0"],
  ["92.253.0.0","255.255.0.0"],
  
  // Additional Jordan Ranges
  ["213.139.32.0","255.255.224.0"],
  ["212.118.0.0","255.255.224.0"],
  ["188.161.0.0","255.255.0.0"],
  ["185.107.0.0","255.255.0.0"],
  ["37.238.0.0","255.255.0.0"]
];

// ================= LOBBY/CDN ALLOWED (JORDAN + NEIGHBORS) =================
var LOBBY_ALLOWED_IPV4 = [
  
  // ===== JORDAN (نطاقات موسعة) =====
  ["46.185.0.0","255.255.0.0"],
  ["176.28.0.0","255.252.0.0"],
  ["176.29.0.0","255.255.0.0"],
  ["82.212.0.0","255.252.0.0"],
  ["94.249.0.0","255.255.0.0"],
  ["149.200.0.0","255.255.0.0"],
  ["86.108.0.0","255.254.0.0"],
  ["92.253.0.0","255.255.0.0"],
  ["212.35.0.0","255.255.0.0"],
  ["212.118.0.0","255.255.224.0"],
  ["213.139.32.0","255.255.224.0"],
  ["188.161.0.0","255.255.0.0"],
  ["185.107.0.0","255.255.0.0"],
  ["37.238.0.0","255.255.0.0"],
  
  // ===== SAUDI ARABIA =====
  ["5.42.0.0","255.254.0.0"],
  ["5.45.0.0","255.255.0.0"],
  ["31.56.0.0","255.248.0.0"],
  ["37.224.0.0","255.248.0.0"],
  ["46.151.0.0","255.255.0.0"],
  ["78.93.0.0","255.255.0.0"],
  ["86.51.0.0","255.255.0.0"],
  ["95.177.0.0","255.255.0.0"],
  ["178.86.0.0","255.254.0.0"],
  ["188.54.0.0","255.254.0.0"],
  ["213.130.0.0","255.255.0.0"],
  ["46.252.0.0","255.252.0.0"],
  
  // ===== LEBANON =====
  ["78.40.0.0","255.254.0.0"],
  ["89.108.0.0","255.252.0.0"],
  ["185.1.0.0","255.255.0.0"],
  ["185.22.0.0","255.255.0.0"],
  
  // ===== PALESTINE =====
  ["185.153.0.0","255.255.0.0"],
  ["185.244.0.0","255.255.0.0"],
  ["82.205.0.0","255.255.0.0"],
  
  // ===== UAE =====
  ["5.45.0.0","255.255.0.0"],
  ["31.192.0.0","255.248.0.0"],
  ["37.238.0.0","255.254.0.0"]
];

// ================= SESSION STATE =================
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

// ================= HELPER FUNCTIONS =================
function norm(h) {
  var i = h.indexOf(":");
  return i > -1 ? h.substring(0, i) : h;
}

function isInList(ip, list) {
  for (var i = 0; i < list.length; i++) {
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  }
  return false;
}

function resolvePinned(host) {
  var now = Date.now();
  
  if (SESSION.dnsCache[host]) {
    if ((now - SESSION.dnsCacheTime[host]) < CONFIG.DNS_CACHE_TTL) {
      return SESSION.dnsCache[host];
    }
  }
  
  var ip = dnsResolve(host);
  if (ip) {
    SESSION.dnsCache[host] = ip;
    SESSION.dnsCacheTime[host] = now;
  }
  
  return ip;
}

function pickLobbyProxy(host) {
  var totalWeight = 0;
  for (var i = 0; i < LOBBY_POOL.length; i++) {
    totalWeight += LOBBY_POOL[i].weight;
  }
  
  var hash = 0;
  for (var j = 0; j < host.length; j++) {
    hash = (hash * 31 + host.charCodeAt(j)) % totalWeight;
  }
  
  var cumulative = 0;
  for (var k = 0; k < LOBBY_POOL.length; k++) {
    cumulative += LOBBY_POOL[k].weight;
    if (hash < cumulative) {
      return LOBBY_POOL[k].proxy;
    }
  }
  
  return LOBBY_POOL[0].proxy;
}

function getCDNTier(url) {
  if (/\.(jpg|jpeg|png|gif|webp|ico|svg|css|js|json)$/i.test(url)) return "high";
  if (/small|thumb|icon|sprite/i.test(url)) return "high";
  
  if (/\.(mp4|avi|mov|zip|rar|pak|bundle|bin)$/i.test(url)) return "low";
  if (/large|full|hd|4k|download|patch/i.test(url)) return "low";
  
  return "medium";
}

// ================= DETECTION PATTERNS =================
function isPUBG(h) {
  return /pubg|pubgm|tencent|krafton|lightspeed|levelinfinite/i.test(h);
}

function isMatch(u, h) {
  return /match|battle|game|combat|realtime|sync|udp|tick|room/i.test(u + h);
}

function isLobby(u, h) {
  return /lobby|matchmaking|queue|dispatch|gateway|region|join|recruit/i.test(u + h);
}

function isSocial(u, h) {
  return /friend|invite|squad|team|party|clan|presence|social/i.test(u + h);
}

function isCDN(u, h) {
  return /cdn|asset|resource|patch|update|media|content/i.test(u + h);
}

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
  
  if (prefix === "46.185" || prefix === "212.35") {
    SESSION.activeCluster = "JO-Orange";
    return MATCH_SERVERS.primary.proxy;
  }
  
  if (prefix === "176.29" || prefix === "176.28") {
    SESSION.activeCluster = "JO-Zain";
    return MATCH_SERVERS.secondary.proxy;
  }
  
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

// 6. Blacklist Check
function isBlacklisted(ip) {
  var now = Date.now();
  if (SESSION.blacklistTemp[ip]) {
    if (now - SESSION.blacklistTemp[ip] < 600000) {
      return true;
    }
    delete SESSION.blacklistTemp[ip];
  }
  return false;
}

// ================= MAIN FUNCTION =================
function FindProxyForURL(url, host) {
  host = norm(host.toLowerCase());
  
  // Direct for non-PUBG
  if (!isPUBG(host)) return DIRECT;
  
  // Apply time-based config
  applyTimeBasedConfig();
  
  // Resolve IP with caching
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
      
      // Select best server
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
  
  // Default deny
  return BLOCK;
}
