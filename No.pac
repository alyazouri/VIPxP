var CORE_JO = "PROXY 176.29.153.95:20001";
var SOCKS_JO = "SOCKS5 176.29.153.95:1080";
var BACKUP = "SOCKS5 176.29.153.95:1080; PROXY 176.29.153.95:20001";

/* ==============================
   🔒 SESSION LOCK
   ============================== */
var LOCK = BACKUP;
var matchCache = {};

/* ==============================
   🇯🇴 JORDAN DETECTION - موسع جداً
   ============================== */
function isJordanHost(host) {
  var h = host.toLowerCase();
  
  // Jordan domains
  if (/\.jo$|\.jo\./.test(h)) return true;
  
  // Jordan ISPs
  if (/orange\.jo|umniah|zain\.jo|batelco|jpp\.jo|linkdotnet/.test(h)) return true;
  
  // Jordan keywords
  if (/jordan|amman|^jo-|\.jo-|-jo\.|-jordan-/.test(h)) return true;
  
  // Jordan IP ranges in hostname
  if (/\.176\.29\.|\.46\.3[2-9]\.|\.37\.17\.|\.31\.4[4-7]\./.test(h)) return true;
  if (/\.94\.249\.|\.188\.161\.|\.89\.2[8-9]\.|\.89\.3[0-5]\./.test(h)) return true;
  if (/\.185\.88\.|\.185\.117\.|\.212\.100\./.test(h)) return true;
  
  return false;
}

/* ==============================
   🌍 MIDDLE EAST DETECTION - موسع
   ============================== */
function isMEHost(host) {
  var h = host.toLowerCase();
  
  // ME region markers
  if (/\b(me|mena|gcc|levant|gulf|arab)-/.test(h)) return true;
  if (/middleeast|middle-east|meast/.test(h)) return true;
  
  // Arab countries domains
  if (/\.jo\.|\.ps\.|\.lb\.|\.sy\.|\.iq\./.test(h)) return true;
  
  // ME city names
  if (/amman|beirut|baghdad|damascus|ramallah/.test(h)) return true;
  
  // ME server indicators
  if (/-me-|-mena-|-gcc-|-levant-/.test(h)) return true;
  
  return false;
}

/* ==============================
   🎮 PUBG DETECTION - شامل
   ============================== */
function isPUBG(host, url) {
  var key = host.substring(0, 50);
  if (matchCache[key]) return true;
  
  var h = host.toLowerCase();
  var u = url.toLowerCase();
  var combined = h + "|" + u;
  
  // Quick substring checks (fastest)
  if (h.indexOf("pubg") !== -1) { matchCache[key] = true; return true; }
  if (h.indexOf("krafton") !== -1) { matchCache[key] = true; return true; }
  if (h.indexOf("tencent") !== -1) { matchCache[key] = true; return true; }
  if (h.indexOf("qcloud") !== -1) { matchCache[key] = true; return true; }
  if (u.indexOf("pubg") !== -1) { matchCache[key] = true; return true; }
  
  // Core PUBG
  if (/pubg|krafton|proximabeta|igame|battlegrounds|pubgm/.test(combined)) {
    matchCache[key] = true;
    return true;
  }
  
  // Tencent Cloud
  if (/tencent|qcloud|myqcloud|gcloud|tencentcs/.test(combined)) {
    matchCache[key] = true;
    return true;
  }
  
  // Cloud providers
  if (/amazonaws|aws|ec2|cloudfront|compute/.test(combined)) {
    matchCache[key] = true;
    return true;
  }
  
  // Game infrastructure
  if (/gameserver|match|lobby|dispatcher|allocation|router|session/.test(combined)) {
    matchCache[key] = true;
    return true;
  }
  
  // Battle keywords
  if (/battle|arena|combat|war|fight|tdm|tournament/.test(combined)) {
    matchCache[key] = true;
    return true;
  }
  
  // Maps
  if (/erangel|miramar|sanhok|livik|vikendi|karakin|taego|haven/.test(combined)) {
    matchCache[key] = true;
    return true;
  }
  
  // Game modes
  if (/squad|duo|solo|fpp|tpp|arcade|classic|training|warehouse/.test(combined)) {
    matchCache[key] = true;
    return true;
  }
  
  // Ranking & stats
  if (/rank|tier|season|leaderboard|stats|profile|achievement/.test(combined)) {
    matchCache[key] = true;
    return true;
  }
  
  // Voice & social
  if (/voip|voice|chat|agora|vivox|photon|social/.test(combined)) {
    matchCache[key] = true;
    return true;
  }
  
  // Updates & patches
  if (/update|patch|download|cdn|asset|resource/.test(combined)) {
    matchCache[key] = true;
    return true;
  }
  
  return false;
}

