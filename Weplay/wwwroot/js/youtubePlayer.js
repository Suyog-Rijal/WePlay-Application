//let ytPlayer;
//const TOTAL_DURATION = 188.4;
//let dotnetReference;

//let progressBar;
//let progressFill;
//let progressHandle;
//let isDragging = false;

//let volumeSlider;
//let volumeFill;
//let isVolumeDragging = false;

//let lastVolume = 1.0;

//window.youtubePlayerInterop = {
//    setDotnetReference(ref) {
//        dotnetReference = ref;
//    },
//    initialize(videoId) {
//        return new Promise((resolve) => {
//            ytPlayer = new YT.Player('youtube-player', {
//                width: '100%',
//                height: '100%',
//                videoId: videoId,
//                playerVars: {
//                    controls: 0,
//                    modestbranding: 1,
//                    rel: 0,
//                    fs: 0,
//                    disablekb: 1,
//                    iv_load_policy: 3,
//                    playsinline: 1,
//                    autoplay: 1
//                },
//                events: {
//                    onReady: () => {
//                        lastVolume = 1.0;
//                        resolve();
//                    }
//                }
//            });
//        });
//    },
//    play() {
//        if (ytPlayer) ytPlayer.playVideo();
//    },
//    pause() {
//        if (ytPlayer) ytPlayer.pauseVideo();
//    },
//    destroy() {
//        if (ytPlayer) {
//            ytPlayer.destroy();
//            ytPlayer = null;
//        }
//    },
//    getCurrentTime() {
//        return ytPlayer ? ytPlayer.getCurrentTime() : 0;
//    },
//    seekForward() {
//        if (!ytPlayer) return;
//        const newTime = Math.min(ytPlayer.getCurrentTime() + 5, TOTAL_DURATION);
//        ytPlayer.seekTo(newTime, true);
//    },
//    seekBackward() {
//        if (!ytPlayer) return;
//        const newTime = Math.max(ytPlayer.getCurrentTime() - 5, 0);
//        ytPlayer.seekTo(newTime, true);
//    },
//    initProgressBar() {
//        progressBar = document.getElementById('progress-bar');
//        if (!progressBar) return;
//        progressFill = progressBar.querySelector('.bg-blue-500');
//        progressHandle = progressBar.querySelector('.bg-white');

//        progressBar.addEventListener('mousedown', startDrag);
//        progressBar.addEventListener('touchstart', startDrag, { passive: false });

//        document.addEventListener('mousemove', drag);
//        document.addEventListener('touchmove', drag, { passive: false });

//        document.addEventListener('mouseup', endDrag);
//        document.addEventListener('touchend', endDrag);
//    },
//    initVolumeSlider() {
//        volumeSlider = document.getElementById('volume-slider');
//        if (!volumeSlider) return;
//        volumeFill = volumeSlider.querySelector('.bg-blue-500');

//        volumeSlider.addEventListener('mousedown', startVolumeDrag);
//        volumeSlider.addEventListener('touchstart', startVolumeDrag, { passive: false });

//        document.addEventListener('mousemove', volumeDrag);
//        document.addEventListener('touchmove', volumeDrag, { passive: false });

//        document.addEventListener('mouseup', endVolumeDrag);
//        document.addEventListener('touchend', endVolumeDrag);
//    },
//    toggleMute() {
//        if (!ytPlayer) return;
//        if (ytPlayer.isMuted()) {
//            ytPlayer.unMute();
//            if (lastVolume <= 0) lastVolume = 0.5;
//            ytPlayer.setVolume(lastVolume * 100);
//            dotnetReference.invokeMethodAsync('OnVolumeChanged', lastVolume);
//            dotnetReference.invokeMethodAsync('OnMuteChanged', false);
//        } else {
//            lastVolume = ytPlayer.getVolume() / 100;
//            ytPlayer.mute();
//            dotnetReference.invokeMethodAsync('OnVolumeChanged', 0);
//            dotnetReference.invokeMethodAsync('OnMuteChanged', true);
//        }
//    },
//    setVolume(volume) {
//        if (!ytPlayer) return;
//        volume = Math.max(0, Math.min(1, volume));
//        ytPlayer.setVolume(volume * 100);
//        if (volume === 0) {
//            ytPlayer.mute();
//            dotnetReference.invokeMethodAsync('OnMuteChanged', true);
//        } else {
//            if (ytPlayer.isMuted()) {
//                ytPlayer.unMute();
//                dotnetReference.invokeMethodAsync('OnMuteChanged', false);
//            }
//            lastVolume = volume;
//        }
//        dotnetReference.invokeMethodAsync('OnVolumeChanged', volume);
//    },
//    getVolume() {
//        return ytPlayer ? ytPlayer.getVolume() / 100 : 1.0;
//    },
//    getMuted() {
//        return ytPlayer ? ytPlayer.isMuted() : false;
//    },

//    // ==== Fullscreen API ====
//    enterFullscreen: async function (elementId) {
//        const elem = document.getElementById(elementId);
//        if (!elem) return;

