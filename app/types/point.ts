export const StakeholderType = {
  Government: 'Government',
  Industry: 'Industry',
  Academia: 'Academia',
} as const
export type StakeholderType= typeof StakeholderType[keyof typeof StakeholderType]

export interface Point {
  name: string
  stakeholderType: StakeholderType
  latitude: number
  longitude: number
}