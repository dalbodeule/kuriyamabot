export interface Langs {
  [index: string]: any
}

export interface Lang {
  set (msg: any): Promise<void>,
  langset (lang: string): Promise<boolean>,
  inline (code: string): string,
  help (code: string): string,
  text (code: string): string,
  getLangList (): Langs
}