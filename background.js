// Sets default settings and stats when the extension is installed for the first time.

chrome.runtime.onInstalled.addListener(async () => {
    const existing = await chrome.storage.local.get(["settings", "stats"]);

    if (!existing.settings) {
        await chrome.storage.local.set({
            settings: {
                enabled: true,
                blockYouTube: true,
                blockInstagram: true
            }
        });
    }

    if (!existing.stats) {
        await chrome.storage.local.set({
            stats: {
                date: todayKey(),
                blockedToday: 0,
                blockedTotal: 0
            }
        });
    }
});

function todayKey() {
    return new Date().toISOString().slice(0, 10); // returns YYYY-MM-DD format date
}