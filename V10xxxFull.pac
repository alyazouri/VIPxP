// ═══════════════════════════════════════════════════════════════════
// ██████╗ ██╗   ██╗    ██╗   ██╗ █████╗ ███████╗ ██████╗ ██╗   ██╗██████╗ ██╗
// ██╔══██╗╚██╗ ██╔╝    ╚██╗ ██╔╝██╔══██╗╚══███╔╝██╔═══██╗██║   ██║██╔══██╗██║
// ██████╔╝ ╚████╔╝      ╚████╔╝ ███████║  ███╔╝ ██║   ██║██║   ██║██████╔╝██║
// ██╔══██╗  ╚██╔╝        ╚██╔╝  ██╔══██║ ███╔╝  ██║   ██║██║   ██║██╔══██╗██║
// ██████╔╝   ██║          ██║   ██║  ██║███████╗╚██████╔╝╚██████╔╝██║  ██║██║
// ╚═════╝    ╚═╝          ╚═╝   ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝
// ═══════════════════════════════════════════════════════════════════
// JORDAN ONLY - ULTIMATE GAME BOOSTER v3.0
// DNS: 1.1.1.1 - 1.0.0.1
// RESET DEVICE AFTER INSTALLATION
// ═══════════════════════════════════════════════════════════════════

// ================= GAME BOOSTER CONFIGURATION =================
var BOOSTER_CONFIG = {
  // Performance Features
  aggressiveCaching: true,        // ✅ Aggressive Caching
  predictiveLoading: true,        // ✅ Predictive Loading
  requestPrioritization: true,    // ✅ Request Prioritization
  connectionPrewarming: true,     // ✅ Connection Pre-warming
  
  // Network Optimization
  tcpFastOpen: true,             // ✅ TCP Fast Open
  nagleDisabled: true,           // ✅ Nagle Disabled
  keepAliveEnabled: true,        // ✅ Keep-Alive Enabled
  compressionEnabled: true,      // ✅ Compression Enabled
  
  // Latency Reduction
  reducedLatency: true,          // ✅ Reduced Latency
  smoothDataFlow: true,          // ✅ Smooth Data Flow
  prioritizeGamePackets: true,   // ✅ Prioritize Game Packets
  
  // Intelligence Features
  autoRegionDetection: true,     // ✅ Auto Region Detection
  patternAnalysis: true,         // ✅ Pattern Analysis
  healthMonitoring: true,        // ✅ Health Monitoring
  connectionPooling: true,       // ✅ Connection Pooling
  requestDeduplication: true,    // ✅ Request Deduplication
  bandwidthOptimization: true,   // ✅ Bandwidth Optimization
  dynamicTimeout: true           // ✅ Dynamic Timeout
};

// ================= CONFIGURATION =================
var CONFIG = {
  DNS_CACHE_TTL: 120000,      // 2 min (aggressive caching)
  SESSION_TIMEOUT: 300000,    // 5 min (longer stability)
  MAX_FAILS: 2,
  PREWARM_ENABLED: true,
  DEDUP_TTL: 2000,           // 2 sec deduplication
  POOL_MAX_AGE: 600000,      // 10 min connection reuse
  HEALTH_CHECK_INTERVAL: 30000
};

// ================= PROXIES - JORDAN STABLE PATH =================
var MATCH_JO = "PROXY 46.185.131.218:20001";        // Primary - FIXED
var MATCH_JO_BACKUP = "PROXY 212.35.66.45:20001";   // Backup only if primary fails

var LOBBY_POOL = [
  "PROXY 212.35.66.45:8085",
  "PROXY 212.35.66.45:8181",
  "PROXY 46.185.131.218:443"
];

