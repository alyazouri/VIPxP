// ============================================================================
// PUBG MOBILE — JO FIRST → GULF/ME FALLBACK → EUROPE BLOCKED (NO-DIRECT)
// iOS / WebKit PAC SAFE (ES5)
// ============================================================================

// ===================== PROXIES (IPs فقط) =====================
var PROXIES = {
  JO_1: "212.35.66.45",
  JO_2: "91.106.109.12",
  JO_3: "46.32.102.1",
  JO_4: "82.212.84.33",
  JO_5: "77.245.9.11"
};

// ===================== PORTS (Fallback) =====================
var PORTS = {
  MATCH:   ["10012", "443", "8080"],
  VOICE:   ["20001", "443"],
  GAME:    ["10039", "443"],
  LOBBY:   ["443", "8080"],
  GENERAL: ["8080", "443"]
};

// ===================== BLOCK (NO EUROPE) =====================
var BLOCK = "PROXY 0.0.0.0:0";

// كلمات مفتاحية لأوروبا — أي ظهور = منع
var BLOCK_EU_KEYWORDS = [
  "-eu-", ".eu.", "europe", "eu-west", "eu-central",
  "frankfurt", "paris", "london", "amsterdam", "berlin",
  "milan", "madrid", "stockholm", "warsaw", "vienna",
  "ireland", "dublin", "zurich", "geneva", "prague"
];

// CIDR مختصرة لأشهر مناطق AWS/GCP الأوروبية (تقوية منع أوروبا)
var EU_BLOCK_RANGES = [
  "3.120.0.0/13",   // AWS Frankfurt
  "18.184.0.0/15",  // AWS EU
  "35.156.0.0/14",  // AWS EU
  "52.28.0.0/14",   // AWS EU
  "34.89.0.0/16",   // GCP EU (مختصر)
  "34.107.0.0/16"   // GCP (مختصر)
];

// إشارات الخليج/الشرق الأوسط (fallback إذا مش JO)
var GULF_KEYWORDS = [
  "me", "middleeast", "mideast", "gcc",
  "dubai", "uae", "abudhabi", "sharjah",
  "saudi", "ksa", "riyadh", "jeddah", "dammam",
  "kuwait", "qatar", "doha", "bahrain", "oman", "muscat",
  "iraq", "baghdad", "lebanon", "beirut", "palestine", "gaza"
];

// ============================================================================
// JO NETWORKS (كما عندك)
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

  LOW_KEYWORDS: [
    "cdn", "static", "img", "image", "asset", "resource", "download",
    "update", "patch", "analytics", "telemetry", "tracking", "metrics"
  ]
};

// ============================================================================
// DNS CACHE
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

// Known IPs (اختياري)
var PUBG_KNOWN_IPS = {
  "match.pubgmobile.com": "212.35.66.45",
  "voice.igamecj.com": "91.106.109.12",
  "game.pubgmobile.com": "46.185.131.220"
};

// ============================================================================
// SESSION LOCK (MATCH/RECRUIT)
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
  }
};

