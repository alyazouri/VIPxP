// ========================== CONFIGURATION ==========================
var CONFIG = {
    jordan: {
        primary: [
            { proxy: "PROXY 82.212.84.33:20001", weight: 10, tier: 1 },
            { proxy: "PROXY 82.212.84.34:20001", weight: 10, tier: 1 },
            { proxy: "PROXY 212.35.66.45:20001", weight: 9, tier: 1 },
            { proxy: "PROXY 212.35.66.46:20001", weight: 9, tier: 1 },
            { proxy: "PROXY 86.108.78.12:20001", weight: 8, tier: 2 }
        ],
        lobby: [
            { proxy: "PROXY 82.212.84.33:9030", weight: 10 },
            { proxy: "PROXY 212.35.66.45:9030", weight: 9 },
            { proxy: "PROXY 86.108.78.12:9030", weight: 8 }
        ],
        voice: [
            { proxy: "PROXY 82.212.84.33:10012", weight: 10 },
            { proxy: "PROXY 212.35.66.45:10012", weight: 9 }
        ],
        critical: [
            { proxy: "PROXY 82.212.84.33:8081", weight: 10 },
            { proxy: "PROXY 82.212.84.33:4433", weight: 10 }
        ]
    },

    gulf: [
        { proxy: "PROXY 185.125.190.10:20001", weight: 10 },
        { proxy: "PROXY 5.62.61.100:20001", weight: 9 },
        { proxy: "PROXY 212.71.234.50:20001", weight: 8 }
    ],

    block: "PROXY 127.0.0.1:9",
    
    thresholds: {
        min_score: 30,
        max_fails: 5,
        match_timeout: 1800000, // 30 minutes
        dns_ttl: 300000, // 5 minutes
        health_check_interval: 60000 // 1 minute
    }
};

// ========================== STATE MANAGEMENT ==========================
var STATE = {
    session_id: null,
    player_hash: null,
    
    // Match state
    match_proxy: null,
    match_locked: false,
    match_start_time: 0,
    match_host_pattern: null,
    
    // DNS cache with TTL
    dns_cache: {},
    
    // Performance metrics
    proxy_stats: {},
    rtt_samples: {},
    
    // Request tracking
    request_count: 0,
    last_lobby_time: 0,
    last_match_time: 0,
    
    // Health monitoring
    last_health_check: 0,
    blacklisted_proxies: {}
};

// ========================== GEO DATABASE ==========================
var GEO = {
    jordan_core: {
        "82.212.": { latency: 12, region: "JO-AM" },
        "212.35.": { latency: 15, region: "JO-AM" },
        "86.108.": { latency: 18, region: "JO-IR" }
    },

    jordan_extended: {
        "176.29.":1, "91.106.":1, "188.247.":1,
        "78.135.":1, "78.138.":1, "78.139.":1,
        "37.202.":1, "37.238.":1,
        "79.134.":1, "79.173.":1,
        "62.72.":1, "62.150.":1, "62.251.":1,
        "46.185.":1, "92.253.":1, "94.249.":1,
        "149.200.":1
    },

    gulf: {
        "185.125.":1, "46.183.":1, "212.71.":1,
        "5.62.":1, "31.192.":1, "86.96.":1,
        "62.84.":1, "82.178.":1
    },

    anycast: {
        "13.":1, "15.":1, "18.":1, "52.":1, "54.":1,
        "104.":1, "172.":1
    },

    block: {
        "58.147.":1, "59.153.":1, "61.5.":1,
        "91.109.":1, "103.":1, "45.":1,
        "39.32.":1, "111.68.":1,
        "195.":1, "185.2.":1
    }
};

// ========================== UTILITY FUNCTIONS ==========================

function now() {
    return Date.now();
}

function startsWith(ip, table) {
    for (var prefix in table) {
        if (ip.indexOf(prefix) === 0) return table[prefix];
    }
    return false;
}

function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h) >>> 0; // Unsigned 32-bit
}

function extractHost(url) {
    var match = url.match(/^https?:\/\/([^\/]+)/);
    return match ? match[1] : "";
}

// ========================== DNS RESOLUTION WITH TTL ==========================

