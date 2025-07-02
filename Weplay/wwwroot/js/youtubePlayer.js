let ytPlayer;
let totalDuration = 0;
let seekStep = 5;
let inactivityInterval = 2500;
let dotnetReference;

let progressBar, progressFill, progressHandle;
let volumeSlider, volumeFill;
let isDragging = false, isVolumeDragging = false;
let lastVolume = 1.0;
let inactivityTimeout, lastInteractionTime = Date.now();

window.youtubePlayerInterop = {
    initialize(videoId, duration, step, inactivityMs) {
        totalDuration = duration;
        seekStep = step;
        inactivityInterval = inactivityMs;

        return new Promise(resolve => {
            ytPlayer = new YT.Player('youtube-player', {
                width: '100%',
                height: '100%',
                videoId,
                playerVars: {
                    controls: 0, modestbranding: 1, rel: 0,
                    fs: 0, disablekb: 1, iv_load_policy: 3,
                    playsinline: 1, autoplay: 0
                },
                events: {
                    onReady: () => { lastVolume = 1.0; resolve(); }
                }
            });
        });
    },

    setDotnetReference(ref) {
        dotnetReference = ref;
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

    setCurrentTime(time) {
        if (!ytPlayer) return;
        time = Math.max(0, Math.min(time, totalDuration));
        ytPlayer.seekTo(time, true);
        if (progressFill) {
            const pct = (time / totalDuration) * 100;
            progressFill.style.width = pct + '%';
            progressHandle.style.left = pct + '%';
        }
    },
    seekAndPause: function (time) {
        return new Promise(resolve => {
            if (!ytPlayer) return resolve();

            time = Math.max(0, Math.min(time, totalDuration));
            ytPlayer.seekTo(time, true);
            if (progressFill) {
                const pct = (time / totalDuration) * 100;
                progressFill.style.width = pct + '%';
                progressHandle.style.left = pct + '%';
            }
            setTimeout(() => {
                ytPlayer.pauseVideo();
                resolve();
            }, 300);
        });
    },
    seekForward() {
        if (!ytPlayer) return;
        const newTime = Math.min(ytPlayer.getCurrentTime() + seekStep, totalDuration);
        ytPlayer.seekTo(newTime, true);
    },

    seekBackward() {
        if (!ytPlayer) return;
        const newTime = Math.max(ytPlayer.getCurrentTime() - seekStep, 0);
        ytPlayer.seekTo(newTime, true);
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

    setVolume(vol) {
        if (!ytPlayer) return;
        vol = Math.max(0, Math.min(1, vol));
        ytPlayer.setVolume(vol * 100);
        if (vol === 0) {
            ytPlayer.mute();
            dotnetReference.invokeMethodAsync('OnMuteChanged', true);
        } else {
            if (ytPlayer.isMuted()) {
                ytPlayer.unMute();
                dotnetReference.invokeMethodAsync('OnMuteChanged', false);
            }
            lastVolume = vol;
        }
        dotnetReference.invokeMethodAsync('OnVolumeChanged', vol);
    },

    getVolume() {
        return ytPlayer ? ytPlayer.getVolume() / 100 : 1.0;
    },

    getMuted() {
        return ytPlayer?.isMuted() ?? false;
    },

    enterFullscreen(id) {
        const el = document.getElementById(id);
        if (!el) return;
        const req = el.requestFullscreen ?? el.webkitRequestFullscreen
            ?? el.mozRequestFullScreen ?? el.msRequestFullscreen;
        req?.call(el);
    },

    exitFullscreen() {
        const exit = document.exitFullscreen ?? document.webkitExitFullscreen
            ?? document.mozCancelFullScreen ?? document.msExitFullscreen;
        exit?.call(document);
    },

    registerFullscreenChangeListener() {
        const report = () => {
            const fsEl = document.fullscreenElement
                || document.webkitFullscreenElement
                || document.mozFullScreenElement
                || document.msFullscreenElement;
            dotnetReference.invokeMethodAsync('OnFullscreenChanged', !!fsEl);
        };
        document.addEventListener('fullscreenchange', report);
        document.addEventListener('webkitfullscreenchange', report);
        document.addEventListener('mozfullscreenchange', report);
        document.addEventListener('MSFullscreenChange', report);
    },

    initInactivityTracker(containerId) {
        const ctr = document.getElementById(containerId);
        if (!ctr) return;
        const onActivity = () => {
            lastInteractionTime = Date.now();
            dotnetReference.invokeMethodAsync('SetControlsVisible', true);
            resetInactivityTimer();
        };
        ctr.addEventListener('mousemove', debounce(onActivity, 100));
        ctr.addEventListener('touchstart', onActivity, { passive: true });
        resetInactivityTimer();
    }
};

// ─── Helpers ────────────────────────────────────────────────────────────

function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        if (Date.now() - lastInteractionTime >= inactivityInterval) {
            dotnetReference.invokeMethodAsync('SetControlsVisible', false);
        }
    }, inactivityInterval + 100);
}

function startVolumeDrag(e) { e.preventDefault(); isVolumeDragging = true; updateVolume(e); }
function volumeDrag(e) { if (!isVolumeDragging) return; e.preventDefault(); updateVolume(e); }
function endVolumeDrag(e) { if (!isVolumeDragging) return; isVolumeDragging = false; updateVolume(e); }

function updateVolume(e) {
    const pct = calculatePercentage(e, volumeSlider);
    window.youtubePlayerInterop.setVolume(pct / 100);
    volumeFill && (volumeFill.style.width = pct + '%');
}

function startDrag(e) { e.preventDefault(); isDragging = true; updateProgress(e); }
function drag(e) { if (!isDragging) return; e.preventDefault(); updateProgress(e); }
function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    const pct = calculatePercentage(e, progressBar);
    ytPlayer && ytPlayer.seekTo((pct / 100) * totalDuration, true);
}

function updateProgress(e) {
    const pct = calculatePercentage(e, progressBar);
    progressFill && (progressFill.style.width = pct + '%');
    progressHandle && (progressHandle.style.left = pct + '%');
}

function calculatePercentage(e, el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
}

function debounce(fn, delay) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}