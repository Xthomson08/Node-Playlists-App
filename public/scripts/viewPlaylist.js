let player;
let isPlaying = false;
let currentSongIndex = 0;
let isAutoplayEnabled = false;
let previousVolume = 100;
const container = document.querySelector('.container');
const playlist = JSON.parse(container.getAttribute('data-playlist'));

console.log('Playlist:', playlist); // Debugging statement

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: '',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('Player is ready');
    player.setVolume(100); // Set initial volume to 100
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        document.getElementById('play-pause').innerHTML = '&#10074;&#10074;'; // Pause symbol
        updateProgress();
    } else {
        isPlaying = false;
        document.getElementById('play-pause').innerHTML = '&#9658;'; // Play symbol
    }
    if (event.data === YT.PlayerState.ENDED) {
        console.log('Video ended');
        console.log('Autoplay is', isAutoplayEnabled);
        if (isAutoplayEnabled) {
            playNextSong();
        }
    }
}

function togglePlayPause() {
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function toggleAutoplay() {
    isAutoplayEnabled = !isAutoplayEnabled;
    const autoplayButton = document.getElementById('autoplay-toggle');
    if (isAutoplayEnabled) {
        autoplayButton.classList.add('active');
    } else {
        autoplayButton.classList.remove('active');
    }
}

function setVolume(volume) {
    player.setVolume(volume);
    previousVolume = volume;
}

function toggleMute() {
    const volumeSymbol = document.getElementById('volume-symbol');
    const volumeSlider = document.getElementById('volume-slider');
    if (player.getVolume() > 0) {
        previousVolume = player.getVolume();
        player.setVolume(0);
        volumeSlider.value = 0;
        volumeSymbol.classList.add('muted');
    } else {
        const newVolume = previousVolume === 0 ? 100 : previousVolume;
        player.setVolume(newVolume);
        volumeSlider.value = newVolume;
        volumeSymbol.classList.remove('muted');
    }
}

function seek(event) {
    const timeBar = document.querySelector('.time-bar');
    const progress = document.querySelector('.time-bar .progress');
    const rect = timeBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = offsetX / timeBar.offsetWidth;
    const newTime = player.getDuration() * percentage;
    player.seekTo(newTime, true);
    progress.style.width = `${percentage * 100}%`;
}

function updateProgress() {
    const progress = document.querySelector('.time-bar .progress');
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    if (isNaN(duration)) {
        return; // Skip updating if duration is not valid
    }
    const percentage = (currentTime / duration) * 100;
    progress.style.width = `${percentage}%`;

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);

    document.getElementById('current-time').innerText = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
    document.getElementById('total-time').innerText = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;

    if (isPlaying) {
        requestAnimationFrame(updateProgress);
    }
}

function playSong(url, artist, title, index) {
    currentSongIndex = index;
    const videoID = extractYouTubeID(url);
    console.log('Playing song:', videoID, artist, title); // Debugging statement
    if (videoID) {
        document.getElementById('time-display').style.visibility = 'hidden'; // Hide timer display
        player.loadVideoById(videoID);
        player.playVideo();
        const songInfo = document.getElementById('song-info');
        songInfo.innerText = `${artist} - ${title}`;
        songInfo.style.display = 'block';
        setTimeout(() => {
            document.getElementById('time-display').style.visibility = 'visible'; // Show timer display after a short delay
        }, 500); // Adjust the delay as needed
    } else {
        console.error('Invalid YouTube URL:', url);
    }
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    console.log('Next song index:', currentSongIndex);
    const nextSong = playlist[currentSongIndex];
    console.log('Next song:', nextSong); // Debugging statement
    if (nextSong) {
        console.log('Playing next song:', nextSong.title);
        playSong(nextSong.url, nextSong.artist, nextSong.title, currentSongIndex);
    } else {
        console.error('No next song found');
    }
}

function extractYouTubeID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function isYouTubeURL(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
}

// Ensure the YouTube IFrame API is loaded before initializing the player
if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    onYouTubeIframeAPIReady();
}