// ==================== PUBG JORDAN PROXY (IPv4 + IPv6) ====================
// النسخة المحسّنة - خفض البنق + استقرار الاتصال
// تحديث: يناير 2025
// الجزء الأول من 2

var MATCH_ULTRA    = "PROXY 176.29.153.95:20001";    // أسرع سيرفر للماتش
var MATCH_PRIME    = "PROXY 82.212.84.33:20001";     // سيرفر احتياطي قوي
var LOBBY_ULTRA    = "PROXY 176.29.153.95:9030";     // اللوبي الرئيسي
var LOBBY_PRIME    = "PROXY 82.212.84.33:9030";      // لوبي احتياطي
var VOICE_PREMIUM  = "PROXY 82.212.84.33:10012";     // الصوت عالي الجودة
var ANALYTICS_LITE = "PROXY 46.185.131.218:443";     // التحليلات الخفيفة
var CDN_COMPRESS   = "PROXY 176.29.153.95:8080";    // تحميل الملفات
var PRELOAD_CACHE  = "PROXY 176.29.153.95:8080";     // التحميل المسبق
var WARMUP_PROXY   = "PROXY 176.29.153.95:7070";     // الإحماء
var BLOCK          = "PROXY 127.0.0.1:9";            // حظر
var DIRECT         = "DIRECT";                        // اتصال مباشر

// ==================== نطاقات IPv4 الأردنية (محدثة 2025) ====================

// TIER 1: أقل بنق (5-15ms) - نطاقات Orange/Zain الرئيسية
var JORDAN_TIER1_V4 = [
  ["176.29.0.0", "255.255.0.0"],        // Orange Jordan - النطاق الذهبي
  ["82.212.64.0", "255.255.192.0"],     // Zain Jordan - نطاق ممتاز
  ["188.123.160.0", "255.255.224.0"],   // Umniah - عالي الأداء
  ["37.48.0.0", "255.255.0.0"],         // Orange الموسع
  ["195.229.0.0", "255.254.0.0"]        // Jordan Telecom Group
];

// TIER 2: بنق منخفض (15-25ms) - نطاقات قوية جداً
var JORDAN_TIER2_V4 = [
  ["91.106.0.0", "255.255.0.0"],        // Orange Business
  ["176.28.128.0", "255.255.128.0"],    // Orange Extended
  ["86.108.0.0", "255.255.128.0"],      // Batelco Jordan
  ["213.6.0.0", "255.255.0.0"],         // Jordan Data
  ["188.161.0.0", "255.255.0.0"],       // Cyberia (fiber)
  ["31.153.0.0", "255.255.0.0"]         // Umniah Extended
];

// TIER 3: بنج متوسط (25-40ms) - نطاقات واسعة
var JORDAN_TIER3_V4 = [
  ["46.185.128.0", "255.255.128.0"],    // LinkDotNet Jordan
  ["92.253.0.0", "255.255.128.0"],      // Jordan Telecom
  ["94.249.0.0", "255.255.128.0"],      // Zain الموسع
  ["185.107.0.0", "255.255.0.0"],       // Jordan Data Centers
  ["37.202.0.0", "255.255.0.0"],        // Batelco الموسع
  ["193.188.0.0", "255.255.0.0"]        // Academic Network
];

// TIER 4: نطاقات إضافية (40-60ms)
var JORDAN_TIER4_V4 = [
  ["185.23.0.0", "255.255.0.0"],        // Regional
  ["212.35.0.0", "255.255.0.0"],        // Legacy Networks
  ["31.170.0.0", "255.255.0.0"],        // Mixed ISPs
  ["213.178.0.0", "255.255.0.0"],       // Government
  ["85.235.0.0", "255.255.0.0"],        // Educational
  ["62.150.0.0", "255.255.128.0"],      // Business
  ["178.133.0.0", "255.255.0.0"]        // Enterprise
];

// ==================== نطاقات IPv6 الأردنية (جديد!) ====================

// IPv6 TIER 1: أسرع نطاقات IPv6
var JORDAN_TIER1_V6 = [
  "2a02:2498::/32",     // Orange Jordan IPv6
  "2a00:1280::/32",     // Zain Jordan IPv6
  "2a04:2180::/29",     // Umniah IPv6
  "2a02:2200::/32"      // Jordan Telecom IPv6
];

