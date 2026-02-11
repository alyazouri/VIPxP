var PROXY = {
  MATCH_JO_1   : "PROXY 176.29.153.95:20001",
  MATCH_JO_2   : "PROXY 176.29.153.95:20002",
  MATCH_JO_3   : "PROXY 176.29.153.95:20003",
  LOBBY_MAIN   : "PROXY 212.35.66.45:9030",
  BLACKHOLE    : "PROXY 127.0.0.1:1"
};

/* ========================================
   🧬 GENETIC ALGORITHM - IP CLASSIFICATION
   تصنيف ذكي بناءً على DNA الشبكة
   ======================================== */
function getNetworkDNA(host){
  var octets = host.split(".");
  if (octets.length !== 4) return null;
  
  var dna = {
    first: parseInt(octets[0]),
    second: parseInt(octets[1]),
    third: parseInt(octets[2]),
    class: "",
    region: "",
    confidence: 0
  };
  
  // تحديد Class الشبكة
  if (dna.first >= 1 && dna.first <= 126) dna.class = "A";
  else if (dna.first >= 128 && dna.first <= 191) dna.class = "B";
  else if (dna.first >= 192 && dna.first <= 223) dna.class = "C";
  
  return dna;
}

/* ========================================
   🎯 ADVANCED JORDAN DETECTION
   كشف متعدد الطبقات للمسارات الأردنية
   ======================================== */
function isJordanTier1(host){
  var dna = getNetworkDNA(host);
  if (!dna) return false;
  
  // Layer 1: Exact ISP ranges
  return (
    // Orange Jordan - Expanded
    (dna.first === 46 && dna.second >= 32 && dna.second <= 39) ||
    (dna.first === 37 && dna.second === 17) ||
    (dna.first === 31 && dna.second >= 44 && dna.second <= 47) ||
    (dna.first === 94 && dna.second === 249) ||
    (dna.first === 188 && dna.second === 161) ||
    (dna.first === 78 && dna.second === 135) ||
    (dna.first === 91 && dna.second >= 144 && dna.second <= 151) ||
    (dna.first === 176 && dna.second >= 10 && dna.second <= 11) ||
    (dna.first === 185 && dna.second >= 88 && dna.second <= 91) ||
    
    // Zain Jordan - Expanded
    (dna.first === 89 && dna.second >= 28 && dna.second <= 35) ||
    (dna.first === 45 && dna.second >= 128 && dna.second <= 131) ||
    (dna.first === 185 && dna.second === 5 && dna.third >= 156 && dna.third <= 159) ||
    (dna.first === 185 && dna.second === 117 && dna.third >= 8 && dna.third <= 15) ||
    (dna.first === 37 && dna.second >= 44 && dna.second <= 47) ||
    
    // Umniah - Expanded
    (dna.first === 102 && dna.second >= 64 && dna.second <= 127) ||
    (dna.first === 185 && dna.second === 127 && dna.third >= 76 && dna.third <= 79) ||
    (dna.first === 37 && dna.second >= 48 && dna.second <= 51) ||
    (dna.first === 185 && dna.second === 20 && dna.third >= 224 && dna.third <= 255) ||
    
    // Batelco Jordan
    (dna.first === 46 && dna.second >= 244 && dna.second <= 247) ||
    
    // Jordan Gov/University
    (dna.first === 196 && dna.second >= 204 && dna.second <= 207) ||
    (dna.first === 212 && dna.second >= 100 && dna.second <= 101) ||
    (dna.first === 193 && dna.second >= 188 && dna.second <= 191)
  );
}

/* ========================================
   🌐 CDN INTELLIGENCE
   تحليل ذكي لـ CDN مع تتبع GEO
   ======================================== */
