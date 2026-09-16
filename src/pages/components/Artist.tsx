import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import instagramIcon from '../../assets/instagram.svg'
import type { Artist as ArtistData } from '../../data/artists'
import { genreColor } from '../../data/genres'
import styles from './Artist.module.css'

type ArtistProps = {
  artist: ArtistData
  style?: CSSProperties
}

function trackUrlOrigin(stringUrl: string) {
  if (!stringUrl) {
    return 'unknown'
  }
  try {
    const url = new URL(stringUrl)
    if (url.hostname.includes('soundcloud.com')) {
      return 'soundcloud'
    }
    if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
      return 'youtube'
    }
    if (url.hostname.includes('spotify.com')) {
      return 'spotify'
    }
    if (url.hostname.includes('bandcamp.com')) {
      return 'bandcamp'
    }
  } catch {
    return 'unknown'
  }
  return 'unknown'
}

function FitName({ name }: { name: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const isSingleWord = !/\s/.test(name.trim())

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !isSingleWord) {
      return
    }

    const fit = () => {
      el.style.fontSize = ''
      let size = parseFloat(getComputedStyle(el).fontSize)
      const minSize = 10
      while (el.scrollWidth > el.clientWidth && size > minSize) {
        size -= 0.5
        el.style.fontSize = `${size}px`
      }
    }

    fit()
    const observer = new ResizeObserver(fit)
    if (el.parentElement) {
      observer.observe(el.parentElement)
    }
    return () => observer.disconnect()
  }, [name, isSingleWord])

  return (
    <h2
      ref={ref}
      className={isSingleWord ? `${styles.name} ${styles.nameSingle}` : styles.name}
    >
      {name}
    </h2>
  )
}

function Artist({ artist, style }: ArtistProps) {
  return (
    <article className={`${styles.card} cascade`} style={style}>
      <div className={styles.artistInfo}>
        {artist.imageUrl ? (
          <div className={styles.artistImage}>
            <img src={artist.imageUrl} alt={artist.name} />
          </div>
        ) : null}
        <div className={styles.artistInfoContent}>
          <div className={styles.header}>
            {artist.instagramUrl ? (
              <a href={artist.instagramUrl} target="_blank" rel="noreferrer">
                <img
                  className={styles.instagramIcon}
                  src={instagramIcon}
                  alt={`${artist.name} on Instagram`}
                />
              </a>
            ) : null}
            <FitName name={artist.name} />
          </div>
          <div className={styles.genres}>
            {artist.genres.map((genre) => (
              <p key={genre} style={{ backgroundColor: genreColor(genre) }}>
                {genre}
              </p>
            ))}
          </div>
        </div>
      </div>
      {trackUrlOrigin(artist.soundcloudEmbedUrl) === 'soundcloud' ? (
        <div className={styles.soundcloud}>
          <iframe
            title={`${artist.name} on SoundCloud`}
            width="100%"
            height="20"
            loading="lazy"
            allow="autoplay"
            src={artist.soundcloudEmbedUrl}
          />
        </div>
      ) : null}
      {trackUrlOrigin(artist.soundcloudEmbedUrl) === 'youtube' ? (
        <div className={styles.youtube}>
          <iframe
            title={`${artist.name} on YouTube`}
            width="100%"
            height="20"
            loading="lazy"
            allow="autoplay"
            src={artist.soundcloudEmbedUrl}
          />
        </div>
      ) : null}
      {trackUrlOrigin(artist.soundcloudEmbedUrl) === 'spotify' ? (
        <div className={styles.spotify}>
          <iframe
            title={`${artist.name} on Spotify`}
            width="100%"
            height="20"
            loading="lazy"
            allow="autoplay"
            src={artist.soundcloudEmbedUrl}
          />
        </div>
      ) : null}
      {trackUrlOrigin(artist.soundcloudEmbedUrl) === 'bandcamp' ? (
        <div className={styles.bandcamp}>
          <iframe
            title={`${artist.name} on Bandcamp`}
            width="100%"
            height="42px"
            loading="lazy"
            allow="autoplay"
            src={artist.soundcloudEmbedUrl}
          />
        </div>
      ) : null}
    </article>
  )
}

export default Artist
