/* =========================================================
   🇯🇴 PUBG OMEGA HARD LOCK – FINAL MAX
   Single Core | Absolute Sticky | Region Kill Switch
   Zero EU | Zero Asia | Zero TR | No Direct | No Fallback
   ========================================================= */

var CORE = "PROXY 176.29.153.95:20001";

/* ==============================
   🔒 ABSOLUTE SESSION LOCK
   ============================== */
var LOCK = CORE;

/* ==============================
   ⚡ FNV-1a HASH (Anchor Stability)
   ============================== */
function fnv1a(str){
  var h = 2166136261;
  for (var i = 0; i < str.length; i++){
    h ^= str.charCodeAt(i);
    h += (h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);
  }
  return h >>> 0;
}

/* ==============================
   🎮 EXTREME PUBG DETECTION
   ============================== */
function isPUBG(host, url){
  var s = (host + " " + url).toLowerCase();

  return (
    /pubg|pubgm|krafton|lightspeed|proximabeta|igame/.test(s) ||
    /tencent|qcloud|myqcloud|gcloud|amazonaws|aws|cloudfront/.test(s) ||
    /battle|match|arena|allocation|dispatcher|router|session|lobby/.test(s) ||
    /erangel|livik|miramar|tdm|warehouse|rank|classic|zone|payload/.test(s)
  );
}

/* ==============================
   🌍 REGION KILL SWITCH
   ============================== */
function foreignRegion(host){

  var h = (host||"").toLowerCase();

  return (
    /* Europe */
    /eu-|europe|de-|fr-|nl-|uk-|it-|pl-|es-|se-|fi-|ro-|cz-/.test(h) ||

    /* Asia */
    /asia|ap-|sg-|jp-|kr-|hk-|tw-|india|in-|th-|vn-/.test(h) ||

    /* Turkey / Russia */
    /tr-|turkey|ru-|russia/.test(h)
  );
}

/* ==============================
   🧱 HARD PIN ENGINE
   ============================== */
function hardPin(){
  return LOCK;
}

/* ==============================
   🚀 MAIN ENGINE
   ============================== */
function FindProxyForURL(url, host){

  if (isPUBG(host, url)){

    /* أي Endpoint أجنبي يُجبر على CORE */
    if (foreignRegion(host)){
      return LOCK;
    }

    /* تثبيت كامل بدون توسعة */
    return LOCK;
  }

  /* منع DIRECT نهائي */
  return CORE;
}
