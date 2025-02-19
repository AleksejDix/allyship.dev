import * as React from "react"

import type { ContactForm } from "./contact-schema"

export const EmailTemplate: React.FC<Readonly<ContactForm>> = (props) => (
  <div>
    <h1>Hallo Allyship</h1>
    <hr />
    <p>{props.message}</p>
    <hr />
    <p>Email: {props.email}</p>
    <p>Name: {props.name}</p>
  </div>
)
