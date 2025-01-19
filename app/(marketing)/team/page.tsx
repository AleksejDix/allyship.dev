import Image from "next/image"
import { allAuthors } from "contentlayer/generated"

const Page = () => {
  const authors = allAuthors

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1
            id="team-heading"
            className="inline-block font-heading text-4xl tracking-tight lg:text-5xl"
          >
            Team
          </h1>
          <p className="text-xl text-muted-foreground">
            Meet the team behind Allyship.
          </p>
        </div>
      </div>
      <hr className="my-8" />

      <section
        className="grid gap-8 sm:grid-cols-2 md:grid-cols-3"
        aria-labelledby="team-heading"
      >
        {authors.map((author, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-4 text-center border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            role="group"
            aria-labelledby={`author-name-${index}`}
            aria-describedby={`author-role-${index}`}
          >
            <Image
              src={author.avatar}
              alt={author.title}
              width={124}
              height={124}
              className="rounded-full bg-white"
            />
            <div className="space-y-2">
              <h2 id={`author-name-${index}`} className="text-lg font-semibold">
                {author.title}
              </h2>
              <p
                id={`author-role-${index}`}
                className="text-sm text-muted-foreground"
              >
                {author.position}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Page
