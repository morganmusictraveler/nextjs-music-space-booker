"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimeslotButton } from "@/components/ui/timeslot-button"
import { format } from "date-fns"
import { CalendarIcon, Music2, MapPin, Phone, Globe, X, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

import venuedata from "@/venuedata.json"

interface BookingWidgetProps {
  studioName?: string
  studioType?: "rehearsal" | "recording"
  address?: string
  phone?: string
  website?: string
  description?: string
  amenities?: string[]
  mapUrl?: string
  showAsModal?: boolean
  onClose?: () => void
}

export function BookingWidget({
  studioName,
  studioType,
  address,
  phone,
  website,
  description,
  amenities,
  mapUrl,
  showAsModal = true,
  onClose,
}: BookingWidgetProps) {
  // Use venuedata.json as fallback if props are not provided
  const venue = venuedata
  studioName = studioName || venue.name
  studioType = studioType || "recording"
  address = address || venue.location?.address || ""
  phone = phone || "+43 (1) 555-0456"
  website = website || "houseofstrauss.at"
  description = description || venue.description
  amenities = amenities || ["Windows", "WiFi", "Air Conditioning"]
  const [date, setDate] = useState<Date>()
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [guests, setGuests] = useState<string>("2")
  const [duration, setDuration] = useState<string>("2")
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate time slots with pricing
  const timeSlots = [
    { time: "9:00", displayTime: "09:00", price: 40, available: true },
    { time: "10:00", displayTime: "10:00", price: 40, available: true },
    { time: "11:00", displayTime: "11:00", price: 40, available: false },
    { time: "12:00", displayTime: "12:00", price: 40, available: true },
    { time: "13:00", displayTime: "13:00", price: 40, available: true },
    { time: "14:00", displayTime: "14:00", price: 40, available: true },
    { time: "15:00", displayTime: "15:00", price: 40, available: false },
    { time: "16:00", displayTime: "16:00", price: 40, available: true },
    { time: "17:00", displayTime: "17:00", price: 35, available: true },
    { time: "18:00", displayTime: "18:00", price: 35, available: true },
    { time: "19:00", displayTime: "19:00", price: 35, available: true },
    { time: "20:00", displayTime: "20:00", price: 35, available: false },
  ]

  const toggleTimeSlot = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    )
  }

  const handleBooking = async () => {
    if (!date || selectedTimes.length === 0 || !clientName || !clientEmail) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueName: studioName,
          venueType: studioType,
          address,
          clientName,
          clientEmail,
          clientPhone,
          date: format(date, "yyyy-MM-dd"),
          times: selectedTimes,
          duration: parseInt(duration),
          guests: parseInt(guests),
          amount: selectedTimes.reduce((total, time) => {
            const slot = timeSlots.find(s => s.time === time)
            return total + (slot?.price || 0)
          }, 0),
        }),
      })

      if (response.ok) {
        alert("Booking confirmed! You'll receive a confirmation email shortly.")
        setDate(undefined)
        setSelectedTimes([])
        setClientName("")
        setClientEmail("")
        setClientPhone("")
        if (onClose) onClose()
      } else {
        alert("Failed to create booking. Please try again.")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const content = (
    <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
      {/* Header - grand, avatar, condensed */}
      <div className="flex items-center justify-between px-6 py-3 border-b backdrop-blur-sm bg-card/95">
        <div className="flex items-center gap-4">
          <img
            src="/houseofstrauss1.jpeg"
            alt={studioName}
            className="w-16 h-16 rounded-full object-cover border border-primary/20 shadow-sm"
          />
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            {studioName}
          </h2>
        </div>
        {showAsModal && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-secondary/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4 space-y-6">

          {/* Booking Form */}
          <div className="space-y-5">
            {/* Client Info Section */}
            <div className="space-y-3 pb-4 border-b">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-sm mb-2 block">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm mb-2 block">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm mb-2 block">Phone/Mobile *</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Booking Details</h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Date Picker */}
                <div className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11 hover:bg-secondary/50 transition-colors",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{date ? format(date, "PPP") : "Select date"}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guests */}
                <div className="w-full">
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="w-full h-11 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 shrink-0" />
                        <SelectValue placeholder="Musicians" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Musician</SelectItem>
                      <SelectItem value="2">2 Musicians</SelectItem>
                      <SelectItem value="3">3 Musicians</SelectItem>
                      <SelectItem value="4">4 Musicians</SelectItem>
                      <SelectItem value="5">5+ Musicians</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="w-full">
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="w-full h-11 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 shrink-0" />
                        <SelectValue placeholder="Duration" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">Full day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-foreground tracking-tight">Available Times</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
                  {timeSlots.map((slot) => (
                    <TimeslotButton
                      key={slot.time}
                      time={`${slot.displayTime} | €${slot.price.toFixed(2)}`}
                      available={slot.available}
                      selected={selectedTimes.includes(slot.time)}
                      onClick={() => toggleTimeSlot(slot.time)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-foreground tracking-tight">About {studioName}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {studioType === "rehearsal"
                  ? `${studioName} is a professional rehearsal space designed for musicians. Equipped with industry-standard gear and acoustically treated rooms, it's perfect for band practice, solo sessions, and creative collaboration.`
                  : `${studioName} is a state-of-the-art recording studio offering professional audio recording, mixing, and mastering services. Our experienced engineers and premium equipment ensure the highest quality results for your music.`}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="font-semibold text-foreground tracking-tight">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0" />
                      <span className="leading-tight">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {mapUrl && (
              <div className="space-y-4 pt-2">
                <h3 className="font-semibold text-foreground tracking-tight">Location</h3>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted ring-1 ring-border shadow-sm">
                  <img src={mapUrl || "/placeholder.svg"} alt="Studio location" className="w-full h-full object-cover" />
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Footer with Booking Button and Music Traveler logo */}
        <div className="border-t backdrop-blur-sm bg-card/95 px-6 py-4">
          <Button
            size="lg"
            onClick={handleBooking}
              disabled={!date || selectedTimes.length === 0 || !clientName || !clientEmail || !clientPhone || isSubmitting}
            className="w-full px-8 h-12 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 mb-2"
          >
            {isSubmitting ? "Booking..." : "Book Now"}
          </Button>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <a href="https://musictraveler.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://d1r3culteut8k2.cloudfront.net/static/images/mt_logo_jan_2018_blue_512.png"
                alt="Music Traveler"
                className="h-6"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  if (showAsModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 animate-in fade-in duration-200">
        <Card className="w-full max-w-3xl shadow-2xl border-border/50 animate-in zoom-in-95 duration-200">
          {content}
        </Card>
      </div>
    )
  }

  return <Card className="w-full max-w-3xl mx-auto shadow-xl border-border/50">{content}</Card>
}
