(function () {
    "use strict";

    const SITE = location.hostname.includes("youtube.com") ? "youtube"
    : location.hostname.includes("instagram.com") ? "instagram"
    : null;

    if (!SITE) return;

    let settings = { enabled: true, blockYouTube: true, blockInstagram: true };
    let lastPath = location.pathname;

    // ---- settings ----

    function loadSettings() {
        chrome.storage.local.get("settings", (data) => {
            if (data.settings) settings = data.settings;
        });
    }

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.settings) settings = changes.settings.newValue;
    });

    function siteIsBlocked() {
        if (!settings.enabled) return false;
        if (SITE === "youtube") return settings.blockYouTube;
        if (SITE === "instagram") return settings.blockInstagram;
        return false;
    }

    // ---- stats ----

    function recordBlock() {
        const today = todayKey();
        chrome.storage.local.get("stats", (data) => {
            const stats = data.stats || { date: today, blockedToday: 0, blockedTotal: 0 };
            if (stats.date !== today) {
                stats.date = today;
                stats.blockedToday = 0;
            }
            stats.blockedToday += 1;
            stats.blockedTotal += 1;
            chrome.storage.local.set({ stats });
        });
    }

    // ---- detection: full Shorts/Rells pages ----
})