let countdownInterval; // 計時器的 interval
let isPaused = false; // 記錄計時器是否處於暫停狀態
let pausedTime = null; // 暫存暫停時的剩餘時間
let remainingTime; // 剩餘的時間

// 讀取 URL 中的參數以獲取倒數時間
function getDurationFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('duration')) || 0;
}

// 開始倒數計時
function startCountdown() {
    const totalDuration = getDurationFromUrl();

    if (totalDuration < 1) {
        alert("計時器設置無效，將返回上一頁。");
        window.history.back();
        return;
    }

    // 如果 remainingTime 為 null，表示是第一次啟動計時器
    if (remainingTime == null) remainingTime = totalDuration;

    countdownInterval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').textContent = "00:00";
            document.getElementById('pieTimer').style.background = '#FF0000'; // 餅圖變為全紅
            document.getElementById('backButton').style.display = 'block'; // 顯示返回按鈕
            playAlarm(); // 播放音效
        } else if (!isPaused) {
            // 更新倒數時間與餅圖
            document.getElementById('countdown').textContent = formatTime(remainingTime);
            updatePieTimer(remainingTime, totalDuration);
            remainingTime--;
        }
    }, 1000);
}

// 格式化時間為 mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 更新餅圖的填充角度
function updatePieTimer(remainingTime, totalDuration) {
    const percentComplete = (1 - (remainingTime / totalDuration)) * 360;
    document.getElementById('pieTimer').style.background = `conic-gradient(#FF0000 ${percentComplete}deg, #4CAF50 ${percentComplete}deg)`;
}

// 播放鈴聲
function playAlarm() {
    const alarmSound = document.getElementById('alarmSound');
    alarmSound.currentTime = 0; // 重置音效到開始位置
    alarmSound.play().catch(error => {
        console.log("音效播放被阻止：", error); // 捕獲錯誤信息
    });
}

// 返回設置頁面
function goBack() {
    window.location.href = "index.html";
}

// 暫停/繼續功能
function togglePauseResume() {
    const button = document.getElementById('pauseResumeButton');

    if (!isPaused) {
        // 暫停計時
        clearInterval(countdownInterval);
        pausedTime = remainingTime; // 保存暫停時的剩餘時間
        button.textContent = "繼續";
    } else {
        // 繼續計時
        remainingTime = pausedTime; // 恢復剩餘時間
        button.textContent = "暫停";
        startCountdown();
    }

    isPaused = !isPaused; // 切換狀態
}
