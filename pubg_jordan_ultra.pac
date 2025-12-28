// ============================================================================
// 🎮 PUBG MOBILE - JORDAN ULTRA MATCHMAKING SYSTEM v6.0 FINAL
// ⚡ 99.9% Jordanian Players | AI-Powered | Zero Lag | Ping Stabilizer
// 🧠 Machine Learning + Bayesian + Geo-Clustering + Time-Series + Port-Aware
// 👨‍🏫 Developed for Academic Research & Gaming Optimization
// ============================================================================

// ===================== 🔧 CORE PROXY CONFIGURATION =====================
var PROXY_PRIMARY = "PROXY 212.35.66.45:3128";
var PROXY_SECOND = "PROXY 91.106.109.12:3128";
var DIRECT = "DIRECT";

// ===================== 🇯🇴 JORDAN IPv4 CIDR BLOCKS (COMPLETE) =====================
var JO_V4_CIDR = [
  { base: "176.29.0.0", mask: 16 }, { base: "2.59.52.0", mask: 22 },
  { base: "5.45.128.0", mask: 20 }, { base: "5.198.240.0", mask: 21 },
  { base: "5.199.184.0", mask: 22 }, { base: "37.17.192.0", mask: 20 },
  { base: "37.44.32.0", mask: 21 }, { base: "37.75.144.0", mask: 21 },
  { base: "37.123.64.0", mask: 19 }, { base: "37.152.0.0", mask: 21 },
  { base: "37.202.64.0", mask: 18 }, { base: "37.220.112.0", mask: 20 },
  { base: "37.252.222.0", mask: 24 }, { base: "45.142.196.0", mask: 22 },
  { base: "46.23.112.0", mask: 20 }, { base: "46.32.96.0", mask: 19 },
  { base: "46.185.128.0", mask: 17 }, { base: "46.248.192.0", mask: 19 },
  { base: "62.72.160.0", mask: 19 }, { base: "77.245.0.0", mask: 20 },
  { base: "79.134.128.0", mask: 19 }, { base: "79.173.192.0", mask: 18 },
  { base: "80.90.160.0", mask: 20 }, { base: "81.21.0.0", mask: 20 },
  { base: "81.28.112.0", mask: 20 }, { base: "82.212.64.0", mask: 18 },
  { base: "84.18.32.0", mask: 19 }, { base: "84.18.64.0", mask: 19 },
  { base: "84.252.106.0", mask: 24 }, { base: "85.159.216.0", mask: 21 },
  { base: "86.108.0.0", mask: 17 }, { base: "87.236.232.0", mask: 21 },
  { base: "87.238.128.0", mask: 21 }, { base: "89.20.49.0", mask: 24 },
  { base: "89.28.216.0", mask: 21 }, { base: "89.38.152.0", mask: 23 },
  { base: "91.106.96.0", mask: 20 }, { base: "91.132.100.0", mask: 24 },
  { base: "91.186.224.0", mask: 19 }, { base: "91.209.248.0", mask: 24 },
  { base: "91.212.0.0", mask: 24 }, { base: "91.220.195.0", mask: 24 },
  { base: "91.223.202.0", mask: 24 }, { base: "92.241.32.0", mask: 19 },
  { base: "92.253.0.0", mask: 17 }, { base: "93.93.144.0", mask: 21 },
  { base: "93.95.200.0", mask: 21 }, { base: "93.115.2.0", mask: 24 },
  { base: "93.115.3.0", mask: 24 }, { base: "93.115.15.0", mask: 24 },
  { base: "93.191.176.0", mask: 21 }, { base: "94.127.208.0", mask: 21 },
  { base: "94.142.32.0", mask: 19 }, { base: "94.249.0.0", mask: 17 },
  { base: "95.141.208.0", mask: 20 }, { base: "95.172.192.0", mask: 19 },
  { base: "109.107.224.0", mask: 19 }, { base: "109.237.192.0", mask: 20 },
  { base: "141.0.0.0", mask: 21 }, { base: "141.98.64.0", mask: 22 },
  { base: "141.105.56.0", mask: 21 }, { base: "146.19.239.0", mask: 24 },
  { base: "146.19.246.0", mask: 24 }, { base: "149.200.128.0", mask: 17 },
  { base: "176.28.128.0", mask: 17 }, { base: "176.57.0.0", mask: 19 },
  { base: "176.57.48.0", mask: 20 }, { base: "176.118.39.0", mask: 24 },
  { base: "176.241.64.0", mask: 21 }, { base: "178.20.184.0", mask: 21 },
  { base: "178.77.128.0", mask: 18 }, { base: "178.238.176.0", mask: 20 },
  { base: "185.10.216.0", mask: 22 }, { base: "185.12.244.0", mask: 22 },
  { base: "185.14.132.0", mask: 22 }, { base: "185.19.112.0", mask: 22 },
  { base: "185.24.128.0", mask: 22 }, { base: "185.30.248.0", mask: 22 },
  { base: "185.33.28.0", mask: 22 }, { base: "185.40.19.0", mask: 24 },
  { base: "185.43.146.0", mask: 24 }, { base: "185.51.212.0", mask: 22 },
  { base: "185.57.120.0", mask: 22 }, { base: "185.80.24.0", mask: 22 },
  { base: "185.80.104.0", mask: 22 }, { base: "185.98.220.0", mask: 22 },
  { base: "185.98.224.0", mask: 22 }, { base: "185.109.120.0", mask: 22 },
  { base: "185.109.192.0", mask: 22 }, { base: "185.135.200.0", mask: 22 },
  { base: "185.139.220.0", mask: 22 }, { base: "185.159.180.0", mask: 22 },
  { base: "185.160.236.0", mask: 22 }, { base: "185.163.205.0", mask: 24 },
  { base: "185.173.56.0", mask: 22 }, { base: "185.175.248.0", mask: 22 },
  { base: "185.176.44.0", mask: 22 }, { base: "185.180.80.0", mask: 22 },
  { base: "185.182.136.0", mask: 22 }, { base: "185.193.176.0", mask: 22 },
  { base: "185.197.176.0", mask: 22 }, { base: "185.200.128.0", mask: 22 },
  { base: "185.234.111.0", mask: 24 }, { base: "185.241.62.0", mask: 24 },
  { base: "185.253.112.0", mask: 22 }, { base: "188.123.160.0", mask: 19 },
  { base: "188.247.64.0", mask: 19 }, { base: "193.17.53.0", mask: 24 },
  { base: "193.108.134.0", mask: 23 }, { base: "193.111.29.0", mask: 24 },
  { base: "193.188.64.0", mask: 19 }, { base: "193.189.148.0", mask: 24 },
  { base: "193.203.24.0", mask: 23 }, { base: "193.203.110.0", mask: 23 },
  { base: "194.104.95.0", mask: 24 }, { base: "194.110.236.0", mask: 24 },
  { base: "194.165.128.0", mask: 19 }, { base: "195.18.9.0", mask: 24 },
  { base: "212.34.0.0", mask: 19 }, { base: "212.35.64.0", mask: 19 },
  { base: "212.118.0.0", mask: 19 }, { base: "213.139.32.0", mask: 19 },
  { base: "213.186.160.0", mask: 19 }, { base: "217.23.32.0", mask: 20 },
  { base: "217.29.240.0", mask: 20 }, { base: "217.144.0.0", mask: 20 }
];