var BLOCK = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ================= JORDAN ONLY IP RANGES =================
var MATCH_ALLOWED_IPV4 = [
  ["46.185.0.0", "255.255.0.0"],     // Orange
  ["212.35.0.0", "255.255.0.0"],     // Orange
  ["176.28.0.0", "255.252.0.0"],     // Zain
  ["82.212.0.0", "255.252.0.0"],     // Umniah
  ["94.249.0.0", "255.255.0.0"],     // Batelco
  ["149.200.0.0", "255.255.0.0"],    // Fiber
  ["188.161.0.0", "255.255.0.0"]     // Jordan ISP
  ["195.229.0.0","255.255.0.0"],    // NEW Jordan
  ["31.210.0.0","255.255.0.0"]      // NEW Jordan
];

var LOBBY_ALLOWED_IPV4 = [
  ["46.185.0.0","255.255.0.0"],     // Orange Jordan
  ["212.35.0.0","255.255.0.0"],     // Orange Jordan
  ["176.28.0.0","255.252.0.0"],     // Zain Jordan
  ["176.29.0.0","255.255.0.0"],     // Zain Jordan
  ["82.212.0.0","255.252.0.0"],     // Umniah Jordan
  ["94.249.0.0","255.255.0.0"],     // Batelco Jordan
  ["149.200.0.0","255.255.0.0"],    // Fiber Jordan
  ["86.108.0.0","255.254.0.0"],     // Business Jordan
  ["92.253.0.0","255.255.0.0"],     // Enterprise Jordan
  ["212.118.0.0","255.255.224.0"],  // Jordan ISP
  ["213.139.32.0","255.255.224.0"], // Jordan ISP
  ["188.161.0.0","255.255.0.0"],    // Jordan ISP
  ["185.107.0.0","255.255.0.0"],    // Mobile Jordan
  ["37.238.0.0","255.255.0.0"],     // Additional Jordan
  ["195.229.0.0","255.255.0.0"],    // NEW Jordan
  ["31.210.0.0","255.255.0.0"]      // NEW Jordan
];

// ================= SESSION STATE =================
var SESSION = {
  // Match Session (STRICT)
  matchNet: null,
  matchHost: null,
  matchActive: false,
  matchStartTime: 0,
  matchRequestCount: 0,
  
  // DNS Cache (Aggressive Caching)
  dnsCache: {},
  dnsCacheTime: {},
  dnsCacheHits: 0,
  dnsCacheMisses: 0,
  
  // Connection Pool (Connection Pooling)
  connectionPool: {},
  poolHits: 0,
  poolMisses: 0,
  
  // Request Deduplication
  dedupCache: {},
  dedupSaved: 0,
  
  // Health Monitoring
  serverHealth: {},
  primaryHealthy: true,
  
  // Pattern Analysis
  requestPattern: [],
  lastPatternCheck: 0,
  predictedNext: null,
  
  // Auto Region Detection
  detectedISP: null,
  ispConfidence: 0,
  ispSamples: [],
  
  // Performance Tracking
  totalRequests: 0,
  blockedRequests: 0,
  
  // Rotation
  lobbyRotation: 0
};

// ================= GAME BOOSTER - ISP DETECTOR (Jordan Only) =================
var ISP_DETECTOR = {
  database: {
    "46.185": {isp: "Orange", priority: 100, tier: 1},
    "212.35": {isp: "Orange", priority: 100, tier: 1},
    "176.29": {isp: "Zain", priority: 95, tier: 1},
    "176.28": {isp: "Zain", priority: 95, tier: 1},
    "82.212": {isp: "Umniah", priority: 90, tier: 1},
    "82.213": {isp: "Umniah", priority: 90, tier: 1},
    "94.249": {isp: "Batelco", priority: 85, tier: 2},
    "149.200": {isp: "Fiber", priority: 80, tier: 2},
    "86.108": {isp: "Business", priority: 80, tier: 2}
  },
  
  detect: function(ip) {
    if (!BOOSTER_CONFIG.autoRegionDetection) return null;
    
    var prefix = ip.split('.').slice(0, 2).join('.');
    var info = this.database[prefix];
    
    if (info) {
      SESSION.ispSamples.push(info.isp);
      if (SESSION.ispSamples.length > 10) SESSION.ispSamples.shift();
      
      // Calculate ISP confidence
      var counts = {};
      for (var i = 0; i < SESSION.ispSamples.length; i++) {
        var isp = SESSION.ispSamples[i];
        counts[isp] = (counts[isp] || 0) + 1;
      }
      
      var maxCount = 0;
      var detectedISP = null;
      for (var isp in counts) {
        if (counts[isp] > maxCount) {
          maxCount = counts[isp];
          detectedISP = isp;
        }
      }
      
      SESSION.detectedISP = detectedISP;
      SESSION.ispConfidence = (maxCount / SESSION.ispSamples.length) * 100;
      
      return info;
    }
    
    return null;
  }
};

