export default interface model {
  language: {
    find (user_id: number): Promise<returnLanguage | undefined>
    create (user_id: number, lang: string): Promise<boolean>
    update (user_id: number, lang: string): Promise<boolean>
  },
  leaveMessage: {
    find (user_id: number): Promise<returnLeaveMessage | undefined>
    create (user_id: number, leaveMessage: string): Promise<boolean>
    update (user_id: number, leaveMessage: string): Promise<boolean>
  },
  welcomeMessage: {
    find (user_id: number): Promise<returnWelcomeMessage | undefined>
    create (user_id: number, welcomeMessage: string): Promise<boolean>
    update (user_id: number, welcomeMessage: string): Promise<boolean>
  },
  user: {
    create (id: number): Promise<boolean>
    find (id: number): Promise<number>
    delete (id: number): Promise<boolean>
  }
}

export interface returnLanguage {
  user_id: number,
  lang: string
}

export interface returnLeaveMessage {
  user_id: number,
  message: string,
  isEnabled: boolean
}

export interface returnWelcomeMessage {
  user_id: number,
  message: string,
  isEnabled: boolean
}

export interface returnUser {
  id: number,
  title: string,
  type: string
}