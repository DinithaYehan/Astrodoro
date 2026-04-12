let CURRENT_WORK_SECONDS = 25 * 60; // Default config
let timerState = {
    status: 'stopped', // 'stopped', 'running', 'paused', 'finished'
    remainingTime: CURRENT_WORK_SECONDS,
};

// Initialize the default on startup
chrome.storage.local.get(['customTime', 'status', 'targetEndTime'], (data) => {
    if (data.customTime) {
        CURRENT_WORK_SECONDS = data.customTime;
        if (!data.status || data.status === 'stopped') {
            timerState.remainingTime = data.customTime;
        }
    }
});

function startTimer() {
    timerState.status = 'running';
    
    chrome.storage.local.get(['targetEndTime'], (data) => {
        let newEndTime;
        if (data.targetEndTime && data.targetEndTime > Date.now()) {
            newEndTime = data.targetEndTime;
        } else {
            newEndTime = Date.now() + (timerState.remainingTime * 1000);
        }
        
        chrome.storage.local.set({ 
            status: 'running',
            targetEndTime: newEndTime 
        });

        chrome.alarms.create('pomodoroAlarm', { delayInMinutes: timerState.remainingTime / 60 });
        tick();
    });
}

function stopTimer() {
    timerState.status = 'stopped';
    chrome.storage.local.get(['customTime'], (data) => {
        timerState.remainingTime = data.customTime || CURRENT_WORK_SECONDS; // Use customized default
        chrome.alarms.clearAll();
        chrome.storage.local.set({ status: 'stopped', targetEndTime: null });
        broadcastState();
    });
}

function pauseTimer() {
    timerState.status = 'paused';
    chrome.alarms.clearAll();
    chrome.storage.local.set({ status: 'paused', targetEndTime: null });
    broadcastState();
}

function tick() {
    chrome.storage.local.get(['status', 'targetEndTime'], (data) => {
        if (data.status === 'running' && data.targetEndTime) {
            const now = Date.now();
            const left = Math.round((data.targetEndTime - now) / 1000);
            
            if (left <= 0) {
                // Timer finished!
                timerState.status = 'finished';
                timerState.remainingTime = 0;
                chrome.storage.local.set({ status: 'finished', targetEndTime: null });
                chrome.alarms.clearAll();
                broadcastState();
                triggerRocketAnimation();
            } else {
                timerState.remainingTime = left;
                timerState.status = 'running';
                broadcastState();
                setTimeout(tick, 1000);
            }
        }
    });
}

function broadcastState() {
    chrome.runtime.sendMessage({ action: 'tick', state: timerState }).catch(() => {});
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'pomodoroAlarm') {
        timerState.status = 'finished';
        timerState.remainingTime = 0;
        chrome.storage.local.set({ status: 'finished', targetEndTime: null });
        broadcastState();
        triggerRocketAnimation();
        
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'assets/128.png', 
            title: 'Astrodoro: Liftoff!',
            message: 'Your mission is complete. Great focus!'
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getState') {
        chrome.storage.local.get(['status', 'targetEndTime', 'customTime'], (data) => {
            if (data.status === 'running' && data.targetEndTime) {
                timerState.status = 'running';
                timerState.remainingTime = Math.max(0, Math.round((data.targetEndTime - Date.now()) / 1000));
            } else if (data.status === 'paused') {
                timerState.status = 'paused';
            } else {
                timerState.status = 'stopped';
                timerState.remainingTime = data.customTime || CURRENT_WORK_SECONDS;
            }
            sendResponse(timerState);
            if (timerState.status === 'running') tick();
        });
        return true; 
    }
    
    if (message.action === 'toggle') {
        if (timerState.status === 'running') pauseTimer();
        else if (timerState.status === 'finished') { stopTimer(); startTimer(); }
        else startTimer();
        sendResponse(true);
    }
    
    if (message.action === 'reset') {
        stopTimer();
        sendResponse(true);
    }

    if (message.action === 'updateTime') {
        CURRENT_WORK_SECONDS = message.seconds;
        // Only force UI update if timer is actively stopped
        if (timerState.status === 'stopped' || timerState.status === 'finished') {
            timerState.remainingTime = CURRENT_WORK_SECONDS;
            chrome.storage.local.set({ status: 'stopped', targetEndTime: null });
        }
        broadcastState();
        sendResponse(true);
    }
});

chrome.runtime.onStartup.addListener(() => {
    tick();
});

function triggerRocketAnimation() {
    chrome.tabs.query({active: true}, function(tabs) {
        tabs.forEach(tab => {
            if (tab.id && tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("edge://")) {
                chrome.scripting.insertCSS({
                    target: {tabId: tab.id},
                    files: ["content.css"]
                }).then(() => {
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        files: ["content.js"]
                    });
                }).catch(() => {});
            }
        });
    });
}
