// =====================================================
// PUBG Mobile PAC — JO MASTER FINAL
// ALL FEATURES ENABLED (EXTREME SMART CONTROL)
// =====================================================

// =======================
// PROXIES
// =======================
var LOBBY_PROXY =
"PROXY 82.212.84.33:9030; " +
"PROXY 212.35.66.45:9030";

var MATCH_PROXY = "PROXY 82.212.84.33:20001";

var VOICE_PROXY =
"PROXY 82.212.84.33:20001; " +
"PROXY 82.212.84.33:10012; DIRECT";

var BLOCK = "PROXY 127.0.0.1:9";

// =======================
// SAFE DIRECT
// =======================
var SAFE_DIRECT = [
"captive.apple.com","time.apple.com","ocsp.apple.com",
"clients3.google.com","gstatic.com","googleapis.com"
];

var CDN_DIRECT = [
"youtube.com","googlevideo.com","ytimg.com",
"fbcdn.net","facebook.com","instagram.com",
"cdninstagram.com","tiktokcdn.com","tiktokv.com",
"akamaihd.net"
];

// =======================
// JORDAN RANGES
// =======================
var JO_CORE = {
"82.212.":1,"212.35.":1,"176.29.":1,"91.106.":1,
"46.185.":1,"86.108.":1,"92.253.":1,
"94.249.":1,"188.247.":1,"149.200.":1
};

var JO_EXTENDED = {
"78.135.":1,"78.138.":1,"78.139.":1,
"37.48.":1,"37.49.":1,"37.50.":1,"37.51.":1,
"37.75.":1,"37.202.":1,"37.238.":1,
"79.134.":1,"79.173.":1,
"81.21.":1,"81.28.":1,"80.90.":1,
"62.72.":1,"62.150.":1,"62.251.":1,
"185.104.":1,"185.105.":1,
"185.89.":1,"185.90.":1,
"185.107.":1,"185.108.":1
};

// =======================
// GULF (SECONDARY)
// =======================
var GULF = {
"185.125.":1,"46.183.":1,"37.131.":1,
"212.71.":1,"185.193.":1,"185.194.":1,"185.195.":1,
"94.26.":1,"95.177.":1,
"5.62.":1,"31.192.":1,"86.96.":1,
"62.84.":1,"82.178.":1,"91.140.":1,
"37.210.":1,"89.211.":1,
"185.64.":1,"5.36.":1
};

// =======================
// BLOCK REGIONS
// =======================
var AFGHANISTAN = {
"58.147.":1,"59.153.":1,"61.5.":1,
"91.109.":1,"103.5.":1,"103.13.":1,
"103.17.":1,"103.18.":1,"103.23.":1,
"103.28.":1,"45.65.":1,"45.116.":1,
"202.88.":1,"202.93.":1,"149.255.":1
};

var FAR = [
"8.222.","47.245.","43.132.","18.163.","13.228.",
"52.220.","54.169.","175.41.","119.81.",
"18.185.","3.120.","52.58.","35.156.",
"54.218.","52.88.","34.208.","18.237.",
"39.32.","39.33.","110.39.","182.176."
];

// =======================
// TIME PHASES
// =======================
var START_TS = Date.now();

var RECRUIT_JO_MS = 120000;
var ARENA_JO_MS   = 60000;
var ARENA_TOTAL   = 240000;
var WOW_JO_MS     = 90000;

// =======================
// HELPERS
// =======================
function sw(ip,t){for(var k in t)if(ip.indexOf(k)===0)return 1;return 0;}
function nh(h){var i=h.indexOf(":");return i>-1?h.substring(0,i):h;}
function v4(ip){return ip&&ip.indexOf(".")>-1;}

var _h=null,_ip=null;
function rip(h){
if(h===_h)return _ip;
var r=dnsResolve(h);
_h=h; _ip=v4(r)?r:null;
return _ip;
}

// =======================
// MAIN
// =======================
function FindProxyForURL(url, host) {
host = nh(host.toLowerCase());

// SAFE
for (var i=0;i<SAFE_DIRECT.length;i++)
if (dnsDomainIs(host, SAFE_DIRECT[i])) return "DIRECT";

for (var j=0;j<CDN_DIRECT.length;j++)
if (shExpMatch(host,"*"+CDN_DIRECT[j])) return "DIRECT";

// NON PUBG
if (!/(pubg|pubgm|tencent|krafton|lightspeed|igame|qcloud)/.test(host))
return "DIRECT";

// CONFIG SAFE
if (/(config|version|patch|update)/.test(url))
return "DIRECT";

var ip = rip(host);
if (!ip) return BLOCK;

// BLOCKS
if (sw(ip,AFGHANISTAN)) return BLOCK;
for (var f=0;f<FAR.length;f++)
if (ip.indexOf(FAR[f])===0) return BLOCK;

var JO = sw(ip,JO_CORE)||sw(ip,JO_EXTENDED);
var GF = sw(ip,GULF);

var t = Date.now()-START_TS;

// VOICE NEVER BLOCK
if (/(voice|rtc|webrtc|voip|audio)/.test(url))
return VOICE_PROXY;

// WOW
if (/(wow|ugc|custom|creation)/.test(url)) {
if (t < WOW_JO_MS) return JO ? LOBBY_PROXY : BLOCK;
return (JO||GF) ? LOBBY_PROXY : BLOCK;
}

// ARENA
if (/(arena|tdm|training)/.test(url)) {
if (t < ARENA_JO_MS) return JO ? LOBBY_PROXY : BLOCK;
if (t < ARENA_TOTAL) return (JO||GF) ? LOBBY_PROXY : BLOCK;
return MATCH_PROXY;
}

// LOBBY
if (/(lobby|matchmaking|recruit|team|party)/.test(url)) {
if (t < RECRUIT_JO_MS) return JO ? LOBBY_PROXY : BLOCK;
return (JO||GF) ? LOBBY_PROXY : BLOCK;
}

// MATCH (STICKY)
return JO ? MATCH_PROXY : BLOCK;
}
