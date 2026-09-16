import fridayCsv from './transmission anniversary info - just friday.csv?raw'
import saturdayCsv from './transmission anniversary info - just saturday.csv?raw'
import sundayCsv from './transmission anniversary info - just sunday.csv?raw'
import { csvRecords } from './parseCsv'

export type { Genre } from './genres'
export { GENRE_COLORS, genreColor } from './genres'

export type Night = 'friday' | 'saturday' | 'sunday'

export type Artist = {
  id: string
  name: string
  title: string
  genres: string[]
  soundcloudEmbedUrl: string
  instagramUrl: string
  imageUrl: string
  nights: Night[]
}

const SOUNDCLOUD_COMPACT =
  'auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false&buying=false&sharing=false&download=false'

function soundCloudEmbedUrl(trackUrl: string) {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&${SOUNDCLOUD_COMPACT}`
}

function youtubeEmbedUrl(url: URL) {
  let videoId = ''
  if (url.hostname.includes('youtu.be')) {
    videoId = url.pathname.split('/').filter(Boolean)[0] ?? ''
  } else if (url.pathname.startsWith('/embed/')) {
    videoId = url.pathname.split('/')[2] ?? ''
  } else {
    videoId = url.searchParams.get('v') ?? ''
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

function spotifyEmbedUrl(url: URL) {
  const parts = url.pathname.split('/').filter(Boolean)
  const skipLocale = parts[0]?.startsWith('intl-') ? 1 : 0
  const kind = parts[skipLocale]
  const id = parts[skipLocale + 1]
  if (kind === 'embed' && parts[skipLocale + 1] && parts[skipLocale + 2]) {
    return `https://open.spotify.com/embed/${parts[skipLocale + 1]}/${parts[skipLocale + 2]}`
  }
  if (!kind || !id) {
    return ''
  }
  return `https://open.spotify.com/embed/${kind}/${id}`
}

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function cleanUrl(value: string) {
  if (!value || value === '-') {
    return ''
  }
  return value.replace(/\?.*$/, '')
}

function parseGenres(value: string) {
  if (!value || value === '-') {
    return []
  }
  return value
    .split(',')
    .map((genre) => genre.trim().toLowerCase())
    .filter(Boolean)
}

function parseTrack(track: string) {
  if (!track || track === '-') {
    return ''
  }
  const iframeSrc = track.match(/src="([^"]+)"/)
  const rawUrl = iframeSrc?.[1] ?? track
  try {
    const url = new URL(rawUrl)
    const host = url.hostname
    if (host.includes('soundcloud.com')) {
      return soundCloudEmbedUrl(`${url.origin}${url.pathname}`)
    }
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return youtubeEmbedUrl(url)
    }
    if (host.includes('spotify.com')) {
      return spotifyEmbedUrl(url)
    }
    if (host.includes('bandcamp.com')) {
      return `${url.origin}${url.pathname}`
    }
    return ''
  } catch {
    return ''
  }
}

function instagramFromRecord(record: Record<string, string>, night: Night) {
  const nightKey = Object.keys(record).find((key) => key.startsWith(night))
  return cleanUrl(nightKey ? record[nightKey] : '')
}

function artistsFromCsv(csv: string, night: Night): Artist[] {
  return csvRecords(csv).flatMap((record) => {
    const name = record.name?.trim()
    if (!name) {
      return []
    }

    return [
      {
        id: slug(name),
        name,
        title: record.title ?? '',
        genres: parseGenres(record.genres ?? record.genre ?? ''),
        soundcloudEmbedUrl: parseTrack(record['example track'] ?? ''),
        instagramUrl: instagramFromRecord(record, night),
        imageUrl: record.picture || record.pictures || '',
        nights: [night],
      },
    ]
  })
}

function mergeArtists(all: Artist[]) {
  const byId = new Map<string, Artist>()

  for (const artist of all) {
    const existing = byId.get(artist.id)
    if (!existing) {
      byId.set(artist.id, { ...artist, nights: [...artist.nights] })
      continue
    }

    existing.nights = [...new Set([...existing.nights, ...artist.nights])]
    existing.genres = [...new Set([...existing.genres, ...artist.genres])]
    existing.instagramUrl = existing.instagramUrl || artist.instagramUrl
    existing.imageUrl = existing.imageUrl || artist.imageUrl
    existing.soundcloudEmbedUrl =
      existing.soundcloudEmbedUrl || artist.soundcloudEmbedUrl
    existing.title = existing.title || artist.title
  }

  return [...byId.values()]
}

export const artists = mergeArtists([
  ...artistsFromCsv(fridayCsv, 'friday'),
  ...artistsFromCsv(saturdayCsv, 'saturday'),
  ...artistsFromCsv(sundayCsv, 'sunday'),
])

export function topGenresForNight(night: Night, limit = 5) {
  const counts = new Map<string, number>()

  for (const artist of artists) {
    if (!artist.nights.includes(night)) {
      continue
    }
    for (const genre of artist.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([genre, count]) => ({ genre, count }))
}
