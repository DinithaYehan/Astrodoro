const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('status-text');
const rocket = document.getElementById('rocket');

// Format total seconds into MM:SS
function formatTime(totalSeconds) {
    const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
    const seconds = Math.max(0, totalSeconds) % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Update UI based on current timer state
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
        // Launch animation
        if (!rocket.classList.contains("launching")) {
            rocket.className = "rocket launching";
        }
    } else {
        // Stopped
        startBtn.textContent = "Ignition";
        startBtn.classList.remove("running");
        statusText.textContent = "Ready for launch.";
        rocket.className = "rocket idle";
    }
}

// Check with the background script to see current timer state
function fetchTimerState() {
    chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
        if (response) {
            updateUI(response);
        }
    });
}

// Listen for updates from the background
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'tick' || message.action === 'stateUpdate') {
        updateUI(message.state);
    }
});

// Event Listeners for buttons
startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'toggle' });
    // Re-fetch state immediately so UI updates instantly
    setTimeout(fetchTimerState, 50);
});

resetBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'reset' });
    setTimeout(() => {
        rocket.className = "rocket idle";
        fetchTimerState();
    }, 50);
});

// On load, fetch current state
document.addEventListener('DOMContentLoaded', fetchTimerState);
