const [music, image] = ['audio', 'img'].map(query =>
  document.querySelector(query)
)

let [
  prevBtn,
  playBtn,
  nextBtn,
  titleEl,
  artistEl,
  progress,
  progressContainer,
  currentTimeSpan,
  duration
] = [
  'prev',
  'play',
  'next',
  'title',
  'artist',
  'progress',
  'progress-container',
  'current-time',
  'duration'
].map(id => document.getElementById(id))

let playing = false
const playSong = () => {
  playing = true
  playBtn.classList.replace('fa-play', 'fa-pause')
  playBtn.setAttribute('title', 'Pause')
  music.play()
}

const pauseSong = () => {
  playing = false
  playBtn.classList.replace('fa-pause', 'fa-play')
  playBtn.setAttribute('title', 'Play')
  music.pause()
}

let currentSongIndex = 0
const loadSong = song => {
  const { audio, img, artist, title, url } = song
  titleEl.textContent = title
  artistEl.textContent = artist
  music.src = `music/${audio}.mp3`
  image.src = `img/${img}.jpg`
  ;[...document.querySelectorAll('a')]
    .slice(0, 2)
    .forEach(el => el.setAttribute('href', url))
}

//  on load, load first song
loadSong(songs[currentSongIndex])

playBtn.addEventListener('click', () => (playing ? pauseSong() : playSong()))
prevBtn.addEventListener('click', () => {
  pauseSong()
  progress.style.width = `0%`
  prevSongIndex =
    currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1
  loadSong(songs[prevSongIndex])
  currentSongIndex = prevSongIndex
  playSong()
})

const nextSong = () => {
  pauseSong()
  progress.style.width = `0%`
  nextSongIndex =
    currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1
  loadSong(songs[nextSongIndex])
  currentSongIndex = nextSongIndex
  playSong()
}

nextBtn.addEventListener('click', nextSong)
music.addEventListener('ended', nextSong)

const formatTime = t => {
  const minutes = Math.floor(t / 60)
  const seconds = Math.floor(t % 60)
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds
  return `${minutes}:${displaySeconds}`
}

// progress bar
music.addEventListener(
  'timeupdate',
  ({ srcElement: { currentTime, duration } }) => {
    progress.style.width = `${(currentTime * 100) / duration}%`
    currentTimeSpan.innerText = formatTime(currentTime)
  }
)
progressContainer.addEventListener(
  'click',
  ({ offsetX, srcElement: { clientWidth } }) => {
    music.currentTime = (music.duration * offsetX) / clientWidth
  }
)

// get audio duration
music.addEventListener('loadedmetadata', () => {
  duration.innerText = formatTime(music.duration)
})
