// === Audio Player Elements ===
const audio = document.getElementById("audio");
const playButton = document.querySelector(".playback-buttons svg:nth-child(2)");
const progressBar = document.querySelector(".progress-wrapper .progress-bar .progress");
const currentTimeEl = document.querySelector(".current-time");
const totalTimeEl = document.querySelector(".total-time");
const songTitle = document.querySelector(".song-title");
const songArtist = document.querySelector(".song-artist");
const albumArt = document.querySelector(".album-art img");

// === Song Data ===
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

// === Utils ===
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function updatePlayButtonIcon(isPlaying) {
    playButton.innerHTML = isPlaying
        ? `<path fill="currentColor" d="M6 18V6H8V18H6ZM16 18V6H18V18H16Z"/>` // pause
        : `<path fill="currentColor" d="M8 5V19L19 12L8 5Z"/>`; // play
}

function loadSong(index) {
    const [artist, rawTitle] = songs[index].split(" - ");
    const title = rawTitle.replace(".mp3", "");
    const file = songs[index];

    audio.src = `assets/media/audio/music/${file}`;
    albumArt.src = `assets/media/images/music_album_covers/${file.replace(".mp3", ".webp")}`;
    songTitle.textContent = title;
    songArtist.textContent = `by ${artist}`;
    progressBar.style.width = "0%";
    currentTimeEl.textContent = "0:00";
}

// === Initial Load ===
loadSong(currentIndex);

// === Events ===
audio.addEventListener("loadedmetadata", () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

playButton.addEventListener("click", () => {
    isPlaying ? audio.pause() : audio.play();
});

audio.addEventListener("play", () => {
    isPlaying = true;
    updatePlayButtonIcon(true);
});

audio.addEventListener("pause", () => {
    isPlaying = false;
    updatePlayButtonIcon(false);
});

audio.addEventListener("timeupdate", () => {
    progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

document.querySelector(".progress-wrapper").addEventListener("click", (e) => {
    const { offsetX, currentTarget } = e;
    audio.currentTime = (offsetX / currentTarget.clientWidth) * audio.duration;
});

// === Prev/Next Buttons ===
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
    audio.play().catch(() => {}); // ignore if autoplay is blocked
    updatePlayButtonIcon(true);
});