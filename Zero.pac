/************************************************************
 *  FINAL PAC – PUBG MOBILE (iOS) – OVERKILL++ (VALID PAC)
 *
 *  Requirements (as requested):
 *  - NO DIRECT anywhere (hard proxy only)
 *  - WOW uses SAME proxy as MATCH
 *  - Arena uses Jordan proxy
 *  - PUBG detection broad (covers most PUBGM ecosystems)
 *  - No time-based logic, no random(), no DNS dependency logic
 *
 *  Notes:
 *  - PAC still receives host as a hostname often; isInNet only helps
 *    when host is already an IP or resolvable by the system.
 ************************************************************/

/* =========================
   PROXIES (HARD ONLY)
   ========================= */
var PROXY = {
  // Jordan-ish / local path proxy for Arena + general lobby
  JORDAN_ARENA : "PROXY 176.29.153.95:9030",

  // Alternative lobby proxy (regional / second path)
  LOBBY_ALT    : "PROXY 212.35.66.45:9030",

  // Match backbone (main)
  MATCH_MAIN   : "PROXY 176.29.153.95:20001",

  // Match backbone (alt) - used only as stable split if needed
  MATCH_ALT    : "PROXY 212.35.66.45:20001"
};

/* =========================
   OPTIONAL: Jordan strong-path hint ranges
   (Used only as a soft tie-breaker for MATCH backbone)
   ========================= */
function isJordanStrongPath(host) {
  return (
    isInNet(host, "176.29.0.0",   "255.255.0.0")   || // common JO access blocks
    isInNet(host, "212.35.64.0",  "255.255.192.0") ||
    isInNet(host, "87.236.232.0", "255.255.248.0") ||
    isInNet(host, "185.54.12.0",  "255.255.252.0")
  );
}

/* =========================
   PUBG MOBILE – FULL DETECTION (host + url)
   ========================= */
function isPUBG(host, url) {
  var h = (host || "").toLowerCase();
  var u = (url  || "").toLowerCase();
  var s = h + " " + u;

  // Core brands / ecosystems seen across PUBG Mobile deployments:
  // - Tencent/KRAFTON/Lightspeed ecosystem
  // - intlgame/igamecj/proximabeta/amsoveasea (common strings)
  // - gcloud/qcloud (infra)
  // - vmp/gme/gamecenter (game services patterns)
  return (
    /pubg/.test(s) ||
    /pubgm/.test(s) ||
    /pubgmobile/.test(s) ||
    /intlgame/.test(s) ||
    /igamecj/.test(s) ||
    /tencent/.test(s) ||
    /krafton/.test(s) ||
    /lightspeed/.test(s) ||
    /lightspeedandquantum/.test(s) ||
    /proximabeta/.test(s) ||
    /amsoveasea/.test(s) ||
    /gcloud/.test(s) ||
    /qcloud/.test(s) ||
    /vmp/.test(s) ||
    /vmpone/.test(s) ||
    /gme/.test(s) ||
    /gamecenter/.test(s)
  );
}

/* =========================
   MODE / TRAFFIC CLASSIFIERS (url-heavy)
   ========================= */

// Lobby / matchmaking / rooms / recruit / party
function isLobby(url) {
  var u = (url || "").toLowerCase();
  return /(lobby|matchmaking|matching|queue|room|rooms|customroom|custom-room|recruit|team|squad|party|invite|gate|dispatcher|router|region|allocation)/.test(u);
}

// WOW (World of Wonder)
function isWOW(url) {
  var u = (url || "").toLowerCase();
  return /(worldofwonder|wow|ugc|creative|creation|creations|custommap|custom-map|template|templates|map|maps|featured|trending|popular|recommend|recommended|daily|weekly|contest|contests|community|workshop|editor|publish|published|playtogether|play-together)/.test(u);
}

// Arena / TDM / Training / Evo / Infection
function isArena(url) {
  var u = (url || "").toLowerCase();
  return /(arena|tdm|deathmatch|teamdeathmatch|team[_-]?deathmatch|gun|gungame|gun[_-]?game|training|arenatraining|arena[_-]?training|ultimate|ultimatearena|ultimate[_-]?arena|warehouse|hangar|evo|evoground|infection)/.test(u);
}

// Metro / Payload / PvE / Zombie-ish keywords
function isSpecial(url) {
  var u = (url || "").toLowerCase();
  return /(metro|metroroyale|payload|helicopter|zombie|pve|mission|survive|survival|raid|co-op|coop)/.test(u);
}

/* =========================
   STABLE FINGERPRINT (NO TIME / NO RANDOM)
   - Same host + similar url length => stable score
   ========================= */
function fingerprint(host, url) {
  var h = (host || "").toLowerCase();
  var u = (url  || "");
  var s = h + "|" + u.length;

  var score = 0;
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    score += (c % 23) * 3;
    score += (c % 13) * 2;
    score += (c % 7);
  }
  return score;
}

/* =========================
   MATCH BACKBONE SELECTOR (Ping+Stability)
   - Prefer MATCH_MAIN if destination hints JO path
   - Otherwise stable split to reduce spikes
   ========================= */
function pickMatchProxy(host, fp) {
  if (isJordanStrongPath(host)) return PROXY.MATCH_MAIN;
  return (fp % 2 === 0) ? PROXY.MATCH_MAIN : PROXY.MATCH_ALT;
}

/* =========================
   FINAL CLASSIFIER CORE
   - WOW => SAME AS MATCH (your requirement)
   - Arena => Jordan proxy (your requirement)
   - Lobby => mostly Jordan proxy, sometimes alt (stability)
   - Special modes => lobby alt (often lighter path)
   - Default (PUBG) => match backbone
   ========================= */
function classifyRoute(host, url) {
  var fp = fingerprint(host, url);

  // WOW: same as match (طلبك)
  if (isWOW(url)) {
    return pickMatchProxy(host, fp);
  }

  // Arena: Jordan proxy (طلبك)
  if (isArena(url)) {
    return PROXY.JORDAN_ARENA;
  }

  // Special modes (Metro/Payload/PvE): often better on ALT
  if (isSpecial(url)) {
    return PROXY.LOBBY_ALT;
  }

  // Lobby: bias to Jordan, occasional alt for balancing
  if (isLobby(url)) {
    return (fp % 4 === 0) ? PROXY.LOBBY_ALT : PROXY.JORDAN_ARENA;
  }

  // Everything else in PUBG bucket: treat as match backbone
  return pickMatchProxy(host, fp);
}

/* =========================
   PAC ENTRY POINT
   - NO DIRECT ANYWHERE
   ========================= */
function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();

  if (isPUBG(host, url)) {
    return classifyRoute(host, url);
  }

  // Hard mode for all other traffic too (as requested: no DIRECT)
  return PROXY.JORDAN_ARENA;
}
