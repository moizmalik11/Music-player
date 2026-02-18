import './Sidebar.css'

function Sidebar({ songs, currentSongIndex, onSongSelect }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <i className="fa-solid fa-music"></i>
        <h3>My Playlist</h3>
      </div>
      <div className="sidebar-items">
        {songs.map((song, index) => (
          <div
            key={index}
            className={`sidebar-item ${index === currentSongIndex ? 'active' : ''}`}
            onClick={() => onSongSelect(index)}
          >
            <img src={song.cover} alt={song.displayName} />
            <div className="sidebar-item-info">
              <div className="sidebar-item-title">{song.displayName}</div>
              <div className="sidebar-item-artist">{song.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