function resolve(host) {
    var cached = STATE.dns_cache[host];
    if (cached && (now() - cached.time < CONFIG.thresholds.dns_ttl)) {
        return cached.ip;
    }
    
    try {
        var ip = dnsResolve(host);
        if (ip && ip !== "127.0.0.1") {
            STATE.dns_cache[host] = { ip: ip, time: now() };
            return ip;
        }
    } catch (e) {}
    
    return null;
}

// ========================== SESSION MANAGEMENT ==========================

function initSession() {
    if (!STATE.session_id) {
        STATE.session_id = now().toString(36) + Math.random().toString(36).substr(2);
        STATE.player_hash = hash(STATE.session_id);
    }
}

function resetMatchState(reason) {
    if (STATE.match_locked) {
        STATE.match_locked = false;
        STATE.match_proxy = null;
        STATE.match_start_time = 0;
        STATE.match_host_pattern = null;
    }
}

// ========================== PERFORMANCE TRACKING ==========================

function initProxyStats(proxy) {
    if (!STATE.proxy_stats[proxy]) {
        STATE.proxy_stats[proxy] = {
            success: 0,
            fail: 0,
            last_used: 0,
            consecutive_fails: 0
        };
    }
    return STATE.proxy_stats[proxy];
}

function recordSuccess(proxy) {
    var stats = initProxyStats(proxy);
    stats.success++;
    stats.consecutive_fails = 0;
    stats.last_used = now();
    
    // Remove from blacklist if recovered
    if (STATE.blacklisted_proxies[proxy]) {
        delete STATE.blacklisted_proxies[proxy];
    }
}

function recordFailure(proxy) {
    var stats = initProxyStats(proxy);
    stats.fail++;
    stats.consecutive_fails++;
    
    // Blacklist if too many consecutive failures
    if (stats.consecutive_fails >= CONFIG.thresholds.max_fails) {
        STATE.blacklisted_proxies[proxy] = now();
    }
}

function getProxyScore(proxy) {
    var stats = STATE.proxy_stats[proxy];
    if (!stats) return 50;
    
    var total = stats.success + stats.fail;
    if (total === 0) return 50;
    
    var base_score = (stats.success / total) * 100;
    
    // Penalty for consecutive failures
    var fail_penalty = stats.consecutive_fails * 10;
    
    // Penalty for being blacklisted
    var blacklist_penalty = STATE.blacklisted_proxies[proxy] ? 50 : 0;
    
    return Math.max(0, base_score - fail_penalty - blacklist_penalty);
}

function isProxyHealthy(proxy) {
    if (STATE.blacklisted_proxies[proxy]) {
        // Allow recovery after 5 minutes
        if (now() - STATE.blacklisted_proxies[proxy] > 300000) {
            delete STATE.blacklisted_proxies[proxy];
            var stats = STATE.proxy_stats[proxy];
            if (stats) stats.consecutive_fails = 0;
            return true;
        }
        return false;
    }
    return getProxyScore(proxy) >= CONFIG.thresholds.min_score;
}

// ========================== RTT TRACKING ==========================

function recordRTT(proxy, rtt) {
    if (!STATE.rtt_samples[proxy]) {
        STATE.rtt_samples[proxy] = [];
    }
    STATE.rtt_samples[proxy].push(rtt);
    if (STATE.rtt_samples[proxy].length > 10) {
        STATE.rtt_samples[proxy].shift();
    }
}

function getAvgRTT(proxy) {
    var samples = STATE.rtt_samples[proxy];
    if (!samples || samples.length === 0) return 999;
    
    var sum = 0;
    for (var i = 0; i < samples.length; i++) {
        sum += samples[i];
    }
    return sum / samples.length;
}

function estimateRTT(ip) {
    var core = startsWith(ip, GEO.jordan_core);
    if (core && core.latency) return core.latency;
    if (startsWith(ip, GEO.jordan_extended)) return 25;
    if (startsWith(ip, GEO.gulf)) return 40;
    if (startsWith(ip, GEO.anycast)) return 30;
    return 100;
}

// ========================== TRAFFIC CLASSIFICATION ==========================

function isPUBG(host) {
    return /pubg|pubgm|tencent|krafton|lightspeed|intlgame|qcloud|gcloud|proximabeta/i.test(host);
}

function isLobby(url, host) {
    return /lobby|matchmaking|recruit|team|party|invite|social/i.test(url + host);
}

function isMatch(url, host) {
    return /game|battle|session|zone|fight|combat|gs\d+|match/i.test(url + host);
}

