import { sendMessage } from "@/lib/messaging"
import { storage } from "@/storage"
import { useEffect, useState } from "react"

export function Werkzeug() {
  const [testEnabled, setTestEnabled] = useState(false)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    storage.get<boolean>("test_enabled_headings").then((saved) => {
      setTestEnabled(saved || false)
    })

    chrome.runtime.onMessage.addListener((request) => {
      if (request.type === "HEADING_RESULTS") {
        setResults(request.data)
      }
    })
  }, [])

  const toggleTest = async () => {
    const newState = !testEnabled
    setTestEnabled(newState)
    await storage.set("test_enabled_headings", newState)

    sendMessage({ type: "toggle-test", test: "headings", enabled: newState })
  }

  return (
    <div>
      <h2>Heading Order Test</h2>
      <label>
        <input type="checkbox" checked={testEnabled} onChange={toggleTest} />
        Enable Heading Test
      </label>

      <h3>Results</h3>
      {results.length > 0 ? (
        <ul>
          {results.map((res, index) => (
            <li key={index}>⚠️ {res.message}</li>
          ))}
        </ul>
      ) : (
        <p>No issues detected</p>
      )}
    </div>
  )
}
