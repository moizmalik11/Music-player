import './Playlist.css'

function Playlist({ songs, currentSongIndex, isVisible, onSongSelect, onClose }) {
  return (
    <div className={`playlist ${isVisible ? 'active' : ''}`}>
      <div className="playlist-header">
        <h3>Playlist</h3>
        <i className="fa-solid fa-times" onClick={onClose}></i>
      </div>
      <div className="playlist-items">
        {songs.map((song, index) => (
          <div
            key={index}
            className={`playlist-item ${index === currentSongIndex ? 'active' : ''}`}
            onClick={() => {
              onSongSelect(index);
              onClose();
            }}
          >
            <img src={song.cover} alt={song.displayName} />
            <div className="playlist-item-info">
              <div className="playlist-item-title">{song.displayName}</div>
              <div className="playlist-item-artist">{song.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Playlist