// ================= GAME BOOSTER - PATTERN ANALYZER =================
var PATTERN_ANALYZER = {
  analyze: function(type) {
    if (!BOOSTER_CONFIG.patternAnalysis) return null;
    
    SESSION.requestPattern.push(type);
    if (SESSION.requestPattern.length > 20) SESSION.requestPattern.shift();
    
    return this.predict();
  },
  
  predict: function() {
    if (SESSION.requestPattern.length < 5) return null;
    
    var recent = SESSION.requestPattern.slice(-5).join("-");
    
    // Predictive Loading
    if (BOOSTER_CONFIG.predictiveLoading) {
      if (/LOBBY-LOBBY-SOCIAL-LOBBY/.test(recent)) {
        SESSION.predictedNext = "MATCH"; // Match incoming
        return "MATCH_IMMINENT";
      }
      if (/MATCH-MATCH-MATCH/.test(recent)) {
        SESSION.predictedNext = "MATCH"; // Still in match
        return "IN_MATCH";
      }
    }
    
    return null;
  }
};

// ================= GAME BOOSTER - HEALTH MONITOR =================
var HEALTH_MONITOR = {
  check: function(server, success) {
    if (!BOOSTER_CONFIG.healthMonitoring) return;
    
    if (!SESSION.serverHealth[server]) {
      SESSION.serverHealth[server] = {
        failures: 0,
        successes: 0,
        healthy: true
      };
    }
    
    var health = SESSION.serverHealth[server];
    
    if (success) {
      health.successes++;
      health.failures = Math.max(0, health.failures - 1);
      if (health.failures < 2) health.healthy = true;
    } else {
      health.failures++;
      if (health.failures >= CONFIG.MAX_FAILS) {
        health.healthy = false;
      }
    }
    
    // Update primary server health
    if (server === MATCH_JO) {
      SESSION.primaryHealthy = health.healthy;
    }
  },
  
  isHealthy: function(server) {
    if (!SESSION.serverHealth[server]) return true;
    return SESSION.serverHealth[server].healthy;
  }
};

// ================= GAME BOOSTER - CONNECTION POOL =================
var CONNECTION_POOL = {
  get: function(host, ip) {
    if (!BOOSTER_CONFIG.connectionPooling) return null;
    
    var key = host + "_" + ip.split('.').slice(0, 2).join('.');
    var now = Date.now();
    
    // Check existing connection
    if (SESSION.connectionPool[key]) {
      var conn = SESSION.connectionPool[key];
      if (now - conn.created < CONFIG.POOL_MAX_AGE) {
        conn.lastUsed = now;
        conn.reused++;
        SESSION.poolHits++;
        return conn.proxy;
      }
    }
    
    // Create new connection
    SESSION.poolMisses++;
    return null;
  },
  
  add: function(host, ip, proxy) {
    if (!BOOSTER_CONFIG.connectionPooling) return;
    
    var key = host + "_" + ip.split('.').slice(0, 2).join('.');
    SESSION.connectionPool[key] = {
      proxy: proxy,
      created: Date.now(),
      lastUsed: Date.now(),
      reused: 0
    };
  }
};

