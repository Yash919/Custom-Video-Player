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


playpause.addEventListener("click", function () {
    if (video.paused) {
        videoThumbnail.style.display = "none";
        video.play();
        playpause.innerHTML = ' <i class="fa-solid fa-pause"></i>';
    } else {
        video.pause();
        playpause.innerHTML = ' <i class="fa-solid fa-play"></i>';
    }
});

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

document.addEventListener("keydown", function (event) {
    if (event.key == " " || event.keyCode === 32) {
        event.preventDefault();
        togglePlayPause();
    }
});

video.addEventListener("play", function () {
    isPlaying = true;
});

video.addEventListener("pause", function () {
    isPlaying = false;
});

video.addEventListener("ended", function () {
    playpause.innerHTML = '<i class="fa-solid fa-play"></i>';
});

// ⏩/⏪
frwd.addEventListener('click', function () {
    video.currentTime += 5;
});

bkwrd.addEventListener('click', function () {
    video.currentTime -= 5;
});

// 🔇 Mute / Unmute
mutebtn.addEventListener("click", function () {
    if (video.muted) {
        video.muted = false;
        mutebtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volume.value = video.volume;
    } else {
        video.muted = true;
        mutebtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        volume.value = 0;
    }
    updateVolumeBackground(); // ✅ update bar color
});

// 🔇 M / m key
document.addEventListener("keydown", function (event) {
    if (event.key === "m" || event.key === "M") {
        event.preventDefault();

        if (video.muted) {
            video.muted = false;
            mutebtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            volume.value = video.volume;
        } else {
            video.muted = true;
            mutebtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            volume.value = 0;
        }
        updateVolumeBackground(); // ✅ update bar color
    }
});

// 🔊 Volume change
volume.addEventListener("input", function () {
    video.volume = volume.value;

    if (video.volume == 0) {
        mutebtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
        video.muted = false; // unmute if user changes volume
        mutebtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }

    updateVolumeBackground();
});

// ⬆️ Hover to show/hide controls
videoContainer.addEventListener("mouseenter", () => {
    controls.style.opacity = 1;
});

videoContainer.addEventListener("mouseleave", () => {
    if (!isPlaying) return;
    controls.style.opacity = 0;
});

// 🕒 Progress bar update
video.addEventListener("timeupdate", () => {
    const currentTime = video.currentTime;
    const duration = video.duration;
    const percentage = (currentTime / duration) * 100;
    progressBar.style.width = percentage + "%";
});

// 📸 Show thumbnail at end
function showThumbnail() {
    videoThumbnail.style.display = "block";
}

video.addEventListener("ended", () => {
    progressBar.style.width = "0%";
    showThumbnail();
});

// ⏱️ Format time
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60);
    minute = minute < 10 ? "0" + minute : minute;

    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;

    return `${minute}:${second}`;
};

// ⏱️ Timer update
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(video.currentTime);
    maxDuration.innerHTML = timeFormatter(video.duration);
}, 500);

// ⏩ Click timeline
playbackline.addEventListener("click", (e) => {
    let timelineWidth = playbackline.clientWidth;
    video.currentTime = (e.offsetX / timelineWidth) * video.duration;
});

// 🎚️ Update volume background
function updateVolumeBackground() {
    const value = (volume.value - volume.min) / (volume.max - volume.min) * 100;
    volume.style.setProperty('--value', `${value}%`);
}

volume.addEventListener('input', updateVolumeBackground);
updateVolumeBackground(); // initial

// 🖥️ Fullscreen
fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch((err) => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        fullscreenBtn.innerHTML = ' <i class="fa-solid fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = ' <i class="fa-solid fa-expand"></i>';
    }
});
