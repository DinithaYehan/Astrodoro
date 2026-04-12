const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('status-text');
const rocket = document.getElementById('rocket');

// Theme & Settings elements
const themeBtn = document.getElementById('theme-btn');
const minInput = document.getElementById('min-input');
const secInput = document.getElementById('sec-input');
const incTimeBtn = document.getElementById('inc-time');
const decTimeBtn = document.getElementById('dec-time');
const saveSettingsBtn = document.getElementById('save-settings-btn');

// --- THEME LOGIC ---
let isDayMode = false;
chrome.storage.local.get(['themeMode', 'customTime'], (data) => {
    if (data.themeMode === 'day') {
        isDayMode = true;
        document.body.classList.add('theme-day');
        themeBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('theme-day');
        themeBtn.textContent = '🌙';
    }
    
    // Load custom timer default if saved
    if (data.customTime) {
        minInput.value = Math.floor(data.customTime / 60);
        secInput.value = (data.customTime % 60).toString().padStart(2, '0');
    }
});

themeBtn.addEventListener('click', () => {
    isDayMode = !isDayMode;
    if (isDayMode) {
        document.body.classList.add('theme-day');
        themeBtn.textContent = '☀️';
        chrome.storage.local.set({themeMode: 'day'});
    } else {
        document.body.classList.remove('theme-day');
        themeBtn.textContent = '🌙';
        chrome.storage.local.set({themeMode: 'dark'});
    }
});

// --- SETTINGS LOGIC ---
incTimeBtn.addEventListener('click', () => {
    let m = parseInt(minInput.value) || 0;
    if (m < 99) minInput.value = m + 1;
});

decTimeBtn.addEventListener('click', () => {
    let m = parseInt(minInput.value) || 0;
    if (m > 1) minInput.value = m - 1;
});

saveSettingsBtn.addEventListener('click', () => {
    let m = parseInt(minInput.value) || 0;
    let s = parseInt(secInput.value) || 0;
    let totalSeconds = (m * 60) + s;
    if (totalSeconds < 1) totalSeconds = 60; 
    
    // Save locally
    chrome.storage.local.set({customTime: totalSeconds});
    
    
    chrome.runtime.sendMessage({ action: 'updateTime', seconds: totalSeconds });
    
    
    saveSettingsBtn.textContent = "Saved!";
    setTimeout(() => {
        saveSettingsBtn.textContent = "Save Timer";
        fetchTimerState(); 
    }, 1000);
});

// --- TIMER LOGIC ---
function formatTime(totalSeconds) {
    const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
    const seconds = Math.max(0, totalSeconds) % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateUI(state) {
    timeDisplay.textContent = formatTime(state.remainingTime);
    
    if (state.status === "running") {
        startBtn.textContent = "Pause Liftoff";
        startBtn.classList.add("running");
        statusText.textContent = "Fueling in progress...";
        rocket.className = "rocket fueling";
    } else if (state.status === "paused") {
        startBtn.textContent = "Resume Liftoff";
        startBtn.classList.remove("running");
        statusText.textContent = "Liftoff paused.";
        rocket.className = "rocket idle";
    } else if (state.status === "finished") {
        startBtn.textContent = "Next Mission";
        startBtn.classList.remove("running");
        statusText.textContent = "Liftoff successful! 🌟";
        timeDisplay.textContent = "00:00";
        if (!rocket.classList.contains("launching")) {
            rocket.className = "rocket launching";
        }
    } else {
        startBtn.textContent = "Ignition";
        startBtn.classList.remove("running");
        statusText.textContent = "Ready for launch.";
        rocket.className = "rocket idle";
    }
}

function fetchTimerState() {
    chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
        if (response) updateUI(response);
    });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'tick' || message.action === 'stateUpdate') {
        updateUI(message.state);
    }
});

startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'toggle' });
    setTimeout(fetchTimerState, 50);
});

resetBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'reset' });
    setTimeout(() => {
        rocket.className = "rocket idle";
        fetchTimerState();
    }, 50);
});

document.addEventListener('DOMContentLoaded', fetchTimerState);
