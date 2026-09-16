import { artists } from '../data/artists'
import LineupPage from './components/LineupPage'

const SORT_GENRES = [
  'alt rock',
  'pop punk',
  'shoegaze',
  'honky tonk',
  'funky post-punk',
]

function Rock() {
  const pageArtists = artists.filter((artist) =>
    artist.genres.some((genre) => SORT_GENRES.includes(genre)),
  )

  return (
    <LineupPage title="rock" artists={pageArtists} sortGenres={SORT_GENRES} />
  )
}

export default Rock
