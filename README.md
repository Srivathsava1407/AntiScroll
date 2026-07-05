# Scroll Blocker - browser extension - v:1.1.0

A Chrome extension that detects and blocks YouTube Shorts and Instagram Reels, so you can use both sites without falling into a scroll loop.

## Install it (unpacked, for development)
 
1. Open `chrome://extensions`
2. Toggle on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this folder
The extension icon appears in your toolbar. Click it to toggle blocking per site and see your stats.
 
## How it works
 
- `content.js` runs on youtube.com and instagram.com. It watches the page two ways at once:
  - a `MutationObserver` for DOM changes
  - a polling fallback (`setInterval`) for SPA navigation that doesn't reliably trigger a DOM mutation
- Landing directly on a Shorts/Reels URL (`/shorts/...`, `/reels/...`) redirects you back to the homepage.
- A Shorts/Reels shelf mixed into your normal feed gets hidden, rather than blocking the whole page. *//Yet to be implemented*
- `background.js` just sets sane defaults on install.
- All state lives in `chrome.storage.local` — nothing leaves your machine.
 
## Roadmap of future version updates

- [X] Hiding shorts/reels shelf from the homepage
- [ ] Friction screen (a short delay/prompt) instead of an instant redirect
- [ ] Per-time-of-day schedules (e.g. only block 9am–5pm)
- [ ] Android companion app using `AccessibilityService` for native app coverage
- [ ] Backend to sync settings/stats across devices
