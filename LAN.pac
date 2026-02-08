var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:9";

// ================= INTERNAL IPV4 =================
var INTERNAL_IPV4 = [
  ["10.0.0.0",    "255.0.0.0"],
  ["172.16.0.0",  "255.240.0.0"],
  ["192.168.0.0", "255.255.0.0"],
  ["127.0.0.0",   "255.0.0.0"],
  ["169.254.0.0", "255.255.0.0"]
];

// ================= JORDAN IPV4 =================
var JORDAN_IPV4 = [
  ["37.44.0.0",    "255.252.0.0"],
  ["176.29.0.0",   "255.255.0.0"],
  ["185.52.0.0",   "255.255.252.0"],
  ["87.236.232.0", "255.255.248.0"]
];

// ================= SESSION =================
var SESSION = {
  pinnedIP: null,
  pinnedHost: null
};

// ================= HELPERS =================
function norm(h){
  var i = h.indexOf(":");
  return i > -1 ? h.substring(0, i) : h;
}

function isInList(ip, list){
  for (var i = 0; i < list.length; i++)
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  return false;
}

// ================= PUBG DETECTION =================
function isPUBG(h){
  return /pubg|pubgm|tencent|krafton|lightspeed|levelinfinite/i.test(h);
}

function isLobby(u,h){
  return /lobby|matchmaking|queue|dispatch|gateway|region|join/i.test(u+h);
}

function isMatch(u,h){
  return /match|battle|game|combat|realtime|sync|udp|tick|room/i.test(u+h);
}

// ================= MAIN =================
function FindProxyForURL(url, host) {

  host = norm(host.toLowerCase());

  // PUBG فقط
  if (!isPUBG(host)) return BLOCK;

  var ip = dnsResolve(host);
  if (!ip) return BLOCK;

  // IPv6 ممنوع
  if (ip.indexOf(":") > -1) return BLOCK;

  // لازم يكون LAN أو أردني
  var isLAN    = isInList(ip, INTERNAL_IPV4);
  var isJordan = isInList(ip, JORDAN_IPV4);

  if (!isLAN && !isJordan) return BLOCK;

  // ================= MATCH PINNING =================
  if (isMatch(url, host)) {

    if (!SESSION.pinnedIP) {
      SESSION.pinnedIP   = ip;
      SESSION.pinnedHost = host;
      return DIRECT;
    }

    if (ip !== SESSION.pinnedIP)   return BLOCK;
    if (host !== SESSION.pinnedHost) return BLOCK;

    return DIRECT;
  }

  // ================= LOBBY =================
  if (isLobby(url, host)) {
    return DIRECT;
  }

  return BLOCK;
}