// ============================================================================
// Helpers
// ============================================================================
function ipToNum(ip) {
  var p = (ip || "").split(".");
  if (p.length !== 4) return 0;
  return ((parseInt(p[0],10) << 24) | (parseInt(p[1],10) << 16) |
          (parseInt(p[2],10) << 8) | parseInt(p[3],10)) >>> 0;
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

function buildChainWithPorts(proxyList, portList) {
  var chain = [];
  for (var i = 0; i < proxyList.length; i++) {
    for (var p = 0; p < portList.length; p++) {
      chain.push("PROXY " + proxyList[i] + ":" + portList[p]);
    }
  }
  return chain.join("; ");
}

function isEUHost(host, url) {
  var t = (host + " " + (url || "")).toLowerCase();
  for (var i = 0; i < BLOCK_EU_KEYWORDS.length; i++) {
    if (t.indexOf(BLOCK_EU_KEYWORDS[i]) !== -1) return true;
  }
  return false;
}

function isEUIP(ip) {
  if (!ip || ip === "0.0.0.0") return false;
  for (var i = 0; i < EU_BLOCK_RANGES.length; i++) {
    if (inCidr(ip, EU_BLOCK_RANGES[i])) return true;
  }
  return false;
}

function isGulfHint(host, url) {
  var t = (host + " " + (url || "")).toLowerCase();
  for (var i = 0; i < GULF_KEYWORDS.length; i++) {
    if (t.indexOf(GULF_KEYWORDS[i]) !== -1) return true;
  }
  // افتراضي: نعتبرها Gulf/ME بدل تركها تروح EU
  return true;
}

function classify(host, url) {
  var u = (url || "").toLowerCase();
  var combined = (host || "") + " " + u;

  var isPubgDomain = inDomainList(host, PUBG.CRITICAL_DOMAINS);
  var isMatch = hasKeyword(combined, PUBG.MATCH_KEYWORDS);
  var isVoice = hasKeyword(combined, PUBG.VOICE_KEYWORDS);
  var isGame  = hasKeyword(combined, PUBG.GAME_KEYWORDS);
  var isLow   = hasKeyword(combined, PUBG.LOW_KEYWORDS);

  if (isMatch) return { type: "MATCH", ports: PORTS.MATCH, urgent: true, pubg: isPubgDomain };
  if (isVoice) return { type: "VOICE", ports: PORTS.VOICE, urgent: true, pubg: isPubgDomain };
  if (isGame)  return { type: "GAME",  ports: PORTS.GAME,  urgent: true, pubg: isPubgDomain };

  if (isPubgDomain) return { type: isLow ? "PUBG_LOW" : "PUBG", ports: PORTS.LOBBY, urgent: false, pubg: true };

  if (isLow) return { type: "LOW", ports: PORTS.GENERAL, urgent: false, pubg: false };
  return { type: "OTHER", ports: PORTS.GENERAL, urgent: false, pubg: false };
}

// ============================================================================
// MAIN — JO FIRST → GULF/ME → EU BLOCKED — NO DIRECT
// ============================================================================
function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();

  // (3) ❌ أوروبا ممنوعة من الاسم/الـ URL
  if (isEUHost(host, url)) return BLOCK;

  var t = classify(host, url);

  // Resolve فقط لـ PUBG/urgent (لتخفيف الضغط على iOS)
  var resolvedIP = PUBG_KNOWN_IPS[host] || (t.pubg || t.urgent ? DNS_CACHE.resolve(host) : null);

  // (3) ❌ أوروبا ممنوعة من الـ IP
  if (resolvedIP && isEUIP(resolvedIP)) return BLOCK;

  // (1) 🇯🇴 الأردن أولاً
  var isJO = resolvedIP ? isJordanian(resolvedIP) : false;

  // ===================== MATCH / RECRUIT =====================
  if (t.type === "MATCH") {
    var locked = SESSION.getMatch();
    if (locked) return locked;

    if (isJO) {
      var matchJO = buildChainWithPorts([PROXIES.JO_1, PROXIES.JO_2], PORTS.MATCH);
      SESSION.setMatch(matchJO);
      return matchJO;
    }

    // (2) فشل JO → خليج/شرق أوسط (لكن أوروبا ممنوعة)
    if (isGulfHint(host, url)) {
      var matchME = buildChainWithPorts([PROXIES.JO_1, PROXIES.JO_2], PORTS.MATCH);
      SESSION.setMatch(matchME);
      return matchME;
    }

    return BLOCK;
  }

  // ===================== VOICE =====================
  if (t.type === "VOICE") {
    if (isJO) return buildChainWithPorts([PROXIES.JO_1], PORTS.VOICE);
    if (isGulfHint(host, url)) return buildChainWithPorts([PROXIES.JO_1, PROXIES.JO_2], PORTS.VOICE);
    return BLOCK;
  }

  // ===================== GAME =====================
  if (t.type === "GAME") {
    if (isJO) return buildChainWithPorts([PROXIES.JO_1], PORTS.GAME);
    if (isGulfHint(host, url)) return buildChainWithPorts([PROXIES.JO_1, PROXIES.JO_2], PORTS.GAME);
    return BLOCK;
  }

  // ===================== PUBG (حتى CDN/telemetry) =====================
  if (t.pubg) {
    if (isJO) return buildChainWithPorts([PROXIES.JO_1], PORTS.LOBBY);
    if (isGulfHint(host, url)) return buildChainWithPorts([PROXIES.JO_1, PROXIES.JO_2], PORTS.LOBBY);
    return BLOCK;
  }

  // ===================== NON-PUBG (NO DIRECT) =====================
  // حسب طلبك: no-direct مطلق — نخليه JO_1
  return buildChainWithPorts([PROXIES.JO_1], PORTS.GENERAL);
}
