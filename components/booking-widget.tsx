"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimeslotButton } from "@/components/ui/timeslot-button"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import venuedata from "@/venuedata.json"

// Helper function to get icon for amenity
const getAmenityIcon = (amenity: string): string => {
  const amenityLower = amenity.toLowerCase()
  if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return 'fa-wifi'
  if (amenityLower.includes('window')) return 'fa-window-maximize'
  if (amenityLower.includes('air') || amenityLower.includes('conditioning') || amenityLower.includes('ac')) return 'fa-snowflake'
  if (amenityLower.includes('parking')) return 'fa-square-parking'
  if (amenityLower.includes('kitchen') || amenityLower.includes('coffee')) return 'fa-mug-saucer'
  if (amenityLower.includes('piano')) return 'fa-music'
  if (amenityLower.includes('microphone') || amenityLower.includes('mic')) return 'fa-microphone'
  if (amenityLower.includes('drum')) return 'fa-drum'
  if (amenityLower.includes('guitar')) return 'fa-guitar'
  if (amenityLower.includes('headphone')) return 'fa-headphones'
  if (amenityLower.includes('wheelchair') || amenityLower.includes('accessible')) return 'fa-wheelchair'
  if (amenityLower.includes('elevator')) return 'fa-elevator'
  if (amenityLower.includes('storage')) return 'fa-box'
  if (amenityLower.includes('security')) return 'fa-shield'
  if (amenityLower.includes('camera')) return 'fa-camera'
  if (amenityLower.includes('historic') || amenityLower.includes('architecture')) return 'fa-landmark'
  if (amenityLower.includes('soundproof') || amenityLower.includes('acoustic')) return 'fa-volume-xmark'
  if (amenityLower.includes('restroom') || amenityLower.includes('bathroom')) return 'fa-restroom'
  if (amenityLower.includes('lounge') || amenityLower.includes('waiting')) return 'fa-couch'
  return 'fa-circle-check'
}

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
  
  // Full list of 12 amenities
  const allAmenities = amenities || [
    "Windows", "WiFi", "Air Conditioning", "Parking", 
    "Historic Architecture", "Soundproof Rooms", "Grand Piano", "Microphones", 
    "Restrooms", "Lounge Area", "Security", "Storage"
  ]
  
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [guests, setGuests] = useState<string>("2")
  const [duration, setDuration] = useState<string>("2")
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientOrganization, setClientOrganization] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Multi-page state
  const [currentPage, setCurrentPage] = useState(1)
  
  // Phone verification state
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAsModal) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [showAsModal])

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

  const handleContinue = () => {
    if (!date || selectedTimes.length === 0) {
      alert("Please select a date and at least one time slot")
      return
    }
    setCurrentPage(2)
  }

  const handleBack = () => {
    setCurrentPage(1)
    setShowVerification(false)
  }

  const handleGuestInfoComplete = () => {
    if (!clientName || !clientEmail || !clientPhone) {
      alert("Please fill in all required fields")
      return
    }
    setShowVerification(true)
  }

  const handleBooking = async () => {
    if (!date || selectedTimes.length === 0 || !clientName || !clientEmail || !clientPhone) {
      alert("Please fill in all required fields")
      return
    }

    if (!verificationCode || verificationCode.length !== 6) {
      alert("Please enter the 6-digit verification code")
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
          clientOrganization,
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
        setClientOrganization("")
        setCurrentPage(1)
        setShowVerification(false)
        setVerificationCode("")
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

  // Calculate displayed amenities - show 5 items plus the button, or all 12 when expanded
  const displayedAmenities = showAllAmenities ? allAmenities : allAmenities.slice(0, 5)

  const content = (
    <div className="flex flex-col max-h-[90vh] overflow-hidden">
      {/* Header - grand, avatar, condensed */}
      <div className="flex items-center justify-between px-6 py-3 border-b backdrop-blur-sm bg-card/95 shrink-0">
        <div className="flex items-center gap-6">
          {currentPage === 2 && (
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:border hover:border-primary bg-white cursor-pointer group mr-2"
            >
              <i className="fa-solid fa-arrow-left text-xl transition-colors duration-300 group-hover:text-primary"></i>
            </button>
          )}
          <img
            src="/houseofstrauss1.jpeg"
            alt={studioName}
            className="w-24 h-16 rounded-lg object-cover border border-primary/20 shadow-sm"
            loading="eager"
            style={{ imageRendering: 'crisp-edges' }}
          />
          <h2 className="text-[1.625rem] font-bold tracking-tight text-foreground leading-tight">
            {studioName}
          </h2>
        </div>
        {showAsModal && onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:border hover:border-primary bg-white cursor-pointer group"
          >
            <i className="fa-solid fa-xmark text-xl transition-colors duration-300 group-hover:text-primary"></i>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {currentPage === 1 ? (
            <>
              {/* Booking Details - Now at the top */}
              <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Booking Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Date Picker */}
                  <div className="w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={cn(
                            "flex items-center justify-start w-full h-10 px-4 text-base font-normal",
                            "bg-white rounded-xl border border-[#d7d7d7]",
                            "shadow-[0_2px_4px_0_rgba(0,0,0,0.08)]",
                            "outline-none transition-all duration-300 cursor-pointer",
                            "hover:bg-[#f0f4ff] hover:border-primary/50 hover:shadow-[0_2px_8px_0_rgba(24,122,237,0.2)]",
                            "focus:border-primary focus:shadow-[0_0_0_1px_#187aed,0_2px_4px_0_rgba(24,122,237,0.15)]",
                            !date && "text-[#707070]/60",
                            date && "text-[#707070]",
                          )}
                        >
                          <i className={cn("fa-solid fa-calendar mr-2 text-sm shrink-0", date ? "text-[#707070]" : "text-[#707070]/60")}></i>
                          <span className="truncate">{date ? format(date, "PPP") : "Select date"}</span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Guests */}
                  <div className="w-full">
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="w-full hover:bg-[#f0f4ff] hover:border-primary/50 hover:shadow-[0_2px_8px_0_rgba(24,122,237,0.2)] transition-all duration-300">
                        <div className="flex items-center">
                          <i className="fa-solid fa-users mr-2 text-sm"></i>
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
                </div>

                {/* Divider */}
                <div className="h-px bg-border my-4" />

                {/* Time Slots */}
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <TimeslotButton
                      key={slot.time}
                      time={slot.displayTime}
                      price={slot.price}
                      available={slot.available}
                      selected={selectedTimes.includes(slot.time)}
                      onClick={() => toggleTimeSlot(slot.time)}
                    />
                  ))}
                </div>
              </div>

              {/* About Section */}
              <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {studioType === "rehearsal"
                    ? `${studioName} is a professional rehearsal space designed for musicians. Equipped with industry-standard gear and acoustically treated rooms, it's perfect for band practice, solo sessions, and creative collaboration.`
                    : `${studioName} is a state-of-the-art recording studio offering professional audio recording, mixing, and mastering services. Our experienced engineers and premium equipment ensure the highest quality results for your music.`}
                </p>
              </div>

              {/* Amenities */}
              {allAmenities.length > 0 && (
                <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                  <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {displayedAmenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[#707070] bg-white rounded-xl border border-[#d7d7d7] shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-[#c0c0c0] hover:shadow-[0_2px_6px_0_rgba(0,0,0,0.12)]"
                      >
                        <i className={`fa-solid ${getAmenityIcon(amenity)} text-sm text-[#707070] shrink-0`}></i>
                        <span className="leading-tight font-medium">{amenity}</span>
                      </div>
                    ))}
                    {!showAllAmenities && allAmenities.length > 5 && (
                      <button
                        onClick={() => setShowAllAmenities(true)}
                        className="flex items-center justify-center gap-3 px-4 py-3 text-sm text-primary bg-white rounded-xl border border-primary/30 shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_2px_6px_0_rgba(24,122,237,0.15)] cursor-pointer group"
                      >
                        <i className="fa-solid fa-plus text-sm text-primary shrink-0 group-hover:text-white transition-colors duration-300"></i>
                        <span className="leading-tight font-medium">View All Amenities</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Map */}
              {(mapUrl || address) && (
                <div className="space-y-3">
                  <h3 className="text-primary uppercase font-bold text-sm tracking-wide">Location</h3>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted ring-1 ring-border shadow-sm">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src="https://www.google.com/maps/embed/v1/view?key=AIzaSyB8LaX5wYg6px8uZTtgRvozCrE-ltw9SUg&center=48.2082,16.3738&zoom=15&maptype=roadmap"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Page 2: Sign in / Sign up / Guest booking */}
              
              {/* Sign In / Sign Up Buttons */}
              <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Already have an account?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="w-full py-3 px-4 text-sm font-semibold rounded-xl border border-primary text-primary bg-white transition-all duration-300 hover:bg-primary hover:text-white cursor-pointer"
                  >
                    <i className="fa-solid fa-right-to-bracket mr-2"></i>
                    Sign In
                  </button>
                  <button
                    className="w-full py-3 px-4 text-sm font-semibold rounded-xl border border-primary text-primary bg-white transition-all duration-300 hover:bg-primary hover:text-white cursor-pointer"
                  >
                    <i className="fa-solid fa-user-plus mr-2"></i>
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Guest Booking Section */}
              <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Book as a Guest</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-xs font-bold text-[#707070] uppercase mb-2 block">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs font-bold text-[#707070] uppercase mb-2 block">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs font-bold text-[#707070] uppercase mb-2 block">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      value={clientPhone}
                      onChange={(e) => {
                        setClientPhone(e.target.value)
                        if (showVerification) setShowVerification(false)
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="organization" className="text-xs font-bold text-[#707070] uppercase mb-2 block">Organization (Optional)</Label>
                    <Input
                      id="organization"
                      placeholder="Your organization or band name"
                      value={clientOrganization}
                      onChange={(e) => setClientOrganization(e.target.value)}
                    />
                  </div>
                  
                  {/* Show Verify button if not yet verifying */}
                  {!showVerification && clientName && clientEmail && clientPhone && (
                    <button
                      onClick={handleGuestInfoComplete}
                      className="w-full py-3 px-4 text-sm font-semibold rounded-xl border border-primary/30 text-primary bg-primary/5 transition-all duration-300 hover:bg-primary/10 cursor-pointer mt-2"
                    >
                      <i className="fa-solid fa-mobile-screen mr-2"></i>
                      Verify Phone Number
                    </button>
                  )}
                </div>
                
                {/* Phone Verification Section */}
                {showVerification && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <i className="fa-solid fa-shield-check text-primary"></i>
                      <span className="text-sm font-medium text-foreground">Verify your phone number</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      We've sent a 6-digit code to <span className="font-semibold">{clientPhone}</span>
                    </p>
                    <div>
                      <Label htmlFor="verificationCode" className="text-xs font-bold text-[#707070] uppercase mb-2 block">
                        Enter 6-digit code
                      </Label>
                      <Input
                        id="verificationCode"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        className="text-center text-lg tracking-[0.5em] font-mono"
                      />
                    </div>
                    <button className="text-xs text-primary hover:underline mt-2">
                      Resend code
                    </button>
                  </div>
                )}
              </div>

              {/* Booking Summary */}
              <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{date ? format(date, "PPP") : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Slots:</span>
                    <span className="font-medium">{selectedTimes.length > 0 ? selectedTimes.join(", ") : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Musicians:</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary">
                      €{selectedTimes.reduce((total, time) => {
                        const slot = timeSlots.find(s => s.time === time)
                        return total + (slot?.price || 0)
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer with Booking Button and Music Traveler logo - sticky */}
      <div className="border-t backdrop-blur-sm bg-card/95 px-6 pt-4 shrink-0">
        {currentPage === 1 ? (
          <button
            onClick={handleContinue}
            disabled={!date || selectedTimes.length === 0}
            className="w-full h-[40px] px-7 text-lg font-normal bg-primary text-white rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#1367c7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span>
              {selectedTimes.length > 0 
                ? `Continue - €${selectedTimes.reduce((total, time) => {
                    const slot = timeSlots.find(s => s.time === time)
                    return total + (slot?.price || 0)
                  }, 0).toFixed(2)}`
                : "Continue"
              }
            </span>
          </button>
        ) : (
          <button
            onClick={handleBooking}
            disabled={!clientName || !clientEmail || !clientPhone || !showVerification || verificationCode.length !== 6 || isSubmitting}
            className="w-full h-[40px] px-7 text-lg font-normal bg-primary text-white rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#1367c7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span>
              {isSubmitting 
                ? "Booking..." 
                : `Book Now - €${selectedTimes.reduce((total, time) => {
                    const slot = timeSlots.find(s => s.time === time)
                    return total + (slot?.price || 0)
                  }, 0).toFixed(2)}`
              }
            </span>
          </button>
        )}
        <div className="flex items-center justify-center gap-2 mt-4">
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
  )

  if (showAsModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
        <Card className="w-full max-w-3xl shadow-2xl border-border/50 animate-in zoom-in-95 duration-200">
          {content}
        </Card>
      </div>
    )
  }

  return <Card className="w-full max-w-3xl mx-auto shadow-xl border-border/50">{content}</Card>
}
