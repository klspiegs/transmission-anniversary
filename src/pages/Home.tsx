import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import flyer from '../assets/anniflyercircle-modified.png'
import { topGenresForNight } from '../data/artists'
import type { Night } from '../data/artists'
import { genreColor } from '../data/genres'
import styles from './Home.module.css'

const NIGHTS: Night[] = ['friday', 'saturday', 'sunday']
const FORWARD_DEG_PER_SEC = 360 / 24
const REVERSE_DEG_PER_SEC = 360 / 3
const TAP_MS = 180

function canHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function Record() {
  const imgRef = useRef<HTMLImageElement>(null)
  const reverseRef = useRef(false)
  const angleRef = useRef(0)
  const downAtRef = useRef<number | null>(null)
  const suppressClickRef = useRef(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) {
      return
    }

    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const elapsed = Math.min((now - last) / 1000, 0.05)
      last = now
      const speed = reverseRef.current
        ? -REVERSE_DEG_PER_SEC
        : FORWARD_DEG_PER_SEC
      angleRef.current += speed * elapsed
      if (imgRef.current) {
        imgRef.current.style.transform = `rotate(${angleRef.current}deg)`
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <a
      className={styles.record}
      href="https://www.instagram.com/p/DcRJLG5FVO8/?hl=en&img_index=2"
      target="_blank"
      rel="noreferrer"
      aria-label="Transmission anniversary flyer on Instagram"
      onPointerEnter={() => {
        if (canHover()) {
          reverseRef.current = true
        }
      }}
      onPointerLeave={() => {
        if (canHover()) {
          reverseRef.current = false
        }
      }}
      onPointerDown={() => {
        if (canHover()) {
          return
        }
        suppressClickRef.current = false
        downAtRef.current = performance.now()
        reverseRef.current = true
      }}
      onPointerUp={() => {
        if (canHover()) {
          return
        }
        reverseRef.current = false
        if (
          downAtRef.current !== null &&
          performance.now() - downAtRef.current > TAP_MS
        ) {
          suppressClickRef.current = true
        }
        downAtRef.current = null
      }}
      onPointerCancel={() => {
        reverseRef.current = false
        suppressClickRef.current = true
        downAtRef.current = null
      }}
      onClick={(event) => {
        if (suppressClickRef.current) {
          event.preventDefault()
          suppressClickRef.current = false
        }
      }}
      onContextMenu={(event) => {
        if (!canHover()) {
          event.preventDefault()
        }
      }}
    >
      <img
        ref={imgRef}
        className={styles.flyer}
        src={flyer}
        alt=""
      />
      <span className={styles.recordShine} aria-hidden="true" />
    </a>
  )
}

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
      <div className="cascade" style={{ animationDelay: '80ms' }}>
        <Record />
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
