// ============================================================================
// PUBG MOBILE — JO-MATCHMAX (iOS/PAC SAFE ES5)
// هدف النسخة: Matchmaking أردني أعلى + ثبات NAT أعلى + أقل تشتت مسار
// ============================================================================

// ===================== PROXIES (IPs فقط) =====================
var PROXIES = {
  JO_1: "212.35.66.45",
  JO_2: "91.106.109.12",
  JO_3: "46.32.102.1",
  JO_4: "82.212.84.33",
  JO_5: "77.245.9.11"
};

// ===================== PORT FALLBACK (ثبات + توافق أعلى) =====================
var PORTS = {
  MATCH:   ["10012", "443", "8080"],
  VOICE:   ["20001", "443"],
  GAME:    ["10039", "443"],
  LOBBY:   ["443", "8080"],
  GENERAL: ["8080", "443"]
};

// ============================================================================
// JO NETWORKS (كما هي من عندك)
// ============================================================================
var JO_NETWORKS = {
  MAJOR: [
    "176.29.0.0/16", "46.185.128.0/17", "86.108.0.0/17", "92.253.0.0/17",
    "94.249.0.0/17", "149.200.128.0/17", "176.28.128.0/17"
  ],
  ORANGE: [
    "212.35.0.0/16", "212.34.0.0/19", "82.212.64.0/18", "212.118.0.0/19",
    "79.173.192.0/18", "37.202.64.0/18"
  ],
  ZAIN: [
    "188.161.0.0/16", "212.118.0.0/19", "213.186.160.0/19",
    "37.17.192.0/20", "46.23.112.0/20", "81.28.112.0/20"
  ],
  UMNIAH: [
    "46.185.128.0/17", "176.29.0.0/16", "91.106.96.0/20",
    "178.77.128.0/18", "5.45.128.0/20"
  ],
  MODERN: [
    "37.220.112.0/20", "95.141.208.0/21", "176.241.64.0/21",
    "141.0.0.0/21", "185.107.0.0/22", "37.123.64.0/19",
    "46.248.192.0/19", "62.72.160.0/19", "79.134.128.0/19",
    "84.18.32.0/19", "84.18.64.0/19", "91.186.224.0/19",
    "92.241.32.0/19", "95.172.192.0/19", "176.57.0.0/19"
  ],
  GAMING: [
    "212.35.66.0/24", "91.106.109.0/24", "46.185.131.0/24",
    "82.212.108.0/24", "77.245.8.0/24", "46.32.102.0/24"
  ]
};

var ALL_JO_RANGES = []
  .concat(JO_NETWORKS.MAJOR)
  .concat(JO_NETWORKS.ORANGE)
  .concat(JO_NETWORKS.ZAIN)
  .concat(JO_NETWORKS.UMNIAH)
  .concat(JO_NETWORKS.MODERN)
  .concat(JO_NETWORKS.GAMING);

// ============================================================================
// PUBG DOMAINS / KEYWORDS
// ============================================================================
var PUBG = {
  CRITICAL_DOMAINS: [
    "pubgmobile.com", "igamecj.com", "proximabeta.com", "gcloudsdk.com",
    "intlgame.com", "tencent.com", "qq.com", "qcloud.com", "tencentgcloud.com"
  ],

  MATCH_KEYWORDS: [
    "match", "matchmaking", "mm", "lobby", "queue", "room", "waiting",
    "findmatch", "join", "recruit", "recruiting", "teamup"
  ],

  VOICE_KEYWORDS: [
    "voice", "rtc", "gvoice", "audio", "voip", "webrtc", "call",
    "mic", "speaker", "talk", "chat"
  ],

  GAME_KEYWORDS: [
    "game", "server", "battle", "gs", "play", "pvp", "combat",
    "loading", "spawn", "sync", "state", "action", "fire", "move"
  ],

  // NOTE: بالنسخة JO-MATCHMAX ما بنخلي CDN/telemetry DIRECT إذا كان تبع PUBG
  LOW_KEYWORDS: [
    "cdn", "static", "img", "image", "asset", "resource", "download",
    "update", "patch", "analytics", "telemetry", "tracking", "metrics"
  ]
};

// ============================================================================
// DIRECT SAFE (اتصالات النظام فقط)
// ============================================================================
var ALWAYS_DIRECT = [
  "captive.apple.com", "ocsp.apple.com", "time.apple.com",
  "connectivitycheck.gstatic.com", "clients3.google.com"
];

