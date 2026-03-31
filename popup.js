const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

function updateDisplay(remainingTime) {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function fetchTimerState() {
    chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
        if (response) {
            updateDisplay(response.remainingTime);
        }
    });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'tick') {
        updateDisplay(message.state.remainingTime);
    }
});

startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'toggle' });
    setTimeout(fetchTimerState, 50);
});

resetBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'reset' });
    setTimeout(fetchTimerState, 50);
});

fetchTimerState();