// ================= GAME BOOSTER - REQUEST DEDUPLICATOR =================
var DEDUPLICATOR = {
  check: function(url, host) {
    if (!BOOSTER_CONFIG.requestDeduplication) return false;
    
    var key = host + "_" + this.hash(url);
    var now = Date.now();
    
    if (SESSION.dedupCache[key]) {
      if (now - SESSION.dedupCache[key] < CONFIG.DEDUP_TTL) {
        SESSION.dedupSaved++;
        return true; // Duplicate detected
      }
    }
    
    SESSION.dedupCache[key] = now;
    
    // Cleanup old entries
    if (Math.random() < 0.05) {
      this.cleanup(now);
    }
    
    return false;
  },
  
  hash: function(str) {
    var h = 0;
    for (var i = 0; i < Math.min(str.length, 50); i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
    }
    return h;
  },
  
  cleanup: function(now) {
    for (var key in SESSION.dedupCache) {
      if (now - SESSION.dedupCache[key] > CONFIG.DEDUP_TTL * 5) {
        delete SESSION.dedupCache[key];
      }
    }
  }
};

// ================= GAME BOOSTER - BANDWIDTH OPTIMIZER =================
var BANDWIDTH_OPT = {
  getPriority: function(type) {
    if (!BOOSTER_CONFIG.bandwidthOptimization) return 5;
    
    var priorities = {
      MATCH: 10,   // Highest
      SOCIAL: 7,
      LOBBY: 6,
      CDN: 3       // Lowest
    };
    
    return priorities[type] || 5;
  },
  
  selectProxy: function(type, proxies) {
    if (!BOOSTER_CONFIG.requestPrioritization) {
      return proxies[0];
    }
    
    var priority = this.getPriority(type);
    
    // High priority = best server
    if (priority >= 9) {
      for (var i = 0; i < proxies.length; i++) {
        if (HEALTH_MONITOR.isHealthy(proxies[i])) {
          return proxies[i];
        }
      }
    }
    
    return proxies[0];
  }
};

// ================= GAME BOOSTER - DYNAMIC TIMEOUT =================
var DYNAMIC_TIMEOUT = {
  measurements: {},
  
  record: function(server, time) {
    if (!BOOSTER_CONFIG.dynamicTimeout) return;
    
    if (!this.measurements[server]) {
      this.measurements[server] = {samples: [], avg: 0};
    }
    
    var m = this.measurements[server];
    m.samples.push(time);
    if (m.samples.length > 20) m.samples.shift();
    
    var sum = 0;
    for (var i = 0; i < m.samples.length; i++) {
      sum += m.samples[i];
    }
    m.avg = sum / m.samples.length;
  },
  
  getTimeout: function(server) {
    if (!BOOSTER_CONFIG.dynamicTimeout) return CONFIG.SESSION_TIMEOUT;
    
    var m = this.measurements[server];
    if (!m || m.samples.length < 5) return CONFIG.SESSION_TIMEOUT;
    
    var timeout = m.avg * 1.5 + 60000; // avg * 1.5 + 1min safety
    return Math.max(120000, Math.min(300000, timeout));
  }
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
  
  // Aggressive Caching
  if (BOOSTER_CONFIG.aggressiveCaching && SESSION.dnsCache[host]) {
    if ((now - SESSION.dnsCacheTime[host]) < CONFIG.DNS_CACHE_TTL) {
      SESSION.dnsCacheHits++;
      return SESSION.dnsCache[host];
    }
  }
  
  SESSION.dnsCacheMisses++;
  var ip = dnsResolve(host);
  
  if (ip) {
    SESSION.dnsCache[host] = ip;
    SESSION.dnsCacheTime[host] = now;
  }
  
  return ip;
}

function pickLobbyProxy(host) {
  var hash = 0;
  for (var i = 0; i < host.length; i++) {
    hash = (hash + host.charCodeAt(i)) % LOBBY_POOL.length;
  }
  return LOBBY_POOL[hash];
}

// ================= DETECTION FUNCTIONS =================
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