// IPv6 TIER 2: نطاقات قوية
var JORDAN_TIER2_V6 = [
  "2a00:1328::/32",     // Batelco Jordan IPv6
  "2a02:2ad0::/32",     // LinkDotNet IPv6
  "2001:4978::/32",     // Academic Network IPv6
  "2a04:ac00::/29"      // Enterprise IPv6
];

// ==================== SESSION MANAGEMENT (محسّن) ====================
var SESSION = {
  // تتبع IPs
  matchIP: null,
  lobbyIP: null,
  voiceIP: null,
  
  // قفل الاتصال
  lockUntil: 0,
  lockStrength: 25000,              // زيادة من 18 إلى 25 ثانية (استقرار أفضل)
  
  // ماتشميكنج
  matchmakingAttempts: 0,
  maxMatchmakingAttempts: 4,        // تقليل من 6 إلى 4 (سرعة أكبر)
  lobbyRetryDelay: 2000,            // جديد: تأخير بين المحاولات
  
  // كاش DNS
  dnsCache: {},
  dnsCacheTimeout: 45000,           // زيادة من 30 إلى 45 ثانية
  
  // الحظر
  blockedIPs: {},
  permanentBlocks: {},
  blockDuration: 60000,             // تقليل من 90 إلى 60 ثانية
  
  // جودة الاتصال
  connectionQuality: 100,
  qualityThreshold: 60,             // زيادة من 50 إلى 60
  
  // إحصائيات
  stats: {
    matchConnections: 0,
    lobbyConnections: 0,
    blockedAttempts: 0,
    tier1Hits: 0,
    tier2Hits: 0,
    ipv6Usage: 0
  },
  
  // استقرار اللوبي
  lobbyStable: false,
  lobbyStableTime: 0,
  lobbyStabilityRequired: 3000      // جديد: 3 ثواني استقرار مطلوبة
};

// ==================== HELPER FUNCTIONS ====================

function now() { 
  return Date.now(); 
}

function norm(h) { 
  var i = h.indexOf(":"); 
  return i > -1 ? h.substring(0, i) : h; 
}

// فحص IPv4 في نطاق
function inListV4(ip, list) {
  if (!ip) return false;
  for (var i = 0; i < list.length; i++) {
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  }
  return false;
}

// فحص IPv6 (مبسط - يدعم البادئات الشائعة)
function isIPv6InRange(ip, prefix) {
  if (!ip || ip.indexOf(':') === -1) return false;
  var prefixParts = prefix.split('/');
  var baseAddr = prefixParts[0].toLowerCase();
  
  // مقارنة مبسطة للبادئة
  var ipLower = ip.toLowerCase();
  var prefixLen = baseAddr.length;
  
  return ipLower.substring(0, prefixLen) === baseAddr.substring(0, prefixLen);
}

// فحص IPv6 في قائمة
function inListV6(ip, list) {
  if (!ip || ip.indexOf(':') === -1) return false;
  for (var i = 0; i < list.length; i++) {
    if (isIPv6InRange(ip, list[i])) return true;
  }
  return false;
}

// الحصول على Tier للـ IP (IPv4 و IPv6)
function getIPTier(ip) {
  if (!ip) return 0;
  
  // فحص IPv6 أولاً
  if (ip.indexOf(':') > -1) {
    if (inListV6(ip, JORDAN_TIER1_V6)) {
      SESSION.stats.ipv6Usage++;
      return 1;
    }
    if (inListV6(ip, JORDAN_TIER2_V6)) {
      SESSION.stats.ipv6Usage++;
      return 2;
    }
    return 0; // IPv6 غير أردني
  }
  
  // فحص IPv4
  if (inListV4(ip, JORDAN_TIER1_V4)) return 1;
  if (inListV4(ip, JORDAN_TIER2_V4)) return 2;
  if (inListV4(ip, JORDAN_TIER3_V4)) return 3;
  if (inListV4(ip, JORDAN_TIER4_V4)) return 4;
  
  return 0; // ليس أردني
}

