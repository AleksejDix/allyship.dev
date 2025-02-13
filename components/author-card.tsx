import Image from "next/image"
import { SocialIcon } from "react-social-icons"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SocialLink {
  url: string
  network: string
  label: string
}

interface Author {
  name: string
  role?: string
  avatar?: string
  twitter?: string
  linkedin?: string
  github?: string
  website?: string
}

interface AuthorCardProps {
  author: Author
  className?: string
}

export function AuthorCard({ author, className }: AuthorCardProps) {
  const socialLinks: SocialLink[] = [
    author.twitter && {
      url: `https://twitter.com/${author.twitter}`,
      network: "x",
      label: `Follow ${author.name} on Twitter`,
    },
    author.linkedin && {
      url: author.linkedin,
      network: "linkedin",
      label: `Connect with ${author.name} on LinkedIn`,
    },
    author.github && {
      url: `https://github.com/${author.github}`,
      network: "github",
      label: `View ${author.name}'s GitHub profile`,
    },
    author.website && {
      url: author.website,
      network: "website",
      label: `Visit ${author.name}'s website`,
    },
  ].filter(Boolean) as SocialLink[]

  return (
    <div className="flex justify-between">
      <div className={cn("flex items-center gap-4", className)}>
        {author.avatar && (
          <Avatar className="w-16 h-16 bg-white">
            <AvatarImage
              src={author.avatar}
              alt={`Avatar of ${author.name}`}
              width={40}
              height={40}
            />
            <AvatarFallback>
              {author.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col">
          <span className="font-medium">{author.name}</span>
          {author.role && (
            <span className="text-sm text-muted-foreground">{author.role}</span>
          )}
        </div>
      </div>
      {socialLinks.length > 0 && (
        <div className="flex items-center gap-1">
          {socialLinks.map(({ url, network, label }) => (
            <SocialIcon
              key={url}
              url={url}
              network={network}
              aria-label={label}
              style={{ width: 24, height: 24 }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
