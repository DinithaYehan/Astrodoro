<div align="center">
  <img src="assets/Astrodoro.png" alt="Astrodoro Banner" style="width: 100%; max-width: 600px; border-radius: 12px; margin-bottom: 20px;">
  
  # 🚀 Astrodoro
  **Mission Control for Your Focus.**
  
  A sleek, space-themed Pomodoro Chrome extension built to help you defeat distractions and achieve orbit on your goals. 

  [![Hack Club Challenger](https://img.shields.io/badge/Hack%20Club-Challenger%20HQ-blueviolet)](https://hackclub.com)
  [![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)](#)
</div>

<br>

## 🌌 Overview
**Astrodoro** is more than just a timer—it's your personal focus shuttle. Set the 25-minute Pomodoro timer, lock in, and watch as your rocket fuels up. When you successfully complete a 25-minute focus session, you'll be treated to a massive, screen-spanning CSS rocket launch directly injected into whatever webpage you are currently conquering!

Built as part of the **Hack Club Challenger** and **Extensions** sidequests, this extension runs efficiently utilizing Chrome's V3 manifest, Service Workers, and minimal styling overhead.

## ✨ Features
- 🚀 **Space Aesthetics:** A stunning, frosted-glass UI with a pure-CSS deep space background.
- ⏰ **Background Persistence:** Leverages `chrome.alarms` and `chrome.storage.local` to ensure your timer continues running efficiently, even when the popup is closed.
- 💥 **Active Tab Injection:** Missed the countdown? When focus time is complete, Astrodoro executes a `content_script` injection that propels a gigantic rocket blastoff across your active web tab to celebrate.
- 🖥️ **Minimal Footprint:** No heavy javascript frameworks—just HTML, CSS, and Vanilla JS operating flawlessly inside Manifest V3 constraint loops.

## 🛠️ Installation from Source

If you want to try Astrodoro by loading the unpacked raw files:

1. Clone or download this repository to your machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left.
5. Select the `Astrodoro` directory.
6. Pin Astrodoro to your toolbar and prepare for ignition!

## 📦 How to Release an Extension as `.crx`
*(For completing the Hack Club Extensions sidequest)*

To get your Chrome Developer License and fulfill the objective, follow these final steps to pack and publish your code as a Github Release:

#### Step 1: Pack the Extension
1. Go back to `chrome://extensions/` with Developer Mode enabled.
2. Click the **Pack extension** button at the top left.
3. For the **Extension root directory**, click Browse and select your `Astrodoro` folder (where your `manifest.json` lives).
4. Leave the **Private key file** blank (Chrome will generate everything for you automatically).
5. Click **Pack extension**. Chrome will generate two files slightly outside your folder: `Astrodoro.crx` (the actual extension) and `Astrodoro.pem` (the security key).

#### Step 2: Create a GitHub Release
1. Push all your latest code (including this updated README and assets) to your repository on GitHub.
2. Go to your repo's main page on GitHub and look for the **Releases** section on the right side. Click **Create a new release**.
3. Click "Choose a tag" and type `v1.0.0` (then click *Create new tag v1.0.0*).
4. Give your release an awesome title like `"Astrodoro Initial Launch 🚀"`.
5. Add a quick description celebrating your launch!
6. **CRITICAL STEP:** **Drag and drop your `Astrodoro.crx` file** into the "Attach binaries by dropping them here" area at the very bottom of the release page.
7. Click **Publish release**.

Congratulations! You are officially an extension publisher. Grab the link to that `.crx` file release to submit for your sidequest rewards!

---

<p align="center">
Made with 💖 for <a href="https://hackclub.com">Hack Club</a>
</p>