// اختياري: إذا بدك GitHub/YouTube دايمًا DIRECT
var OPTIONAL_DIRECT = [
  "github.com", "raw.githubusercontent.com", "gist.githubusercontent.com",
  "youtube.com", "googlevideo.com", "ytimg.com", "youtubei.googleapis.com"
];

// ============================================================================
// DNS CACHE (خفيف)
// ============================================================================
var DNS_CACHE = {
  cache: {},
  order: [],
  maxSize: 400,

  get: function(host) { return this.cache[host] || null; },

  set: function(host, ip) {
    if (this.order.length >= this.maxSize) {
      var oldest = this.order.shift();
      delete this.cache[oldest];
    }
    this.cache[host] = ip;
    this.order.push(host);
  },

  resolve: function(host) {
    var cached = this.get(host);
    if (cached) return cached;

    var ip = dnsResolve(host);
    if (ip && ip !== "0.0.0.0") this.set(host, ip);
    return ip;
  }
};

// ============================================================================
// Known IPs (كما عندك)
// ============================================================================
var PUBG_KNOWN_IPS = {
  "match.pubgmobile.com": "212.35.66.45",
  "voice.igamecj.com": "91.106.109.12",
  "game.pubgmobile.com": "46.185.131.220"
};

// ============================================================================
// SESSION LOCK (قفل مسار للماتش/التجنيد)
// ============================================================================
var SESSION = {
  matchProxyChain: null,
  matchStart: 0,
  matchDuration: 1200000, // 20 دقيقة

  getMatch: function() {
    var now = new Date().getTime();
    if (this.matchProxyChain && (now - this.matchStart < this.matchDuration)) {
      return this.matchProxyChain;
    }
    return null;
  },

  setMatch: function(chain) {
    this.matchProxyChain = chain;
    this.matchStart = new Date().getTime();
  },

  clear: function() {
    this.matchProxyChain = null;
    this.matchStart = 0;
  }
};

// ============================================================================
// Helpers
// ============================================================================
function ipToNum(ip) {
  var p = (ip || "").split(".");
  if (p.length !== 4) return 0;
  return ((parseInt(p[0],10) << 24) | (parseInt(p[1],10) << 16) |
          (parseInt(p[2],10) << 8) |  parseInt(p[3],10)) >>> 0;
}

function inCidr(ip, cidr) {
  var idx = cidr.indexOf("/");
  if (idx === -1) return false;

  var net = cidr.substring(0, idx);
  var bits = parseInt(cidr.substring(idx + 1), 10);

  var ipNum = ipToNum(ip);
  var netNum = ipToNum(net);
  var mask = (0xFFFFFFFF << (32 - bits)) >>> 0;

  return ((ipNum & mask) === (netNum & mask));
}

function isJordanian(ip) {
  if (!ip || ip === "0.0.0.0") return false;
  for (var i = 0; i < ALL_JO_RANGES.length; i++) {
    if (inCidr(ip, ALL_JO_RANGES[i])) return true;
  }
  return false;
}

function matchDomain(host, domain) {
  if (!host || !domain) return false;
  host = host.toLowerCase();
  domain = domain.toLowerCase();

  if (host === domain) return true;
  if (host.length > domain.length) {
    var suffix = host.substring(host.length - domain.length);
    if (suffix === domain && host.charAt(host.length - domain.length - 1) === ".") return true;
  }
  return false;
}

function inDomainList(host, list) {
  for (var i = 0; i < list.length; i++) {
    if (matchDomain(host, list[i])) return true;
  }
  return false;
}

function hasKeyword(text, keywords) {
  if (!text) return false;
  text = text.toLowerCase();
  for (var i = 0; i < keywords.length; i++) {
    if (text.indexOf(keywords[i]) !== -1) return true;
  }
  return false;
}

// chain with port fallback (يحافظ على نفس proxy ترتيبًا)
function buildChainWithPorts(proxyList, portList, includeDirect) {
  var chain = [];
  for (var i = 0; i < proxyList.length; i++) {
    for (var p = 0; p < portList.length; p++) {
      chain.push("PROXY " + proxyList[i] + ":" + portList[p]);
    }
  }
  if (includeDirect) chain.push("DIRECT");
  return chain.join("; ");
}

// Match ID (اختياري)
function extractMatchId(url) {
  var patterns = [
    /match[*-]?id[=:]([a-zA-Z0-9-]+)/i,
    /room[*-]?id[=:]([a-zA-Z0-9-]+)/i,
    /game[_-]?id[=:]([a-zA-Z0-9-]+)/i
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = (url || "").match(patterns[i]);
    if (m) return m[1];
  }
  return null;
}

