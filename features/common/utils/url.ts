export function normalizeUrl(url: string): string {
  try {
    // Ensure URL has protocol
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`
    const parsed = new URL(urlWithProtocol)
    // Remove www and get base hostname
    const hostname = parsed.hostname.replace(/^www\./, "")
    return `https://${hostname}`
  } catch (error) {
    return url // Return original if parsing fails
  }
}

export function compareHostnames(url1: string, url2: string): boolean {
  try {
    const parsed1 = new URL(url1)
    const parsed2 = new URL(url2)
    const hostname1 = parsed1.hostname.toLowerCase().replace(/^www\./, "")
    const hostname2 = parsed2.hostname.toLowerCase().replace(/^www\./, "")
    return hostname1 === hostname2
  } catch (error) {
    return false
  }
}
