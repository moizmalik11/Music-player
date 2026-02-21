import { useState, useRef, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import MusicPlayer from './components/MusicPlayer'
import Playlist from './components/Playlist'

const songs = [
  {
    path: '/assets/1.mp3',
    displayName: 'The Charmer\'s Call',
    cover: '/assets/1.jpg',
    artist: 'Hanu Dixit',
  },
  {
    path: '/assets/2.mp3',
    displayName: 'You Will Never See Me Coming',
    cover: '/assets/2.jpg',
    artist: 'NEFFEX',
  },
  {
    path: '/assets/3.mp3',
    displayName: 'Intellect',
    cover: '/assets/3.jpg',
    artist: 'Yung Logos',
  }
];

function App() {
  const audioRef = useRef(new Audio());
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // none, one, all
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentSong = songs[currentSongIndex];

  // Load saved state
  

  // Save state
  useEffect(() => {
    const state = {
      currentSong: currentSongIndex,
      volume,
      isShuffled,
      repeatMode
    };
    localStorage.setItem('musicPlayerState', JSON.stringify(state));
  }, [currentSongIndex, volume, isShuffled, repeatMode]);

  // Load song
  useEffect(() => {
    const audio = audioRef.current;
    audio.src = currentSong.path;
    audio.volume = volume;
    
    if (isPlaying) {
      audio.play().catch(e => console.log('Play error:', e));
    }
  }, [currentSongIndex]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all') {
        handleNext();
      } else {
        if (currentSongIndex < songs.length - 1) {
          handleNext();
        } else {
          setIsPlaying(false);
          audio.currentTime = 0;
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleTimeUpdate);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleTimeUpdate);
    };
  }, [currentSongIndex, repeatMode]);

  // Play/Pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch(e => console.log('Play error:', e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume control
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const handleProgressChange = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  return (
    <>
      <div className="background">
        <img src={currentSong.cover} alt="" />
      </div>
      
      <div className="app-wrapper">
        <Sidebar 
          songs={songs}
          currentSongIndex={currentSongIndex}
          onSongSelect={handleSongSelect}
        />
        
        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          onTogglePlay={togglePlay}
          onNext={handleNext}
          onPrev={handlePrev}
          onProgressChange={handleProgressChange}
          onVolumeChange={setVolume}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          onTogglePlaylist={togglePlaylist}
        />

        <Playlist
          songs={songs}
          currentSongIndex={currentSongIndex}
          isVisible={showPlaylist}
          onSongSelect={handleSongSelect}
          onClose={togglePlaylist}
        />
      </div>
    </>
  )
}

export default App