//        try {
//            if (elem.requestFullscreen) await elem.requestFullscreen();
//            else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
//            else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
//            else throw new Error("Fullscreen API not supported.");
//        } catch (err) {
//            console.error("Fullscreen enter failed:", err);
//        }
//    },

//    exitFullscreen: async function () {
//        try {
//            if (document.exitFullscreen) await document.exitFullscreen();
//            else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
//            else if (document.msExitFullscreen) await document.msExitFullscreen();
//            else throw new Error("Fullscreen exit not supported.");
//        } catch (err) {
//            console.error("Fullscreen exit failed:", err);
//        }
//    },

//    registerFullscreenChangeListener: function () {
//        const handler = () => {
//            const fullscreenElement =
//                document.fullscreenElement ||
//                document.webkitFullscreenElement ||
//                document.msFullscreenElement;

//            const isFullscreen = !!fullscreenElement;
//            if (dotnetReference) {
//                dotnetReference.invokeMethodAsync("OnFullscreenChanged", isFullscreen);
//            }
//        };

//        document.addEventListener("fullscreenchange", handler);
//        document.addEventListener("webkitfullscreenchange", handler);
//        document.addEventListener("msfullscreenchange", handler);
//    }
//};

//// ==== Drag & Volume ====
//function startDrag(e) {
//    e.preventDefault();
//    isDragging = true;
//    dotnetReference.invokeMethodAsync('SetDragging', true);
//    updateProgress(e);
//}

//function drag(e) {
//    if (!isDragging) return;
//    e.preventDefault();
//    updateProgress(e);
//}

//function endDrag(e) {
//    if (!isDragging) return;
//    isDragging = false;
//    dotnetReference.invokeMethodAsync('SetDragging', false);
//    const percentage = calculatePercentage(e, progressBar);
//    const time = (percentage / 100) * TOTAL_DURATION;
//    if (ytPlayer) ytPlayer.seekTo(time, true);
//}

//function updateProgress(e) {
//    const percentage = calculatePercentage(e, progressBar);
//    if (progressFill) progressFill.style.width = percentage + '%';
//    if (progressHandle) progressHandle.style.left = percentage + '%';
//}

//function startVolumeDrag(e) {
//    e.preventDefault();
//    isVolumeDragging = true;
//    updateVolume(e);
//}

//function volumeDrag(e) {
//    if (!isVolumeDragging) return;
//    e.preventDefault();
//    updateVolume(e);
//}

//function endVolumeDrag(e) {
//    if (!isVolumeDragging) return;
//    isVolumeDragging = false;
//    updateVolume(e);
//}

//function updateVolume(e) {
//    const percentage = calculatePercentage(e, volumeSlider);
//    const volume = percentage / 100;
//    window.youtubePlayerInterop.setVolume(volume);
//    if (volumeFill) volumeFill.style.width = percentage + '%';
//}

//function calculatePercentage(e, element) {
//    if (!element) return 0;
//    const rect = element.getBoundingClientRect();
//    let x;
//    if (e.type.startsWith('touch')) {
//        x = e.touches[0].clientX - rect.left;
//    } else {
//        x = e.clientX - rect.left;
//    }
//    const percentage = (x / rect.width) * 100;
//    return Math.max(0, Math.min(100, percentage));
//}


let ytPlayer;
const TOTAL_DURATION = 188.4;
let dotnetReference;

let progressBar, progressFill, progressHandle;
let volumeSlider, volumeFill;
let isDragging = false;
let isVolumeDragging = false;
let lastVolume = 1.0;

let inactivityTimeout;
let inactivityInterval = 2500; // 2.5 seconds
let lastInteractionTime = Date.now();

