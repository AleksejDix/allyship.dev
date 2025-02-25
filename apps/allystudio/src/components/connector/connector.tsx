"use client"

import { ConnectorButton } from "./connector-button"
import { ConnectorIcon } from "./connector-icon"
import { ConnectorLink } from "./connector-link"

export function Connector() {
  const state = "disconnected"

  const LinkOrButton =
    state === "disconnected" ? ConnectorButton : ConnectorLink

  return (
    <>
      <LinkOrButton>
        <ConnectorIcon state={state} />
      </LinkOrButton>
    </>
  )
}
