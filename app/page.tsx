"use client"

import { useState } from "react"
import { BookingWidget } from "@/components/booking-widget"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [showWidget, setShowWidget] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Page Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">MT</span>
              </div>
              <h1 className="text-xl font-bold">Music Traveler</h1>
            </div>
            <nav className="hidden md:flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Spaces
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                How it Works
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                About
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section - Demo Studio Website */}
      <div className="relative">
        <div
          className="h-[60vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(/placeholder.svg?height=800&width=1600&query=professional+music+recording+studio+interior)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-bold text-white mb-4 text-balance">Harmony Recording Studio</h2>
              <p className="text-xl text-white/90 mb-8 text-pretty">
                Professional recording and rehearsal space in the heart of Brooklyn
              </p>
              <Button size="lg" onClick={() => setShowWidget(true)}>
                Book Your Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About Our Studio</h2>
          <div className="prose prose-lg">
            <p className="text-muted-foreground leading-relaxed">
              Harmony Recording Studio offers world-class facilities for musicians, producers, and artists. Our space
              features cutting-edge equipment, exceptional acoustics, and a creative atmosphere that brings out the best
              in every session.
            </p>
          </div>

          <div className="mt-12 p-8 bg-secondary rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Try the Booking Widget</h3>
            <p className="text-muted-foreground mb-6">
              Click the button below to see how the Music Traveler booking widget works. This widget can be easily
              embedded on any studio's website.
            </p>
            <Button onClick={() => setShowWidget(true)}>Open Booking Widget</Button>
          </div>
        </div>
      </div>

      {/* Booking Widget Modal */}
      {showWidget && (
        <BookingWidget
          studioName="Harmony Recording Studio"
          studioType="recording"
          address="123 Music Ave, Brooklyn, NY 11201"
          phone="+1 (555) 123-4567"
          website="https://harmonyrecording.com"
          description="Professional recording studio with state-of-the-art equipment. All bookings require a valid ID and 50% deposit. Experienced sound engineer included with all sessions."
          amenities={[
            "Pro Tools HD",
            "Neumann Microphones",
            "SSL Console",
            "Vocal Booth",
            "Live Room",
            "Control Room",
            "Instruments Available",
            "Free Parking",
          ]}
          mapUrl="/brooklyn-map-location.jpg"
          showAsModal={true}
          onClose={() => setShowWidget(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo implementation of Music Traveler booking widget</p>
            <p className="mt-2">This widget can be embedded on any studio website</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
