// ==================================================================================
// PUBG MOBILE - JORDAN FORCE ROUTING v4.0 ULTRA
// Maximum Jordan Players Concentration - DNS + Proxy Hybrid
// ==================================================================================

// ================= AGGRESSIVE CONFIGURATION =================
var CONFIG = {
  // JORDAN ONLY - Single powerful server
  MATCH_SERVER: "PROXY 46.185.131.218:20001",
  
  // Backup if main fails
  MATCH_BACKUP: "PROXY 212.35.66.45:8085",
  
  // Force everything through Jordan
  LOBBY_SERVER: "PROXY 46.185.131.218:443",
  
  // Block everything else
  BLOCK: "PROXY 127.0.0.1:9",
  DIRECT: "DIRECT",
  
  // Aggressive settings
  JORDAN_ONLY_MODE: true,      // Block ALL non-Jordan
  FORCE_REGION: "ME",           // Middle East region
  BLOCK_ASIA: true,             // Block Asia servers
  BLOCK_EUROPE: true,           // Block Europe servers
  ENABLE_LOGGING: true
};

// ================= JORDAN IPS (ULTRA COMPREHENSIVE) =================
var JORDAN_ALL_RANGES = [
  // Zain Jordan
  ["46.185.168.0", "255.255.248.0"],
  ["46.185.176.0", "255.255.248.0"],
  ["46.244.0.0", "255.255.0.0"],
  
  // Orange Jordan
  ["212.35.64.0", "255.255.248.0"],
  ["212.35.72.0", "255.255.248.0"],
  ["212.100.0.0", "255.255.0.0"],
  
  // Umniah
  ["92.241.32.0", "255.255.248.0"],
  ["92.241.40.0", "255.255.248.0"],
  
  // Premium & Fiber
  ["37.220.112.0", "255.255.248.0"],
  ["176.57.48.0", "255.255.248.0"],
  ["176.56.0.0", "255.254.0.0"],
  ["109.237.192.0", "255.255.248.0"],
  ["185.60.216.0", "255.255.252.0"],
  ["185.117.8.0", "255.255.252.0"],
  
  // Wide blocks
  ["188.161.0.0", "255.255.0.0"],
  ["195.229.0.0", "255.255.0.0"],
  
  // Mobile networks
  ["31.9.0.0", "255.255.0.0"],
  ["79.142.192.0", "255.255.192.0"],
  ["82.212.64.0", "255.255.192.0"],
  ["91.106.64.0", "255.255.192.0"],
  ["85.115.0.0", "255.255.0.0"],
  
  // Educational/Gov
  ["193.188.0.0", "255.255.0.0"],
  ["194.165.0.0", "255.255.0.0"]
];

// ================= BLOCKED REGIONS (Force Jordan only) =================
var BLOCKED_REGIONS = [
  // Asia servers
  ["13.228.0.0", "255.252.0.0"],        // Singapore AWS
  ["52.76.0.0", "255.252.0.0"],         // Singapore AWS
  ["54.169.0.0", "255.255.0.0"],        // Singapore AWS
  ["18.136.0.0", "255.252.0.0"],        // Singapore AWS
  
  // India servers
  ["13.126.0.0", "255.254.0.0"],        // Mumbai AWS
  ["13.232.0.0", "255.248.0.0"],        // Mumbai AWS
  
  // Hong Kong
  ["18.162.0.0", "255.254.0.0"],        // HK AWS
  ["47.52.0.0", "255.252.0.0"],         // Alibaba HK
  
  // Europe (if blocking enabled)
  ["18.194.0.0", "255.254.0.0"],        // Frankfurt
  ["18.156.0.0", "255.252.0.0"],        // Frankfurt
  
  // US servers (always block)
  ["54.183.0.0", "255.255.0.0"],        // US West
  ["52.8.0.0", "255.252.0.0"]           // US West
];

// ================= PUBG SERVER HOSTS (Known servers) =================
var KNOWN_SERVERS = {
  JORDAN: [
    "me.pubgmobile.com",
    "middle-east.pubgmobile.com",
    "dubai.pubgmobile.com",
    "qatar.pubgmobile.com"
  ],
  BLOCK: [
    "asia.pubgmobile.com",
    "sg.pubgmobile.com",
    "hk.pubgmobile.com",
    "india.pubgmobile.com",
    "eu.pubgmobile.com",
    "na.pubgmobile.com"
  ]
};

// ================= SESSION =================
var SESSION = {
  dnsCache: {},
  matchLocked: false,
  forcedRegion: "ME",
  blockedAttempts: 0
};

// ================= CORE FUNCTIONS =================

function log(msg) {
  if (CONFIG.ENABLE_LOGGING) {
    // Alert for debugging (remove in production)
    // alert("[PUBG-JO] " + msg);
  }
}

function normalizeHost(host) {
  var i = host.indexOf(":");
  return i > -1 ? host.substring(0, i) : host;
}

function isInNet(ip, network, mask) {
  // Built-in PAC function - just using it
  return isInNet(ip, network, mask);
}