function analyzeCDN(host){
  var dna = getNetworkDNA(host);
  if (!dna) return {provider: "unknown", hasJordanPOP: false, score: 0};
  
  var result = {
    provider: "unknown",
    hasJordanPOP: false,
    score: 0
  };
  
  // Cloudflare detection
  if ((dna.first === 104 && dna.second >= 16 && dna.second <= 31) ||
      (dna.first === 172 && dna.second >= 64 && dna.second <= 95) ||
      (dna.first === 188 && dna.second === 114 && dna.third >= 96 && dna.third <= 127)) {
    result.provider = "cloudflare";
    result.hasJordanPOP = true;
    result.score = 95;
  }
  
  // Google Global Cache
  else if ((dna.first === 142 && dna.second >= 250 && dna.second <= 251) ||
           (dna.first === 172 && dna.second === 217) ||
           (dna.first === 216 && dna.second === 239 && dna.third >= 32 && dna.third <= 63)) {
    result.provider = "google";
    result.hasJordanPOP = true;
    result.score = 90;
  }
  
  // Akamai
  else if ((dna.first === 23 && dna.second >= 32 && dna.second <= 95) ||
           (dna.first === 104 && dna.second >= 64 && dna.second <= 127)) {
    result.provider = "akamai";
    result.hasJordanPOP = true;
    result.score = 85;
  }
  
  // Meta (Facebook/Instagram)
  else if ((dna.first === 157 && dna.second === 240) ||
           (dna.first === 31 && dna.second === 13 && dna.third >= 64 && dna.third <= 127)) {
    result.provider = "meta";
    result.hasJordanPOP = true;
    result.score = 80;
  }
  
  // Fastly
  else if ((dna.first === 151 && dna.second === 101) ||
           (dna.first === 199 && dna.second === 232)) {
    result.provider = "fastly";
    result.hasJordanPOP = false;
    result.score = 60;
  }
  
  return result;
}

/* ========================================
   🌍 GULF COALITION
   تحالف خليجي موسع
   ======================================== */
function isGulfCoalition(host){
  var dna = getNetworkDNA(host);
  if (!dna) return false;
  
  return (
    // UAE Tier 1
    (dna.first === 5 && dna.second >= 1 && dna.second <= 127) ||
    (dna.first === 213 && dna.second >= 42 && dna.second <= 43) ||
    (dna.first === 31 && dna.second >= 222 && dna.second <= 223) ||
    (dna.first === 85 && dna.second === 15) ||
    (dna.first === 217 && dna.second === 18) ||
    
    // Saudi Tier 1
    (dna.first === 85 && dna.second === 25) ||
    (dna.first === 188 && dna.second === 245) ||
    (dna.first === 213 && dna.second >= 130 && dna.second <= 131) ||
    (dna.first === 91 && dna.second >= 102 && dna.second <= 103) ||
    
    // Kuwait
    (dna.first === 87 && dna.second >= 236 && dna.second <= 237) ||
    (dna.first === 195 && dna.second === 229) ||
    (dna.first === 62 && dna.second === 215) ||
    
    // Bahrain
    (dna.first === 37 && dna.second === 223) ||
    (dna.first === 82 && dna.second === 178) ||
    (dna.first === 195 && dna.second === 229) ||
    
    // Qatar
    (dna.first === 37 && dna.second >= 210 && dna.second <= 211) ||
    (dna.first === 78 && dna.second >= 100 && dna.second <= 101) ||
    (dna.first === 185 && dna.second === 60) ||
    
    // Oman
    (dna.first === 5 && dna.second >= 36 && dna.second <= 37) ||
    (dna.first === 46 && dna.second === 49) ||
    
    // Egypt (geographic proximity)
    (dna.first === 41 && dna.second >= 128 && dna.second <= 191) ||
    (dna.first === 156 && dna.second >= 160 && dna.second <= 191) ||
    (dna.first === 197 && dna.second >= 32 && dna.second <= 63)
  );
}

/* ========================================
   🚫 EUROPEAN DEATH ZONE
   منطقة الموت الأوروبية - رفض شامل
   ======================================== */
function isEuropeanDeathZone(host){
  var dna = getNetworkDNA(host);
  if (!dna) return false;
  
  // Aggressive European blocking
  var europeanFirstOctets = [
    2, 31, 37, 46, 62, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    90, 91, 92, 93, 94, 95, 109, 128, 130, 134, 141, 145, 151, 176, 178,
    185, 188, 193, 194, 195, 212, 213, 217
  ];
  
  // Check if first octet is in European range
  for (var i = 0; i < europeanFirstOctets.length; i++) {
    if (dna.first === europeanFirstOctets[i]) {
      // Double-check: not Jordan or Gulf
      if (isJordanTier1(host) || isGulfCoalition(host)) {
        return false;
      }
      
      // Additional European indicators
      if (dna.second >= 0 && dna.second <= 255) {
        // Check common European ISP patterns
        var isDefinitelyEurope = (
          // Deutsche Telekom patterns
          (dna.first === 77 || dna.first === 91) ||
          // British Telecom
          (dna.first === 80 || dna.first === 86) ||
          // France Telecom
          (dna.first === 82 || dna.first === 90) ||
          // Italian ISPs
          (dna.first === 79 || dna.first === 87) ||
          // Spanish ISPs
          (dna.first === 83 || dna.first === 88)
        );
        
        if (isDefinitelyEurope) return true;
      }
    }
  }
  
  return false;
}

