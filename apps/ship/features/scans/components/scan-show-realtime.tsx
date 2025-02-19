"use client"

import { useEffect, useState } from "react"

import { createClient } from "@/lib/supabase/client"

export function ScanShow({ serverProps }: { serverProps: any }) {
  const [scan, setScan] = useState(serverProps)

  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel("Scan")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Scan" },
        (payload) => {
          if (payload.new.id === scan.id) {
            setScan(payload.new)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  })

  return <pre>{JSON.stringify(scan, null, 2)}</pre>
}
