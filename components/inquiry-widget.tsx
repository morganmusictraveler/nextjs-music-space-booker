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
import { X, Music2, CalendarIcon, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface InquiryWidgetProps {
    venueName: string
    venueType: "rehearsal" | "recording"
    address: string
    phone?: string
    website?: string
    description: string
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

    const handleSubmit = () => {
        console.log("[Inquiry Widget] Form submitted:", formData)
        alert("Inquiry submitted! We'll get back to you soon.")
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
    }

    const isFormValid = formData.name && formData.email && formData.eventDescription && formData.equipmentNeeded && formData.selectedDates.length > 0

    const content = (
        <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b backdrop-blur-sm bg-card/95">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/10 to-accent/10 ring-1 ring-primary/10">
                        <Music2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{venueName}</h2>
                        <p className="text-sm text-muted-foreground mt-0.5 capitalize">{venueType} Space</p>
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
                    {/* Description Section */}
                    <Card className="p-5 bg-linear-to-br from-secondary/30 to-secondary/10 border-secondary/40 shadow-sm">
                        <h3 className="font-semibold mb-2.5 text-foreground tracking-tight">Need to Know</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    </Card>

                    {/* Inquiry Form */}
                    <div className="space-y-6">
                        <h3 className="font-semibold text-foreground tracking-tight">Send an Inquiry</h3>

                        {/* Name Field */}
                        <div className="space-y-2">
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
                        <div className="space-y-2">
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
                        <div className="space-y-3 -mx-8 px-8 py-6 bg-linear-to-br from-primary/5 to-accent/5 border-y border-primary/10 rounded-lg">
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
                                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-primary/10">
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
                        <div className="space-y-2">
                            <Label htmlFor="maxCapacity" className="text-sm font-medium">
                                Expected Attendees / Max Capacity
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
                            />
                        </div>

                        {/* Budget Range Slider */}
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">Expected Budget Range</Label>
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
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">Event Requirements</Label>
                            <div className="space-y-3">
                                {[
                                    { id: "publiclySellingTickets", label: "Publicly selling tickets?" },
                                    { id: "revenueSharing", label: "Revenue Sharing?" },
                                    { id: "backlineNeeded", label: "Backline needed?" },
                                    { id: "audioEngineerNeeded", label: "Audio Engineer needed?" },
                                    { id: "lightingEngineerNeeded", label: "Lighting engineer needed?" },
                                    { id: "insuranceNeeded", label: "Insurance needed?" },
                                    { id: "merchandiseToSell", label: "Merchandise to be sold?" },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <Checkbox
                                            id={item.id}
                                            checked={formData.requirements[item.id as keyof typeof formData.requirements]}
                                            onCheckedChange={(checked) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    requirements: {
                                                        ...prev.requirements,
                                                        [item.id]: checked,
                                                    },
                                                }))
                                            }}
                                        />
                                        <Label
                                            htmlFor={item.id}
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {item.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Event Description Field */}
                        <div className="space-y-2">
                            <Label htmlFor="equipmentNeeded" className="text-sm font-medium">
                                Any Equipment Specifically Needed
                            </Label>
                            <Textarea
                                id="equipmentNeeded"
                                name="equipmentNeeded"
                                placeholder="Describe any specific technical requirements you have for your event"
                                value={formData.equipmentNeeded}
                                onChange={handleInputChange}
                                className="min-h-30 resize-none"
                            />
                        </div>
                        <div className="space-y-2">
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
                    <div className="space-y-4 pt-2">
                        <h3 className="font-semibold text-foreground tracking-tight">{venueName}</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>{address}</p>
                            {phone && <p>Phone: {phone}</p>}
                            {website && <p>Website: {website}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer with Submit Button */}
            <div className="border-t backdrop-blur-sm bg-card/95 px-8 py-6">
                <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className="w-full px-10 h-12 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                    Send Inquiry
                </Button>
                <p className="text-xs text-center text-muted-foreground/80 mt-4">
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
