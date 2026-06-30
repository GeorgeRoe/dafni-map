import type { StakeholderType } from "./stakeholderType"

export interface Partner {
  name: string
  stakeholderType: StakeholderType 
  organisationDescription: string
  imageFilePath: string
  project: string
}