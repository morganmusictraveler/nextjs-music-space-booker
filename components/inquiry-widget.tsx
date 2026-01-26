"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { X, CalendarIcon, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import venuedata from "@/venuedata.json"

interface InquiryWidgetProps {
    venueName?: string
    venueType?: "rehearsal" | "recording"
    address?: string
    phone?: string
    website?: string
    description?: string
    showAsModal?: boolean
    onClose?: () => void
}

export function InquiryWidget({
    venueName,
    venueType,
    address,
    phone,
    website,
    description,
    showAsModal = true,
    onClose,
}: InquiryWidgetProps) {
    // Use venuedata.json as fallback if props are not provided
    const venue = venuedata
    venueName = venueName || venue.name
    venueType = venueType || "recording"
    address = address || venue.location?.address || ""
    phone = phone || "+43 (1) 555-0456"
    website = website || "houseofstrauss.at"
    description = description || venue.description
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        eventDescription: "",
        equipmentNeeded: "",
        maxCapacity: "",
        priceRange: [1000, 10000] as [number, number],
        selectedDates: [] as Date[],
        requirements: {
            publiclySellingTickets: false,
            revenueSharing: false,
            backlineNeeded: false,
            audioEngineerNeeded: false,
            lightingEngineerNeeded: false,
            insuranceNeeded: false,
            merchandiseToSell: false,
        },
    })
    const [calendarOpen, setCalendarOpen] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleDateSelect = (dates: Date[] | undefined) => {
        if (!dates) {
            setFormData((prev) => ({ ...prev, selectedDates: [] }))
            return
        }

        setFormData((prev) => ({
            ...prev,
            selectedDates: dates.sort((a, b) => a.getTime() - b.getTime()),
        }))
    }

    const removeDate = (dateToRemove: Date) => {
        setFormData((prev) => ({
            ...prev,
            selectedDates: prev.selectedDates.filter(
                (d) => new Date(d).toDateString() !== new Date(dateToRemove).toDateString()
            ),
        }))
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch("/api/inquiries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    venueName,
                    venueType,
                    address,
                    clientName: formData.name,
                    clientEmail: formData.email,
                    clientPhone: formData.phone,
                    eventDescription: formData.eventDescription,
                    equipmentNeeded: formData.equipmentNeeded,
                    maxCapacity: formData.maxCapacity,
                    priceRange: formData.priceRange,
                    selectedDates: formData.selectedDates.map(d => d.toISOString()),
                    requirements: formData.requirements,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                alert("Inquiry submitted successfully! We'll review it and get back to you soon.")
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    eventDescription: "",
                    equipmentNeeded: "",
                    maxCapacity: "",
                    priceRange: [1000, 10000],
                    selectedDates: [],
                    requirements: {
                        publiclySellingTickets: false,
                        revenueSharing: false,
                        backlineNeeded: false,
                        audioEngineerNeeded: false,
                        lightingEngineerNeeded: false,
                        insuranceNeeded: false,
                        merchandiseToSell: false,
                    },
                })
                if (onClose) {
                    onClose()
                }
            } else {
                const error = await response.json()
                alert("Failed to submit inquiry: " + (error.error || "Unknown error"))
            }
        } catch (error) {
            console.error("Error submitting inquiry:", error)
            alert("Failed to submit inquiry. Please try again.")
        }
    }

    const isFormValid =
        formData.name &&
        formData.email &&
        formData.eventDescription &&
        formData.equipmentNeeded &&
        formData.selectedDates.length > 0 &&
        formData.maxCapacity &&
        formData.priceRange[0] > 0 &&
        formData.priceRange[1] > 0

    const content = (
        <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b backdrop-blur-sm bg-card/95">
                <div className="flex items-center gap-4">
                    <img
                        src="/houseofstrauss1.jpeg"
                        alt="House of Strauss"
                        className="w-16 h-16 rounded-full object-cover border border-primary/20 shadow-sm"
                    />
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                        {venueName}
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
                <div className="px-6 py-4 space-y-4">
                    {/* Inquiry Form */}
                    <div className="space-y-4">
                        

                        {/* Name Field */}
                        <div className="space-y-1">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Your Name *
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="h-11"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address *
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="h-11"
                            />
                        </div>

                        {/* Date Selection Field */}
                        <div className="space-y-2 -mx-4 px-4 py-4 bg-linear-to-br from-primary/5 to-accent/5 border-y border-primary/10 rounded-lg">
                            <Label className="text-base font-semibold">Dates You're Interested In *</Label>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full h-14 justify-start text-left font-medium text-base border-2 hover:border-primary/50 hover:bg-card"
                                    >
                                        <CalendarIcon className="mr-3 h-5 w-5" />
                                        {formData.selectedDates.length === 0
                                            ? "Select dates"
                                            : `${formData.selectedDates.length} date${formData.selectedDates.length > 1 ? "s" : ""} selected`}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="multiple"
                                        selected={formData.selectedDates}
                                        onSelect={handleDateSelect}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </PopoverContent>
                            </Popover>

                            {/* Selected Dates Display */}
                            {formData.selectedDates.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-primary/10">
                                    {formData.selectedDates.map((date) => {
                                        const dateObj = new Date(date)
                                        return (
                                            <div
                                                key={dateObj.toDateString()}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full border border-primary/30"
                                            >
                                                {format(dateObj, "MMM d, yyyy")}
                                                <button
                                                    onClick={() => removeDate(date)}
                                                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                                    type="button"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Max Capacity Field */}
                        <div className="space-y-1">
                            <Label htmlFor="maxCapacity" className="text-sm font-medium">
                                Expected Attendees / Max Capacity *
                            </Label>
                            <Input
                                id="maxCapacity"
                                name="maxCapacity"
                                type="number"
                                placeholder="Number of people"
                                value={formData.maxCapacity}
                                onChange={handleInputChange}
                                className="h-11"
                                min="1"
                                required
                            />
                        </div>

                        {/* Budget Range Slider */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Expected Budget Range *</Label>
                            <Slider
                                value={formData.priceRange}
                                onValueChange={(value) => {
                                    if (value.length === 2) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            priceRange: [value[0], value[1]] as [number, number],
                                        }))
                                    }
                                }}
                                min={0}
                                max={100000}
                                step={500}
                                className="w-full"
                            />
                            <div className="flex justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground mb-1">Minimum</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        €{formData.priceRange[0].toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-xs text-muted-foreground mb-1">Maximum</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        €{formData.priceRange[1].toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Event Requirements Checkboxes */}
                        <div className="space-y-1">
                            <Label className="text-sm font-medium mb-1 block">Event Requirements</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: "publiclySellingTickets", label: "Publicly selling tickets?" },
                                    { id: "revenueSharing", label: "Revenue Sharing?" },
                                    { id: "backlineNeeded", label: "Backline needed?" },
                                    { id: "audioEngineerNeeded", label: "Audio Engineer needed?" },
                                    { id: "lightingEngineerNeeded", label: "Lighting engineer needed?" },
                                    { id: "insuranceNeeded", label: "Insurance needed?" },
                                    { id: "merchandiseToSell", label: "Merchandise to be sold?" },
                                ].map((item) => {
                                    const selected = formData.requirements[item.id as keyof typeof formData.requirements]
                                    return (
                                        <button
                                            type="button"
                                            key={item.id}
                                            className={`flex items-center justify-center text-center px-2 py-3 rounded-lg border text-xs font-medium transition-colors h-14 w-full
                                                ${selected ? "bg-primary/10 border-primary text-primary" : "bg-card border-muted text-foreground hover:bg-muted/60"}`}
                                            aria-pressed={selected}
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    requirements: {
                                                        ...prev.requirements,
                                                        [item.id]: !selected,
                                                    },
                                                }))
                                            }}
                                        >
                                            {item.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Event Description Field */}
                        <div className="space-y-1">
                            <Label htmlFor="equipmentNeeded" className="text-sm font-medium">
                                Any Equipment Specifically Needed *
                            </Label>
                            <Textarea
                                id="equipmentNeeded"
                                name="equipmentNeeded"
                                placeholder="Describe any specific technical requirements you have for your event"
                                value={formData.equipmentNeeded}
                                onChange={handleInputChange}
                                className="min-h-30 resize-none"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="eventDescription" className="text-sm font-medium">
                                Tell us about your event *
                            </Label>
                            <Textarea
                                id="eventDescription"
                                name="eventDescription"
                                placeholder="Describe anything you'd like us to know to help host you"
                                value={formData.eventDescription}
                                onChange={handleInputChange}
                                className="min-h-30 resize-none"
                            />
                        </div>
                    </div>

                    {/* Contact Info */}

                </div>
            </div>

            {/* Footer with Submit Button */}
            <div className="border-t backdrop-blur-sm bg-card/95 px-6 py-4">
                <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className="w-full px-8 h-10 font-semibold shadow hover:shadow-md transition-all disabled:opacity-50 mb-2"
                >
                    Send Inquiry
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
    )

    if (showAsModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10  animate-in fade-in duration-200">
                <Card className="w-full max-w-3xl shadow-2xl border-border/50 animate-in zoom-in-95 duration-200">
                    {content}
                </Card>
            </div>
        )
    }

    return <Card className="w-full max-w-3xl mx-auto shadow-xl border-border/50">{content}</Card>
}