function isJordanIP(ip) { 
  return getIPTier(ip) > 0; 
}

// ==================== DNS CACHE (محسّن) ====================
function resolveWithCache(host) {
  // فحص الكاش أولاً
  if (SESSION.dnsCache[host]) {
    var c = SESSION.dnsCache[host];
    if (now() - c.time < SESSION.dnsCacheTimeout) {
      return c.ip;
    }
  }
  
  // Resolve جديد
  var ip = dnsResolve(host);
  
  // حفظ في الكاش
  if (ip) {
    SESSION.dnsCache[host] = { ip: ip, time: now() };
  }
  
  return ip;
}

// ==================== BLOCKING SYSTEM (محسّن) ====================
function blockIP(ip, permanent) {
  if (!ip) return;
  
  if (permanent) {
    SESSION.permanentBlocks[ip] = now();
  } else {
    SESSION.blockedIPs[ip] = now();
  }
  
  SESSION.stats.blockedAttempts++;
}

function isBlocked(ip) {
  if (!ip) return false;
  
  // فحص الحظر الدائم
  if (SESSION.permanentBlocks[ip]) return true;
  
  // فحص الحظر المؤقت
  if (SESSION.blockedIPs[ip]) {
    return (now() - SESSION.blockedIPs[ip]) < SESSION.blockDuration;
  }
  
  return false;
}

// ==================== DETECTION PATTERNS (موسّع) ====================

function isPUBG(h) {
  return /pubg|pubgm|intl|igame|tencent|krafton|lightspeed|proxima|lvl|levelinfinite/i.test(h);
}

function isMatch(u, h) {
  return /game|battle|match|realtime|udp|relay|tick|state|sync|room\d|server\d|authority|gameplay|combat/i.test(u + h);
}

function isLobby(u, h) {
  return /lobby|matchmaking|queue|dispatch|gateway|frontend|alloc|region|connect|join|find/i.test(u + h);
}

function isVoice(u, h) {
  return /voice|rtc|webrtc|voip|agora|vivox|audio|mic|talk|speech/i.test(u + h);
}

function isAnalytics(u, h) {
  return /analytics|telemetry|metric|track|event|log|crash|beacon|report|stats/i.test(u + h);
}

function isCDN(u, h) {
  return /cdn|asset|static|resource|download|patch|update|media|texture|image|content/i.test(u + h);
}

function isKeepAlive(u, h) {
  return /ping|pong|heartbeat|alive|health|status|keep|pulse/i.test(u + h);
}

// ==================== PROXY SELECTION (محسّن) ====================

function getMatchProxy() {
  if (SESSION.matchIP && getIPTier(SESSION.matchIP) === 1) {
    SESSION.stats.tier1Hits++;
    return MATCH_ULTRA;
  }
  SESSION.stats.tier2Hits++;
  return MATCH_PRIME;
}

function getLobbyProxy(tier) {
  if (tier === 1) {
    SESSION.stats.tier1Hits++;
    return LOBBY_ULTRA;
  }
  if (tier === 2) {
    SESSION.stats.tier2Hits++;
    return LOBBY_PRIME;
  }
  return LOBBY_ULTRA; // افتراضي
}

// ==================== MAIN PROXY LOGIC ====================

