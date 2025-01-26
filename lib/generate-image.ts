const gradients = {
  blue: "from-blue-500 to-indigo-500",
  purple: "from-purple-500 to-pink-500",
  green: "from-emerald-500 to-teal-500",
  orange: "from-orange-500 to-amber-500",
  indigo: "from-indigo-500 to-violet-500",
}

export function generateImage(text: string) {
  const encoded = encodeURIComponent(text)

  // Generate a consistent gradient based on the text
  const gradientKeys = Object.keys(gradients)
  const gradientIndex =
    Math.abs(
      text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % gradientKeys.length

  const gradient =
    gradients[gradientKeys[gradientIndex] as keyof typeof gradients]

  // Return the URL to our OG image API route with gradient parameter
  return `/api/og/course?title=${encoded}&gradient=${gradient}`
}
