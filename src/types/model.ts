export default interface model {
  language: {
    find (id: number): Promise<returnLanguage | undefined>
    create (id: number, lang: string): Promise<boolean>
    update (lang: string, id: number): Promise<boolean>
  },
  leaveMessage: {
    find (id: number): Promise<returnLeaveMessage | undefined>
    create (id: number, leaveMessage: string): Promise<boolean>
    update (id: number, leaveMessage: string): Promise<boolean>
  },
  welcomeMessage: {
    find (id: number): Promise<returnWelcomeMessage | undefined>
    create (id: number, welcomeMessage: string): Promise<boolean>
    update (id: number, welcomeMessage: string): Promise<boolean>
  },
  user: {
    create (id: number): Promise<boolean>
    find (id: number): Promise<number>
    delete (id: number): Promise<boolean>
  }
}

export interface returnLanguage {
  id: number,
  lang: string
}

export interface returnLeaveMessage {
  id: number,
  message: string
}

export interface returnWelcomeMessage {
  id: number,
  message: string
}