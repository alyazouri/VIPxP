// ============================================================================
// PUBG MOBILE - TOURNAMENT MODE + K-STRICT (NO DIRECT) 2025-12-30
// - Tournament: shortest chains for lowest ping
// - K-STRICT: if PUBG traffic resolves to non-JO -> BLOCK to force re-search
// - NO DIRECT anywhere (even sacred/safe checks go through JO proxies)
// ============================================================================

// ===================== MODE SWITCHES =====================
var TOURNAMENT_MODE = true;     // ✅ Lowest ping
var K_STRICT_JO     = true;     // ✅ Hard JO pressure (may increase queue time)

// ===================== PROXIES =====================
var HYPER_PROXIES = {
  JO_ULTRA: {
    QUANTUM_1: "PROXY 212.35.66.45:20020",
    QUANTUM_2: "PROXY 46.185.131.218:20001",
    QUANTUM_3: "PROXY 212.35.66.46:443",
    QUANTUM_4: "PROXY 91.106.109.12:20004"
  },
  JO_SPECIALIZED: {
    MATCH_ALPHA: "PROXY 212.35.66.45:20020",
    MATCH_BETA:  "PROXY 46.185.131.218:20001",
    VOICE_ALPHA: "PROXY 46.185.131.222:20001",
    VOICE_BETA:  "PROXY 46.185.131.223:20001",
    GAME_ALPHA:  "PROXY 91.106.109.12:20001",
    GAME_BETA:   "PROXY 91.106.109.25:20001"
  },
  JO_BALANCERS: {
    LB_1: "PROXY 212.35.66.45:20020",
    LB_2: "PROXY 46.185.131.218:20001",
    LB_3: "PROXY 91.106.109.25:20001"
  },

  // NO DIRECT: keep name, but route to JO
  DIRECT: "PROXY 212.35.66.45:20020"
};

var BLOCK = "PROXY 0.0.0.0:0";

// ===================== DOMAIN INTELLIGENCE =====================
var ULTRA_DOMAINS = {
  MATCHMAKING_CRITICAL: [
    "igamecj.com","gcloudsdk.com","proximabeta.com",
    "match.pubgmobile.com","matchmaking.pubgmobile.com","mm.pubgmobile.com",
    "lobby.pubgmobile.com","queue.pubgmobile.com","room.pubgmobile.com"
  ],
  GAME_SERVERS_CRITICAL: [
    "game.pubgmobile.com","gs.pubgmobile.com","server.pubgmobile.com",
    "battle.pubgmobile.com","play.pubgmobile.com","combat.pubgmobile.com","pvp.pubgmobile.com"
  ],
  VOICE_CRITICAL: [
    "voice.pubgmobile.com","rtc.igamecj.com","gvoice.qq.com",
    "voip.pubgmobile.com","audio.pubgmobile.com","rtc.pubgmobile.com"
  ],
  PUBG_CORE_HIGH: [
    "pubgmobile.com","pubgm.com","proximabeta.com","pubgmobile.proximabeta.com"
  ],
  TENCENT_HIGH: [
    "tencent.com","qq.com","qcloud.com","tencentgcloud.com","myqcloud.com"
  ],
  CDN_MEDIUM: [
    "cdnpubg.com","pubgcdn.com","cdn.pubgmobile.com","static.pubgmobile.com",
    "img.pubgmobile.com","image.pubgmobile.com","res.pubgmobile.com"
  ],
  SACRED_DIRECT: [
    "youtube.com","googlevideo.com","ytimg.com","ggpht.com",
    "github.com","githubusercontent.com","raw.githubusercontent.com","gitlab.com",
    "shahid.net","shahid.mbc.net",
    "apple.com","icloud.com","mzstatic.com",
    "amazonaws.com","cloudfront.net"
  ]
};