// ============================================================================
// Classify
// ============================================================================
function classify(host, url) {
  var u = (url || "").toLowerCase();
  var combined = (host || "") + " " + u;

  var isPubgDomain = inDomainList(host, PUBG.CRITICAL_DOMAINS);
  var isMatch = hasKeyword(combined, PUBG.MATCH_KEYWORDS);
  var isVoice = hasKeyword(combined, PUBG.VOICE_KEYWORDS);
  var isGame  = hasKeyword(combined, PUBG.GAME_KEYWORDS);
  var isLow   = hasKeyword(combined, PUBG.LOW_KEYWORDS);

  // Match/Recruit أعلى أولوية
  if (isMatch) return { type: "MATCH", ports: PORTS.MATCH, urgent: true, pubg: isPubgDomain };

  // Voice
  if (isVoice) return { type: "VOICE", ports: PORTS.VOICE, urgent: true, pubg: isPubgDomain };

  // Game realtime
  if (isGame) return { type: "GAME", ports: PORTS.GAME, urgent: true, pubg: isPubgDomain };

  // PUBG non-urgent
  if (isPubgDomain) {
    // حتى لو LOW (cdn/telemetry) خليه عبر proxy (مش DIRECT) عشان ما يطلع المسار
    return { type: isLow ? "PUBG_LOW" : "PUBG", ports: PORTS.LOBBY, urgent: false, pubg: true };
  }

  // Non-PUBG
  if (isLow) return { type: "LOW", ports: PORTS.GENERAL, urgent: false, pubg: false };
  return { type: "OTHER", ports: PORTS.GENERAL, urgent: false, pubg: false };
}

// ============================================================================
// MAIN
// ============================================================================
function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();
  var urlL = (url || "").toLowerCase();

  // 0) system connectivity direct
  if (inDomainList(host, ALWAYS_DIRECT)) return "DIRECT";
  if (host === "clients3.google.com" && urlL.indexOf("generate_204") !== -1) return "DIRECT";

  // optional direct for github/youtube (only if NOT PUBG)
  if (inDomainList(host, OPTIONAL_DIRECT)) return "DIRECT";

  // 1) classify
  var t = classify(host, url);

  // 2) Non-PUBG LOW => DIRECT (خفف ضغط)
  if (!t.pubg && t.type === "LOW") return "DIRECT";

  // 3) Resolve فقط لما نحتاج (PUBG / MATCHMAX)
  // لو هو PUBG أو urgent، نحاول نعرف إذا IP أردني
  var resolvedIP = PUBG_KNOWN_IPS[host] || (t.pubg || t.urgent ? DNS_CACHE.resolve(host) : null);
  var isJO = resolvedIP ? isJordanian(resolvedIP) : false;

  // 4) JO-MATCHMAX: MATCH/RECRUIT/QUEUE = session lock قوي على JO_1
  if (t.type === "MATCH") {
    var locked = SESSION.getMatch();
    if (locked) return locked;

    // إذا IP أردني أو حتى غير واضح، إحنا بدنا JO ثابت
    var matchChain = buildChainWithPorts(
      [PROXIES.JO_1, PROXIES.JO_2], // ثبات + احتياط
      t.ports,
      true
    );

    SESSION.setMatch(matchChain);
    return matchChain;
  }

  // 5) Voice/Game: ثبات عالي (JO_1 أولاً)
  if (t.type === "VOICE") {
    return buildChainWithPorts([PROXIES.JO_1, PROXIES.JO_2], t.ports, true);
  }

  if (t.type === "GAME") {
    // إذا IP أردني، خلّيه JO_1 فقط لتقليل jitter
    if (isJO) return buildChainWithPorts([PROXIES.JO_1], t.ports, true);
    return buildChainWithPorts([PROXIES.JO_1, PROXIES.JO_2], t.ports, true);
  }

  // 6) PUBG (حتى لو CDN/telemetry): لا DIRECT
  if (t.pubg) {
    // لو IP أردني: JO_1 ثابت
    if (isJO) return buildChainWithPorts([PROXIES.JO_1], PORTS.LOBBY, true);

    // غير أردني/غير معروف: برضه خليه JO (هدفنا matchmaking جو)
    return buildChainWithPorts([PROXIES.JO_1, PROXIES.JO_2], PORTS.LOBBY, true);
  }

  // 7) باقي الترافيك: DIRECT
  return "DIRECT";
}
