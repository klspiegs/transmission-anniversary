import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Artist, Night } from '../../data/artists'
import { genreColor } from '../../data/genres'
import ArtistCard from './Artist'
import styles from './LineupPage.module.css'

const SORT_NIGHTS: Night[] = ['friday', 'saturday', 'sunday']

const NIGHT_COLORS: Record<Night, string> = {
  friday: '#C9B6E4',
  saturday: '#A8D5E5',
  sunday: '#F4C7A1',
}

type LineupPageProps = {
  title: string
  artists: Artist[]
  sortGenres: readonly string[]
}

function LineupPage({ title, artists, sortGenres }: LineupPageProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedNights, setSelectedNights] = useState<Night[]>([])

  const visibleArtists = artists.filter((artist) => {
    const matchesGenre =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => artist.genres.includes(genre))
    const matchesNight =
      selectedNights.length === 0 ||
      selectedNights.some((night) => artist.nights.includes(night))
    return matchesGenre && matchesNight
  })

  const availableGenres = sortGenres.filter(
    (genre) => !selectedGenres.includes(genre),
  )
  const availableNights = SORT_NIGHTS.filter(
    (night) => !selectedNights.includes(night),
  )

  function addGenre(genre: string) {
    if (!genre || selectedGenres.includes(genre)) {
      return
    }
    setSelectedGenres([...selectedGenres, genre])
  }

  function removeGenre(genre: string) {
    setSelectedGenres(selectedGenres.filter((item) => item !== genre))
  }

  function addNight(night: Night) {
    if (!night || selectedNights.includes(night)) {
      return
    }
    setSelectedNights([...selectedNights, night])
  }

  function removeNight(night: Night) {
    setSelectedNights(selectedNights.filter((item) => item !== night))
  }

  return (
    <>
      <p className={`${styles.back} cascade`} style={{ animationDelay: '0ms' }}>
        <Link to="/">&larr; back</Link>
      </p>
      <main className={styles.page}>
        <h1 className="cascade" style={{ animationDelay: '70ms' }}>
          {title}
        </h1>
        <div className={`${styles.sort} cascade`} style={{ animationDelay: '140ms' }}>
          <div className={styles.dropdowns}>
            {availableGenres.length > 0 ? (
              <select
                aria-label="Sort by genre"
                value=""
                onChange={(event) => addGenre(event.target.value)}
              >
                <option value="" disabled>
                  sort by genre
                </option>
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            ) : null}
            {availableNights.length > 0 ? (
              <select
                aria-label="Sort by night"
                value=""
                onChange={(event) => addNight(event.target.value as Night)}
              >
                <option value="" disabled>
                  sort by night
                </option>
                {availableNights.map((night) => (
                  <option key={night} value={night}>
                    {night}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
          <div className={styles.tags}>
            {selectedGenres.map((genre) => (
              <span
                key={genre}
                className={styles.tag}
                style={{ backgroundColor: genreColor(genre) }}
              >
                {genre}
                <button
                  type="button"
                  aria-label={`Remove ${genre}`}
                  onClick={() => removeGenre(genre)}
                >
                  ×
                </button>
              </span>
            ))}
            {selectedNights.map((night) => (
              <span
                key={night}
                className={styles.tag}
                style={{ backgroundColor: NIGHT_COLORS[night] }}
              >
                {night}
                <button
                  type="button"
                  aria-label={`Remove ${night}`}
                  onClick={() => removeNight(night)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        {visibleArtists.map((artist, index) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            style={{ animationDelay: `${(index + 3) * 70}ms` }}
          />
        ))}
      </main>
    </>
  )
}

export default LineupPage
