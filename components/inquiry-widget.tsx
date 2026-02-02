"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
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
        priceRange: [0, 10000] as [number, number],
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

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showAsModal) {
            document.body.style.overflow = 'hidden'
            return () => {
                document.body.style.overflow = 'unset'
            }
        }
    }, [showAsModal])

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

        // Limit to 3 dates maximum
        if (dates.length > 3) {
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
                    priceRange: [0, 10000],
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
        <div className="flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b backdrop-blur-sm bg-card/95 shrink-0">
                <div className="flex items-center gap-4">
                    <img
                        src="/houseofstrauss1.jpeg"
                        alt="House of Strauss"
                        className="w-24 h-16 rounded-lg object-cover border border-primary/20 shadow-sm"
                        loading="eager"
                        style={{ imageRendering: 'crisp-edges' }}
                    />
                    <h2 className="text-[1.625rem] font-bold tracking-tight text-foreground leading-tight">
                        {venueName}
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
                    {/* Inquiry Form */}
                    <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                        <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Contact Information</h3>
                        
                        <div className="space-y-3">
                        {/* Name Field */}
                        <div className="space-y-1">
                            <Label htmlFor="name" className="text-xs font-bold text-[#707070] uppercase mb-2 block">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-xs font-bold text-[#707070] uppercase mb-2 block">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        </div>
                    </div>

                        {/* Inquiry Details with Event Dates and Expected Attendees */}
                        <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                            <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Inquiry Details</h3>
                            <div className="space-y-4">
                                {/* Event Dates */}
                                <div className="space-y-1">
                                    <Label className="text-xs font-bold text-[#707070] uppercase mb-2 block">Event Dates</Label>
                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <button
                                            className={cn(
                                                "flex items-center justify-start w-full h-10 px-4 text-base font-normal",
                                                "bg-white rounded-xl border border-[#d7d7d7]",
                                                "shadow-[0_2px_4px_0_rgba(0,0,0,0.08)]",
                                                "outline-none transition-all duration-300 cursor-pointer",
                                                "hover:bg-[#fafbfc] hover:border-[#c0c0c0] hover:shadow-[0_2px_6px_0_rgba(0,0,0,0.12)]",
                                                "focus:border-primary focus:shadow-[0_0_0_1px_#187aed,0_2px_4px_0_rgba(24,122,237,0.15)]",
                                                "text-[#707070]",
                                            )}
                                        >
                                            <i className="fa-solid fa-calendar mr-2 text-sm shrink-0 text-[#707070]"></i>
                                            <span className="truncate">
                                            {formData.selectedDates.length === 0
                                                ? "Select up to 3 dates"
                                                : formData.selectedDates.map(date => format(new Date(date), "MMM d, yyyy")).join(" - ")}
                                            </span>
                                        </button>
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
                                </div>

                                {/* Expected Attendees */}
                                <div className="space-y-1">
                                    <Label htmlFor="maxCapacity" className="text-xs font-bold text-[#707070] uppercase mb-2 block">
                                    Expected Attendees
                                </Label>
                                <Input
                                id="maxCapacity"
                                name="maxCapacity"
                                type="number"
                                placeholder="Number of people"
                                value={formData.maxCapacity}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                                </div>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                            <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Budget</h3>
                            <div className="space-y-3">
                                <div>
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
                                        max={50000}
                                        step={500}
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex justify-between gap-4">
                                    <div className="flex-1 p-3 rounded-lg bg-card shadow-md border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Minimum</p>
                                        <p className="text-xl font-bold text-primary">
                                            €{formData.priceRange[0].toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex-1 text-right p-3 rounded-lg bg-card shadow-md border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Maximum</p>
                                        <p className="text-xl font-bold text-primary">
                                            €{formData.priceRange[1].toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Event Requirements Checkboxes */}
                        <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                            <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Event Requirements</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: "publiclySellingTickets", label: "Publicly selling tickets?" },
                                    { id: "revenueSharing", label: "Revenue Sharing?" },
                                    { id: "backlineNeeded", label: "Backline needed?" },
                                    { id: "audioEngineerNeeded", label: "Audio Engineer needed?" },
                                    { id: "lightingEngineerNeeded", label: "Lighting engineer needed?" },
                                    { id: "insuranceNeeded", label: "Insurance needed?" },
                                ].map((item) => {
                                    const selected = formData.requirements[item.id as keyof typeof formData.requirements]
                                    return (
                                        <button
                                            type="button"
                                            key={item.id}
                                            className={cn(
                                                "w-full py-2.5 px-2 text-xs font-semibold rounded-xl border transition-all duration-300",
                                                "text-center leading-tight",
                                                selected
                                                ? "bg-primary/10 border-primary text-primary shadow-md cursor-pointer"
                                                : "bg-white text-[rgba(0,0,0,0.54)] border-[#d7d7d7] hover:border-primary hover:text-primary cursor-pointer",
                                            )}
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
                        <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                            <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Additional Information</h3>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="equipmentNeeded" className="text-xs font-bold text-[#707070] uppercase mb-2 block">
                                    Technical Needs
                                </Label>
                                <Textarea
                                    id="equipmentNeeded"
                                    name="equipmentNeeded"
                                    placeholder="Describe any specific technical requirements you have for your event"
                                    value={formData.equipmentNeeded}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="eventDescription" className="text-xs font-bold text-[#707070] uppercase mb-2 block">
                                    ADDITIONAL REMARKS
                                </Label>
                                <Textarea
                                    id="eventDescription"
                                    name="eventDescription"
                                    placeholder="Describe anything you'd like us to know to help host you"
                                    value={formData.eventDescription}
                                    onChange={handleInputChange}
                                />
                            </div>
                            </div>
                        </div>

                </div>
            </div>

            {/* Footer with Submit Button */}
            <div className="border-t backdrop-blur-sm bg-card/95 px-6 pt-4 shrink-0">
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className="w-full h-[40px] px-7 text-lg font-normal bg-primary text-white rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#1367c7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    <span>Send Inquiry</span>
                </button>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40  animate-in fade-in duration-200">
                <Card className="w-full max-w-3xl shadow-2xl border-border/50 animate-in zoom-in-95 duration-200">
                    {content}
                </Card>
            </div>
        )
    }

    return <Card className="w-full max-w-3xl mx-auto shadow-xl border-border/50">{content}</Card>
}
