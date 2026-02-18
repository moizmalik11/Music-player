import './MusicPlayer.css'

function MusicPlayer({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isShuffled,
  repeatMode,
  onTogglePlay,
  onNext,
  onPrev,
  onProgressChange,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onTogglePlaylist
}) {
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onProgressChange(percentage * duration);
  };

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onVolumeChange(percentage);
  };

  const getVolumeIcon = () => {
    if (volume >= 0.5) return 'fa-volume-high';
    if (volume > 0) return 'fa-volume-low';
    return 'fa-volume-xmark';
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return 'fa-repeat-1';
    return 'fa-repeat';
  };

  return (
    <div className="container">
      <div className="top-bar">
        <i className="fa-solid fa-angle-down" id="minimize"></i>
        <span className="now-playing">NOW PLAYING</span>
        <i className="fa-solid fa-bars" onClick={onTogglePlaylist}></i>
      </div>

      <div className="player-wrapper">
        <div className="vinyl-animation">
          <div className={`player-img ${isPlaying ? 'playing' : ''}`}>
            <img src={currentSong.cover} className="active" alt={currentSong.displayName} />
          </div>
        </div>

        <div className="track-info">
          <h2>{currentSong.displayName}</h2>
          <h3>{currentSong.artist}</h3>
        </div>

        <div className="player-progress" onClick={handleProgressClick}>
          <div 
            className="progress" 
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          ></div>
          <div className="music-duration">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="volume-control">
          <i 
            className={`fa-solid ${getVolumeIcon()}`}
            onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
          ></i>
          <div className="volume-slider" onClick={handleVolumeClick}>
            <div 
              className="volume-progress" 
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="player-controls">
          <i 
            className={`fa-solid fa-shuffle ${isShuffled ? 'active' : ''}`}
            title="Shuffle" 
            onClick={onToggleShuffle}
          ></i>
          <i 
            className="fa-solid fa-backward" 
            title="Previous" 
            onClick={onPrev}
          ></i>
          <i 
            className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} play-button`}
            title={isPlaying ? 'Pause' : 'Play'}
            onClick={onTogglePlay}
          ></i>
          <i 
            className="fa-solid fa-forward" 
            title="Next" 
            onClick={onNext}
          ></i>
          <i 
            className={`fa-solid ${getRepeatIcon()} ${repeatMode !== 'none' ? 'active' : ''}`}
            title="Repeat" 
            onClick={onToggleRepeat}
          ></i>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer
