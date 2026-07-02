document.addEventListener("DomContentLoaded", async () => {
    const { settings, stats } = await chrome.storage.local.get(["settings","stats"]);

    const current = settings || { enabled: true, blockYouTube: true, blockInstagram: true };
    document.getElementById("enabled").checked = current.enabled;
    document.getElementById("blockYouTube").checked = current.blockYouTube;
    document.getElementById("blockInstagram").checked = current.blockInstagram;

    document.getElementById("blockedToday").textContent = stats ? stats.blockedToday : 0;
    document.getElementById("blockedTotal").textContent = stats ? stats.blockedTotal : 0;

    ["enabled", "blockYouTube", "blockInstagram"].forEach((id) => {
    document.getElementById(id).addEventListener("change", saveSettings);
    });
});

async function saveSettings() {
    const settings = {
        enabled: document.getElementById("enabled").checked,
        blockYouTube: document.getElementById("blockYouTube").checked,
        blockInstagram: document.getElementById("blockInstagram").checked
    };
    await chrome.storage.local.set({ settings });
}