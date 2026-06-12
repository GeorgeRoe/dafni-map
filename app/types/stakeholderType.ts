export const StakeholderType = {
  Government: 'Government',
  Industry: 'Industry',
  Academia: 'Academia',
} as const
export type StakeholderType= typeof StakeholderType[keyof typeof StakeholderType]