import { Sector, PlanetEvent } from '@/interfaces'

export interface PlanetHazard {
  name: string
  description: string
}

export interface Planet {
  index?: number
  name: string
  sector: Sector
  biome: {
    name: string
    description: string
  }
  hazards: PlanetHazard[]
  hash: number
  position: { x: number; y: number }
  waypoints: number[]
  maxHealth: number
  health: number
  disabled: boolean
  initialOwner: 'Humans' | 'Automatons' | 'Terminids'
  currentOwner: 'Humans' | 'Automatons' | 'Terminids'
  regenPerSecond: number
  event: PlanetEvent[]
  statistics: {
    missionsWon: number
    missionsLost: number
    missionTime: number
    terminidKills: number
    automatonKills: number
    illuminateKills: number
    bulletsFired: number
    bulletsHit: number
    timePlayed: number
    deaths: number
    revives: number
    friendlies: number
    missionSuccessRate: number
    accuracy: number
    playerCount: number
  }
  attacking: number[]
}