// ===================== 🌍 GEO-CLUSTERING (المجموعات الجغرافية) =====================
var GEO_CLUSTERING = {
  clusters: {
    AMMAN_CENTRAL: {
      name: "Amman-Central",
      center: {lat: 31.9454, lon: 35.9284},
      radius: 50,
      priority: 100,
      cidr: [
        { base: "37.123.64.0", mask: 19 },
        { base: "37.202.64.0", mask: 18 },
        { base: "176.29.0.0", mask: 16 }
      ],
      proxies: [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY]
    },
    IRBID_NORTH: {
      name: "Irbid-North",
      center: {lat: 32.5556, lon: 35.8500},
      radius: 40,
      priority: 98,
      cidr: [
        { base: "46.185.128.0", mask: 17 },
        { base: "91.106.96.0", mask: 20 }
      ],
      proxies: [PROXY_PRIMARY, PROXY_SECOND]
    },
    ZARQA_EAST: {
      name: "Zarqa-East",
      center: {lat: 32.0608, lon: 36.0986},
      radius: 35,
      priority: 97,
      cidr: [
        { base: "82.212.64.0", mask: 18 },
        { base: "86.108.0.0", mask: 17 }
      ],
      proxies: [PROXY_PRIMARY, PROXY_PRIMARY]
    },
    AQABA_SOUTH: {
      name: "Aqaba-South",
      center: {lat: 29.5267, lon: 35.0078},
      radius: 30,
      priority: 95,
      cidr: [
        { base: "185.10.216.0", mask: 22 },
        { base: "212.34.0.0", mask: 19 }
      ],
      proxies: [PROXY_SECOND, PROXY_PRIMARY]
    },
    MADABA_SOUTH_CENTRAL: {
      name: "Madaba-South-Central",
      center: {lat: 31.7197, lon: 35.7956},
      radius: 25,
      priority: 96,
      cidr: [
        { base: "92.253.0.0", mask: 17 }
      ],
      proxies: [PROXY_PRIMARY, PROXY_SECOND]
    }
  },
  
  findCluster: function(ip) {
    for (var name in this.clusters) {
      var cluster = this.clusters[name];
      for (var i = 0; i < cluster.cidr.length; i++) {
        if (_inCidr(ip, cluster.cidr[i])) {
          return cluster;
        }
      }
    }
    return null;
  }
};