window.youtubePlayerInterop = {
    setDotnetReference(ref) {
        dotnetReference = ref;
    },

    initialize(videoId) {
        return new Promise((resolve) => {
            ytPlayer = new YT.Player('youtube-player', {
                width: '100%',
                height: '100%',
                videoId: videoId,
                playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    fs: 0,
                    disablekb: 1,
                    iv_load_policy: 3,
                    playsinline: 1,
                    autoplay: 1
                },
                events: {
                    onReady: () => {
                        lastVolume = 1.0;
                        resolve();
                    }
                }
            });
        });
    },

    play() {
        ytPlayer?.playVideo();
    },

    pause() {
        ytPlayer?.pauseVideo();
    },

    destroy() {
        ytPlayer?.destroy();
        ytPlayer = null;
        clearTimeout(inactivityTimeout);
    },

    getCurrentTime() {
        return ytPlayer ? ytPlayer.getCurrentTime() : 0;
    },

    seekForward() {
        if (ytPlayer) {
            let newTime = Math.min(ytPlayer.getCurrentTime() + 5, TOTAL_DURATION);
            ytPlayer.seekTo(newTime, true);
        }
    },

    seekBackward() {
        if (ytPlayer) {
            let newTime = Math.max(ytPlayer.getCurrentTime() - 5, 0);
            ytPlayer.seekTo(newTime, true);
        }
    },

    initProgressBar() {
        progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;

        progressFill = progressBar.querySelector('.bg-blue-500');
        progressHandle = progressBar.querySelector('.bg-white');

        progressBar.addEventListener('mousedown', startDrag);
        progressBar.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    },

    initVolumeSlider() {
        volumeSlider = document.getElementById('volume-slider');
        if (!volumeSlider) return;

        volumeFill = volumeSlider.querySelector('.bg-blue-500');
        volumeSlider.addEventListener('mousedown', startVolumeDrag);
        volumeSlider.addEventListener('touchstart', startVolumeDrag, { passive: false });
        document.addEventListener('mousemove', volumeDrag);
        document.addEventListener('touchmove', volumeDrag, { passive: false });
        document.addEventListener('mouseup', endVolumeDrag);
        document.addEventListener('touchend', endVolumeDrag);
    },

    toggleMute() {
        if (!ytPlayer) return;

        if (ytPlayer.isMuted()) {
            ytPlayer.unMute();
            ytPlayer.setVolume(lastVolume * 100);
            dotnetReference.invokeMethodAsync('OnVolumeChanged', lastVolume);
            dotnetReference.invokeMethodAsync('OnMuteChanged', false);
        } else {
            lastVolume = ytPlayer.getVolume() / 100;
            ytPlayer.mute();
            dotnetReference.invokeMethodAsync('OnVolumeChanged', 0);
            dotnetReference.invokeMethodAsync('OnMuteChanged', true);
        }
    },

    setVolume(volume) {
        if (!ytPlayer) return;
        volume = Math.max(0, Math.min(1, volume));
        ytPlayer.setVolume(volume * 100);

        if (volume === 0) {
            ytPlayer.mute();
            dotnetReference.invokeMethodAsync('OnMuteChanged', true);
        } else {
            if (ytPlayer.isMuted()) {
                ytPlayer.unMute();
                dotnetReference.invokeMethodAsync('OnMuteChanged', false);
            }
            lastVolume = volume;
        }

        dotnetReference.invokeMethodAsync('OnVolumeChanged', volume);
    },

    getVolume() {
        return ytPlayer ? ytPlayer.getVolume() / 100 : 1.0;
    },

    getMuted() {
        return ytPlayer?.isMuted() ?? false;
    },

    // 🧠 Fullscreen Handling
    enterFullscreen(id) {
        const el = document.getElementById(id);
        if (!el) return;

        try {
            const request = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            if (request) request.call(el);
        } catch (e) {
            console.warn('Fullscreen request failed:', e);
        }
    },

    exitFullscreen() {
        try {
            const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
            if (exit) exit.call(document);
        } catch (e) {
            console.warn('Fullscreen exit failed:', e);
        }
    },

    registerFullscreenChangeListener() {
        document.addEventListener('fullscreenchange', reportFullscreenStatus);
        document.addEventListener('webkitfullscreenchange', reportFullscreenStatus);
        document.addEventListener('mozfullscreenchange', reportFullscreenStatus);
        document.addEventListener('MSFullscreenChange', reportFullscreenStatus);
    },

    // 📵 Inactivity Detection
    initInactivityTracker(containerId) {
        const container = document.getElementById(containerId);
        if (!container || !dotnetReference) return;

        const onActivity = () => {
            lastInteractionTime = Date.now();
            dotnetReference.invokeMethodAsync('SetControlsVisible', true);
            resetInactivityTimer();
        };

        container.addEventListener('mousemove', debounce(onActivity, 100));
        container.addEventListener('touchstart', onActivity, { passive: true });

        resetInactivityTimer();
    }
};

// 🔁 Inactivity Timer Logic
function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        const now = Date.now();
        const elapsed = now - lastInteractionTime;
        if (elapsed >= inactivityInterval) {
            dotnetReference.invokeMethodAsync('SetControlsVisible', false);
        }
    }, inactivityInterval + 100);
}

// 🔄 Fullscreen Callback
function reportFullscreenStatus() {
    const isFs =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

    dotnetReference.invokeMethodAsync('OnFullscreenChanged', !!isFs);
}

// 🔧 Volume Slider Drag
function startVolumeDrag(e) {
    e.preventDefault();
    isVolumeDragging = true;
    updateVolume(e);
}
function volumeDrag(e) {
    if (!isVolumeDragging) return;
    e.preventDefault();
    updateVolume(e);
}
function endVolumeDrag(e) {
    if (!isVolumeDragging) return;
    isVolumeDragging = false;
    updateVolume(e);
}
function updateVolume(e) {
    const percentage = calculatePercentage(e, volumeSlider);
    const volume = percentage / 100;
    window.youtubePlayerInterop.setVolume(volume);
    if (volumeFill) volumeFill.style.width = percentage + '%';
}

// 🎯 Progress Bar Drag
function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    updateProgress(e);
}
function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    updateProgress(e);
}
function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    const percentage = calculatePercentage(e, progressBar);
    const time = (percentage / 100) * TOTAL_DURATION;
    if (ytPlayer) ytPlayer.seekTo(time, true);
}
function updateProgress(e) {
    const percentage = calculatePercentage(e, progressBar);
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressHandle) progressHandle.style.left = percentage + '%';
}

// 🧮 Helpers
function calculatePercentage(e, element) {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
}

// 🧼 Debounce Utility
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

