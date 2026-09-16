export const GENRE_COLORS: Record<string, string> = {
  electronic: '#F5C074',
  hiphop: '#FFB66D',
  rock: '#FF5733',
  techno: '#A48FD0',
  house: '#EAEB88',
  experimental: '#7BA885',
  bass: '#9DBCE3',
  club: '#FF8CB2',
  hardcore: '#8ADCCC',
  dance: '#E194AD',
  'alt rock': '#A8C686',
  'baltimore club': '#FFFFFF',
  'bouncy bass': '#FFFFFF',
  dubstep: '#FFFFFF',
  edm: '#FFFFFF',
  'funky post-punk': '#FFFFFF',
  'ghetto tech': '#FFFFFF',
  'honky tonk': '#FFFFFF',
  'jungle/drum & bass': '#FFFFFF',
  pop: '#FFFFFF',
  'pop punk': '#FFFFFF',
  'pop rap': '#FFFFFF',
  rap: '#FFFFFF',
  shoegaze: '#FFFFFF',
  trap: '#FFFFFF',
  'trip hop': '#FFFFFF',
}

export type Genre = string

export type Profession = string

export function genreColor(genre: string): string {
  return GENRE_COLORS[genre] ?? '#FFFFFF'
}