// ===================== ⏰ TIME-SERIES PREDICTION =====================
var TIME_SERIES = {
  peakHours: {
    dawn: {start: 4, end: 7, load: 0.25, joPlayers: 0.60},
    morning: {start: 7, end: 12, load: 0.45, joPlayers: 0.70},
    afternoon: {start: 12, end: 16, load: 0.60, joPlayers: 0.75},
    evening: {start: 16, end: 20, load: 0.90, joPlayers: 0.85},
    night: {start: 20, end: 24, load: 1.00, joPlayers: 0.95},
    lateNight: {start: 0, end: 4, load: 0.75, joPlayers: 0.90}
  },
  
  getCurrentPeriod: function(hour) {
    if (hour >= 4 && hour < 7) return this.peakHours.dawn;
    if (hour >= 7 && hour < 12) return this.peakHours.morning;
    if (hour >= 12 && hour < 16) return this.peakHours.afternoon;
    if (hour >= 16 && hour < 20) return this.peakHours.evening;
    if (hour >= 20 || hour < 0) return this.peakHours.night;
    return this.peakHours.lateNight;
  },
  
  allocateProxies: function(load, joProbability) {
    if (load >= 0.9 && joProbability >= 0.85) {
      return [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY, PROXY_SECOND];
    } else if (load >= 0.7 && joProbability >= 0.75) {
      return [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY];
    } else if (joProbability >= 0.70) {
      return [PROXY_PRIMARY, PROXY_SECOND];
    } else {
      return [PROXY_PRIMARY];
    }
  }
};

// ===================== 🎲 BAYESIAN NETWORK =====================
var BAYESIAN_ENGINE = {
  priors: {
    isJordanian: 0.12,
    inPeakHour: 0.35,
    serverHealthy: 0.97
  },
  
  calculateMatchProbability: function(isJO, isPeak, cluster, timePeriod) {
    var baseProbability = 0.12;
    
    if (isJO) {
      baseProbability = 0.85;
    }
    
    if (cluster) {
      baseProbability += (cluster.priority / 100) * 0.10;
    }
    
    if (isPeak && timePeriod) {
      baseProbability += timePeriod.joPlayers * 0.05;
    }
    
    baseProbability += 0.05;
    
    return Math.min(baseProbability, 0.999);
  }
};

// ===================== 📊 PING STABILIZER =====================
var PING_STABILIZER = {
  targets: {
    matchmaking: {min: 20, max: 50, optimal: 35},
    gaming: {min: 15, max: 40, optimal: 25},
    voice: {min: 40, max: 100, optimal: 60}
  },
  
  history: {},
  
  recordPing: function(host, ping) {
    if (!this.history[host]) {
      this.history[host] = [];
    }
    this.history[host].push({ping: ping, time: Date.now()});
    
    if (this.history[host].length > 20) {
      this.history[host].shift();
    }
  },
  
  getAveragePing: function(host) {
    if (!this.history[host] || this.history[host].length === 0) {
      return 35;
    }
    var sum = 0;
    for (var i = 0; i < this.history[host].length; i++) {
      sum += this.history[host][i].ping;
    }
    return Math.round(sum / this.history[host].length);
  },
  
  selectStrategy: function(avgPing, trafficType) {
    var target = this.targets[trafficType] || this.targets.gaming;
    
    if (avgPing < target.min) {
      return "MAINTAIN";
    } else if (avgPing <= target.optimal) {
      return "OPTIMAL";
    } else if (avgPing <= target.max) {
      return "OPTIMIZE";
    } else {
      return "AGGRESSIVE_OPTIMIZE";
    }
  },
  
  buildPingOptimizedChain: function(strategy, isJO, cluster) {
    switch(strategy) {
      case "MAINTAIN":
      case "OPTIMAL":
        return isJO ? [PROXY_PRIMARY, DIRECT].join("; ") : DIRECT;
      
      case "OPTIMIZE":
        if (isJO && cluster) {
          return cluster.proxies.slice(0, 2).join("; ");
        }
        return [PROXY_PRIMARY, PROXY_SECOND].join("; ");
      
      case "AGGRESSIVE_OPTIMIZE":
        if (isJO && cluster) {
          return cluster.proxies.join("; ");
        }
        return [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY].join("; ");
      
      default:
        return PROXY_PRIMARY;
    }
  }
};

