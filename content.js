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

    function todayKey() {
        return new Date().toISOString().slice(0,10);
    }

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

    function onShortsOrReelsPage() {
        if (SITE === "youtube") return location.pathname.startsWith("/shorts/");
        if (SITE === "instagram") return location.pathname.startsWith("/reels/");
        return false;
    }

    function redirectAway() {
        recordBlock();
        location.href = SITE === "youtube" ? "https://www.youtube.com/" : "https://www.instagram.com/";
    }

    // functions for detecting shorts/reels in feed/homescreen shelfs, and redirecting away from them.

    const YOUTUBE_SHELF_SELECTORS = [
        'ytd-reel-shelf-renderer',
        'ytd-rich-shelf-renderer[is-shorts',
        'ytd-guide-entry-renderer a[title="Shorts"]'
    ];

    const INSTAGRAM_SHELF_SELECTORS = [
        'a[href^="/reels/"]',
        'svg[aria-label="Reels"]'
    ];

    function hideShelves() {
        const selectors = SITE === "youtube" ? YOUTUBE_SHELF_SELECTORS : INSTAGRAM_SHELF_SELECTORS;
        for (const selector of selectors) {
            document.querySelectorAll(selector).forEach((el) => {
                const target = el.closest("ytd-rich-item renderer, ytd-rich-grid-renderer, ytd-guide-entry-renderer, a") || el;
                target.style.display = "none";
            });
        }
    }

    // ---- main loop ----

    function tick() {
        if (!siteIsBlocked()) return;

        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
        }

        if (onShortsOrReelsPage()) {
            redirectAway();
            return;
        }
    }

    const observer = new MutationObserver(() => tick());

    function init() {
        loadSettings();
        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(tick, 800);
        tick();
    }

    if (document.body) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();