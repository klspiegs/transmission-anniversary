import { Link } from 'react-router-dom'
import { topGenresForNight } from '../data/artists'
import type { Night } from '../data/artists'
import { genreColor } from '../data/genres'
import styles from './Home.module.css'
import instagramIcon from '../assets/instagram.svg'

const NIGHTS: Night[] = ['friday', 'saturday', 'sunday']

function Home() {
  return (
    <main className="home">
      <div className="home-content cascade" style={{ animationDelay: '0ms' }}>
        <h1>transmission's first year anniversary</h1>
        <div>
          <p>a celebration of music and community from 10/2 - 10/4</p>
        </div>
        <div className="home-buttons">
          <Link to="/hiphop">
            <button type="button">hiphop</button>
          </Link>
          <Link to="/electronic">
            <button type="button">electronic</button>
          </Link>
          <Link to="/rock">
            <button type="button">rock</button>
          </Link>
        </div>
      </div>
      <div className={styles.nights}>
        {NIGHTS.map((night, index) => {
          const genres = topGenresForNight(night)
          const topCount = genres[0]?.count ?? 1

          return (
            <section
              key={night}
              className={`${styles.night} cascade`}
              style={{ animationDelay: `${(index + 1) * 120}ms` }}
            >
              <h2>{night}</h2>
              <div className={styles.tags}>
                {genres.map(({ genre, count }) => {
                  const scale = Math.max(count / topCount, 0.55)
                  return (
                    <span
                      key={genre}
                      className={styles.tag}
                      style={{
                        backgroundColor: genreColor(genre),
                        fontSize: `${scale}rem`,
                        padding: `${4 * scale}px ${8 * scale}px`,
                        opacity: scale,
                      }}
                    >
                      {genre}
                    </span>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
      <div className='buy-tickets cascade'>
        <a href="https://shotgun.live/en/festivals/broadcast-one-year-of-transmission" target="_blank" rel="noopener noreferrer">
          <button type="button">buy tickets!!</button>
        </a>
        <p>HINT you can use code <span className="promo-hint">ANNI5KAT</span> for $5 off</p>
      </div>
      <div className='footer cascade'>
        <p> and follow <a href="https://www.instagram.com/transmissiondc" target="_blank" rel="noopener noreferrer">@transmissiondc</a> and <a href="https://www.instagram.com/klspiegs" target="_blank" rel="noopener noreferrer">@klspiegs</a> (the dev) on instagram</p>
      </div>
    </main>
  )
}

export default Home