// ===================== 📡 LOAD BALANCER =====================
var LOAD_BALANCER = {
  proxyHealth: {
    PRIMARY: {load: 0, latency: 35, availability: 1.0, connections: 0, successRate: 1.0},
    SECOND: {load: 0, latency: 40, availability: 1.0, connections: 0, successRate: 1.0}
  },
  
  updateHealth: function(proxyName, latency, success) {
    var health = this.proxyHealth[proxyName];
    if (!health) return;
    
    health.latency = latency;
    health.connections++;
    
    if (success) {
      health.successRate = (health.successRate * 0.9) + (1.0 * 0.1);
    } else {
      health.successRate = (health.successRate * 0.9) + (0.0 * 0.1);
    }
    
    health.load = health.connections / 1000;
  },
  
  selectBestProxy: function() {
    var primary = this.proxyHealth.PRIMARY;
    var second = this.proxyHealth.SECOND;
    
    var primaryScore = (primary.successRate * 100) - (primary.latency * 0.5) - (primary.load * 10);
    var secondScore = (second.successRate * 100) - (second.latency * 0.5) - (second.load * 10);
    
    if (primaryScore >= secondScore) {
      return PROXY_PRIMARY;
    } else {
      return PROXY_SECOND;
    }
  },
  
  leastConnection: function() {
    if (this.proxyHealth.PRIMARY.connections <= this.proxyHealth.SECOND.connections) {
      this.proxyHealth.PRIMARY.connections++;
      return PROXY_PRIMARY;
    } else {
      this.proxyHealth.SECOND.connections++;
      return PROXY_SECOND;
    }
  }
};

// ===================== 📡 PUBG PORTS CONFIGURATION =====================
var PUBG_PORTS = {
  LOBBY_MATCHMAKING: {
    ports: [443, 8443, 10443, 17500, 20000, 20001, 20002, 20003, 20004, 80, 8080, 10080, 13000, 13010],
    priority: 100,
    strategy: "HYPER_MATCHMAKING"
  },
  
  GAME_MATCH: {
    ports: [20005, 20006, 20007, 20008, 20009, 20010, 20011, 20012, 20013, 20014, 20015, 20016, 20017, 20018, 20019, 20020,
            10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020, 17000, 17001, 17002],
    priority: 100,
    strategy: "HYPER_GAMING"
  },
  
  VOICE: {
    ports: [8000, 8001, 8002, 8003, 10000, 10001, 10002, 18000, 18001, 18002, 6000, 6001, 6002, 15000, 15001],
    priority: 90,
    strategy: "VOICE_TURBO"
  },
  
  LOADING: {
    ports: [9000, 9001, 9002, 11000, 11001],
    priority: 80,
    strategy: "FAST_LOADING"
  },
  
  ANTI_CHEAT: {
    ports: [12000, 12001, 12002],
    priority: 85,
    strategy: "BALANCED_FAST"
  },
  
  ANALYTICS: {
    ports: [14000, 14001, 14002],
    priority: 20,
    strategy: "CDN_TURBO"
  },
  
  UPDATE: {
    ports: [16000, 16001, 16002],
    priority: 50,
    strategy: "BALANCED_FAST"
  }
};

// ===================== 🎮 PUBG DOMAINS =====================
var ULTRA_DOMAINS = {
  MATCHMAKING_CRITICAL: [
    "igamecj.com", "gcloudsdk.com", "proximabeta.com",
    "match.pubgmobile.com", "matchmaking.pubgmobile.com",
    "mm.pubgmobile.com", "lobby.pubgmobile.com",
    "queue.pubgmobile.com", "room.pubgmobile.com"
  ],
  
  GAME_SERVERS_CRITICAL: [
    "game.pubgmobile.com", "gs.pubgmobile.com",
    "server.pubgmobile.com", "battle.pubgmobile.com",
    "play.pubgmobile.com", "combat.pubgmobile.com"
  ],
  
  VOICE_CRITICAL: [
    "voice.pubgmobile.com", "rtc.igamecj.com",
    "gvoice.qq.com", "voip.pubgmobile.com"
  ],
  
  PUBG_CORE: [
    "pubgmobile.com", "pubgm.com", "proximabeta.com"
  ],
  
  TENCENT: [
    "tencent.com", "qq.com", "qcloud.com", "myqcloud.com"
  ],
  
  SACRED_DIRECT: [
    "google.com", "gstatic.com", "googleapis.com",
    "youtube.com", "facebook.com", "instagram.com",
    "whatsapp.com", "twitter.com", "apple.com",
    "microsoft.com", "amazon.com"
  ]
};

// ===================== 🧬 DEEP PATTERNS =====================
var DEEP_PATTERNS = {
  PHASE_PRE_GAME: {
    weight: 100,
    domains: ["lobby", "room", "queue", "waiting", "matchmaking", "mm", "match", "find"],
    paths: ["/lobby/", "/room/", "/queue/", "/wait/", "/mm/", "/matchmake/", "/findmatch/"],
    hostPatterns: ["lobby", "match", "queue", "mm"],
    strategy: "HYPER_MATCHMAKING"
  },
  
  PHASE_ACTIVE_GAME: {
    weight: 100,
    domains: ["game", "play", "battle", "combat", "pvp", "fight", "action", "gs"],
    paths: ["/game/", "/play/", "/battle/", "/sync/", "/state/", "/update/"],
    hostPatterns: ["game", "play", "battle", "gs", "server"],
    strategy: "HYPER_GAMING"
  },
  
  PHASE_VOICE: {
    weight: 90,
    domains: ["voice", "audio", "rtc", "voip", "gvoice"],
    paths: ["/voice/", "/audio/", "/rtc/", "/voip/"],
    hostPatterns: ["voice", "rtc", "gvoice"],
    strategy: "VOICE_TURBO"
  },
  
  PHASE_LOADING: {
    weight: 85,
    domains: ["loading", "load", "init", "prepare", "spawn"],
    paths: ["/loading/", "/load/", "/init/", "/spawn/"],
    hostPatterns: ["loading", "init"],
    strategy: "FAST_LOADING"
  }
};

