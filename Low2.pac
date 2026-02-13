/* ==============================
   🎯 إعدادات البروكسي
   ============================== */
var PROXY_A = "PROXY 46.185.131.218:20001";
var PROXY_B = "PROXY 91.106.109.12:20001";
var PROXY_C = "PROXY 176.29.153.95:20001";

/* ==============================
   ⚡ محرك الهاش
   ============================== */
function ultraHash(str) {
  var h = 2166136261;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0);
}

/* ==============================
   🇯🇴 كشف الأردن بدون DNS
   ============================== */
function isJordanDomain(host) {
  var h = host.toLowerCase();
  
  // دومينات أردنية معروفة
  if (shExpMatch(h, "*.jo") ||
      shExpMatch(h, "*.orange.jo") ||
      shExpMatch(h, "*.zain.jo") ||
      shExpMatch(h, "*.umniah.com")) {
    return true;
  }
  
  // كلمات مفتاحية أردنية
  if (/jordan|amman|zarqa|irbid|aqaba/.test(h)) {
    return true;
  }
  
  return false;
}

function isJordanIP(host) {
  // محاولة الحصول على IP مباشرة
  var ip = host;
  
  // فحص إذا كان النص IP مباشر
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
    return (
      isInNet(ip, "31.44.0.0", "255.252.0.0") ||
      isInNet(ip, "37.17.0.0", "255.255.0.0") ||
      isInNet(ip, "46.32.0.0", "255.248.0.0") ||
      isInNet(ip, "78.135.0.0", "255.255.0.0") ||
      isInNet(ip, "85.94.0.0", "255.254.0.0") ||
      isInNet(ip, "89.28.0.0", "255.248.0.0") ||
      isInNet(ip, "94.249.0.0", "255.255.0.0") ||
      isInNet(ip, "176.29.0.0", "255.255.0.0") ||
      isInNet(ip, "188.161.0.0", "255.255.0.0") ||
      isInNet(ip, "212.118.0.0", "255.254.0.0")
    );
  }
  
  return false;
}

function isJordan(host) {
  // فحص الدومين أولاً
  if (isJordanDomain(host)) return true;
  
  // فحص IP مباشرة
  if (isJordanIP(host)) return true;
  
  return false;
}

/* ==============================
   🇸🇾 حظر سوريا
   ============================== */
function isSyria(host) {
  var h = host.toLowerCase();
  
  // دومينات سورية
  if (shExpMatch(h, "*.sy")) return true;
  
  // فحص IP إذا كان مباشر
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
    return (
      isInNet(host, "5.0.0.0", "255.0.0.0") ||
      isInNet(host, "31.9.0.0", "255.255.0.0") ||
      isInNet(host, "37.48.0.0", "255.240.0.0") ||
      isInNet(host, "82.137.192.0", "255.255.192.0") ||
      isInNet(host, "91.144.0.0", "255.252.0.0") ||
      isInNet(host, "176.29.0.0", "255.255.0.0")
    );
  }
  
  return false;
}

/* ==============================
   🌍 كشف الخليج بدون DNS
   ============================== */
function isGulfDomain(host) {
  var h = host.toLowerCase();
  
  // دومينات خليجية
  if (shExpMatch(h, "*.sa") ||
      shExpMatch(h, "*.ae") ||
      shExpMatch(h, "*.kw") ||
      shExpMatch(h, "*.qa") ||
      shExpMatch(h, "*.bh") ||
      shExpMatch(h, "*.om")) {
    return true;
  }
  
  // كلمات مفتاحية خليجية
  if (/saudi|dubai|kuwait|qatar|bahrain|oman|emirates/.test(h)) {
    return true;
  }
  
  return false;
}