// ===================== GEO MATRIX =====================
var GEO_MATRIX = {
  JO: [
    "109.107.224.0/19","176.29.0.0/16","86.108.0.0/17","46.185.128.0/17","92.253.0.0/17","94.249.0.0/17",
    "149.200.128.0/17","176.28.128.0/17","82.212.64.0/18","37.202.64.0/18","79.173.192.0/18",
    "213.186.160.0/19","46.248.192.0/19","92.241.32.0/19","95.172.192.0/19"
  ],
  NEIGHBORS: [].concat(
    ["2.88.0.0/14","5.41.0.0/16","5.82.0.0/16","5.108.0.0/14","37.208.0.0/13","212.138.64.0/19"], // SA subset
    ["2.48.0.0/14","5.30.0.0/15","5.107.0.0/16","31.193.128.0/17"], // AE subset
    ["77.42.128.0/17","77.110.64.0/18","178.135.0.0/16"], // LB subset
    ["37.8.0.0/17","46.61.0.0/16"], // PS subset
    ["37.236.0.0/14","149.255.0.0/16"] // IQ subset
  )
};

// ===================== DEEP PATTERNS =====================
var DEEP_PATTERNS = {
  PHASE_PRE_GAME:   { weight:100, domains:["lobby","room","queue","waiting","matchmaking","mm","match"], paths:["/lobby/","/room/","/queue/","/wait/","/mm/","/matchmake/","/findmatch/"], hostPatterns:["lobby","match","queue","mm"], strategy:"HYPER_MATCHMAKING" },
  PHASE_ACTIVE_GAME:{ weight:100, domains:["game","play","battle","combat","pvp","fight"],             paths:["/game/","/play/","/battle/","/sync/","/state/","/pos/","/move/","/action/"], hostPatterns:["game","battle","server"], strategy:"ZERO_JITTER_ULTRA" },
  PHASE_VOICE:      { weight:100, domains:["voice","rtc","audio","voip","call"],                      paths:["/voice/","/rtc/","/audio/","/webrtc/","/voip/"], hostPatterns:["voice","rtc","audio"], strategy:"ZERO_LATENCY_VOICE_ULTRA" },
  PHASE_RESOURCES:  { weight:20,  domains:["resource","asset","cdn","static","download","update"],    paths:["/resource/","/asset/","/download/","/update/","/patch/","/cdn/","/static/"], hostPatterns:["cdn","static","asset"], strategy:"CDN_TURBO" }
};

// ===================== HELPERS =====================
function _ipToLong(ip){
  var p=ip.split(".");
  return p.length===4 ? ((parseInt(p[0])<<24)|(parseInt(p[1])<<16)|(parseInt(p[2])<<8)|parseInt(p[3]))>>>0 : -1;
}
function _cidrMatch(ip,cidr){
  var i=cidr.indexOf("/"); if(i===-1) return false;
  var ipL=_ipToLong(ip), netL=_ipToLong(cidr.substring(0,i)), bits=parseInt(cidr.substring(i+1));
  if(ipL===-1||netL===-1) return false;
  var mask=(0xFFFFFFFF<<(32-bits))>>>0;
  return ((ipL&mask)>>>0)===((netL&mask)>>>0);
}
function _inCidrArray(ip,arr){
  if(!ip||!arr) return false;
  for(var i=0;i<arr.length;i++){ if(_cidrMatch(ip,arr[i])) return true; }
  return false;
}
function _fastDomainMatch(host,domain){
  host=(host||"").toLowerCase(); domain=(domain||"").toLowerCase();
  return host===domain || (host.length>domain.length && host.charAt(host.length-domain.length-1)==="." && host.substring(host.length-domain.length)===domain);
}
function _inDomainArray(host,arr){
  if(!host) return false;
  for(var i=0;i<arr.length;i++){ if(_fastDomainMatch(host,arr[i])) return true; }
  return false;
}
function _urlHasPattern(url,patterns){
  if(!url) return false; url=url.toLowerCase();
  for(var i=0;i<patterns.length;i++){ if(url.indexOf(patterns[i])!==-1) return true; }
  return false;
}
function _hostHasPattern(host,patterns){
  if(!host) return false; host=host.toLowerCase();
  for(var i=0;i<patterns.length;i++){ if(host.indexOf(patterns[i])!==-1) return true; }
  return false;
}