function FindProxyForURL(url, host) {
  host = norm(host.toLowerCase());
  
  // السماح للمواقع غير PUBG
  if (!isPUBG(host)) return DIRECT;
  
  // Resolve IP
  var ip = resolveWithCache(host);
  if (!ip) return BLOCK;
  
  // فحص الحظر
  if (isBlocked(ip)) return BLOCK;
  
  // الحصول على Tier
  var tier = getIPTier(ip);
  
  // ==================== KEEPALIVE (ضروري للاستقرار) ====================
  if (isKeepAlive(url, host)) {
    // استخدام نفس proxy الماتش لمنع قطع الاتصال
    return getMatchProxy();
  }
  
  // ==================== ANALYTICS (تحسين الأداء) ====================
  if (isAnalytics(url, host)) {
    return ANALYTICS_LITE;
  }
  
  // ==================== CDN (ملفات اللعبة) ====================
  if (isCDN(url, host)) {
    return CDN_COMPRESS;
  }
  
  // ==================== VOICE (صوت عالي الجودة) ====================
  if (isVoice(url, host)) {
    if (tier <= 2) {
      SESSION.voiceIP = ip;
      return VOICE_PREMIUM;
    }
    // حظر مؤقت للـ IPs الضعيفة
    blockIP(ip, false);
    return BLOCK;
  }
  
  // ==================== LOBBY (التحسين الأهم!) ====================
  if (isLobby(url, host)) {
    SESSION.stats.lobbyConnections++;
    SESSION.matchmakingAttempts++;
    
    // TIER 1: اتصال فوري
    if (tier === 1) {
      SESSION.matchmakingAttempts = 0;
      SESSION.lobbyIP = ip;
      SESSION.lobbyStable = true;
      SESSION.lobbyStableTime = now();
      return LOBBY_ULTRA;
    }
    
    // TIER 2: قبول بعد محاولتين فقط
    if (tier === 2 && SESSION.matchmakingAttempts >= 2) {
      SESSION.matchmakingAttempts = 0;
      SESSION.lobbyIP = ip;
      SESSION.lobbyStable = true;
      SESSION.lobbyStableTime = now();
      return LOBBY_PRIME;
    }
    
    // السماح بـ TIER 3 بعد 4 محاولات (طوارئ)
    if (tier === 3 && SESSION.matchmakingAttempts >= SESSION.maxMatchmakingAttempts) {
      SESSION.matchmakingAttempts = 0;
      SESSION.lobbyIP = ip;
      return LOBBY_PRIME;
    }
    
    // حظر مؤقت فقط (ليس دائم!)
    blockIP(ip, false);
    
    // إعادة محاولة مع السيرفر الافتراضي
    return LOBBY_ULTRA;
  }
  
  // ==================== MATCH (الأولوية القصوى!) ====================
  if (isMatch(url, host)) {
    SESSION.stats.matchConnections++;
    
    // إذا كان هناك match نشط ومقفول
    if (SESSION.matchIP && now() < SESSION.lockUntil) {
      // نفس الـ IP = استمرار
      if (ip === SESSION.matchIP) {
        return getMatchProxy();
      }
      
      // IP جديد أثناء Match = حظر دائم!
      blockIP(ip, true);
      
      // الاستمرار مع السيرفر الأصلي (منع القطع!)
      return getMatchProxy();
    }
    
    // TIER 1 أو TIER 2: قبول فوري
    if (tier <= 2) {
      SESSION.matchIP = ip;
      SESSION.lockUntil = now() + SESSION.lockStrength;
      return getMatchProxy();
    }
    
    // TIER 3: قبول إذا لم يكن هناك بديل أفضل
    if (tier === 3 && !SESSION.matchIP) {
      SESSION.matchIP = ip;
      SESSION.lockUntil = now() + (SESSION.lockStrength / 2); // قفل أقصر
      return MATCH_PRIME;
    }
    
    // رفض السيرفرات الضعيفة
    blockIP(ip, true);
    
    // الاحتفاظ بالسيرفر الحالي إن وُجد
    if (SESSION.matchIP) {
      return getMatchProxy();
    }
    
    // افتراضي
    return MATCH_PRIME;
  }
  
  // ==================== DEFAULT ====================
  return LOBBY_ULTRA;
}

// ==================== STATISTICS (اختياري - للتشخيص) ====================
// يمكن طباعة الإحصائيات في console المتصفح
function getStats() {
  return "PUBG Jordan Proxy Stats:\n" +
         "Match Connections: " + SESSION.stats.matchConnections + "\n" +
         "Lobby Connections: " + SESSION.stats.lobbyConnections + "\n" +
         "Blocked Attempts: " + SESSION.stats.blockedAttempts + "\n" +
         "TIER1 Hits: " + SESSION.stats.tier1Hits + "\n" +
         "TIER2 Hits: " + SESSION.stats.tier2Hits + "\n" +
         "IPv6 Usage: " + SESSION.stats.ipv6Usage;
}

// ========== نهاية السكريبت الكامل ==========