function isGulfIP(host) {
  if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
    return false;
  }
  
  return (
    isInNet(host, "2.16.0.0", "255.240.0.0") ||
    isInNet(host, "5.44.0.0", "255.252.0.0") ||
    isInNet(host, "37.17.0.0", "255.255.0.0") ||
    isInNet(host, "46.32.0.0", "255.248.0.0") ||
    isInNet(host, "77.28.0.0", "255.252.0.0") ||
    isInNet(host, "78.108.0.0", "255.255.0.0") ||
    isInNet(host, "89.28.0.0", "255.248.0.0") ||
    isInNet(host, "102.64.0.0", "255.192.0.0") ||
    isInNet(host, "178.20.0.0", "255.252.0.0") ||
    isInNet(host, "185.48.0.0", "255.255.0.0") ||
    isInNet(host, "212.35.64.0", "255.255.192.0") ||
    isInNet(host, "213.6.0.0", "255.254.0.0")
  );
}

function isGulf(host) {
  if (isGulfDomain(host)) return true;
  if (isGulfIP(host)) return true;
  return false;
}

/* ==============================
   🎮 كشف PUBG
   ============================== */
function isPUBG(host, url) {
  var combined = (host + " " + url).toLowerCase();

  if (/pubg|pubgm|krafton|proximabeta|lightspeed/.test(combined)) return true;
  if (/tencent|qcloud|myqcloud|tencentcs|tdm/.test(combined)) return true;
  if (/amazonaws|aliyun|gcloud/.test(combined)) {
    if (/me-south|ap-south|eu-west|us-east/.test(combined)) return true;
  }
  if (/battle|match|arena|session|dispatcher|allocation/.test(combined)) return true;
  if (/erangel|miramar|sanhok|vikendi|livik|karakin|metro|payload/.test(combined)) return true;

  return false;
}

/* ==============================
   🔐 نظام الجلسة الثابتة
   ============================== */
var SESSION = {
  proxy: null,
  hostPattern: null,
  timestamp: 0,
  duration: 300000
};

function getTime() {
  return new Date().getTime();
}

function isExpired() {
  return (getTime() - SESSION.timestamp) > SESSION.duration;
}

function lockSession(proxy, host) {
  SESSION.proxy = proxy;
  SESSION.hostPattern = host.substring(0, 20);
  SESSION.timestamp = getTime();
}

function getSession(host) {
  if (!SESSION.proxy) return null;
  if (isExpired()) {
    SESSION.proxy = null;
    return null;
  }
  
  // مطابقة بسيطة بدون DNS
  if (host.indexOf(SESSION.hostPattern) === 0) {
    SESSION.timestamp = getTime();
    return SESSION.proxy;
  }
  
  return null;
}

/* ==============================
   🎯 اختيار البروكسي
   ============================== */
function selectProxy(host, url) {
  var locked = getSession(host);
  if (locked) return locked;

  // 🇯🇴 أولوية الأردن
  if (isJordan(host)) {
    lockSession(PROXY_A, host);
    return PROXY_A;
  }

  // 🌍 الخليج
  if (isGulf(host)) {
    var hash = ultraHash(host + url);
    var mod = hash % 3;
    var proxy = (mod === 0) ? PROXY_A :
                (mod === 1) ? PROXY_B :
                              PROXY_C;
    lockSession(proxy, host);
    return proxy;
  }

  // 🌐 باقي الدول
  var hash = ultraHash(host + url);
  var proxy = (hash % 2 === 0) ? PROXY_A : PROXY_B;
  lockSession(proxy, host);
  return proxy;
}

/* ==============================
   🚀 المحرك الرئيسي
   ============================== */
function FindProxyForURL(url, host) {
  var h = host.toLowerCase();

  // ✅ استثناءات
  if (dnsDomainIs(h, "github.com") ||
      shExpMatch(h, "*.github.com") ||
      dnsDomainIs(h, "youtube.com") ||
      shExpMatch(h, "*.youtube.com") ||
      shExpMatch(h, "*.googlevideo.com")) {
    return "DIRECT";
  }

  // 🚫 حظر سوريا
  if (isSyria(host)) {
    return "PROXY 127.0.0.1:1";
  }

  // 🎮 PUBG
  if (isPUBG(host, url)) {
    return selectProxy(host, url);
  }

  return selectProxy(host, url);
}
