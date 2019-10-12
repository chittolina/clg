type Music = {
  title: string
  author: string
  album: string
  genre: string
  releaseDate: number
}

const musics: Music[] = [
  {
    title: 'Dolphin Dream',
    author: 'Larry Heard',
    album: 'Sceneries Not Songs',
    genre: 'Deep House',
    releaseDate: 1994,
  },
  {
    title: 'Wrapped In Silk',
    author: 'Peletronic',
    album: 'Blyss',
    genre: 'House',
    releaseDate: 2019,
  },
]

export default {
  listMusics: (): Music[] => musics,
}
