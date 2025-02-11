function showEditForm(songId) {
    document.getElementById(`edit-form-${songId}`).style.display = 'block';
}

function hideEditForm(songId) {
    document.getElementById(`edit-form-${songId}`).style.display = 'none';
}

async function addYouTubeSong() {
    const url = document.getElementById('youtube-url').value;
    const videoID = extractYouTubeID(url);
    if (!videoID) {
        alert('Invalid YouTube URL');
        return;
    }

    const apiKey = 'YOUR_YOUTUBE_API_KEY'; // Replace with your YouTube Data API key
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&part=snippet&key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.items.length === 0) {
            alert('Video not found');
            return;
        }

        const video = data.items[0].snippet;
        const title = video.title;
        const artist = video.channelTitle;
        const profileImage = video.thumbnails.default.url;

        // Send the extracted details to the server to save in the database
        const res = await fetch('/playlists/<%= playlist.id %>/add-song', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, artist, url, profileImage })
        });

        if (res.ok) {
            location.reload();
        } else {
            alert('Failed to add song');
        }
    } catch (error) {
        console.error('Error fetching YouTube video details:', error);
        alert('Failed to fetch YouTube video details');
    }
}

function extractYouTubeID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}