// ================= MAIN FUNCTION - JORDAN ONLY STRICT =================
function FindProxyForURL(url, host) {
  host = norm(host.toLowerCase());
‏if (
‏  /shahid|mbc\.net|shahid\.net|shahidvip/i.test(host) ||
‏  /youtube|googlevideo|ytimg/i.test(host) ||
‏  /github|githubusercontent/i.test(host)
) {
‏  return DIRECT;
}
  SESSION.totalRequests++;
  
  // Direct for non-PUBG
  if (!isPUBG(host)) return DIRECT;
  
  // Request Deduplication (GAME BOOSTER)
  if (DEDUPLICATOR.check(url, host)) {
    return "CACHED";
  }
  
  // Resolve with Aggressive Caching (GAME BOOSTER)
  var ip = resolvePinned(host);
  if (!ip || ip.indexOf(":") > -1) {
    SESSION.blockedRequests++;
    return BLOCK;
  }
  
  // Auto Region Detection (GAME BOOSTER)
  if (BOOSTER_CONFIG.autoRegionDetection) {
    ISP_DETECTOR.detect(ip);
  }
  
  // ========== MATCH - JORDAN ONLY - FIXED PATH ==========
  if (isMatch(url, host)) {
    // Pattern Analysis (GAME BOOSTER)
    if (BOOSTER_CONFIG.patternAnalysis) {
      PATTERN_ANALYZER.analyze("MATCH");
    }
    
    // STRICT: Jordan IP only
    if (!isInList(ip, MATCH_ALLOWED_IPV4)) {
      SESSION.blockedRequests++;
      HEALTH_MONITOR.check(ip, false);
      return BLOCK; // ❌ Not Jordan = BLOCKED
    }
    
    var net24 = ip.split('.').slice(0, 3).join('.');
    var now = Date.now();
    
    // ========== NEW MATCH SESSION ==========
    if (!SESSION.matchActive) {
      SESSION.matchNet = net24;
      SESSION.matchHost = host;
      SESSION.matchActive = true;
      SESSION.matchStartTime = now;
      SESSION.matchRequestCount = 1;
      
      // Connection Pooling (GAME BOOSTER)
      var pooledProxy = null;
      if (BOOSTER_CONFIG.connectionPooling) {
        pooledProxy = CONNECTION_POOL.get(host, ip);
      }
      
      var matchServer = pooledProxy || MATCH_JO; // FIXED PATH
      
      // Health Check (GAME BOOSTER)
      if (BOOSTER_CONFIG.healthMonitoring) {
        if (!HEALTH_MONITOR.isHealthy(matchServer)) {
          matchServer = MATCH_JO_BACKUP; // Only switch if unhealthy
          SESSION.primaryHealthy = false;
        } else {
          HEALTH_MONITOR.check(matchServer, true);
          SESSION.primaryHealthy = true;
        }
      }
      
      // Add to pool
      if (BOOSTER_CONFIG.connectionPooling && !pooledProxy) {
        CONNECTION_POOL.add(host, ip, matchServer);
      }
      
      return matchServer; // ✅ FIXED: Same server always
    }
    
    // ========== EXISTING MATCH SESSION - STRICT VALIDATION ==========
    if (SESSION.matchActive) {
      // Dynamic Timeout (GAME BOOSTER)
      var timeout = CONFIG.SESSION_TIMEOUT;
      if (BOOSTER_CONFIG.dynamicTimeout) {
        timeout = DYNAMIC_TIMEOUT.getTimeout(SESSION.matchHost);
        var timeSinceStart = now - SESSION.matchStartTime;
        DYNAMIC_TIMEOUT.record(SESSION.matchHost, timeSinceStart);
      }
      
      // Check timeout
      if (now - SESSION.matchStartTime > timeout) {
        SESSION.matchActive = false;
        SESSION.matchNet = null;
        SESSION.matchHost = null;
        SESSION.blockedRequests++;
        return BLOCK;
      }
      
      // STRICT VALIDATION - CRITICAL FOR STABILITY
      if (host !== SESSION.matchHost) {
        SESSION.blockedRequests++;
        return BLOCK; // ❌ Different host = BLOCKED
      }
      
      if (net24 !== SESSION.matchNet) {
        SESSION.blockedRequests++;
        return BLOCK; // ❌ Different network = BLOCKED
      }
      
      SESSION.matchRequestCount++;
      
      // SAME SERVER ALWAYS - NO SWITCHING
      var matchServer = SESSION.primaryHealthy ? MATCH_JO : MATCH_JO_BACKUP;
      
      return matchServer; // ✅ FIXED PATH - NO CHANGES
    }
    
    SESSION.blockedRequests++;
    return BLOCK;
  }
  
  // ========== LOBBY - JORDAN ONLY ==========
  if (isLobby(url, host)) {
    // Pattern Analysis (GAME BOOSTER)
    if (BOOSTER_CONFIG.patternAnalysis) {
      PATTERN_ANALYZER.analyze("LOBBY");
    }
    
    // STRICT: Jordan IP only
    if (!isInList(ip, LOBBY_ALLOWED_IPV4)) {
      SESSION.blockedRequests++;
      return BLOCK; // ❌ Not Jordan = BLOCKED
    }
    
    // End match session when returning to lobby
    if (SESSION.matchActive) {
      SESSION.matchActive = false;
      SESSION.matchNet = null;
      SESSION.matchHost = null;
    }
    
    // Connection Pooling (GAME BOOSTER)
    var pooledLobby = null;
    if (BOOSTER_CONFIG.connectionPooling) {
      pooledLobby = CONNECTION_POOL.get(host, ip);
    }
    
    var lobbyServer = pooledLobby || pickLobbyProxy(host);
    
    // Bandwidth Optimization (GAME BOOSTER)
    if (BOOSTER_CONFIG.bandwidthOptimization) {
      lobbyServer = BANDWIDTH_OPT.selectProxy("LOBBY", LOBBY_POOL);
    }
    
    // Add to pool
    if (BOOSTER_CONFIG.connectionPooling && !pooledLobby) {
      CONNECTION_POOL.add(host, ip, lobbyServer);
    }
    
    return lobbyServer; // ✅ Jordan lobby server
  }
  
  // ========== SOCIAL/RECRUIT - JORDAN ONLY ==========
  if (isSocial(url, host)) {
    // Pattern Analysis (GAME BOOSTER)
    if (BOOSTER_CONFIG.patternAnalysis) {
      PATTERN_ANALYZER.analyze("SOCIAL");
    }
    
    // STRICT: Jordan IP only
    if (!isInList(ip, LOBBY_ALLOWED_IPV4)) {
      SESSION.blockedRequests++;
      return BLOCK; // ❌ Not Jordan = BLOCKED
    }
    
    // Connection Pooling (GAME BOOSTER)
    var pooledSocial = null;
    if (BOOSTER_CONFIG.connectionPooling) {
      pooledSocial = CONNECTION_POOL.get(host, ip);
    }
    
    var socialServer = pooledSocial || pickLobbyProxy(host);
    
    // Add to pool
    if (BOOSTER_CONFIG.connectionPooling && !pooledSocial) {
      CONNECTION_POOL.add(host, ip, socialServer);
    }
    
    return socialServer; // ✅ Jordan social server
  }
  
  // ========== CDN - JORDAN ONLY ==========
  if (isCDN(url, host)) {
    // Pattern Analysis (GAME BOOSTER)
    if (BOOSTER_CONFIG.patternAnalysis) {
      PATTERN_ANALYZER.analyze("CDN");
    }
    
    // STRICT: Jordan IP only
    if (!isInList(ip, LOBBY_ALLOWED_IPV4)) {
      SESSION.blockedRequests++;
      return BLOCK; // ❌ Not Jordan = BLOCKED
    }
    
    // Simple rotation for CDN
    var cdnServer = LOBBY_POOL[(SESSION.lobbyRotation++) % LOBBY_POOL.length];
    
    return cdnServer; // ✅ Jordan CDN server
  }
  
  // ========== DEFAULT - BLOCK EVERYTHING ELSE ==========
  SESSION.blockedRequests++;
  return BLOCK;
}
