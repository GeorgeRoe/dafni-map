import type { StakeholderType } from "./stakeholderType"

export interface Partner {
  name: string
  stakeholderType: StakeholderType 
  organisationDescription: string
  imagefilepath: string
  project: string
}