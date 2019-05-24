export interface IreturnLanguage {
  user_id: number
  lang: string
}

export interface IreturnLeaveMessage {
  user_id: number
  message: string
  isEnabled: boolean
}

export interface IreturnWelcomeMessage {
  user_id: number
  message: string
  isEnabled: boolean
}

export interface IreturnUser {
  id: number
  title: string
  type: string
}
