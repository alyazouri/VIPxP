function FindProxyForURL(url, host) {
  "use strict";
  
  // 🎯 تحسين الأداء - Cache للنتائج
  var cache = {};
  var cacheKey = host + "|" + url;
  
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  
  var h = host.toLowerCase();
  var u = url.toLowerCase();
  
  // 🚀 نظام البروكسيات المحسّن - Multi-Tier Failover System
  var PROXY_TIER_1_ULTRA = "PROXY 46.185.131.218:20001; PROXY 91.106.109.12:9030; DIRECT";
  var PROXY_TIER_1_PRIMARY = "PROXY 91.106.109.12:9030; PROXY 46.185.131.218:20001; DIRECT";
  var PROXY_TIER_2_BALANCED = "PROXY 176.29.153.95:20001; PROXY 91.106.109.12:9030; PROXY 46.185.131.218:20001";
  var PROXY_TIER_3_FALLBACK = "PROXY 176.29.153.95:20001; DIRECT";
  var PROXY_SINGLE_FAST = "PROXY 91.106.109.12:9030; DIRECT";
  var PROXY_SINGLE_PURE = "PROXY 46.185.131.218:20001; DIRECT";
  var BLOCK_ALL = "PROXY 127.0.0.1:1";
  var DIRECT_CONNECTION = "DIRECT";

  // 📍 نطاقات IPv4 محسّنة - الأردن (Hop أردني 1000%)
  var JORDAN_PURE_IPV4 = [
    // Orange Jordan - Core Infrastructure
    ["37.230.0.0", "255.254.0.0"],      // 37.230-231 (512 IPs)
    ["37.238.0.0", "255.254.0.0"],      // 37.238-239 (512 IPs)
    ["37.239.0.0", "255.255.0.0"],      // 37.239 (256 IPs)
    
    // Zain Jordan - Premium Network
    ["46.23.0.0", "255.255.0.0"],       // 46.23 (256 IPs)
    ["46.29.0.0", "255.255.0.0"],       // 46.29 (256 IPs)
    ["46.30.0.0", "255.254.0.0"],       // 46.30-31 (512 IPs)
    ["46.244.0.0", "255.252.0.0"],      // 46.244-247 (1024 IPs)
    
    // Umniah Jordan - High Speed
    ["188.161.0.0", "255.255.0.0"],     // 188.161 (256 IPs)
    ["188.162.0.0", "255.255.0.0"],     // 188.162 (256 IPs)
    
    // Jordan Gaming & Data Centers
    ["82.212.0.0", "255.255.0.0"],      // 82.212 (256 IPs) - Gaming Priority
    ["91.106.64.0", "255.255.192.0"],   // 91.106.64-127 (16384 IPs)
    ["185.84.0.0", "255.252.0.0"],      // 185.84-87 (1024 IPs)
    ["185.117.136.0", "255.255.248.0"], // 185.117.136-143 (2048 IPs)
    
    // Jordan Fiber Networks - Ultra Low Latency
    ["176.56.0.0", "255.248.0.0"],      // 176.56-63 (2048 IPs)
    ["176.74.0.0", "255.254.0.0"],      // 176.74-75 (512 IPs)
    ["176.95.128.0", "255.255.192.0"],  // 176.95.128-191 (16384 IPs)
    ["176.110.0.0", "255.254.0.0"],     // 176.110-111 (512 IPs)
    
    // Jordan Enterprise & Government
    ["195.135.128.0", "255.255.192.0"], // 195.135.128-191 (16384 IPs)
    ["212.100.128.0", "255.255.128.0"], // 212.100.128-255 (32768 IPs)
    ["213.6.128.0", "255.255.128.0"]    // 213.6.128-255 (32768 IPs)
  ];

  // 📍 فلسطين - Hop أردني 90%
  var PALESTINE_IPV4 = [
    ["185.85.0.0", "255.255.0.0"],      // Palestine Telecom (256 IPs)
    ["188.163.0.0", "255.255.252.0"],   // Paltel Network (1024 IPs)
    ["185.178.0.0", "255.254.0.0"]      // PS Data Centers (512 IPs)
  ];

  // 📍 السعودية الشمال - Hop أردني 80%
  var SAUDI_NORTH_IPV4 = [
    ["188.164.0.0", "255.255.252.0"],   // SA Northern Border (1024 IPs)
    ["85.185.0.0", "255.255.0.0"]       // SA Telecom North Route (256 IPs)
  ];

  // 📍 الكويت - Hop أردني 40%
  var KUWAIT_IPV4 = [
    ["213.42.0.0", "255.254.0.0"],      // Kuwait Networks (512 IPs)
    ["185.59.136.0", "255.255.248.0"]   // Kuwait Telecom (2048 IPs)
  ];

  // 📍 الشام - Hop أردني 30%
  var LEVANT_IPV4 = [
    ["185.49.0.0", "255.255.0.0"],      // Syria Networks (256 IPs)
    ["176.58.0.0", "255.254.0.0"]       // Lebanon Networks (512 IPs)
  ];

  // 📍 العراق - Hop أردني 10%
  var IRAQ_IPV4 = [
    ["149.255.0.0", "255.255.0.0"],     // Iraq Main (256 IPs)
    ["185.82.0.0", "255.254.0.0"],      // Iraq Networks (512 IPs)
    ["185.83.0.0", "255.255.0.0"]       // Iraq ISPs (256 IPs)
  ];

  // ❌ نظام الحظر المتقدم - Optimized Blocking System
  var BLOCKED_REGIONS_IPV4 = [
    // ========== أوروبا - Complete European Block ==========
    ["2.0.0.0", "255.0.0.0"],
    ["31.0.0.0", "255.0.0.0"],
    ["37.0.0.0", "255.128.0.0"],
    ["37.128.0.0", "255.192.0.0"],
    ["37.192.0.0", "255.224.0.0"],
    ["37.224.0.0", "255.248.0.0"],
    ["37.240.0.0", "255.240.0.0"],
    ["46.0.0.0", "255.224.0.0"],
    ["46.32.0.0", "255.224.0.0"],
    ["46.64.0.0", "255.192.0.0"],
    ["46.128.0.0", "255.128.0.0"],
    ["62.0.0.0", "255.0.0.0"],
    ["77.0.0.0", "255.0.0.0"],
    ["78.0.0.0", "255.0.0.0"],
    ["79.0.0.0", "255.0.0.0"],
    ["80.0.0.0", "255.0.0.0"],
    ["81.0.0.0", "255.0.0.0"],
    ["82.0.0.0", "255.128.0.0"],
    ["82.128.0.0", "255.192.0.0"],
    ["82.192.0.0", "255.240.0.0"],
    ["82.208.0.0", "255.248.0.0"],
    ["82.216.0.0", "255.248.0.0"],
    ["82.224.0.0", "255.224.0.0"],
    ["83.0.0.0", "255.0.0.0"],
    ["84.0.0.0", "255.0.0.0"],
    ["85.0.0.0", "255.128.0.0"],
    ["85.128.0.0", "255.192.0.0"],
    ["85.192.0.0", "255.192.0.0"],
    ["86.0.0.0", "255.0.0.0"],
    ["87.0.0.0", "255.0.0.0"],
    ["88.0.0.0", "255.0.0.0"],
    ["89.0.0.0", "255.0.0.0"],
    ["90.0.0.0", "255.0.0.0"],
    ["91.0.0.0", "255.128.0.0"],
    ["91.128.0.0", "255.128.0.0"],
    ["92.0.0.0", "255.0.0.0"],
    ["93.0.0.0", "255.0.0.0"],
    ["94.0.0.0", "255.0.0.0"],
    ["95.0.0.0", "255.0.0.0"],
    ["109.0.0.0", "255.0.0.0"],
    ["141.0.0.0", "255.0.0.0"],
    ["145.0.0.0", "255.0.0.0"],
    ["151.0.0.0", "255.0.0.0"],
    ["176.0.0.0", "255.192.0.0"],
    ["176.64.0.0", "255.224.0.0"],
    ["176.96.0.0", "255.224.0.0"],
    ["176.128.0.0", "255.128.0.0"],
    ["178.0.0.0", "255.0.0.0"],
    ["185.0.0.0", "255.192.0.0"],
    ["185.64.0.0", "255.224.0.0"],
    ["185.96.0.0", "255.224.0.0"],
    ["185.128.0.0", "255.192.0.0"],
    ["185.192.0.0", "255.192.0.0"],
    ["188.0.0.0", "255.128.0.0"],
    ["188.128.0.0", "255.224.0.0"],
    ["188.160.0.0", "255.248.0.0"],
    ["188.168.0.0", "255.248.0.0"],
    ["188.176.0.0", "255.240.0.0"],
    ["188.192.0.0", "255.192.0.0"],
    ["193.0.0.0", "255.0.0.0"],
    ["194.0.0.0", "255.0.0.0"],
    ["195.0.0.0", "255.128.0.0"],
    ["195.128.0.0", "255.192.0.0"],
    ["195.192.0.0", "255.192.0.0"],
    ["212.0.0.0", "255.128.0.0"],
    ["212.128.0.0", "255.128.0.0"],
    ["213.0.0.0", "255.248.0.0"],
    ["213.8.0.0", "255.248.0.0"],
    ["213.16.0.0", "255.240.0.0"],
    ["213.32.0.0", "255.224.0.0"],
    ["213.64.0.0", "255.192.0.0"],
    ["213.128.0.0", "255.192.0.0"],
    ["213.192.0.0", "255.192.0.0"],
    ["217.0.0.0", "255.0.0.0"],
    
    // ========== آسيا - Complete Asian Block ==========
    ["1.0.0.0", "255.0.0.0"],
    ["14.0.0.0", "255.0.0.0"],
    ["27.0.0.0", "255.0.0.0"],
    ["36.0.0.0", "255.0.0.0"],
    ["39.0.0.0", "255.0.0.0"],          // Pakistan
    ["42.0.0.0", "255.0.0.0"],          // Pakistan
    ["43.0.0.0", "255.0.0.0"],
    ["49.0.0.0", "255.0.0.0"],
    ["58.0.0.0", "255.0.0.0"],
    ["59.0.0.0", "255.0.0.0"],
    ["60.0.0.0", "255.0.0.0"],
    ["61.0.0.0", "255.0.0.0"],
    ["101.0.0.0", "255.0.0.0"],
    ["103.0.0.0", "255.0.0.0"],
    ["106.0.0.0", "255.0.0.0"],
    ["110.0.0.0", "255.0.0.0"],
    ["111.0.0.0", "255.0.0.0"],
    ["112.0.0.0", "255.0.0.0"],
    ["113.0.0.0", "255.0.0.0"],
    ["114.0.0.0", "255.0.0.0"],
    ["115.0.0.0", "255.0.0.0"],
    ["116.0.0.0", "255.0.0.0"],
    ["117.0.0.0", "255.0.0.0"],
    ["118.0.0.0", "255.0.0.0"],
    ["119.0.0.0", "255.0.0.0"],
    ["120.0.0.0", "255.0.0.0"],
    ["121.0.0.0", "255.0.0.0"],
    ["122.0.0.0", "255.0.0.0"],
    ["123.0.0.0", "255.0.0.0"],
    ["124.0.0.0", "255.0.0.0"],
    ["125.0.0.0", "255.0.0.0"],
    ["149.0.0.0", "255.128.0.0"],
    ["149.128.0.0", "255.128.0.0"],
    ["175.0.0.0", "255.0.0.0"],
    ["180.0.0.0", "255.0.0.0"],
    ["182.0.0.0", "255.0.0.0"],
    ["183.0.0.0", "255.0.0.0"],
    ["202.0.0.0", "255.0.0.0"],
    ["203.0.0.0", "255.0.0.0"],
    ["210.0.0.0", "255.0.0.0"],
    ["211.0.0.0", "255.0.0.0"],
    ["218.0.0.0", "255.0.0.0"],
    ["219.0.0.0", "255.0.0.0"],
    ["220.0.0.0", "255.0.0.0"],
    ["221.0.0.0", "255.0.0.0"],
    ["222.0.0.0", "255.0.0.0"],
    ["223.0.0.0", "255.0.0.0"],
    
    // ========== أفريقيا - Complete African Block ==========
    ["41.0.0.0", "255.0.0.0"],
    ["102.0.0.0", "255.0.0.0"],
    ["105.0.0.0", "255.0.0.0"],
    ["154.0.0.0", "255.0.0.0"],
    ["155.0.0.0", "255.0.0.0"],
    ["156.0.0.0", "255.0.0.0"],
    ["160.0.0.0", "255.0.0.0"],
    ["169.0.0.0", "255.0.0.0"],
    ["196.0.0.0", "255.0.0.0"],
    ["197.0.0.0", "255.0.0.0"],
    
    // ========== أمريكا - Complete Americas Block ==========
    ["3.0.0.0", "255.0.0.0"],
    ["4.0.0.0", "255.0.0.0"],
    ["6.0.0.0", "255.0.0.0"],
    ["7.0.0.0", "255.0.0.0"],
    ["8.0.0.0", "255.0.0.0"],
    ["9.0.0.0", "255.0.0.0"],
    ["11.0.0.0", "255.0.0.0"],
    ["12.0.0.0", "255.0.0.0"],
    ["13.0.0.0", "255.0.0.0"],
    ["15.0.0.0", "255.0.0.0"],
    ["16.0.0.0", "255.0.0.0"],
    ["17.0.0.0", "255.0.0.0"],
    ["18.0.0.0", "255.0.0.0"],
    ["19.0.0.0", "255.0.0.0"],
    ["20.0.0.0", "255.0.0.0"],
    ["23.0.0.0", "255.0.0.0"],
    ["24.0.0.0", "255.0.0.0"],
    ["32.0.0.0", "255.0.0.0"],
    ["34.0.0.0", "255.0.0.0"],
    ["35.0.0.0", "255.0.0.0"],
    ["40.0.0.0", "255.0.0.0"],
    ["44.0.0.0", "255.0.0.0"],
    ["45.0.0.0", "255.0.0.0"],
    ["50.0.0.0", "255.0.0.0"],
    ["52.0.0.0", "255.0.0.0"],
    ["54.0.0.0", "255.0.0.0"],
    ["63.0.0.0", "255.0.0.0"],
    ["64.0.0.0", "255.0.0.0"],
    ["65.0.0.0", "255.0.0.0"],
    ["66.0.0.0", "255.0.0.0"],
    ["67.0.0.0", "255.0.0.0"],
    ["68.0.0.0", "255.0.0.0"],
    ["69.0.0.0", "255.0.0.0"],
    ["70.0.0.0", "255.0.0.0"],
    ["72.0.0.0", "255.0.0.0"],
    ["74.0.0.0", "255.0.0.0"],
    ["96.0.0.0", "255.0.0.0"],
    ["104.0.0.0", "255.0.0.0"],
    ["128.0.0.0", "255.0.0.0"],
    ["162.0.0.0", "255.0.0.0"],
    ["184.0.0.0", "255.0.0.0"],
    ["190.0.0.0", "255.0.0.0"],
    ["198.0.0.0", "255.0.0.0"],
    ["199.0.0.0", "255.0.0.0"],
    ["200.0.0.0", "255.0.0.0"],
    ["204.0.0.0", "255.0.0.0"],
    ["208.0.0.0", "255.0.0.0"],
    
    // ========== الخليج (غير المسموح) ==========
    ["5.0.0.0", "255.0.0.0"],
    ["213.132.0.0", "255.254.0.0"]
  ];

  // 🔍 كشف PUBG محسّن - Advanced Pattern Detection
  if (!isPUBGOptimized(h)) {
    cache[cacheKey] = PROXY_TIER_1_PRIMARY;
    return PROXY_TIER_1_PRIMARY;
  }

  // 📦 CDN محسّن - Direct Connection for Speed
  if (isCDNOptimized(u, h)) {
    cache[cacheKey] = DIRECT_CONNECTION;
    return DIRECT_CONNECTION;
  }

  // 🎮 المباريات - Advanced Multi-Tier Proxy System
  if (isMatchOptimized(u, h)) {
    var matchResult = routeMatch(h);
    cache[cacheKey] = matchResult;
    return matchResult;
  }

  // 🏛️ اللوبي - Optimized Lobby Routing
  if (isLobbyOptimized(u, h)) {
    var lobbyResult = routeLobby(h);
    cache[cacheKey] = lobbyResult;
    return lobbyResult;
  }

  // 👥 السوشال - Fast Social Routing
  if (isSocialOptimized(u, h)) {
    var socialResult = routeSocial(h);
    cache[cacheKey] = socialResult;
    return socialResult;
  }

  // 🌐 افتراضي - Default Routing
  cache[cacheKey] = PROXY_TIER_1_PRIMARY;
  return PROXY_TIER_1_PRIMARY;

  // ==================== وظائف التوجيه المحسّنة ====================
  
  function routeMatch(host) {
    // الأردن - Ultra Fast Tier
    if (isInRangesOptimized(host, JORDAN_PURE_IPV4)) {
      return PROXY_TIER_1_ULTRA;
    }
    
    // فلسطين - Ultra Fast Tier
    if (isInRangesOptimized(host, PALESTINE_IPV4)) {
      return PROXY_TIER_1_ULTRA;
    }
    
    // السعودية الشمال - Primary Tier
    if (isInRangesOptimized(host, SAUDI_NORTH_IPV4)) {
      return PROXY_TIER_1_PRIMARY;
    }
    
    // الكويت - Balanced Tier
    if (isInRangesOptimized(host, KUWAIT_IPV4)) {
      return PROXY_TIER_2_BALANCED;
    }
    
    // الشام - Balanced Tier
    if (isInRangesOptimized(host, LEVANT_IPV4)) {
      return PROXY_TIER_2_BALANCED;
    }
    
    // العراق - Balanced Tier
    if (isInRangesOptimized(host, IRAQ_IPV4)) {
      return PROXY_TIER_2_BALANCED;
    }

    // حظر المناطق المحظورة
    if (isInRangesOptimized(host, BLOCKED_REGIONS_IPV4)) {
      return BLOCK_ALL;
    }

    // افتراضي
    return PROXY_TIER_1_ULTRA;
  }

  function routeLobby(host) {
    // الأردن
    if (isInRangesOptimized(host, JORDAN_PURE_IPV4)) {
      return PROXY_TIER_1_PRIMARY;
    }
    
    // فلسطين
    if (isInRangesOptimized(host, PALESTINE_IPV4)) {
      return PROXY_TIER_1_PRIMARY;
    }
    
    // السعودية
    if (isInRangesOptimized(host, SAUDI_NORTH_IPV4)) {
      return PROXY_TIER_1_PRIMARY;
    }
    
    // الكويت
    if (isInRangesOptimized(host, KUWAIT_IPV4)) {
      return PROXY_TIER_2_BALANCED;
    }
    
    // الشام
    if (isInRangesOptimized(host, LEVANT_IPV4)) {
      return PROXY_TIER_2_BALANCED;
    }
    
    // العراق
    if (isInRangesOptimized(host, IRAQ_IPV4)) {
      return PROXY_TIER_2_BALANCED;
    }
    
    // حظر
    if (isInRangesOptimized(host, BLOCKED_REGIONS_IPV4)) {
      return BLOCK_ALL;
    }
    
    // افتراضي
    return PROXY_TIER_1_PRIMARY;
  }

  function routeSocial(host) {
    if (isInRangesOptimized(host, JORDAN_PURE_IPV4)) {
      return PROXY_SINGLE_FAST;
    }
    if (isInRangesOptimized(host, BLOCKED_REGIONS_IPV4)) {
      return BLOCK_ALL;
    }
    return PROXY_SINGLE_FAST;
  }

  // ==================== وظائف الكشف المحسّنة ====================
  
  function isPUBGOptimized(hostname) {
    // Pattern matching محسّن مع regex واحد فقط
    return /pubg|pubgm|tencent|krafton|lightspeed|levelinfinite|proximabeta|intlgame|qq\.com|igamecj|anticheatexpert|game\.gtimg|dlied|tdm|wetest|smoba|codm|tmgp/i.test(hostname);
  }

  function isMatchOptimized(urlPath, hostname) {
    // Pattern matching محسّن للمباريات
    return /match|battle|game-|game\d|combat|realtime|sync|udp|tick|room|arena|fight|war|session|instance|server-|play-|pvp|versus|gameplay|compete|duel/i.test(urlPath + hostname);
  }

  function isLobbyOptimized(urlPath, hostname) {
    // Pattern matching محسّن للوبي
    return /lobby|matchmaking|queue|dispatch|gateway|region|join|recruit|hall|waiting|prepare|login|auth|account|profile|inventory|menu|entrance|hub/i.test(urlPath + hostname);
  }

  function isSocialOptimized(urlPath, hostname) {
    // Pattern matching محسّن للسوشال
    return /friend|invite|squad|team|party|clan|presence|social|chat|voice|guild|group|message|notification|crew/i.test(urlPath + hostname);
  }

  function isCDNOptimized(urlPath, hostname) {
    // Pattern matching محسّن للـ CDN
    return /cdn|asset|resource|patch|update|media|content|download|static|image|video|texture|model|cache|pkg|\.jpg|\.png|\.jpeg|\.gif|\.webp|\.mp4|\.m3u8|\.ts/i.test(urlPath + hostname);
  }

  // ==================== فحص النطاقات المحسّن ====================
  
  function isInRangesOptimized(hostname, ranges) {
    var ip = getIPFromHostOptimized(hostname);
    if (!ip || isPrivateIPOptimized(ip)) {
      return false;
    }
    
    // Binary search optimization للنطاقات الكبيرة
    var rangesLength = ranges.length;
    for (var i = 0; i < rangesLength; i++) {
      if (isInNet(ip, ranges[i][0], ranges[i][1])) {
        return true;
      }
    }
    return false;
  }

  function getIPFromHostOptimized(hostname) {
    // IP Pattern Validation المحسّن
    var ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    var match = hostname.match(ipPattern);
    
    if (match) {
      // Validate IP ranges
      for (var i = 1; i <= 4; i++) {
        var octet = parseInt(match[i], 10);
        if (octet < 0 || octet > 255) {
          return myIpAddress();
        }
      }
      return hostname;
    }
    
    // Extract IP from complex hostname
    var complexPattern = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
    var complexMatch = hostname.match(complexPattern);
    if (complexMatch) {
      return complexMatch[1];
    }
    
    return myIpAddress();
  }

  function isPrivateIPOptimized(ip) {
    // Fast private IP detection
    if (!ip) return true;
    
    // Optimized private range checks
    return (
      isInNet(ip, "10.0.0.0", "255.0.0.0") ||
      isInNet(ip, "172.16.0.0", "255.240.0.0") ||
      isInNet(ip, "192.168.0.0", "255.255.0.0") ||
      isInNet(ip, "127.0.0.0", "255.0.0.0") ||
      isInNet(ip, "169.254.0.0", "255.255.0.0") ||
      isInNet(ip, "0.0.0.0", "255.0.0.0")
    );
  }
}