/* ========================================
   🎮 TENCENT CLOUD DEEP INSPECTION
   فحص عميق لسحابة تنسنت
   ======================================== */
function inspectTencentCloud(host, url){
  var fullText = (host + " " + url).toLowerCase();
  
  var regions = [
    // Middle East - PRIORITY
    {
      patterns: [/bahrain/i, /\bbh\b/i, /me-east/i, /ap-bahrain/i],
      region: "BAHRAIN",
      priority: 100,
      proxy: "MATCH_JO_1"
    },
    {
      patterns: [/dubai/i, /\buae\b/i, /me-south/i, /ap-dubai/i],
      region: "UAE",
      priority: 95,
      proxy: "MATCH_JO_1"
    },
    
    // Asia - ACCEPTABLE
    {
      patterns: [/mumbai/i, /india/i, /\bin\b/i, /ap-mumbai/i, /ap-south/i],
      region: "MUMBAI",
      priority: 75,
      proxy: "MATCH_JO_2"
    },
    {
      patterns: [/singapore/i, /\bsg\b/i, /ap-singapore/i, /sea/i],
      region: "SINGAPORE",
      priority: 70,
      proxy: "MATCH_JO_2"
    },
    {
      patterns: [/hongkong/i, /\bhk\b/i, /ap-hongkong/i],
      region: "HONGKONG",
      priority: 65,
      proxy: "MATCH_JO_3"
    },
    {
      patterns: [/tokyo/i, /japan/i, /\bjp\b/i, /ap-tokyo/i, /ap-northeast/i],
      region: "TOKYO",
      priority: 60,
      proxy: "MATCH_JO_3"
    },
    
    // Europe - BLACKLISTED
    {
      patterns: [/frankfurt/i, /germany/i, /\bde\b/i, /eu-central/i, /europe/i],
      region: "EUROPE",
      priority: -1000,
      proxy: "BLACKHOLE"
    },
    {
      patterns: [/london/i, /\buk\b/i, /eu-west/i],
      region: "EUROPE",
      priority: -1000,
      proxy: "BLACKHOLE"
    },
    {
      patterns: [/paris/i, /france/i, /\bfr\b/i],
      region: "EUROPE",
      priority: -1000,
      proxy: "BLACKHOLE"
    }
  ];
  
  var bestMatch = null;
  var highestPriority = -9999;
  
  for (var i = 0; i < regions.length; i++) {
    var region = regions[i];
    for (var j = 0; j < region.patterns.length; j++) {
      if (region.patterns[j].test(fullText)) {
        if (region.priority > highestPriority) {
          bestMatch = region;
          highestPriority = region.priority;
        }
      }
    }
  }
  
  return bestMatch;
}

/* ========================================
   🔬 DEEP PACKET INSPECTION SIMULATION
   محاكاة فحص الباكيت العميق
   ======================================== */
function deepPacketInspection(url){
  var analysis = {
    type: "unknown",
    confidence: 0,
    isMatch: false,
    isLobby: false
  };
  
  var u = (url || "").toLowerCase();
  var urlLength = u.length;
  
  // Pattern 1: Direct IP connections (usually match servers)
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(u) && urlLength < 30) {
    analysis.type = "match_server";
    analysis.isMatch = true;
    analysis.confidence = 95;
    return analysis;
  }
  
  // Pattern 2: WebSocket connections (real-time game)
  if (/ws:\/\/|wss:\/\//i.test(u)) {
    analysis.type = "websocket_game";
    analysis.isMatch = true;
    analysis.confidence = 90;
    return analysis;
  }
  
  // Pattern 3: UDP relay indicators
  if (/relay|turn|stun|ice/i.test(u)) {
    analysis.type = "voice_relay";
    analysis.isMatch = true;
    analysis.confidence = 85;
    return analysis;
  }
  
  // Pattern 4: API endpoints (lobby functions)
  if (/\/api\/|\/v\d+\/|\.json|\.php/i.test(u) && urlLength > 50) {
    analysis.type = "api_call";
    analysis.isLobby = true;
    analysis.confidence = 80;
    return analysis;
  }
  
  // Pattern 5: Asset loading (can be direct)
  if (/\.(jpg|png|webp|mp4|m4a|bundle|pak|bin)(\?|$)/i.test(u)) {
    analysis.type = "asset";
    analysis.isLobby = true;
    analysis.confidence = 70;
    return analysis;
  }
  
  // Pattern 6: Match-specific keywords
  var matchKeywords = [
    "battle", "combat", "fight", "game", "match", "play", "versus",
    "arena", "tdm", "classic", "spawn", "loot", "zone", "circle"
  ];
  
  var matchCount = 0;
  for (var i = 0; i < matchKeywords.length; i++) {
    if (u.indexOf(matchKeywords[i]) !== -1) matchCount++;
  }
  
  if (matchCount >= 2) {
    analysis.type = "match_related";
    analysis.isMatch = true;
    analysis.confidence = 75;
    return analysis;
  }
  
  // Pattern 7: Lobby-specific keywords
  var lobbyKeywords = [
    "lobby", "room", "queue", "matchmaking", "invite", "friend",
    "shop", "store", "inventory", "profile", "settings", "news"
  ];
  
  var lobbyCount = 0;
  for (var i = 0; i < lobbyKeywords.length; i++) {
    if (u.indexOf(lobbyKeywords[i]) !== -1) lobbyCount++;
  }
  
  if (lobbyCount >= 2) {
    analysis.type = "lobby_related";
    analysis.isLobby = true;
    analysis.confidence = 75;
    return analysis;
  }
  
  return analysis;
}

