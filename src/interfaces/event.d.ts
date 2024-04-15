export interface PlanetEvent {
  id: number
  eventType: number
  faction: 'Humans' | 'Automatons' | 'Terminids'
  health: number
  maxHealth: number
  startTime: string
  endTime: string
  campaignId: number
  joinOperationIds: number[]
}
