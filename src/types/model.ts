export interface returnLanguage {
  user_id: number;
  lang: string;
}

export interface returnLeaveMessage {
  user_id: number;
  message: string;
  isEnabled: boolean;
}

export interface returnWelcomeMessage {
  user_id: number;
  message: string;
  isEnabled: boolean;
}

export interface returnUser {
  id: number;
  title: string;
  type: string;
}