/* ==============================
   🚫 FOREIGN REGION DETECTION
   ============================== */
function isForeignRegion(host) {
  var h = host.toLowerCase();
  
  // Quick substring checks
  if (h.indexOf("-eu-") !== -1) return true;
  if (h.indexOf("-us-") !== -1) return true;
  if (h.indexOf("-ap-") !== -1) return true;
  if (h.indexOf("europe") !== -1) return true;
  if (h.indexOf("asia") !== -1) return true;
  
  // Europe
  if (/\b(eu|europe|de|fr|nl|uk|gb|it|pl|es|se|fi|no|dk|be|at|ch|ie|pt|cz|gr|ro)-/.test(h)) return true;
  
  // Asia Pacific (non-ME)
  if (/\b(ap|asia|sg|jp|kr|hk|tw|cn|india|in|th|vn|id|my|ph|bd|pk)-/.test(h)) return true;
  
  // Americas
  if (/\b(us|usa|useast|uswest|use1|use2|usw1|usw2|america|na|ca|canada|br|brazil|sa)-/.test(h)) return true;
  
  // Other Arab countries (غير الشام)
  if (/\b(sa|ksa|saudi|uae|ae|dubai|eg|egypt|cairo|kw|kuwait|qa|qatar|bh|bahrain|om|oman)-/.test(h)) return true;
  
  // Other regions
  if (/\b(ru|russia|tr|turkey|au|oceania|nz|za|africa)-/.test(h)) return true;
  
  // City names
  if (/frankfurt|london|paris|tokyo|singapore|mumbai|sydney|seattle|virginia|oregon|dublin|stockholm/.test(h)) return true;
  if (/riyadh|dubai|doha|muscat|manama|jeddah|abudhabi/.test(h)) return true;
  
  return false;
}

/* ==============================
   🎯 JORDAN PRIORITY SERVERS
   ============================== */
function isJordanPriority(host) {
  var h = host.toLowerCase();
  
  // Explicit Jordan markers
  if (/jordan|^jo-|-jo-|-jo\.|\.jo-|amman/.test(h)) return true;
  
  // Levant region (likely Jordan/Palestine/Lebanon)
  if (/levant|sham/.test(h)) return true;
  
  // Low latency indicators with ME
  if (/low.*me|me.*low|fast.*me|me.*fast/.test(h)) return true;
  
  return false;
}

/* ==============================
   🚀 MAIN ENGINE - محرك ذكي
   ============================== */
function FindProxyForURL(url, host) {
  
  // ========== PUBG TRAFFIC ==========
  if (isPUBG(host, url)) {
    
    // ✅ Priority 1: Jordan hosts (highest priority)
    if (isJordanHost(host)) {
      return BACKUP;
    }
    
    // ✅ Priority 2: Jordan priority markers
    if (isJordanPriority(host)) {
      return BACKUP;
    }
    
    // ✅ Priority 3: Middle East region
    if (isMEHost(host)) {
      return BACKUP;
    }
    
    // ❌ Block: Foreign regions
    if (isForeignRegion(host)) {
      return BACKUP; // Force through Jordan proxy
    }
    
    // 🎯 Default: All unknown PUBG traffic through Jordan
    return BACKUP;
  }
  
  // ========== NON-PUBG TRAFFIC ==========
  // Everything goes through Jordan for consistency
  return BACKUP;
}
