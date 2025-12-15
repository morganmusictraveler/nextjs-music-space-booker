"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Music2, MapPin, Phone, Globe, X, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingWidgetProps {
  studioName: string
  studioType: "rehearsal" | "recording"
  address: string
  phone?: string
  website?: string
  description: string
  amenities: string[]
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
  const [date, setDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [guests, setGuests] = useState<string>("2")
  const [duration, setDuration] = useState<string>("2")

  // Generate time slots
  const timeSlots = [
    { time: "9:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "12:00 PM", available: true },
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: true },
    { time: "3:00 PM", available: false },
    { time: "4:00 PM", available: true },
    { time: "5:00 PM", available: true },
    { time: "6:00 PM", available: true },
    { time: "7:00 PM", available: true },
    { time: "8:00 PM", available: false },
  ]

  const handleBooking = () => {
    console.log("[v0] Booking details:", { date, selectedTime, guests, duration })
    alert("Booking request submitted! (This is a demo)")
  }

  const content = (
    <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b backdrop-blur-sm bg-card/95">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 ring-1 ring-primary/10">
            <Music2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{studioName}</h2>
            <p className="text-sm text-muted-foreground capitalize mt-0.5">{studioType} Space</p>
          </div>
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
        <div className="px-8 py-6 space-y-8">
          {/* Need to Know Section */}
          <Card className="p-5 bg-gradient-to-br from-secondary/30 to-secondary/10 border-secondary/40 shadow-sm">
            <h3 className="font-semibold mb-2.5 text-foreground tracking-tight">Need to Know</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description ||
                `Professional ${studioType} space available for booking. Please arrive 5 minutes early for setup. Cancellations must be made at least 24 hours in advance.`}
            </p>
          </Card>

          {/* Booking Form */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Date Picker */}
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

              {/* Guests */}
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="h-11 hover:bg-secondary/50 transition-colors">
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

              {/* Duration */}
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-11 hover:bg-secondary/50 transition-colors">
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

            {/* Time Slots */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground tracking-tight">Available Times</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={cn(
                      "w-full h-11 font-medium transition-all",
                      selectedTime === slot.time && "shadow-md",
                      slot.available && selectedTime !== slot.time && "hover:border-primary/40 hover:bg-secondary/50",
                    )}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 h-11 bg-transparent hover:bg-secondary/50 transition-colors border-dashed"
                disabled={!date}
              >
                🔔 Notify me if times open up
              </Button>
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

          {/* Contact Info */}
          <div className="space-y-4 pb-6 pt-2">
            <h3 className="font-semibold text-foreground tracking-tight">{studioName}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground/80 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">{address}</span>
              </div>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-sm text-primary hover:text-primary/80 transition-colors group"
                >
                  <Phone className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:underline">{phone}</span>
                </a>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-primary hover:text-primary/80 transition-colors group"
                >
                  <Globe className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:underline">{website}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Booking Button */}
      <div className="border-t backdrop-blur-sm bg-card/95 px-8 py-6">
        <div className="flex items-center justify-between gap-6 mb-4">
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Price</div>
            <div className="text-3xl font-semibold text-foreground tracking-tight">
              $45<span className="text-lg text-muted-foreground">/hr</span>
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleBooking}
            disabled={!date || !selectedTime}
            className="px-10 h-12 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            Book Now
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground/80">
          Powered by <span className="font-semibold text-muted-foreground">Music Traveler</span>
        </p>
      </div>
    </div>
  )

  if (showAsModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <Card className="w-full max-w-3xl shadow-2xl border-border/50 animate-in zoom-in-95 duration-200">
          {content}
        </Card>
      </div>
    )
  }

  return <Card className="w-full max-w-3xl mx-auto shadow-xl border-border/50">{content}</Card>
}
