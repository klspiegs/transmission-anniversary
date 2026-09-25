import { artists } from '../data/artists'
import type { Profession } from '../data/genres'
import LineupPage from './components/LineupPage'

const PAGE_PROFESSION: Profession = 'dj'

const SORT_GENRES = [
  'electronic',
  'techno',
  'house',
  'experimental',
  'bass',
  'club',
  'hardcore',
  'dance',
  'reggaeton',
  'latin',
  'afrobeats',
  'tribal',
] as const

function Electronic() {
  const pageArtists = artists.filter((artist) =>
    artist.title.includes(PAGE_PROFESSION),
  )

  return (
    <LineupPage
      title="electronic"
      artists={pageArtists}
      sortGenres={SORT_GENRES}
    />
  )
}

export default Electronic
