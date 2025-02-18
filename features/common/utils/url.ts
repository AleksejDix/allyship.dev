export function normalizeUrl(url: string): string {
  const urlObj = new URL(url);
  // Convert to lowercase
  const hostname = urlObj.hostname.toLowerCase();
  // Remove www.
  const normalizedHostname = hostname.replace(/^www\./, '');
  // Remove trailing slash from pathname
  const normalizedPath = urlObj.pathname.replace(/\/$/, '');
  // Combine without protocol, www, trailing slashes, query params, or hash
  return `${normalizedHostname}${normalizedPath}`;
}

export function compareHostnames(url1: string, url2: string): boolean {
  const hostname1 = new URL(url1).hostname.toLowerCase()
  const hostname2 = new URL(url2).hostname.toLowerCase()
  return hostname1 === hostname2
}

export function normalizePath(url: string): string {
  const urlObj = new URL(url);
  // Remove trailing slash, query parameters, and hash fragments
  return urlObj.pathname.replace(/\/$/, '');
}
