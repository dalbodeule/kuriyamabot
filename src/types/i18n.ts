export interface i18n {
  language: {
    find (id: number): Promise<returnLanguage>
    create (id: number, lang: string): Promise<boolean>
    update (lang: string, id: number): Promise<boolean>
    delete (id: number): Promise<boolean>
  },
  message: {
    findLeave (id: number): Promise<returnLeaveMessage>
    createLeave (id: number, leaveMessage: string): Promise<boolean>
    updateLeave (id: number, leaveMessage: string): Promise<boolean>
  
    findWelcome (id: number): Promise<returnWelcomeMessage>
    createWelcome (id: number, welcomeMessage: string): Promise<boolean>
    updateWelcome (id: number, welcomeMessage: string): Promise<boolean>

    deleteAll (id: number): Promise<boolean>
  }
}

export interface returnLanguage {
  id: number,
  lang: string
}

export interface returnLeaveMessage {
  id: number,
  leaveMessage: string
}

export interface returnWelcomeMessage {
  id: number,
  welcomeMessage: string
}