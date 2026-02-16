/* =========================================================
   🏆 JORDAN OPEN VIEW – ALL REGIONS INCLUDED
   Target: See & Be Seen by All Jordan
   Proxy: Locked to Jordan IP (PROXY_C) for Matchmaking
   ========================================================= */

var PROXY_A = "PROXY 46.185.131.218:20001";
var PROXY_B = "PROXY 91.106.109.12:20001";
// 🇯🇴 البروكسي الأردني (Orange Jordan) - هذا هو المفتاح
var PROXY_C = "PROXY 176.29.153.95:20001";

/* ==============================
   ⚡ HASH ENGINE
   ============================== */
function ultraHash(str){
  var h = 2166136261;
  for (var i = 0; i < str.length; i++){
    h ^= str.charCodeAt(i);
    h += (h<<1) + (h<<4) + (h<<7) + (h<<8) + (h<<24);
  }
  return (h >>> 0);
}

/* ==============================
   🇯🇴 JORDAN RANGES (FULL COVERAGE)
   يشمل: زين، أورنج، أمنية، مادة، وشركات أخرى
   ============================== */
function isJordan(host){
  var ip = dnsResolve(host);
  if (!ip) return false;

  return (
    // --- Zain Jordan ---
    isInNet(ip, "31.44.0.0", "255.252.0.0") ||
    isInNet(ip, "77.31.0.0", "255.255.0.0") ||
    isInNet(ip, "82.212.0.0", "255.254.0.0") ||
    isInNet(ip, "188.123.0.0", "255.255.0.0") ||
    isInNet(ip, "213.139.0.0", "255.255.0.0") ||
    isInNet(ip, "87.236.0.0", "255.252.0.0") || // Parts of Zain/Structure

    // --- Orange Jordan ---
    isInNet(ip, "176.29.0.0", "255.255.0.0") ||
    isInNet(ip, "80.90.0.0", "255.255.0.0") ||
    isInNet(ip, "84.18.0.0", "255.255.0.0") ||
    isInNet(ip, "86.108.0.0", "255.255.0.0") ||
    isInNet(ip, "212.35.64.0", "255.255.192.0") ||
    isInNet(ip, "194.165.128.0", "255.255.224.0") ||
    isInNet(ip, "185.48.0.0", "255.255.0.0") ||

    // --- Umniah ---
    isInNet(ip, "178.20.0.0", "255.254.0.0") ||
    isInNet(ip, "94.142.32.0", "255.255.224.0") ||
    isInNet(ip, "74.50.0.0", "255.255.0.0") || // Some ranges
    isInNet(ip, "74.50.48.0", "255.255.240.0")||

    // --- Mada & Other Jordanian ISPs ---
    isInNet(ip, "92.253.0.0", "255.255.0.0") ||
    isInNet(ip, "46.32.0.0", "255.248.0.0") ||
    isInNet(ip, "37.17.0.0", "255.255.0.0") ||
    isInNet(ip, "5.45.128.0", "255.255.128.0") ||
    isInNet(ip, "91.144.0.0", "255.252.0.0") || // Some mix
    isInNet(ip, "178.238.176.0", "255.255.240.0") ||
    isInNet(ip, "217.144.0.0", "255.255.240.0") ||
    
    // --- DataVaults / Damamax / Dedicated ---
    isInNet(ip, "87.236.48.0", "255.255.240.0") ||
    isInNet(ip, "185.67.36.0", "255.255.252.0")
  );
}

/* ==============================
   🌍 GULF RANGES
   ============================== */
function isGulf(host){
  var ip = dnsResolve(host);
  if (!ip) return false;

  return (
    isInNet(ip, "2.16.0.0", "255.240.0.0") || 
    isInNet(ip, "5.44.0.0", "255.252.0.0") ||
    isInNet(ip, "37.17.0.0", "255.255.0.0") ||
    isInNet(ip, "78.108.0.0", "255.255.0.0") ||
    isInNet(ip, "89.28.0.0", "255.248.0.0") ||
    isInNet(ip, "188.161.0.0", "255.255.0.0") ||
    isInNet(ip, "213.6.0.0", "255.254.0.0")
  );
}

/* ==============================
   🎮 PUBG DETECTION
   ============================== */
function isPUBG(host, url){
  var s = (host + " " + url).toLowerCase();

  return (
    /pubg|pubgm|pubgmobile|krafton|lightspeed|proximabeta/.test(s) ||
    /tencent|qcloud|myqcloud|tencentcs/.test(s) ||
    /amazonaws|aliyun|gcloud|me-south-1/.test(s) ||
    /battle|match|arena|allocation|session|dispatcher/.test(s) ||
    /erangel|tdm|payload|metro|rank|classic/.test(s)
  );
}

/* ==============================
   🔐 STICKY CORE (JORDAN LOCK)
   ============================== */
var LOCKED_CORE = null;

function selectCore(host, url){

  // إذا تم تحديد السيرفر مسبقاً، نثبته لضمان استقرار الجلسة
  if (LOCKED_CORE !== null) return LOCKED_CORE;

  // إذا كان الهدف أردني، نستخدم بروكسي C لأنه أردني IP
  if (isJordan(host)){
    LOCKED_CORE = PROXY_C; 
    return LOCKED_CORE;
  }

  // إذا كان الهدف خليجي
  if (isGulf(host)){
    LOCKED_CORE = PROXY_C; // نستخدم الأردني أيضاً لتقليل البنق وربط اللعب
    return LOCKED_CORE;
  }

  // لباقي الاتصالات (سيرفرات اللعبة العالمية)
  // نستخدم البروكسي الأردني لضمان أن "بصمتك" أردنية داخل اللعبة
  LOCKED_CORE = PROXY_C;
  return LOCKED_CORE;
}

/* ==============================
   🚀 MAIN ENGINE
   ============================== */
function FindProxyForURL(url, host){

  var h = host.toLowerCase();

  /* ✅ استثناءات ضرورية (يوتيوب وجيت هاب) */
  if (dnsDomainIs(h, "github.com") ||
      dnsDomainIs(h, "www.github.com") ||
      shExpMatch(h, "*.github.com") ||
      dnsDomainIs(h, "youtube.com") ||
      dnsDomainIs(h, "www.youtube.com") ||
      shExpMatch(h, "*.youtube.com") ||
      dnsDomainIs(h, "apple.com") ||
      dnsDomainIs(h, "icloud.com")){
        return "DIRECT";
  }

  /* 🚫 لا يوجد حظر لأي دولة (تم إزالة كود حظر سوريا) */

  /* 🎮 توجيه ببجي */
  if (isPUBG(host, url)){
    // توجيه كل شيء للبروكسي الأردني C
    return selectCore(host, url);
  }

  /* 🌍 تصفح عادي */
  return "DIRECT";
}
