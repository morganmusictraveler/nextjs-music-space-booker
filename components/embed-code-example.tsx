"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function EmbedCodeExample() {
  const embedCode = `<!-- Add this script to your website -->
<script src="https://musictraveler.com/widget.js"></script>

<!-- Add this div where you want the booking button -->
<div 
  class="music-traveler-widget"
  data-studio-id="your-studio-id"
  data-button-text="Book Now"
></div>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
    alert("Embed code copied to clipboard!")
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Embed Code</h3>
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Code
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code>{embedCode}</code>
      </pre>
      <p className="text-sm text-muted-foreground mt-4">
        Studios can embed this widget on their website to accept bookings through Music Traveler's platform.
      </p>
    </Card>
  )
}
