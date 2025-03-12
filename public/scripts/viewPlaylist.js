let player;
let isPlaying = false;
let currentSongIndex = 0;
let currentSongUrl = '';
let isSongPicked = false;
let isShuffleEnabled = false;
let isAutoplayEnabled = false;
let previousVolume = 100;
const container = document.querySelector('.container');
const playlist = JSON.parse(container.getAttribute('data-playlist'));
const originalPlaylist = [...playlist]; // Copy the original playlist

console.log('Playlist:', playlist); // Debugging statement
for(song in playlist){
    console.log('Song:', song); // Debugging statement
}

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

function onPlayerReady() {
    console.log('Player is ready');
    player.setVolume(10); // Set initial volume to 100
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
    if (!isSongPicked) {
        playSong(playlist[currentSongIndex].url, playlist[currentSongIndex].artist, playlist[currentSongIndex].title, currentSongIndex);
        isSongPicked = true;
    } else if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function toggleShuffle() {
    isShuffleEnabled = !isShuffleEnabled;
    const shuffleButton = document.getElementById('shuffle-toggle');
    if (isSongPicked) {
        currentSongUrl = playlist[currentSongIndex].url; // Store the URL of the currently playing song
    }

    if (isShuffleEnabled) {
        shuffleButton.classList.add('active');
        playlist.sort(() => Math.random() - 0.5);
        console.log('Shuffled playlist:', playlist); // Debugging statement
    } else {
        shuffleButton.classList.remove('active');
        playlist.splice(0, playlist.length, ...originalPlaylist); // Reset the playlist
        console.log('Playlist:', playlist); // Debugging statement
    }

    // Update the currentSongIndex to the new index of the currently playing song
    if (isSongPicked) {
        currentSongIndex = playlist.findIndex(song => song.url === currentSongUrl);
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
    if (player && typeof player.setVolume === 'function') {
        player.setVolume(volume);
    }
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
    if (!isSongPicked) return;

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

function playSong(url, artist, title) {
    currentSongIndex = playlist.findIndex(song => song.url === url);
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
        isSongPicked = true;
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

function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    console.log('Previous song index:', currentSongIndex);
    const previousSong = playlist[currentSongIndex];
    console.log('Previous song:', previousSong); // Debugging statement
    if (previousSong) {
        console.log('Playing previous song:', previousSong.title);
        playSong(previousSong.url, previousSong.artist, previousSong.title, currentSongIndex);
    } else {
        console.error('No previous song found');
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