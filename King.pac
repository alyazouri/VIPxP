// =====================================================
// PUBG GLOBAL – JO LONG-TERM SMART PAC (FINAL)
// Stable / No Future Edits Needed
// =====================================================

// =======================
// JORDAN PROXIES (CORE)
// =======================
var JO = {
  ZAIN   : "PROXY 82.212.84.33:8080",
  ORANGE : "PROXY 212.35.66.45:8080",
  UMNIAH : "PROXY 91.106.109.12:8080",
  BACKUP : "PROXY 46.32.102.152:8080",
  BLOCK  : "PROXY 127.0.0.1:9"
};

// =======================
// PUBG GLOBAL DOMAINS
// =======================
function isPUBG(host) {
  return shExpMatch(host, "*.pubgmobile.com") ||
         shExpMatch(host, "*.igamecj.com") ||
         shExpMatch(host, "*.intlgame.com") ||
         shExpMatch(host, "*.tencent.com") ||
         shExpMatch(host, "*.proximabeta.com");
}

// =======================
// TRAFFIC DETECTION
// =======================
function isMatchmaking(url) {
  var u = url.toLowerCase();
  return u.indexOf("match") !== -1 ||
         u.indexOf("queue") !== -1 ||
         u.indexOf("lobby") !== -1 ||
         u.indexOf("room") !== -1 ||
         u.indexOf("recruit") !== -1;
}

function isVoice(url) {
  var u = url.toLowerCase();
  return u.indexOf("voice") !== -1 ||
         u.indexOf("rtc") !== -1 ||
         u.indexOf("webrtc") !== -1 ||
         u.indexOf("voip") !== -1 ||
         u.indexOf("gvoice") !== -1;
}

// =======================
// PEAK HOURS (JO DENSITY)
// =======================
function isPeak() {
  return timeRange(19,30,23,59) || timeRange(0,0,3,0);
}

// =======================
// DNS LEAK PROTECTION
// =======================
function dnsGuard(host) {
  if (isPlainHostName(host)) {
    return JO.BLOCK;
  }
  return null;
}

// =======================
// FAST ISP PREFIX (STABLE)
// =======================
function fastISP(ip) {
  if (ip.indexOf("82.212.") === 0 || ip.indexOf("212.35.") === 0) return "ORANGE";
  if (ip.indexOf("46.32.")  === 0 || ip.indexOf("188.161.") === 0) return "ZAIN";
  if (ip.indexOf("91.106.") === 0 || ip.indexOf("176.29.")  === 0) return "UMNIAH";
  return null;
}

// =======================
// CIDR BACKUP (LONG-TERM)
// =======================
var ISP_RANGES = {
  ZAIN:   ["188.161.0.0/16","213.186.160.0/19","37.17.192.0/20","46.23.112.0/20"],
  ORANGE: ["212.35.0.0/16","82.212.64.0/18","79.173.192.0/18"],
  UMNIAH: ["46.185.128.0/17","176.29.0.0/16","91.106.96.0/20"]
};

function ipToNum(ip) {
  var p = ip.split(".");
  return ((p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3])>>>0;
}

function inCidr(ip, cidr) {
  var c = cidr.split("/");
  var mask = ~(Math.pow(2,32-c[1]) - 1);
  return (ipToNum(ip) & mask) === (ipToNum(c[0]) & mask);
}

function detectISP(ip) {
  var f = fastISP(ip);
  if (f) return f;

  for (var k in ISP_RANGES) {
    for (var i=0;i<ISP_RANGES[k].length;i++) {
      if (inCidr(ip, ISP_RANGES[k][i])) return k;
    }
  }
  return "FOREIGN";
}

// =======================
// ROUTING LOGIC (STABLE)
// =======================
function routePUBG(match, voice, isp) {

  // 1️⃣ MATCHMAKING – توحيد الأردن
  if (match) {
    return JO.ZAIN;
  }

  // 2️⃣ VOICE CHAT – أقل jitter
  if (voice) {
    if (isp === "ORANGE") return JO.ORANGE + "; " + JO.ZAIN;
    if (isp === "UMNIAH") return JO.UMNIAH + "; " + JO.ZAIN;
    return JO.ZAIN + "; " + JO.ORANGE;
  }

  // 3️⃣ IN-GAME
  if (isPeak()) {
    if (isp === "ORANGE") return JO.ORANGE + "; " + JO.ZAIN;
    if (isp === "UMNIAH") return JO.UMNIAH + "; " + JO.ZAIN;
    return JO.ZAIN + "; " + JO.ORANGE + "; " + JO.UMNIAH;
  }

  return JO.ZAIN + "; " + JO.ORANGE + "; " + JO.UMNIAH + "; " + JO.BACKUP;
}

// =======================
// MAIN PAC FUNCTION
// =======================
function FindProxyForURL(url, host) {

  host = host.toLowerCase();

  var guard = dnsGuard(host);
  if (guard) return guard;

  if (!isPUBG(host)) return "DIRECT";

  var ip  = dnsResolve(host) || "";
  var isp = detectISP(ip);

  return routePUBG(
    isMatchmaking(url),
    isVoice(url),
    isp
  );
}