// ===================== PHASE DETECTOR =====================
function _deepDetectPhase(url,host){
  var best=null, bestScore=0;
  for(var k in DEEP_PATTERNS){
    var p=DEEP_PATTERNS[k], s=0;
    if(_hostHasPattern(host,p.domains)) s+=40;
    if(_urlHasPattern(url,p.paths)) s+=40;
    if(_hostHasPattern(host,p.hostPatterns)) s+=20;
    s=s*(p.weight/100);
    if(s>bestScore){ bestScore=s; best=p; }
  }
  return best;
}

// ===================== CLASSIFIER =====================
function _neuralClassify(url,host){
  var c={ type:"UNKNOWN", tier:"LOW", priority:30, strategy:"BALANCED_FAST" };

  var ph=_deepDetectPhase(url,host);
  if(ph){
    c.type=ph.strategy; c.tier="HIGH"; c.priority=ph.weight; c.strategy=ph.strategy;
    return c;
  }

  if(_inDomainArray(host,ULTRA_DOMAINS.MATCHMAKING_CRITICAL)){ c.type="MATCHMAKING"; c.tier="CRITICAL"; c.priority=100; c.strategy="HYPER_MATCHMAKING"; return c; }
  if(_inDomainArray(host,ULTRA_DOMAINS.VOICE_CRITICAL)){       c.type="VOICE";       c.tier="CRITICAL"; c.priority=100; c.strategy="ZERO_LATENCY_VOICE_ULTRA"; return c; }
  if(_inDomainArray(host,ULTRA_DOMAINS.GAME_SERVERS_CRITICAL)){c.type="GAMING";      c.tier="CRITICAL"; c.priority=100; c.strategy="ZERO_JITTER_ULTRA"; return c; }
  if(_inDomainArray(host,ULTRA_DOMAINS.CDN_MEDIUM)){          c.type="CDN";         c.tier="LOW";      c.priority=10;  c.strategy="CDN_TURBO"; return c; }
  if(_inDomainArray(host,ULTRA_DOMAINS.PUBG_CORE_HIGH) || _inDomainArray(host,ULTRA_DOMAINS.TENCENT_HIGH)){
    c.type="PUBG_GENERAL"; c.tier="HIGH"; c.priority=75; c.strategy="BALANCED_FAST"; return c;
  }

  return c;
}

// ===================== STRATEGY CHAINS =====================
function _chainTournament(strategy){
  // Tournament = minimal hops
  if(strategy==="HYPER_MATCHMAKING")       return HYPER_PROXIES.JO_SPECIALIZED.MATCH_ALPHA + "; " + HYPER_PROXIES.JO_SPECIALIZED.MATCH_BETA;
  if(strategy==="ZERO_JITTER_ULTRA")       return HYPER_PROXIES.JO_SPECIALIZED.GAME_ALPHA  + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_1;
  if(strategy==="ZERO_LATENCY_VOICE_ULTRA")return HYPER_PROXIES.JO_SPECIALIZED.VOICE_ALPHA + "; " + HYPER_PROXIES.JO_SPECIALIZED.VOICE_BETA;
  if(strategy==="CDN_TURBO")              return HYPER_PROXIES.JO_ULTRA.QUANTUM_1 + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_2;
  return HYPER_PROXIES.JO_ULTRA.QUANTUM_1 + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_2;
}

function _chainKStrict(strategy){
  // K-Strict = stronger JO pressure (more hops)
  if(strategy==="HYPER_MATCHMAKING")       return HYPER_PROXIES.JO_SPECIALIZED.MATCH_ALPHA + "; " + HYPER_PROXIES.JO_SPECIALIZED.MATCH_BETA + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_1 + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_2;
  if(strategy==="ZERO_JITTER_ULTRA")       return HYPER_PROXIES.JO_SPECIALIZED.GAME_ALPHA  + "; " + HYPER_PROXIES.JO_SPECIALIZED.GAME_BETA + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_1 + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_2;
  if(strategy==="ZERO_LATENCY_VOICE_ULTRA")return HYPER_PROXIES.JO_SPECIALIZED.VOICE_ALPHA + "; " + HYPER_PROXIES.JO_SPECIALIZED.VOICE_BETA + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_3;
  if(strategy==="CDN_TURBO")              return HYPER_PROXIES.JO_ULTRA.QUANTUM_1 + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_2;
  return HYPER_PROXIES.JO_ULTRA.QUANTUM_1 + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_2 + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_3;
}

