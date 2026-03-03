/**
 * Appends the current language parameter to external URLs
 * @param url - The base URL
 * @param lang - The current language ('en' | 'es')
 * @returns URL with lg parameter appended
 */
export function appendLangToUrl(url: string, lang: 'en' | 'es'): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('lg', lang);
    return urlObj.toString();
  } catch {
    // If URL parsing fails, just append as query string
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}lg=${lang}`;
  }
}

/**
 * Gets the current language from localStorage or URL
 * @returns The current language
 */
export function getCurrentLang(): 'en' | 'es' {
  if (typeof window === 'undefined') return 'en';
  
  const url = new URL(window.location.href);
  const lgParam = url.searchParams.get('lg');
  const storedLang = localStorage.getItem('tlang');
  
  if (lgParam === 'en' || lgParam === 'es') return lgParam;
  if (storedLang === 'en' || storedLang === 'es') return storedLang;
  
  return 'en';
}
