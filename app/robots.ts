import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api",
          "/api/*",
          "/search",
          "/search/*",
          "/admin",
          "/admin/*",
          "/spaces",
          "/spaces/*",
          "/account",
          "/account/*",
          "/*.json",
          "/*_buildManifest.js",
          "/*_middlewareManifest.js",
          "/*_ssgManifest.js",
          "/*.js.map",
        ],
      },
    ],
    sitemap: "https://allyship.dev/sitemap.xml",
    host: "https://allyship.dev",
  }
}
