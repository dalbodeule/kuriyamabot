declare module 'languages' {
  function isValid(langcode: string): boolean
  function getAllLanguageCode(): Array<string>
  function getLanguageInfo(langcode: string): languageInformation

  interface languageInformation {
    name: string,
    nativeName: string
    direction: 'ltr' | 'rtl'
  }
}