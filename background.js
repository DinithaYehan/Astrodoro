let timerState = {
    status: 'stopped',
    remainingTime: 25 * 60
};

function startTimer() {
    timerState.status = 'running';
    chrome.storage.local.set({ 
        status: 'running',
        targetEndTime: Date.now() + (timerState.remainingTime * 1000) 
    });
    chrome.alarms.create('pomodoroAlarm', { delayInMinutes: timerState.remainingTime / 60 });
    tick();
}

function stopTimer() {
    timerState.status = 'stopped';
    timerState.remainingTime = 25 * 60;
    chrome.alarms.clearAll();
    broadcastState();
}

function tick() {
    chrome.storage.lop;cal.get(['status', 'targetEndTime'], (data) => {
        if (data.status === 'running' && data.targetEndTime) {
            const left = Math.round((data.targetEndTime - Date.now()) / 1000);
            if (left <= 0) {
                timerState.status = 'finished';
                timerState.remainingTime = 0;
                chrome.storage.local.set({ status: 'finished' });
                chrome.alarms.clearAll();
                broadcastState();
            } else {
                timerState.remainingTime = left;
                broadcastState();
                setTimeout(tick, 1000);
            }
        }
    });
}

function broadcastState() {
    chrome.runtime.sendMessage({ action: 'tick', state: timerState }).catch(() => {});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getState') {
        sendResponse(timerState);
        return true;
    }
    if (message.action === 'toggle') {
        startTimer();
        sendResponse(true);
    }
    if (message.action === 'reset') {
        stopTimer();
        sendResponse(true);
    }
});
