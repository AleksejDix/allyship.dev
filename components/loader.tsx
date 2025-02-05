interface LoaderProps {
  size: number
}

export function Loader({ size }: LoaderProps) {
  return (
    <div
      className="logo logo-2"
      style={
        {
          "--base": size,
        } as React.CSSProperties
      }
    >
      <div className="circle g-1"></div>
      <div className="circle g-2 offset-y"></div>
    </div>
  )
}
