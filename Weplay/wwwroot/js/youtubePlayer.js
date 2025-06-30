let ytPlayer;

window.youtubePlayerInterop = {
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
                    onReady: (e) => {
                        resolve();
                    }
                }
            });
        });
    },
    play() {
        ytPlayer.playVideo();
    },
    pause() {
        ytPlayer.pauseVideo();
    },
    destroy() {
        if (ytPlayer) {
            ytPlayer.destroy();
            ytPlayer = null;
        }
    },
    getCurrentTime() {
        if (ytPlayer) {
            return ytPlayer.getCurrentTime();
        }
        return 0;
    }
};