const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    volumeProgress = document.getElementById('volume-progress'),
    volumeSlider = document.getElementById('volume-slider'),
    volumeIcon = document.getElementById('volume-icon'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    shuffleBtn = document.getElementById('shuffle'),
    repeatBtn = document.getElementById('repeat'),
    playlistToggle = document.getElementById('playlist-toggle'),
    closePlaylist = document.getElementById('close-playlist'),
    playlistContainer = document.getElementById('playlist'),
    playlistItems = document.getElementById('playlist-items'),
    sidebarItems = document.getElementById('sidebar-items'),
    background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
    {
        path: 'assets/1.mp3',
        displayName: 'The Charmer\'s Call',
        cover: 'assets/1.jpg',
        artist: 'Hanu Dixit',
    },
    {
        path: 'assets/2.mp3',
        displayName: 'You Will Never See Me Coming',
        cover: 'assets/2.jpg',
        artist: 'NEFFEX',
    },
    {
        path: 'assets/3.mp3',
        displayName: 'Intellect',
        cover: 'assets/3.jpg',
        artist: 'Yung Logos',
    }
];

let musicIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 'none'; // none, one, all
let volume = 1;
let originalPlaylist = [...songs];
let shuffledPlaylist = [];

function initializePlayer() {
    // Set initial volume
    music.volume = volume;
    updateVolumeIcon();
    
    // Create playlist items
    renderPlaylist();
    
    // Create sidebar items
    renderSidebar();
    
    // Load saved state from localStorage
    loadPlayerState();
}

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}



function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
    
    // Update active song in playlist
    updateActivePlaylistItem();
    
    // Save current song to localStorage
    savePlayerState();
}

function changeMusic(direction) {
    let playlist = isShuffled ? shuffledPlaylist : songs;
    
    if (repeatMode === 'one') {
        loadMusic(playlist[musicIndex]);
    } else {
        musicIndex = (musicIndex + direction + playlist.length) % playlist.length;
        loadMusic(playlist[musicIndex]);
    }
    
    playMusic();
}

function shuffleArray(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array;
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active');
    
    if (isShuffled) {
        shuffledPlaylist = [...songs];
        shuffleArray(shuffledPlaylist);
        // Keep current song as first item
        const currentSong = shuffledPlaylist.splice(musicIndex, 1)[0];
        shuffledPlaylist.unshift(currentSong);
        musicIndex = 0;
    } else {
        musicIndex = songs.findIndex(song => song.path === music.src.split('/').pop());
    }
    
    savePlayerState();
}

function toggleRepeat() {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    repeatMode = modes[(currentIndex + 1) % modes.length];
    
    // Update repeat button UI
    repeatBtn.className = 'fa-solid';
    if (repeatMode === 'one') {
        repeatBtn.classList.add('fa-repeat-1', 'active');
    } else if (repeatMode === 'all') {
        repeatBtn.classList.add('fa-repeat', 'active');
    } else {
        repeatBtn.classList.add('fa-repeat');
    }
    
    savePlayerState();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

function handleVolume(e) {
    const width = volumeSlider.clientWidth;
    const clickX = e.offsetX;
    volume = clickX / width;
    music.volume = volume;
    volumeProgress.style.width = `${volume * 100}%`;
    updateVolumeIcon();
    savePlayerState();
}

function updateVolumeIcon() {
    volumeIcon.className = 'fa-solid';
    if (volume >= 0.5) {
        volumeIcon.classList.add('fa-volume-high');
    } else if (volume > 0) {
        volumeIcon.classList.add('fa-volume-low');
    } else {
        volumeIcon.classList.add('fa-volume-xmark');
    }
}

function togglePlaylist() {
    playlistContainer.classList.toggle('active');
}

function renderPlaylist() {
    playlistItems.innerHTML = '';
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === musicIndex ? 'active' : ''}`;
        item.innerHTML = `
            <img src="${song.cover}" alt="${song.displayName}">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.displayName}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
        `;
        item.addEventListener('click', () => {
            musicIndex = index;
            loadMusic(songs[musicIndex]);
            playMusic();
            togglePlaylist();
        });
        playlistItems.appendChild(item);
    });
}

function renderSidebar() {
    sidebarItems.innerHTML = '';
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = `sidebar-item ${index === musicIndex ? 'active' : ''}`;
        item.innerHTML = `
            <img src="${song.cover}" alt="${song.displayName}">
            <div class="sidebar-item-info">
                <div class="sidebar-item-title">${song.displayName}</div>
                <div class="sidebar-item-artist">${song.artist}</div>
            </div>
        `;
        item.addEventListener('click', () => {
            musicIndex = index;
            loadMusic(songs[musicIndex]);
            playMusic();
        });
        sidebarItems.appendChild(item);
    });
}

function updateActivePlaylistItem() {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('active', index === musicIndex);
    });
    document.querySelectorAll('.sidebar-item').forEach((item, index) => {
        item.classList.toggle('active', index === musicIndex);
    });
}

function savePlayerState() {
    const state = {
        currentSong: musicIndex,
        volume: volume,
        isShuffled: isShuffled,
        repeatMode: repeatMode
    };
    localStorage.setItem('musicPlayerState', JSON.stringify(state));
}

function loadPlayerState() {
    const savedState = localStorage.getItem('musicPlayerState');
    if (savedState) {
        const state = JSON.parse(savedState);
        musicIndex = state.currentSong;
        volume = state.volume;
        isShuffled = state.isShuffled;
        repeatMode = state.repeatMode;
        
        // Apply saved state
        music.volume = volume;
        volumeProgress.style.width = `${volume * 100}%`;
        updateVolumeIcon();
        
        if (isShuffled) {
            toggleShuffle();
        }
        
        // Update repeat button state
        repeatBtn.className = 'fa-solid';
        if (repeatMode === 'one') {
            repeatBtn.classList.add('fa-repeat-1', 'active');
        } else if (repeatMode === 'all') {
            repeatBtn.classList.add('fa-repeat', 'active');
        } else {
            repeatBtn.classList.add('fa-repeat');
        }
    }
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
playlistToggle.addEventListener('click', togglePlaylist);
closePlaylist.addEventListener('click', togglePlaylist);
volumeSlider.addEventListener('click', handleVolume);
volumeIcon.addEventListener('click', () => {
    if (volume > 0) {
        volume = 0;
    } else {
        volume = 1;
    }
    music.volume = volume;
    volumeProgress.style.width = `${volume * 100}%`;
    updateVolumeIcon();
    savePlayerState();
});

music.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        loadMusic(songs[musicIndex]);
        playMusic();
    } else if (repeatMode === 'all') {
        changeMusic(1);
    } else {
        if (musicIndex < songs.length - 1) {
            changeMusic(1);
        } else {
            pauseMusic();
            musicIndex = 0;
            loadMusic(songs[musicIndex]);
        }
    }
});

music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

// Initialize player
initializePlayer();
loadMusic(songs[musicIndex]);