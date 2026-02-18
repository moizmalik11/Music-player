# Music Player App - React + Vite

Modern music player converted to React with Vite.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Move Assets**
   - Create a `public` folder in the root directory
   - Move your `assets` folder (with mp3 and jpg files) to `public/assets/`
   - Structure should be:
     ```
     public/
       assets/
         1.mp3
         1.jpg
         2.mp3
         2.jpg
         3.mp3
         3.jpg
     ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Features

- ✨ Modern React components with hooks
- 🎵 Auto-play next song when current ends
- 🔀 Shuffle mode
- 🔁 Repeat modes (none, one, all)
- 📊 Progress bar with seek
- 🔊 Volume control
- 💾 LocalStorage state persistence
- 📱 Fully responsive design
- 🎨 Beautiful glassmorphism UI
- ⚡ Fast refresh with Vite

## Project Structure

```
src/
  ├── components/
  │   ├── MusicPlayer.jsx    # Main player component
  │   ├── MusicPlayer.css
  │   ├── Sidebar.jsx         # Sidebar with songs list
  │   ├── Sidebar.css
  │   ├── Playlist.jsx        # Overlay playlist
  │   └── Playlist.css
  ├── App.jsx                 # Root component
  ├── App.css
  ├── index.css               # Global styles
  └── main.jsx                # Entry point
```

## Technologies Used

- React 18
- Vite
- CSS3 with animations
- Font Awesome icons
- HTML5 Audio API

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
