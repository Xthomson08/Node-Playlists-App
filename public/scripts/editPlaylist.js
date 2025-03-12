function showEditForm(songId) {
    document.getElementById(`edit-form-${songId}`).style.display = 'block';
    document.getElementById('edit').style.display = 'none';
    document.getElementById('delete').style.display = 'none';
}

function hideEditForm(songId) {
    document.getElementById(`edit-form-${songId}`).style.display = 'none';
    document.getElementById('edit').style.display = 'inline-block';
    document.getElementById('delete').style.display = 'inline-block';
}

function showAddForm() {
    document.getElementById('add-form').style.display = 'block';
    document.getElementById('add').style.display = 'none';
}

function hideAddForm() {
    document.getElementById('add-form').style.display = 'none';
    document.getElementById('add').style.display = 'inline-block';
}

async function addYouTubeSong() {
    const youtubeUrl = document.getElementById('youtube-url').value;
    const videoId = extractYouTubeID(youtubeUrl);
    const playlistId = document.querySelector('.container').getAttribute('data-playlist-id');

    if (!videoId) {
        console.error('Invalid YouTube URL');
        return;
    }

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            console.error('No video details found');
            return;
        }

        const videoDetails = data.items[0].snippet;
        const title = document.getElementById('title').value || videoDetails.title;
        const artist = document.getElementById('artist').value || videoDetails.channelTitle;
        const songPicture = videoDetails.thumbnails.high ? videoDetails.thumbnails.high.url : videoDetails.thumbnails.default.url;
        
        // Send the extracted details to the server to save in the database
        const res = await fetch(`/playlists/${playlistId}/add-song`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, artist, url: youtubeUrl, picture: songPicture })
        });

        if (res.ok) {
            location.reload();
        } else {
            console.error('Error adding song');
        }
    } catch (error) {
        console.error('Error fetching YouTube video details:', error);
    }
}

function extractYouTubeID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}