const video = document.getElementById("video");
const videoThumbnail = document.getElementById("video-thumbnail");

const playpause = document.getElementById("play-pause");
const frwd = document.getElementById("skip-10");
const bkwrd = document.getElementById("skipminus-10");
const volume = document.getElementById("volume");
const mutebtn = document.getElementById("mute");

const videoContainer = document.querySelector(".videoContainer");
const controls = document.querySelector(".controls");
const progressBar = document.querySelector(".progress-bar");
const playbackline = document.querySelector(".playback-line");

const currentTimeRef = document.getElementById('current-time');
const maxDuration = document.getElementById('max-duration');
const fullscreenBtn = document.getElementById('fullscreen-btn');

let isPlaying = false;

function togglePlayPause() {
    if (isPlaying) {
        video.pause();
        playpause.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
        videoThumbnail.style.display = "none";
        video.play();
        playpause.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

playpause.addEventListener("click", togglePlayPause);

video.addEventListener("play", () => isPlaying = true);
video.addEventListener("pause", () => isPlaying = false);

video.addEventListener("ended", () => {
    video.currentTime = 0; // Reset time
    progressBar.style.width = "0%";
    currentTimeRef.innerHTML = timeFormatter(0); // Display 00:00
    showThumbnail();
    playpause.innerHTML = '<i class="fa-solid fa-play"></i>';
    isPlaying = false;
});

frwd.addEventListener("click", () => video.currentTime += 5);
bkwrd.addEventListener("click", () => video.currentTime -= 5);

mutebtn.addEventListener("click", () => {
    video.muted = !video.muted;
    if (video.muted) {
        mutebtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        volume.value = 0;
    } else {
        mutebtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volume.value = video.volume;
    }
    updateVolumeBackground();
});

volume.addEventListener("input", () => {
    video.volume = volume.value;
    if (video.volume == 0) {
        video.muted = true;
        mutebtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
        video.muted = false;
        mutebtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    updateVolumeBackground();
});

function updateVolumeBackground() {
    const value = (volume.value - volume.min) / (volume.max - volume.min) * 100;
    volume.style.setProperty('--value', `${value}%`);
}
updateVolumeBackground();

videoContainer.addEventListener("mouseenter", () => controls.style.opacity = 1);
videoContainer.addEventListener("mouseleave", () => {
    if (isPlaying) controls.style.opacity = 0;
});

video.addEventListener("timeupdate", () => {
    const currentTime = video.currentTime;
    const duration = video.duration;
    const percentage = (currentTime / duration) * 100;
    progressBar.style.width = `${percentage}%`;
});

function timeFormatter(timeInput) {
    let minute = Math.floor(timeInput / 60);
    let second = Math.floor(timeInput % 60);
    return `${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}`;
}

setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(video.currentTime);
    maxDuration.innerHTML = timeFormatter(video.duration);
}, 500);

playbackline.addEventListener("click", (e) => {
    const timelineWidth = playbackline.clientWidth;
    video.currentTime = (e.offsetX / timelineWidth) * video.duration;
});

fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
            alert(`Error enabling fullscreen: ${err.message}`);
        });
        fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
});

function showThumbnail() {
    videoThumbnail.style.display = "block";
}

// 🎯 Global key shortcuts
document.addEventListener("keydown", function (event) {
    const key = event.key.toLowerCase();

    switch (key) {
        case " ":
            event.preventDefault();
            togglePlayPause();
            break;
        case "m":
            event.preventDefault();
            video.muted = !video.muted;
            if (video.muted) {
                mutebtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                volume.value = 0;
            } else {
                mutebtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                volume.value = video.volume;
            }
            updateVolumeBackground();
            break;
        case "arrowright":
            event.preventDefault();
            video.currentTime += 5;
            break;
        case "arrowleft":
            event.preventDefault();
            video.currentTime -= 5;
            break;
        case "f":
            event.preventDefault();
            if (!document.fullscreenElement) {
                videoContainer.requestFullscreen().catch(err => {
                    alert(`Error enabling fullscreen: ${err.message}`);
                });
                fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
            } else {
                document.exitFullscreen();
                fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
            }
            break;
    }
});