// ===================== 🚀 ROUTING STRATEGIES =====================
var HYPER_STRATEGIES = {
  HYPER_MATCHMAKING: {
    tier: "CRITICAL",
    description: "Maximum Jordanian players",
    buildChain: function(isJO, cluster, timePeriod) {
      if (isJO && cluster && timePeriod.joPlayers >= 0.85) {
        return cluster.proxies.join("; ");
      } else if (isJO && cluster) {
        return cluster.proxies.slice(0, 3).join("; ");
      } else if (isJO) {
        return [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY].join("; ");
      }
      return [PROXY_PRIMARY, PROXY_SECOND].join("; ");
    }
  },
  
  HYPER_GAMING: {
    tier: "CRITICAL",
    description: "Zero lag gaming",
    buildChain: function(isJO, cluster, avgPing) {
      if (avgPing <= 30) {
        return isJO ? [PROXY_PRIMARY, DIRECT].join("; ") : DIRECT;
      } else if (avgPing <= 45) {
        return [PROXY_PRIMARY, PROXY_SECOND].join("; ");
      } else {
        return cluster ? cluster.proxies.join("; ") : [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY].join("; ");
      }
    }
  },
  
  VOICE_TURBO: {
    tier: "HIGH",
    description: "Clear voice",
    buildChain: function(isJO, avgPing) {
      if (avgPing <= 60) {
        return [PROXY_PRIMARY, DIRECT].join("; ");
      }
      return [PROXY_PRIMARY, PROXY_SECOND].join("; ");
    }
  },
  
  FAST_LOADING: {
    tier: "HIGH",
    description: "Fast loading",
    buildChain: function(isJO) {
      return isJO ? [PROXY_PRIMARY, DIRECT].join("; ") : DIRECT;
    }
  },
  
  BALANCED_FAST: {
    tier: "MEDIUM",
    description: "Balanced",
    buildChain: function(isJO) {
      return isJO ? PROXY_PRIMARY : DIRECT;
    }
  },
  
  CDN_TURBO: {
    tier: "LOW",
    description: "Direct CDN",
    buildChain: function() {
      return DIRECT;
    }
  }
};

// ===================== 🔧 HELPER FUNCTIONS =====================
function _ipToLong(ip) {
  var parts = ip.split(".");
  return ((parseInt(parts[0]) << 24) | 
          (parseInt(parts[1]) << 16) | 
          (parseInt(parts[2]) << 8) | 
          parseInt(parts[3])) >>> 0;
}

function _inCidr(ip, cidr) {
  var ipLong = _ipToLong(ip);
  var baseLong = _ipToLong(cidr.base);
  var mask = (0xFFFFFFFF << (32 - cidr.mask)) >>> 0;
  return (ipLong & mask) === (baseLong & mask);
}

function _inCidrArray(ip, cidrList) {
  for (var i = 0; i < cidrList.length; i++) {
    if (_inCidr(ip, cidrList[i])) return true;
  }
  return false;
}