function isInList(ip, list) {
  for (var i = 0; i < list.length; i++) {
    if (isInNet(ip, list[i][0], list[i][1])) {
      return true;
    }
  }
  return false;
}

function isJordanIP(ip) {
  return isInList(ip, JORDAN_ALL_RANGES);
}

function isBlockedRegion(ip) {
  if (!CONFIG.BLOCK_ASIA && !CONFIG.BLOCK_EUROPE) {
    return false;
  }
  return isInList(ip, BLOCKED_REGIONS);
}

function resolveHost(host) {
  if (SESSION.dnsCache[host]) {
    return SESSION.dnsCache[host];
  }
  
  var ip = dnsResolve(host);
  if (ip) {
    SESSION.dnsCache[host] = ip;
  }
  
  return ip;
}

// ================= DETECTION =================

function isPUBG(host) {
  return /pubg|tencent|krafton|lightspeed|proxima|intlgame|helpshift/i.test(host);
}

function isMatchServer(url, host) {
  var combined = (url + " " + host).toLowerCase();
  
  return /match|game|battle|royale|classic|rank|tdm|arena|session|gameplay/i.test(combined);
}

function isLobby(url, host) {
  var combined = (url + " " + host).toLowerCase();
  
  return /lobby|queue|dispatch|region|matchmaking|gateway/i.test(combined);
}

function isCDN(url, host) {
  return /cdn|asset|download|patch|update|cloudfront/i.test(url + host);
}

function isBlockedServerHost(host) {
  for (var i = 0; i < KNOWN_SERVERS.BLOCK.length; i++) {
    if (host.indexOf(KNOWN_SERVERS.BLOCK[i]) > -1) {
      return true;
    }
  }
  return false;
}

function isJordanServerHost(host) {
  for (var i = 0; i < KNOWN_SERVERS.JORDAN.length; i++) {
    if (host.indexOf(KNOWN_SERVERS.JORDAN[i]) > -1) {
      return true;
    }
  }
  return false;
}

// ================= MAIN PROXY FUNCTION =================

function FindProxyForURL(url, host) {
  
  host = normalizeHost(host.toLowerCase());
  
  // Allow non-PUBG traffic
  if (!isPUBG(host)) {
    return CONFIG.DIRECT;
  }
  
  // FORCE BLOCK known non-Jordan servers by hostname
  if (isBlockedServerHost(host)) {
    log("BLOCKED SERVER HOST: " + host);
    SESSION.blockedAttempts++;
    return CONFIG.BLOCK;
  }
  
  // Resolve IP
  var ip = resolveHost(host);
  
  // Block IPv6 or failed DNS
  if (!ip || ip.indexOf(":") > -1) {
    log("BLOCKED: Invalid IP for " + host);
    return CONFIG.BLOCK;
  }
  
  // AGGRESSIVE: Block known bad regions by IP
  if (isBlockedRegion(ip)) {
    log("BLOCKED REGION IP: " + ip + " for " + host);
    SESSION.blockedAttempts++;
    return CONFIG.BLOCK;
  }
  
  // ========= MATCH TRAFFIC =========
  if (isMatchServer(url, host)) {
    
    // STRICT: Only Jordan IPs allowed
    if (CONFIG.JORDAN_ONLY_MODE && !isJordanIP(ip)) {
      log("BLOCKED NON-JORDAN MATCH: " + ip);
      SESSION.blockedAttempts++;
      return CONFIG.BLOCK;
    }
    
    // Force Jordan server
    if (isJordanServerHost(host) || isJordanIP(ip)) {
      log("MATCH ALLOWED: " + host + " -> " + ip);
      SESSION.matchLocked = true;
      return CONFIG.MATCH_SERVER;
    }
    
    // Fallback: Try backup if looks safe
    if (isJordanIP(ip)) {
      return CONFIG.MATCH_BACKUP;
    }
    
    // Otherwise block
    log("BLOCKED UNKNOWN MATCH SERVER: " + host);
    return CONFIG.BLOCK;
  }
  
  // ========= LOBBY TRAFFIC =========
  if (isLobby(url, host)) {
    
    // Only Jordan for lobby
    if (CONFIG.JORDAN_ONLY_MODE && !isJordanIP(ip)) {
      log("BLOCKED NON-JORDAN LOBBY: " + ip);
      return CONFIG.BLOCK;
    }
    
    return CONFIG.LOBBY_SERVER;
  }
  
  // ========= CDN TRAFFIC =========
  if (isCDN(url, host)) {
    // CDN can go direct for speed
    return CONFIG.DIRECT;
  }
  
  // ========= DEFAULT =========
  
  // Jordan IPs: Allow through lobby
  if (isJordanIP(ip)) {
    return CONFIG.LOBBY_SERVER;
  }
  
  // AGGRESSIVE MODE: Block everything else
  if (CONFIG.JORDAN_ONLY_MODE) {
    log("BLOCKED DEFAULT: " + host + " (" + ip + ")");
    SESSION.blockedAttempts++;
    return CONFIG.BLOCK;
  }
  
  return CONFIG.DIRECT;
}

// ==================================================================================
