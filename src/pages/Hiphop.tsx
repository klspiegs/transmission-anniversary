import { artists } from '../data/artists'
import type { Profession } from '../data/genres'
import LineupPage from './components/LineupPage'

const PAGE_PROFESSION: Profession = 'rapper'

const SORT_GENRES = ['hiphop', 'trap', 'pop rap'] as const

function Hiphop() {
  const pageArtists = artists.filter((artist) =>
    artist.title.includes(PAGE_PROFESSION),
  )

  return (
    <LineupPage title="hiphop" artists={pageArtists} sortGenres={SORT_GENRES} />
  )
}

export default Hiphop
