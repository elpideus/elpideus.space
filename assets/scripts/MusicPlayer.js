// === Audio Player Elements ===
const audio = document.getElementById("audio");
const playButton = document.querySelector(".playback-buttons svg:nth-child(2)");
const progressBar = document.querySelector(".progress-wrapper .progress-bar .progress");
const progressBarContainer = document.querySelector(".progress-wrapper");
const currentTimeEl = document.querySelector(".current-time");
const totalTimeEl = document.querySelector(".total-time");
const songTitle = document.querySelector(".song-title");
const songArtist = document.querySelector(".song-artist");
const albumArt = document.querySelector(".album-art img");
const volumeButton = document.querySelector(".volume-button");
const volumeBarContainer = document.querySelector(".volume-slider-container");
const volumeBar = document.querySelector(".volume-slider-container .volume-slider .volume-progress");
const volumeIcon = document.getElementById("volume-icon");

const songs = [
    "Binary Haze Interactive - Harmonious.mp3",
    "Binary Haze Interactive - Main Theme.mp3",
    "d4vd - Here With Me.mp3",
    "d4vd - Romantic Homicide.mp3",
    "Evan Call - The Ultimate Price.mp3",
    "HoYoMix - Crimson Pierces the Twilight.mp3",
    "HoYoMix - If I Can Stop One Heart From Breaking.mp3",
    "Jordy Chandra - Xiao's Sorrow.mp3",
    "Keiichi Okabe - Boundless Memories.mp3",
    "Lies of P - Feel.mp3",
    "Lorien Testard - Alicia.mp3",
    "Nicholas Frega - Requiem of Silence.mp3",
    "Robin, HOYO-MiX - Had I Not Seen the Sun.mp3",
];

let currentIndex = Math.floor(Math.random() * songs.length);
let isPlaying = false;
let isSeeking = false;
let isTouchSeeking = false;
let isVolumeSeeking = false;
let isTouchVolumeSeeking = false;
let wasPlayingBeforeSeek = false;

const customCursor = document.querySelector('.custom-cursor');

const formatTime = seconds => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;

const updatePlayButtonIcon = playing =>
    playButton.innerHTML = playing
        ? `<path fill="currentColor" d="M6 18V6H8V18H6ZM16 18V6H18V18H16Z"/>`
        : `<path fill="currentColor" d="M8 5V19L19 12L8 5Z"/>`;

const updateVolumeIcon = volume =>
    volumeIcon.innerHTML = volume === 0
        ? `<path fill="currentColor" d="M12 4L9.91 6.09L12 8.18V4M4.27 3L2.49 4.78L7.05 9.34L7 9.35V14.65L10.55 18.2L12 19.66V15.55L17.72 21.27L19 22.54L20.54 21L4.27 3M19 12c0-.77-.32-1.47-.86-2L17 10.42V13.58L18.14 14C18.68 13.47 19 12.77 19 12M14.5 12c0-.85-.45-1.63-1.19-2.06L14.5 12.81V12M16.5 12c0-.78-1-3.22-2.5-4v1.5l2.09 2.09c.2-.38.41-.75.65-1.09L16.5 12M3 6v12h4l5 5V1L8 6zm7-.45v1.72l-1.39-1.39L10 5.55M10 17.5l2 2v-4.08L10 17.5M8 12h-.73L4 14.71V9.29L7.27 12H8z"/>`
        : `<path fill="currentColor" d="M14 3.23v2.06c2.89.81 5 3.54 5 6.71s-2.11 5.9-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77M16.5 12c0-1.77-1-3.22-2.5-4v8c1.5-.78 2.5-2.23 2.5-4M3 6v12h4l5 5V1L8 6zm7-.45v12.9C9.72 17.65 9.27 17.5 9 17.35L5.41 14H4V7h1.41L9 3.65c.27-.15.72-.3 1-.45"/>`;

const loadSong = index => {
    const [artist, rawTitle] = songs[index].split(" - ");
    const title = rawTitle.replace(".mp3", "");
    const file = songs[index];

    audio.src = `assets/media/audio/music/${file}`;
    albumArt.src = `assets/media/images/music_album_covers/${file.replace(".mp3", ".webp")}`;
    songTitle.textContent = title;
    songArtist.textContent = `by ${artist}`;
    progressBar.style.width = "0%";
    currentTimeEl.textContent = "0:00";
};

const updateProgressBar = clientX => {
    const { left, width, top, height } = progressBarContainer.getBoundingClientRect();
    const clampedX = Math.min(Math.max(clientX, left), left + width);
    const percent = (clampedX - left) / width;

    progressBar.style.width = `${percent * 100}%`;
    if (isFinite(audio.duration)) currentTimeEl.textContent = formatTime(percent * audio.duration);
    customCursor.style.transform = `translate(calc(${clampedX}px - 50%), calc(${top + height / 2}px - 50%))`;
};