function _selectChain(strategy){
  // Tournament + K-Strict together:
  // - For MATCH/GAME/VOICE: Tournament chain (lowest ping)
  // - But K-Strict logic may BLOCK non-JO resolved PUBG traffic to force JO
  if(TOURNAMENT_MODE) return _chainTournament(strategy);
  return _chainKStrict(strategy);
}

// ===================== PUBG DETECTOR (for K-Strict blocking) =====================
function _isPubgRelated(host, traffic){
  if(!host) return false;
  if(traffic && (traffic.strategy==="HYPER_MATCHMAKING" || traffic.strategy==="ZERO_JITTER_ULTRA" || traffic.strategy==="ZERO_LATENCY_VOICE_ULTRA")) return true;
  if(_inDomainArray(host, ULTRA_DOMAINS.PUBG_CORE_HIGH) || _inDomainArray(host, ULTRA_DOMAINS.TENCENT_HIGH)) return true;
  if(host.indexOf("pubg")!==-1 || host.indexOf("igamecj")!==-1 || host.indexOf("gcloud")!==-1 || host.indexOf("tencent")!==-1) return true;
  return false;
}

// ============================================================================
// FindProxyForURL (NO DIRECT + Tournament + K-Strict)
// ============================================================================
function FindProxyForURL(url, host){
  host=(host||"").toLowerCase();
  url =(url ||"").toLowerCase();

  // NO DIRECT baseline for anything that used to be direct
  var NO_DIRECT_BASE = HYPER_PROXIES.JO_ULTRA.QUANTUM_1 + "; " + HYPER_PROXIES.JO_ULTRA.QUANTUM_2;

  // Sacred list: still NO DIRECT (route via JO)
  if(_inDomainArray(host, ULTRA_DOMAINS.SACRED_DIRECT)){
    return NO_DIRECT_BASE;
  }

  // Resolve + GEO
  var ip = dnsResolve(host);
  var isJO = ip && _inCidrArray(ip, GEO_MATRIX.JO);
  var isNeighbor = ip && _inCidrArray(ip, GEO_MATRIX.NEIGHBORS);

  // Classify
  var traffic = _neuralClassify(url, host);

  // CDN: keep routed via JO proxies (NO DIRECT)
  if(traffic.strategy==="CDN_TURBO"){
    return _selectChain("CDN_TURBO");
  }

  // ===================== K-STRICT PRESSURE =====================
  // If it's PUBG-related and NOT JO -> BLOCK to force retry / new endpoint
  if(K_STRICT_JO && _isPubgRelated(host, traffic) && !isJO){
    // Neighbor: also block (strongest JO lock)
    // If you want neighbors allowed instead of block, change BLOCK to NO_DIRECT_BASE here.
    return BLOCK;
  }

  // JO bias: if JO detected -> force strongest matchmaking routing
  if(isJO && traffic.priority>=60){
    return _selectChain("HYPER_MATCHMAKING");
  }

  // Critical
  if(traffic.tier==="CRITICAL" || traffic.priority===100){
    return _selectChain(traffic.strategy);
  }

  // High
  if(traffic.tier==="HIGH" || traffic.priority>=75){
    return _selectChain(traffic.strategy);
  }

  // Medium
  if(traffic.priority>=50 && traffic.type!=="UNKNOWN"){
    return _selectChain(traffic.strategy);
  }

  // Low: NO DIRECT baseline
  if(traffic.priority<30){
    return NO_DIRECT_BASE;
  }

  // Default: NO DIRECT baseline
  return NO_DIRECT_BASE;
}