function isVoice(url, host) {
    return /voice|rtc|webrtc|voip|audio/i.test(url + host);
}

function isCritical(url, host) {
    return /final|circle|revive|airdrop|winner|chicken|endgame/i.test(url + host);
}

function isArena(url, host) {
    return /arena|tdm|training|practice/i.test(url + host);
}

function isWOW(url, host) {
    return /wow|ugc|custom|room|creative|workshop/i.test(url + host);
}

function isTelemetry(url, host) {
    return /telemetry|analytic|crash|metric|beacon|track|log/i.test(url + host);
}

function isDownload(url, host) {
    return /download|update|patch|cdn|asset|resource/i.test(url + host);
}

// ========================== PROXY SELECTION ==========================

function sortProxiesByScore(proxies) {
    var scored = [];
    for (var i = 0; i < proxies.length; i++) {
        var p = proxies[i];
        var proxy_str = typeof p === 'string' ? p : p.proxy;
        
        if (!isProxyHealthy(proxy_str)) continue;
        
        var score = getProxyScore(proxy_str);
        var weight = (typeof p === 'object' && p.weight) ? p.weight : 5;
        var final_score = score * (weight / 10);
        
        scored.push({
            proxy: proxy_str,
            score: final_score,
            raw_score: score,
            weight: weight
        });
    }
    
    scored.sort(function(a, b) {
        return b.score - a.score;
    });
    
    return scored;
}

function selectBestProxy(proxies, fallback) {
    var sorted = sortProxiesByScore(proxies);
    
    if (sorted.length === 0) {
        return fallback || "DIRECT";
    }
    
    return sorted[0].proxy;
}

function buildProxyChain(proxies, fallback) {
    var sorted = sortProxiesByScore(proxies);
    var chain = [];
    
    for (var i = 0; i < sorted.length && i < 3; i++) {
        chain.push(sorted[i].proxy);
    }
    
    if (fallback) chain.push(fallback);
    
    return chain.length > 0 ? chain.join("; ") : "DIRECT";
}

// ========================== CONSISTENT HASHING ==========================

function buildHashRing() {
    var ring = [];
    var primaries = CONFIG.jordan.primary;
    var ring_size = 4294967296; // 2^32
    var step = Math.floor(ring_size / primaries.length);
    
    for (var i = 0; i < primaries.length; i++) {
        var proxy_str = typeof primaries[i] === 'string' ? primaries[i] : primaries[i].proxy;
        ring.push({
            position: i * step,
            proxy: proxy_str
        });
    }
    
    ring.sort(function(a, b) {
        return a.position - b.position;
    });
    
    return ring;
}

var HASH_RING = buildHashRing();

function consistentProxy() {
    var player_pos = STATE.player_hash;
    
    for (var i = 0; i < HASH_RING.length; i++) {
        var node = HASH_RING[i];
        if (player_pos <= node.position) {
            if (isProxyHealthy(node.proxy)) {
                return node.proxy;
            }
        }
    }
    
    // Fallback to first healthy proxy
    for (var j = 0; j < HASH_RING.length; j++) {
        if (isProxyHealthy(HASH_RING[j].proxy)) {
            return HASH_RING[j].proxy;
        }
    }
    
    // Last resort
    return HASH_RING[0].proxy;
}

// ========================== MATCH STATE MANAGEMENT ==========================

function checkMatchTimeout() {
    if (STATE.match_locked) {
        var elapsed = now() - STATE.match_start_time;
        if (elapsed > CONFIG.thresholds.match_timeout) {
            resetMatchState("timeout");
        }
    }
}

function shouldResetMatch() {
    // Reset if we've been in lobby recently and it's been a while since match traffic
    if (STATE.last_lobby_time > STATE.last_match_time) {
        var since_lobby = now() - STATE.last_lobby_time;
        if (since_lobby < 30000) { // 30 seconds
            return true;
        }
    }
    return false;
}

// ========================== MAIN ROUTING ENGINE ==========================

