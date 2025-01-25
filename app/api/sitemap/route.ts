import { NextResponse } from "next/server"

// import { createClient } from "@/lib/auth/server" // Adjust path if needed

// const crawledUrls = new Set<string>()

// async function fetchHtml(url: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const client = url.startsWith("https") ? get : httpGet

//     client(url, (res) => {
//       let data = ""

//       res.on("data", (chunk) => (data += chunk))
//       res.on("end", () => resolve(data))
//     }).on("error", (err) => reject(err))
//   })
// }

// async function crawlWebsite(
//   rootUrl: string,
//   currentUrl: string,
//   sitemap: Set<string> = new Set()
// ): Promise<string[]> {
//   if (crawledUrls.has(currentUrl)) return Array.from(sitemap)
//   crawledUrls.add(currentUrl)

//   try {
//     const html = await fetchHtml(currentUrl)

//     const links = [...html.matchAll(/href="(.*?)"/g)].map((match) => match[1])

//     for (const link of links) {
//       try {
//         const absoluteUrl = new URL(link, rootUrl).href

//         if (absoluteUrl.startsWith(rootUrl) && !crawledUrls.has(absoluteUrl)) {
//           sitemap.add(absoluteUrl)
//           await crawlWebsite(rootUrl, absoluteUrl, sitemap)
//         }
//       } catch {
//         // Ignore invalid URLs
//       }
//     }
//   } catch (err) {
//     console.error(`Error crawling ${currentUrl}:`, (err as Error).message)
//   }

//   return Array.from(sitemap)
// }

export async function GET(): Promise<NextResponse> {
  return new NextResponse(`Hello from ${process.env.VERCEL_REGION}`)

  // Create Supabase client
  //const supabase = await createClient()

  // Validate user session
  // const { data, error } = await supabase.auth.getUser()
  // if (error || !data?.user) {
  //   return NextResponse.json(
  //     { error: "Unauthorized. Please log in to access this route." },
  //     { status: 401 }
  //   )
  // }

  // Extract URL from query parameters
  // const { searchParams } = new URL(request.url)
  // const rootUrl = searchParams.get("url")

  // if (!rootUrl || !/^https?:\/\//.test(rootUrl)) {
  //   return NextResponse.json(
  //     { error: "Please provide a valid root URL (e.g., https://example.com)" },
  //     { status: 400 }
  //   )
  // }

  // try {
  // Generate sitemap
  //   const sitemap = await crawlWebsite(rootUrl, rootUrl)
  //   return NextResponse.json({ sitemap }, { status: 200 })
  // } catch (error) {
  //   return NextResponse.json(
  //     { error: "Failed to generate sitemap." },
  //     { status: 500 }
  //   )
  // }
}
