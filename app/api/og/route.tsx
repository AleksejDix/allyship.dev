import { ImageResponse } from "next/og"

// App router includes @vercel/og.
// No need to install it.

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get("title")
    const description = searchParams.get("description")

    if (!title) {
      return new Response("Missing title parameter", { status: 400 })
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            padding: "48px",
            position: "relative",
            backgroundImage: "linear-gradient(to bottom, #264059, black)",
          }}
        >
          <div tw="flex flex-col w-full relative">
            <h1 tw="text-6xl font-bold tracking-tight text-white text-left mb-4">
              📢 {title}
            </h1>
            {description && (
              <p tw="text-4xl text-gray-300 text-left">{description}</p>
            )}
          </div>
          <div
            style={{
              left: 48,
              bottom: 48,
              position: "absolute",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 48,
                color: "white",
              }}
            >
              allyship.dev
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error("Error generating image:", error)
    return new Response("Failed to generate image", { status: 500 })
  }
}