const updateVolume = clientX => {
    const { left, width, top, height } = volumeBarContainer.getBoundingClientRect();
    const clampedX = Math.min(Math.max(clientX, left), left + width);
    let percent = Math.min(Math.max(0, (clampedX - left) / width), 1);

    volumeBar.style.width = `${percent * 100}%`;
    audio.volume = percent;
    updateVolumeIcon(percent);
    customCursor.style.transform = `translate(calc(${clampedX}px - 50%), calc(${top + height / 2}px - 50%))`;
};

loadSong(currentIndex);
updateVolumeIcon(audio.volume);

audio.addEventListener("loadedmetadata", () => totalTimeEl.textContent = formatTime(audio.duration));
playButton.addEventListener("click", () => isPlaying ? audio.pause() : audio.play());
audio.addEventListener("play", () => { isPlaying = true; updatePlayButtonIcon(true); });
audio.addEventListener("pause", () => { isPlaying = false; updatePlayButtonIcon(false); });
audio.addEventListener("timeupdate", () => {
    if (!isSeeking && !isTouchSeeking) {
        progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

progressBarContainer.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    isCustomSeek = true;
    isSeeking = true;
    updateProgressBar(e.clientX);
    document.body.classList.add('no-select');
    customCursor.classList.add('small');
    customCursor.style.transition = 'none';
});

volumeBarContainer.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    isCustomSeek = true;
    isVolumeSeeking = true;
    updateVolume(e.clientX);
    document.body.classList.add('no-select');
    customCursor.classList.add('small');
    customCursor.style.transition = 'none';
});

document.addEventListener("mousemove", e => {
    if (isSeeking) {
        updateProgressBar(e.clientX);
        customCursor.classList.add('small');
    } else if (isVolumeSeeking) {
        updateVolume(e.clientX);
        customCursor.classList.add('small');
    }
});

document.addEventListener("mouseup", e => {
    if (isSeeking) {
        isCustomSeek = isSeeking = false;
        const { left, width } = progressBarContainer.getBoundingClientRect();
        const percent = Math.min(Math.max(0, (e.clientX - left) / width), 1);
        audio.currentTime = percent * audio.duration;
        customCursor.classList.remove('small');
        document.body.classList.remove('no-select');
        customCursor.style.transition = '';
    } else if (isVolumeSeeking) {
        isCustomSeek = isVolumeSeeking = false;
        const { left, width } = volumeBarContainer.getBoundingClientRect();
        const percent = Math.min(Math.max(0, (e.clientX - left) / width), 1);
        audio.volume = percent;
        updateVolumeIcon(percent);
        customCursor.classList.remove('small');
        document.body.classList.remove('no-select');
        customCursor.style.transition = '';
    }
});

progressBarContainer.addEventListener("touchstart", e => {
    e.preventDefault();
    isTouchSeeking = true;
    wasPlayingBeforeSeek = !audio.paused;
    audio.pause();
    updateProgressBar(e.touches[0].clientX);
}, { passive: false });

volumeBarContainer.addEventListener("touchstart", e => {
    e.preventDefault();
    isTouchVolumeSeeking = true;
    updateVolume(e.touches[0].clientX);
}, { passive: false });

document.addEventListener("touchmove", e => {
    if (isTouchSeeking) {
        e.preventDefault();
        updateProgressBar(e.touches[0].clientX);
    } else if (isTouchVolumeSeeking) {
        e.preventDefault();
        updateVolume(e.touches[0].clientX);
    }
}, { passive: false });

document.addEventListener("touchend", e => {
    if (isTouchSeeking) {
        isTouchSeeking = false;
        const { left, width } = progressBarContainer.getBoundingClientRect();
        const finalSeekClientX = (e.changedTouches && e.changedTouches.length > 0) ? e.changedTouches[0].clientX : left + (width * (parseFloat(progressBar.style.width) / 100));
        const percent = Math.min(Math.max(0, (finalSeekClientX - left) / width), 1);
        audio.currentTime = percent * audio.duration;
        if (wasPlayingBeforeSeek) audio.play();
    } else if (isTouchVolumeSeeking) {
        isTouchVolumeSeeking = false;
        const { left, width } = volumeBarContainer.getBoundingClientRect();
        const finalVolumeClientX = (e.changedTouches && e.changedTouches.length > 0) ? e.changedTouches[0].clientX : left + (width * (parseFloat(volumeBar.style.width) / 100));
        const percent = Math.min(Math.max(0, (finalVolumeClientX - left) / width), 1);
        audio.volume = percent;
        updateVolumeIcon(percent);
    }
});

document.querySelector(".playback-buttons svg:nth-child(1)").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) audio.play();
    updatePlayButtonIcon(isPlaying);
});

document.querySelector(".playback-buttons svg:nth-child(3)").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) audio.play();
    updatePlayButtonIcon(isPlaying);
});

audio.addEventListener("ended", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    audio.play().catch(() => {});
    updatePlayButtonIcon(true);
});

volumeButton.addEventListener("click", () =>
    volumeBarContainer.style.display = (volumeBarContainer.style.display === "none" || volumeBarContainer.style.display === "") ? "flex" : "none"
);
