import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Get title and description from search params
    const title = searchParams.get("title")
    const description = searchParams.get("description")

    if (!title) {
      return new Response("Missing title parameter", { status: 400 })
    }

    // Load the font
    const interSemiBold = await fetch(
      new URL("../../../assets/fonts/Inter-SemiBold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer())

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: "white",
            padding: 80,
          }}
        >
          <div
            style={{
              marginBottom: 40,
              fontSize: 60,
              fontFamily: "Inter",
              color: "black",
              lineHeight: 1.2,
              whiteSpace: "pre-wrap",
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 30,
                fontFamily: "Inter",
                color: "#666666",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
              }}
            >
              {description}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 80,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <img
              src={new URL(
                "../../../public/logo.png",
                import.meta.url
              ).toString()}
              alt="Logo"
              width={48}
              height={48}
            />
            <div
              style={{
                fontSize: 24,
                fontFamily: "Inter",
                color: "black",
              }}
            >
              allyship.dev
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: interSemiBold,
            style: "normal",
            weight: 600,
          },
        ],
      }
    )
  } catch (e) {
    console.error(e)
    return new Response("Failed to generate image", { status: 500 })
  }
}
