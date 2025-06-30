//let ytPlayer;

//window.youtubePlayerInterop = {
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
//                    autoplay: 0,
//                },
//                events: {
//                    onReady: (e) => {
//                        resolve();
//                    }
//                }
//            });
//        });
//    },
//    play() {
//        ytPlayer.playVideo();
//    },
//    pause() {
//        ytPlayer.pauseVideo();
//    },
//    seek(seconds) {
//        ytPlayer.seekTo(seconds, true);
//    },
//    setVolume(volume) {
//        ytPlayer.setVolume(volume);
//    }
//};


let ytPlayer;

window.youtubePlayerInterop = {
    initialize(videoId) {
        console.time('YouTubePlayerInit');
        return new Promise((resolve, reject) => {
            if (typeof YT === 'undefined' || !YT.Player) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                window.onYouTubeIframeAPIReady = () => {
                    console.timeEnd('YouTubePlayerInit');
                    createPlayer(videoId, resolve, reject);
                };
            } else {
                console.timeEnd('YouTubePlayerInit');
                createPlayer(videoId, resolve, reject);
            }
        });
    },
    play() {
        if (ytPlayer) ytPlayer.playVideo();
    },
    pause() {
        if (ytPlayer) ytPlayer.pauseVideo();
    },
    seek(seconds) {
        if (ytPlayer) ytPlayer.seekTo(seconds, true);
    },
    setVolume(volume) {
        if (ytPlayer) ytPlayer.setVolume(volume);
    },
    destroy() {
        if (ytPlayer) {
            ytPlayer.destroy();
            ytPlayer = null;
        }
    }
};

function createPlayer(videoId, resolve, reject) {
    try {
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
                autoplay: 0,
            },
            events: {
                onReady: (e) => {
                    e.target.setPlaybackQuality('medium');
                    resolve();
                },
                onStateChange: (e) => {
                    if (e.data === YT.PlayerState.BUFFERING) {
                        console.log('Buffering detected, lowering quality');
                        e.target.setPlaybackQuality('small');
                    }
                },
                onError: (e) => {
                    console.error('YouTube Player Error:', e);
                    reject(e);
                }
            }
        });
    } catch (error) {
        console.error('Failed to create YouTube player:', error);
        reject(error);
    }
}
    