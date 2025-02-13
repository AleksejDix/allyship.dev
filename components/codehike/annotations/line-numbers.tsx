import { AnnotationHandler, InnerLine } from "codehike/code"

export const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 1
    return (
      <div className="...">
        <span className="..." style={{ minWidth: `${width}ch` }}>
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className="..." />
      </div>
    )
  },
}