/* ========================================
   🧮 MULTI-DIMENSIONAL SCORING
   تسجيل متعدد الأبعاد
   ======================================== */
function calculateMultiScore(host, url){
  var score = {
    jordan: 0,
    gulf: 0,
    cdn: 0,
    asia: 0,
    europe: 0,
    total: 0,
    recommendation: ""
  };
  
  // Dimension 1: Jordan presence
  if (isJordanTier1(host)) {
    score.jordan = 100;
  }
  
  // Dimension 2: CDN analysis
  var cdnInfo = analyzeCDN(host);
  if (cdnInfo.hasJordanPOP) {
    score.cdn = cdnInfo.score;
  }
  
  // Dimension 3: Gulf coalition
  if (isGulfCoalition(host)) {
    score.gulf = 80;
  }
  
  // Dimension 4: Europe penalty
  if (isEuropeanDeathZone(host)) {
    score.europe = -500; // Massive penalty
  }
  
  // Dimension 5: Tencent cloud
  var tencentInfo = inspectTencentCloud(host, url);
  if (tencentInfo) {
    if (tencentInfo.priority > 50) {
      score.asia = tencentInfo.priority;
    } else if (tencentInfo.priority < 0) {
      score.europe = tencentInfo.priority;
    }
  }
  
  // Calculate total
  score.total = score.jordan + score.gulf + score.cdn + score.asia + score.europe;
  
  // Recommendation
  if (score.total >= 100) score.recommendation = "TIER_1"; // Best
  else if (score.total >= 70) score.recommendation = "TIER_2"; // Good
  else if (score.total >= 40) score.recommendation = "TIER_3"; // Acceptable
  else if (score.total < 0) score.recommendation = "BLACKLIST"; // Reject
  else score.recommendation = "TIER_4"; // Low priority
  
  return score;
}

/* ========================================
   🎲 ENHANCED FINGERPRINT
   بصمة محسنة مع entropy
   ======================================== */
function enhancedFingerprint(host, url){
  var data = (host || "") + "|" + ((url || "").substring(0, 100));
  var hash = 0;
  var entropy = 0;
  
  // DJB2 hash algorithm
  for (var i = 0; i < data.length; i++) {
    var char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
    entropy += char % 17; // Add entropy
  }
  
  return {
    hash: Math.abs(hash) >>> 0,
    entropy: entropy % 100,
    mod: function(n) { return (Math.abs(hash) >>> 0) % n; }
  };
}

/* ========================================
   🎯 INTELLIGENT MATCH PROXY SELECTOR
   اختيار ذكي لبروكسي المباراة
   ======================================== */