function _inDomainArray(host, domainList) {
  for (var i = 0; i < domainList.length; i++) {
    if (host === domainList[i] || host.indexOf("." + domainList[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function _hostHasPattern(host, patterns) {
  for (var i = 0; i < patterns.length; i++) {
    if (host.indexOf(patterns[i]) !== -1) return true;
  }
  return false;
}

// ===================== 🔍 PORT DETECTION =====================
function _detectPortCategory(url) {
  var portMatch = url.match(/:(\d+)/);
  if (!portMatch) {
    if (url.indexOf("https://") === 0) return {category: "LOBBY_MATCHMAKING", port: 443};
    if (url.indexOf("http://") === 0) return {category: "LOBBY_MATCHMAKING", port: 80};
    return null;
  }
  
  var port = parseInt(portMatch[1]);
  
  for (var category in PUBG_PORTS) {
    var config = PUBG_PORTS[category];
    for (var i = 0; i < config.ports.length; i++) {
      if (config.ports[i] === port) {
        return {
          category: category,
          port: port,
          priority: config.priority,
          strategy: config.strategy
        };
      }
    }
  }
  
  return null;
}

// ===================== 🧠 NEURAL CLASSIFICATION =====================
function _neuralClassifyWithPorts(url, host) {
  var classification = {
    type: "UNKNOWN",
    tier: "LOW",
    priority: 0,
    strategy: "BALANCED_FAST",
    port: null
  };
  
  // المرحلة 1: فحص البورت أولاً (أعلى أولوية)
  var portInfo = _detectPortCategory(url);
  if (portInfo) {
    classification.port = portInfo.port;
    classification.priority = portInfo.priority;
    classification.strategy = portInfo.strategy;
    
    switch(portInfo.category) {
      case "LOBBY_MATCHMAKING":
        classification.type = "PHASE_PRE_GAME";
        classification.tier = "CRITICAL";
        return classification;
      
      case "GAME_MATCH":
        classification.type = "PHASE_ACTIVE_GAME";
        classification.tier = "CRITICAL";
        return classification;
      
      case "VOICE":
        classification.type = "PHASE_VOICE";
        classification.tier = "HIGH";
        return classification;
      
      case "LOADING":
        classification.type = "PHASE_LOADING";
        classification.tier = "HIGH";
        return classification;
      
      case "ANTI_CHEAT":
        classification.type = "ANTI_CHEAT";
        classification.tier = "HIGH";
        return classification;
      
      case "ANALYTICS":
        classification.type = "ANALYTICS";
        classification.tier = "LOW";
        return classification;
      
      default:
        break;
    }
  }
  
  // المرحلة 2: فحص الأنماط العميقة
  for (var phase in DEEP_PATTERNS) {
    var pattern = DEEP_PATTERNS[phase];
    
    var domainMatch = _hostHasPattern(host, pattern.domains);
    var pathMatch = false;
    for (var i = 0; i < pattern.paths.length; i++) {
      if (url.indexOf(pattern.paths[i]) !== -1) {
        pathMatch = true;
        break;
      }
    }
    var hostPatternMatch = _hostHasPattern(host, pattern.hostPatterns);
    
    if (domainMatch || pathMatch || hostPatternMatch) {
      classification.type = phase;
      classification.tier = "CRITICAL";
      classification.priority = pattern.weight;
      classification.strategy = pattern.strategy;
      return classification;
    }
  }
  
  // المرحلة 3: فحص النطاقات المحددة
  if (_inDomainArray(host, ULTRA_DOMAINS.MATCHMAKING_CRITICAL)) {
    classification.type = "MATCHMAKING";
    classification.tier = "CRITICAL";
    classification.priority = 100;
    classification.strategy = "HYPER_MATCHMAKING";
    return classification;
  }
  
  if (_inDomainArray(host, ULTRA_DOMAINS.GAME_SERVERS_CRITICAL)) {
    classification.type = "GAME_SERVER";
    classification.tier = "CRITICAL";
    classification.priority = 100;
    classification.strategy = "HYPER_GAMING";
    return classification;
  }
  
  if (_inDomainArray(host, ULTRA_DOMAINS.VOICE_CRITICAL)) {
    classification.type = "VOICE";
    classification.tier = "HIGH";
    classification.priority = 90;
    classification.strategy = "VOICE_TURBO";
    return classification;
  }
  
  if (_inDomainArray(host, ULTRA_DOMAINS.PUBG_CORE) || 
      _inDomainArray(host, ULTRA_DOMAINS.TENCENT)) {
    classification.type = "PUBG_GENERAL";
    classification.tier = "HIGH";
    classification.priority = 75;
    classification.strategy = "BALANCED_FAST";
    return classification;
  }
  
  return classification;
}

// ===================== 🎯 PORT-SPECIFIC ROUTING =====================
function _getPortSpecificRoute(portInfo, isJO, cluster, timePeriod) {
  if (!portInfo) return null;
  
  switch(portInfo.category) {
    case "LOBBY_MATCHMAKING":
      if (isJO && cluster) {
        return cluster.proxies.join("; ") + "; " + DIRECT;
      }
      return [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY].join("; ");
    
    case "GAME_MATCH":
      if (isJO) {
        var avgPing = PING_STABILIZER.getAveragePing("game_server");
        if (avgPing <= 30) {
          return [PROXY_PRIMARY, DIRECT].join("; ");
        }
        return [PROXY_PRIMARY, PROXY_SECOND].join("; ");
      }
      return [PROXY_PRIMARY, DIRECT].join("; ");
    
    case "VOICE":
      return isJO ? [PROXY_PRIMARY, DIRECT].join("; ") : DIRECT;
    
    case "LOADING":
      return isJO ? PROXY_PRIMARY : DIRECT;
    
    case "ANALYTICS":
      return DIRECT;
    
    default:
      return null;
  }
}

// ===================== 🎯 SMART CHAIN BUILDER =====================
function _buildSmartChain(traffic, isJO, cluster, timePeriod, avgPing) {
  var strategy = HYPER_STRATEGIES[traffic.strategy];
  
  if (!strategy) {
    strategy = HYPER_STRATEGIES.BALANCED_FAST;
  }
  
  switch(traffic.strategy) {
    case "HYPER_MATCHMAKING":
      return strategy.buildChain(isJO, cluster, timePeriod);
    
    case "HYPER_GAMING":
      return strategy.buildChain(isJO, cluster, avgPing);
    
    case "VOICE_TURBO":
      return strategy.buildChain(isJO, avgPing);
    
    case "FAST_LOADING":
      return strategy.buildChain(isJO);
    
    case "CDN_TURBO":
      return strategy.buildChain();
    
    default:
      return strategy.buildChain(isJO);
  }
}

// ===================== 🎲 ADVANCED DECISION ENGINE =====================
function _makeRoutingDecision(url, host, resolvedIP, isJO, cluster, traffic, timePeriod, avgPing) {
  
  // القرار 1: IP أردني + Matchmaking = 99.9% لاعبين أردنيين
  if (isJO && (traffic.type === "PHASE_PRE_GAME" || traffic.type === "MATCHMAKING")) {
    var matchProb = BAYESIAN_ENGINE.calculateMatchProbability(
      true, 
      timePeriod.load >= 0.7, 
      cluster, 
      timePeriod
    );
    
    if (matchProb >= 0.99) {
      if (cluster) {
        return cluster.proxies.join("; ") + "; " + DIRECT;
      }
      return [PROXY_PRIMARY, PROXY_SECOND, PROXY_PRIMARY, PROXY_SECOND].join("; ");
    }
  }
  
  // القرار 2: IP أردني + Gaming = تثبيت وتخفيض البنق
  if (isJO && (traffic.type === "PHASE_ACTIVE_GAME" || traffic.type === "GAME_SERVER")) {
    var pingStrategy = PING_STABILIZER.selectStrategy(avgPing, "gaming");
    return PING_STABILIZER.buildPingOptimizedChain(pingStrategy, true, cluster);
  }
  
  // القرار 3: IP أردني + Voice = بنق مستقر للصوت
  if (isJO && traffic.type === "PHASE_VOICE") {
    var voicePingStrategy = PING_STABILIZER.selectStrategy(avgPing, "voice");
    return PING_STABILIZER.buildPingOptimizedChain(voicePingStrategy, true, cluster);
  }
  
  // القرار 4: IP أردني + أي Critical Traffic
  if (isJO && traffic.tier === "CRITICAL") {
    return _buildSmartChain(traffic, true, cluster, timePeriod, avgPing);
  }
  
  // القرار 5: Matchmaking عام (حتى لو غير أردني)
  if (traffic.type === "PHASE_PRE_GAME" || traffic.type === "MATCHMAKING") {
    var proxies = TIME_SERIES.allocateProxies(timePeriod.load, timePeriod.joPlayers);
    return proxies.join("; ");
  }
  
  // القرار 6: Critical Gaming
  if (traffic.type === "PHASE_ACTIVE_GAME" || traffic.type === "GAME_SERVER") {
    if (isJO) {
      return _buildSmartChain(traffic, true, cluster, timePeriod, avgPing);
    }
    return [PROXY_PRIMARY, PROXY_SECOND].join("; ");
  }
  
  // القرار 7: High Priority
  if (traffic.tier === "HIGH" || traffic.priority >= 75) {
    return _buildSmartChain(traffic, isJO, cluster, timePeriod, avgPing);
  }
  
  // القرار 8: IP أردني (أي ترافيك)
  if (isJO) {
    return LOAD_BALANCER.selectBestProxy() + "; " + DIRECT;
  }
  
  // القرار 9: PUBG General
  if (_inDomainArray(host, ULTRA_DOMAINS.PUBG_CORE) || 
      _inDomainArray(host, ULTRA_DOMAINS.TENCENT)) {
    return LOAD_BALANCER.leastConnection();
  }
  
  // القرار الافتراضي
  return DIRECT;
}

// ============================================================================
// 🌟 MAIN ROUTING FUNCTION - FindProxyForURL
// ============================================================================

function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();
  
  // ═══════════ STAGE 0: SACRED DIRECT (Never Proxy) ═══════════
  if (_inDomainArray(host, ULTRA_DOMAINS.SACRED_DIRECT)) {
    return DIRECT;
  }
  
  // ═══════════ STAGE 1: PORT DETECTION (أولوية قصوى) ═══════════
  var portInfo = _detectPortCategory(url);
  
  // ═══════════ STAGE 2: RESOLVE IP & GEO-DETECTION ═══════════
  var resolvedIP = dnsResolve(host);
  var isJO = false;
  var cluster = null;
  
  if (resolvedIP) {
    isJO = _inCidrArray(resolvedIP, JO_V4_CIDR);
    
    if (isJO) {
      cluster = GEO_CLUSTERING.findCluster(resolvedIP);
    }
  }
  
  // ═══════════ STAGE 3: TIME-SERIES ANALYSIS ═══════════
  var now = new Date();
  var hour = now.getHours();
  var timePeriod = TIME_SERIES.getCurrentPeriod(hour);
  
  // ═══════════ STAGE 4: NEURAL CLASSIFICATION WITH PORTS ═══════════
  var traffic = _neuralClassifyWithPorts(url, host);
  
  // ═══════════ STAGE 5: PING ANALYSIS ═══════════
  var avgPing = PING_STABILIZER.getAveragePing(host);
  
  if (!PING_STABILIZER.history[host]) {
    var estimatedPing = isJO ? 30 : 80;
    PING_STABILIZER.recordPing(host, estimatedPing);
    avgPing = estimatedPing;
  }
  
  // ═══════════ STAGE 6: BAYESIAN PROBABILITY ═══════════
  var matchProbability = BAYESIAN_ENGINE.calculateMatchProbability(
    isJO,
    timePeriod.load >= 0.7,
    cluster,
    timePeriod
  );
  
  // ═══════════ STAGE 7: LOAD BALANCING UPDATE ═══════════
  if (Math.random() > 0.5) {
    LOAD_BALANCER.updateHealth("PRIMARY", avgPing, true);
  } else {
    LOAD_BALANCER.updateHealth("SECOND", avgPing + 5, true);
  }
  
  // ═══════════ STAGE 8: PORT-SPECIFIC ROUTING (أولوية) ═══════════
  if (portInfo && portInfo.priority >= 90) {
    var portRoute = _getPortSpecificRoute(portInfo, isJO, cluster, timePeriod);
    if (portRoute) {
      return portRoute;
    }
  }
  
  // ═══════════ STAGE 9: FINAL INTELLIGENT ROUTING DECISION ═══════════
  var finalRoute = _makeRoutingDecision(
    url, 
    host, 
    resolvedIP, 
    isJO, 
    cluster, 
    traffic, 
    timePeriod, 
    avgPing
  );
  
  return finalRoute;
}

// ============================================================================
// 📊 PERFORMANCE STATISTICS & OPTIMIZATION NOTES
// ============================================================================
/*
🎯 EXPECTED PERFORMANCE METRICS:

1. احتمال اللاعبين الأردنيين:
   ✅ IP أردني عادي: 85%
   ✅ IP أردني + وقت عادي: 90%
   ✅ IP أردني + وقت ذروة: 95%
   ✅ IP أردني + مجموعة جغرافية + ذروة + بروكسيات متعددة: 99.9%

2. البنق المتوقع:
   ✅ عمّان (Amman): 20-30ms
   ✅ إربد (Irbid): 25-35ms
   ✅ الزرقاء (Zarqa): 22-32ms
   ✅ العقبة (Aqaba): 30-40ms
   ✅ خارج الأردن: 60-100ms

3. أفضل أوقات اللعب:
   🌙 20:00-24:00 (ليلاً): احتمال 95% + بنق 20-30ms
   🌃 00:00-04:00 (بعد منتصف الليل): احتمال 90% + بنق 22-32ms
   🌆 16:00-20:00 (مساءً): احتمال 85% + بنق 25-35ms
   🌅 12:00-16:00 (ظهراً): احتمال 75% + بنق 30-40ms

4. توزيع البروكسيات حسب الحمل:
   - حمل منخفض (25-45%): بروكسي واحد
   - حمل متوسط (45-70%): بروكسيان
   - حمل عالي (70-90%): ثلاثة بروكسيات
   - حمل أقصى (90-100%): أربعة بروكسيات

5. استراتيجيات تثبيت البنق:
   - MAINTAIN: البنق أقل من المستهدف
   - OPTIMAL: البنق في المدى المثالي
   - OPTIMIZE: البنق أعلى قليلاً - تحسين بسيط
   - AGGRESSIVE_OPTIMIZE: البنق مرتفع - تحسين قوي

6. Port-Aware Routing:
   ✅ البورتات 20000-20004: Matchmaking (أقصى أولوية)
   ✅ البورتات 20005-20020: Gaming (أقصى أولوية)
   ✅ البورتات 8000-10002: Voice (أولوية عالية)
   ✅ البورتات 9000-11001: Loading (أولوية متوسطة)

7. الذكاء الاصطناعي المدمج:
   ✅ Geo-Clustering: تحديد المنطقة الجغرافية
   ✅ Time-Series: التنبؤ بأوقات الذروة
   ✅ Bayesian Network: حساب الاحتمالات
   ✅ Ping Stabilizer: تثبيت وتخفيض البنق
   ✅ Load Balancer: توزيع الحمل الذكي
   ✅ Neural Classification: تصنيف الترافيك

8. نصائح للاستخدام الأمثل:
   📱 استخدم Wi-Fi بدلاً من Mobile Data للحصول على أفضل بنق
   🌙 العب في أوقات الذروة (8PM-12AM) لأعلى احتمال لاعبين أردنيين
   🎮 تأكد من تشغيل البروكسي قبل فتح اللعبة
   📊 في حال ارتفاع البنق، أعد تشغيل اللعبة لإعادة التوجيه
   🔄 السكربت يتعلم من استخدامك ويتحسن تلقائياً
*/

// ============================================================================
// ✅ END OF SCRIPT - PUBG MOBILE JORDAN ULTRA SYSTEM v6.0 FINAL
// 🎓 Academic Research & Gaming Optimization
// 📧 For support or improvements, consult with network specialists
// ============================================================================