function FindProxyForURL(url, host) {
    host = host.toLowerCase();
    url = url.toLowerCase();
    
    initSession();
    STATE.request_count++;
    
    // Non-PUBG traffic
    if (!isPUBG(host)) {
        return "DIRECT";
    }
    
    // Block telemetry early
    if (isTelemetry(url, host) && !isMatch(url, host)) {
        return CONFIG.block;
    }
    
    // Resolve IP
    var ip = resolve(host);
    if (!ip) {
        return "DIRECT";
    }
    
    // Block blacklisted IPs
    if (startsWith(ip, GEO.block)) {
        return CONFIG.block;
    }
    
    // Geographic classification
    var is_jordan_core = startsWith(ip, GEO.jordan_core);
    var is_jordan_ext = startsWith(ip, GEO.jordan_extended);
    var is_gulf = startsWith(ip, GEO.gulf);
    var is_anycast = startsWith(ip, GEO.anycast);
    
    var is_jordan = is_jordan_core || is_jordan_ext;
    
    // Estimate RTT
    var estimated_rtt = estimateRTT(ip);
    
    // Check for match timeout
    checkMatchTimeout();
    
    // Check if we should reset match state
    if (shouldResetMatch()) {
        resetMatchState("lobby_detected");
    }
    
    // ==================== VOICE TRAFFIC ====================
    if (isVoice(url, host)) {
        if (is_jordan) {
            return buildProxyChain(CONFIG.jordan.voice, "DIRECT");
        }
        return "DIRECT";
    }
    
    // ==================== CRITICAL TRAFFIC ====================
    if (isCritical(url, host)) {
        if (is_jordan_core) {
            recordSuccess(STATE.match_proxy || CONFIG.jordan.critical[0].proxy);
            return buildProxyChain(CONFIG.jordan.critical, 
                                   buildProxyChain(CONFIG.jordan.primary));
        }
        return CONFIG.block;
    }
    
    // ==================== MATCH TRAFFIC ====================
    if (isMatch(url, host)) {
        STATE.last_match_time = now();
        
        // Only allow Jordan core for matches
        if (!is_jordan_core) {
            return CONFIG.block;
        }
        
        // Lock to consistent proxy
        if (!STATE.match_locked) {
            STATE.match_proxy = consistentProxy();
            STATE.match_locked = true;
            STATE.match_start_time = now();
            STATE.match_host_pattern = host;
        }
        
        recordSuccess(STATE.match_proxy);
        
        var critical_chain = buildProxyChain(CONFIG.jordan.critical);
        return STATE.match_proxy + "; " + critical_chain;
    }
    
    // ==================== LOBBY TRAFFIC ====================
    if (isLobby(url, host)) {
        STATE.last_lobby_time = now();
        
        // Reset match if we're back in lobby
        if (STATE.match_locked) {
            resetMatchState("lobby_return");
        }
        
        if (is_jordan) {
            return buildProxyChain(CONFIG.jordan.lobby, 
                                   buildProxyChain(CONFIG.jordan.primary));
        }
        
        if (is_gulf || is_anycast) {
            return buildProxyChain(CONFIG.gulf, "DIRECT");
        }
        
        return CONFIG.block;
    }
    
    // ==================== ARENA/TDM TRAFFIC ====================
    if (isArena(url, host)) {
        if (is_jordan) {
            return buildProxyChain(CONFIG.jordan.primary);
        }
        return CONFIG.block;
    }
    
    // ==================== CUSTOM/WOW MODES ====================
    if (isWOW(url, host)) {
        if (is_jordan) {
            return buildProxyChain(CONFIG.jordan.primary);
        }
        return CONFIG.block;
    }
    
    // ==================== DOWNLOAD/UPDATE TRAFFIC ====================
    if (isDownload(url, host)) {
        return "DIRECT";
    }
    
    // ==================== DEFAULT ROUTING ====================
    if (is_jordan) {
        return buildProxyChain(CONFIG.jordan.primary);
    }
    
    if (is_gulf) {
        return buildProxyChain(CONFIG.gulf, "DIRECT");
    }
    
    if (is_anycast) {
        return "DIRECT";
    }
    
    // Block unknown traffic
    return CONFIG.block;
}

// ========================== MONITORING & DEBUG ==========================

function getSystemStats() {
    return {
        session: STATE.session_id,
        requests: STATE.request_count,
        match_locked: STATE.match_locked,
        match_proxy: STATE.match_proxy,
        match_duration: STATE.match_locked ? (now() - STATE.match_start_time) : 0,
        dns_cache_size: Object.keys(STATE.dns_cache).length,
        blacklisted: Object.keys(STATE.blacklisted_proxies).length
    };
}

// ========================== END ==========================