function selectMatchProxy(host, url, fp){
  var score = calculateMultiScore(host, url);
  
  // BLACKLIST: Immediate rejection
  if (score.recommendation === "BLACKLIST") {
    return PROXY.BLACKHOLE;
  }
  
  // TIER 1: Jordan absolute - Concentrate on JO_1
  if (score.recommendation === "TIER_1") {
    // 80% on JO_1, 15% on JO_2, 5% on JO_3
    if (fp.mod(100) < 80) return PROXY.MATCH_JO_1;
    if (fp.mod(100) < 95) return PROXY.MATCH_JO_2;
    return PROXY.MATCH_JO_3;
  }
  
  // TIER 2: Good quality - Balanced distribution
  if (score.recommendation === "TIER_2") {
    // 60% on JO_1, 30% on JO_2, 10% on JO_3
    if (fp.mod(100) < 60) return PROXY.MATCH_JO_1;
    if (fp.mod(100) < 90) return PROXY.MATCH_JO_2;
    return PROXY.MATCH_JO_3;
  }
  
  // TIER 3: Acceptable - More distributed
  if (score.recommendation === "TIER_3") {
    // 40% on JO_1, 40% on JO_2, 20% on JO_3
    if (fp.mod(100) < 40) return PROXY.MATCH_JO_1;
    if (fp.mod(100) < 80) return PROXY.MATCH_JO_2;
    return PROXY.MATCH_JO_3;
  }
  
  // TIER 4: Low priority - Even distribution
  // 33% each
  var mod3 = fp.mod(3);
  if (mod3 === 0) return PROXY.MATCH_JO_1;
  if (mod3 === 1) return PROXY.MATCH_JO_2;
  return PROXY.MATCH_JO_3;
}

/* ========================================
   🎮 PUBG ENHANCED DETECTION
   ======================================== */
function isPUBGEnhanced(host, url){
  var combined = ((host || "") + " " + (url || "")).toLowerCase();
  
  // Core patterns
  var corePatterns = [
    /pubg/i, /pubgm/i, /pubgmobile/i,
    /intlgame/i, /igamecj/i, /krafton/i,
    /tencent/i, /qq\.com/i, /lightspeed/i,
    /proximabeta/i, /amsoveasea/i,
    /gcloud/i, /qcloud/i, /myqcloud/i, /tencentcs/i
  ];
  
  for (var i = 0; i < corePatterns.length; i++) {
    if (corePatterns[i].test(combined)) return true;
  }
  
  // Service patterns
  var servicePatterns = [
    /vmp/i, /gme/i, /voice/i, /voip/i,
    /anticheat/i, /pandora/i, /bugly/i,
    /gamecenter/i, /gameserver/i
  ];
  
  for (var i = 0; i < servicePatterns.length; i++) {
    if (servicePatterns[i].test(combined)) return true;
  }
  
  // Analytics patterns
  var analyticsPatterns = [
    /adjust/i, /appsflyer/i, /firebase/i,
    /crashlytics/i, /analytics/i
  ];
  
  for (var i = 0; i < analyticsPatterns.length; i++) {
    if (analyticsPatterns[i].test(combined)) return true;
  }
  
  return false;
}

/* ========================================
   🧠 MASTER CLASSIFIER
   المصنف الرئيسي
   ======================================== */
function masterClassifier(host, url){
  var fp = enhancedFingerprint(host, url);
  
  // Step 1: Deep packet inspection
  var packetAnalysis = deepPacketInspection(url);
  
  // Step 2: Tencent cloud check
  var tencentInfo = inspectTencentCloud(host, url);
  if (tencentInfo) {
    if (tencentInfo.proxy === "BLACKHOLE") {
      return PROXY.BLACKHOLE;
    }
    if (packetAnalysis.isMatch) {
      return tencentInfo.proxy;
    }
  }
  
  // Step 3: European death zone check
  if (isEuropeanDeathZone(host)) {
    return PROXY.BLACKHOLE;
  }
  
  // Step 4: Route based on packet type
  if (packetAnalysis.isMatch && packetAnalysis.confidence >= 80) {
    return selectMatchProxy(host, url, fp);
  }
  
  if (packetAnalysis.isLobby) {
    return PROXY.LOBBY_MAIN;
  }
  
  // Step 5: Multi-score based routing
  var score = calculateMultiScore(host, url);
  
  if (score.recommendation === "BLACKLIST") {
    return PROXY.BLACKHOLE;
  }
  
  if (score.total >= 70) {
    // High quality path - likely match traffic
    return selectMatchProxy(host, url, fp);
  }
  
  // Default: lobby
  return PROXY.LOBBY_MAIN;
}

/* ========================================
   🚀 PAC ENTRY POINT
   ======================================== */
function FindProxyForURL(url, host){
  // PUBG traffic detection
  if (isPUBGEnhanced(host, url)) {
    return masterClassifier(host, url);
  }
  
  // Non-PUBG traffic
  return "DIRECT";
}
