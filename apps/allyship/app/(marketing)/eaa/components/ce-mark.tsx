import React from 'react'

interface CEMarkProps {
  width?: number
  height?: number
  className?: string
}

export function CEMark({
  width = 280,
  height = 200,
  className = '',
}: CEMarkProps) {
  return (
    <svg
      width={width}
      height={height}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
      viewBox="0 0 280 200"
      className={className}
      aria-label="CE Marking logo"
    >
      <path
        d="M110,199.498744A100,100 0 0 1 100,200A100,100 0 0 1 100,0A100,100 0 0 1 110,0.501256L110,30.501256A70,70 0 0 0 100,30A70,70 0 0 0 100,170A70,70 0 0 0 110,169.498744Z"
        fill="currentColor"
      />
      <path
        d="M280,199.498744A100,100 0 0 1 270,200A100,100 0 0 1 270,0A100,100 0 0 1 280,0.501256L280,30.501256A70,70 0 0 0 270,30A70,70 0 0 0 201.620283,85L260,85L260,115L201.620283,115A70,70 0 0 0 270,170A70,70 0 0 0 280,169.498744Z"
        fill="currentColor"
      />
    </svg>
  )
}
