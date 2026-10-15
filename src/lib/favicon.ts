/**
 * Dynamically updates the browser tab favicon to reflect the active theme colors.
 */
export function setDynamicFavicon(
  primaryAccent: string,
  secondaryAccent: string,
  _textColor: string,
  _bgColor: string
) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="8" fill="#111311"/>
        <path d="M7 23 L16 8 L25 23 L19.5 23 L16 16.5 L12.5 23 Z" fill="${primaryAccent}"/>
        <circle cx="23" cy="9" r="3.5" fill="${secondaryAccent}"/>
      </svg>
    `.trim();

    const encodedSvg = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = encodedSvg;
  } catch (e) {
    console.debug('Failed to set dynamic favicon:', e);
  }
}
