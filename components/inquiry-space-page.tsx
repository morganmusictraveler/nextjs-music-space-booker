"use client"

import { useState, useRef } from "react"
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

interface InquirySpacePageProps {
    venueName: string
    venueType: "rehearsal" | "recording"
    address: string
    phone?: string
    website?: string
    description: string
    hostName?: string
    showAsModal?: boolean
    onClose?: () => void
}

export function InquirySpacePage({
    venueName,
    venueType,
    address,
    phone,
    website,
    description,
    hostName,
    showAsModal = false,
    onClose,
}: InquirySpacePageProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        eventDescription: "",
        equipmentNeeded: "",
        maxCapacity: [1, 50] as [number, number],
        priceRange: [0, 1000000] as [number, number],
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
    const [riderFile, setRiderFile] = useState<File | null>(null)
    const riderInputRef = useRef<HTMLInputElement>(null)
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
        console.log("[Inquiry Space Page] Form submitted:", formData)
        alert("Inquiry submitted! We'll get back to you soon.")
        setFormData({
            name: "",
            email: "",
            phone: "",
            eventDescription: "",
            equipmentNeeded: "",
            maxCapacity: [1, 50] as [number, number],
            priceRange: [0, 1000000],
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

    return (
        <div className="min-h-screen bg-background">
            {/* Header Navigation */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Powered by</span>
                        <a href="https://musictraveler.com" target="_blank">
                            <img
                                src="https://d1r3culteut8k2.cloudfront.net/static/images/mt_logo_jan_2018_blue_512.png"
                                alt="Music Traveler"
                                className="h-6"
                            />
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section with Image */}
            <section className="relative h-[60vh] bg-muted overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(/houseofstrauss1.jpeg)`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                </div>

                {/* Hero Overlay Content */}
                <div className="relative h-full flex flex-col justify-between p-6 md:p-10">
                    <div className="flex items-start justify-between">
                        <div className="space-y-3" />
                        <div className="flex gap-2" />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 text-balance leading-tight">
                                Inquire About {venueName}
                            </h1>
                            <p className="text-xl text-white/90">
                                Have a custom event in mind? Send us an inquiry to discuss your specific needs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Description and Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-6 bg-linear-to-br from-secondary/30 to-secondary/10 border-secondary/40">
                            <h2 className="font-semibold mb-3 text-foreground tracking-tight">About {venueName}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                        </Card>

                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-3 gap-3">
                            <Card className="p-4 text-center hover:shadow-md transition-shadow">
                                <div className="flex justify-center mb-2">
                                    <i className="fa-solid fa-music w-5 h-5 text-primary" />
                                </div>
                                <div className="text-sm font-bold capitalize">{venueType}</div>
                                <p className="text-xs text-muted-foreground mt-1">Space</p>
                            </Card>
                            <Card className="p-4 text-center hover:shadow-md transition-shadow">
                                <div className="flex justify-center mb-2">
                                    <i className="fa-solid fa-user w-5 h-5 text-primary" />
                                </div>
                                <div className="text-sm font-bold">{hostName}</div>
                                <p className="text-xs text-muted-foreground mt-1">Your host</p>
                            </Card>
                            <Card className="p-4 text-center hover:shadow-md transition-shadow">
                                <div className="flex justify-center mb-2">
                                    <i className="fa-solid fa-award w-5 h-5 text-primary" />
                                </div>
                                <div className="text-sm font-bold">24+</div>
                                <p className="text-xs text-muted-foreground mt-1">Reviews</p>
                            </Card>
                        </div>

                        <Card className="p-6">
                            <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <p>{address}</p>
                                {phone && <p>Phone: {phone}</p>}
                                {website && <p>Website: {website}</p>}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-8">
                            <h2 className="text-2xl font-semibold mb-6 text-foreground">Send an Inquiry</h2>

                            <div className="space-y-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm text-foreground">Your Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    </div>

                                    {/* Event Details */}
                                    <div className="space-y-4 pt-6 border-t">
                                        <h3 className="font-semibold text-sm text-foreground">Event Details</h3>

                                        {/* Date Selection */}
                                        <div className="space-y-3 bg-linear-to-br from-primary/5 to-accent/5 p-4 rounded-lg border border-primary/10">
                                            <Label className="text-sm font-medium">Dates You're Interested In *</Label>
                                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full h-11 justify-start text-left font-normal border-2"
                                                    >
                                                        <i className="fa-regular fa-calendar mr-2 h-4 w-4" />
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

                                            {formData.selectedDates.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-3 border-t border-primary/10">
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
                                                                    <i className="fa-regular fa-trash w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Max Capacity */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Expected Attendees</Label>
                                            <div className="flex items-center justify-center gap-4 py-2">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={formData.maxCapacity[1]}
                                                    value={formData.maxCapacity[0]}
                                                    onChange={(e) => {
                                                        const val = Math.min(Number(e.target.value), formData.maxCapacity[1])
                                                        setFormData((prev) => ({ ...prev, maxCapacity: [val, prev.maxCapacity[1]] }))
                                                    }}
                                                    className="text-2xl font-bold text-primary bg-transparent border-none outline-none w-24 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                                <span className="text-xl font-bold text-primary">—</span>
                                                <input
                                                    type="number"
                                                    min={formData.maxCapacity[0]}
                                                    value={formData.maxCapacity[1]}
                                                    onChange={(e) => {
                                                        const val = Math.max(Number(e.target.value), formData.maxCapacity[0])
                                                        setFormData((prev) => ({ ...prev, maxCapacity: [prev.maxCapacity[0], val] }))
                                                    }}
                                                    className="text-2xl font-bold text-primary bg-transparent border-none outline-none w-24 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                            </div>
                                            <Slider
                                                value={formData.maxCapacity}
                                                onValueChange={(value) => {
                                                    if (value.length === 2) {
                                                        setFormData((prev) => ({ ...prev, maxCapacity: [value[0], value[1]] as [number, number] }))
                                                    }
                                                }}
                                                min={1}
                                                max={10000}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Budget Slider */}
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
                                                max={1000000}
                                                step={500}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between gap-4">
                                                <div className="flex-1 p-3 rounded-lg bg-card shadow-md border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Minimum</p>
                                                    <div className="flex items-center">
                                                        <span className="text-xl font-bold text-primary mr-0.5">€</span>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={formData.priceRange[1]}
                                                            step={500}
                                                            value={formData.priceRange[0]}
                                                            onChange={(e) => {
                                                                const val = Math.min(Number(e.target.value), formData.priceRange[1])
                                                                setFormData((prev) => ({ ...prev, priceRange: [val, prev.priceRange[1]] }))
                                                            }}
                                                            className="text-xl font-bold text-primary bg-transparent border-none outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-right p-3 rounded-lg bg-card shadow-md border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Maximum</p>
                                                    <div className="flex items-center justify-end">
                                                        <span className="text-xl font-bold text-primary mr-0.5">€</span>
                                                        <input
                                                            type="number"
                                                            min={formData.priceRange[0]}
                                                            max={1000000}
                                                            step={500}
                                                            value={formData.priceRange[1]}
                                                            onChange={(e) => {
                                                                const val = Math.max(Number(e.target.value), formData.priceRange[0])
                                                                setFormData((prev) => ({ ...prev, priceRange: [prev.priceRange[0], val] }))
                                                            }}
                                                            className="text-xl font-bold text-primary bg-transparent border-none outline-none w-full text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    <div className="space-y-4 pt-6 border-t">
                                        <h3 className="font-semibold text-sm text-foreground">Event Requirements</h3>
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
                                                        className={`w-full py-2.5 px-2 text-xs font-semibold rounded-xl border transition-all duration-300 text-center leading-tight ${
                                                            selected
                                                                ? "bg-primary/10 border-primary text-primary shadow-md cursor-pointer"
                                                                : "bg-white text-[rgba(0,0,0,0.54)] border-[#d7d7d7] hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer"
                                                        }`}
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

                                    {/* Rider Upload */}
                                    <div className="space-y-3 pt-6 border-t">
                                        <h3 className="font-semibold text-sm text-foreground">Upload Rider</h3>
                                        <div
                                            onClick={() => riderInputRef.current?.click()}
                                            className={`flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                                                riderFile
                                                    ? "border-primary bg-primary/5"
                                                    : "border-[#d7d7d7] bg-white hover:border-primary/50 hover:bg-primary/5"
                                            }`}
                                        >
                                            <input
                                                ref={riderInputRef}
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => setRiderFile(e.target.files?.[0] || null)}
                                                className="hidden"
                                            />
                                            {riderFile ? (
                                                <>
                                                    <i className="fa-solid fa-file-check text-2xl text-primary mb-2"></i>
                                                    <span className="text-sm font-medium text-primary">{riderFile.name}</span>
                                                    <span className="text-xs text-muted-foreground mt-1">Click to change file</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-[#707070] mb-2"></i>
                                                    <span className="text-sm font-medium text-[#707070]">Click to upload rider</span>
                                                    <span className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX (max 10MB)</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="space-y-4 pt-6 border-t">
                                        <h3 className="font-semibold text-sm text-foreground">Additional Information</h3>
                                        <Textarea
                                            id="equipmentNeeded"
                                            name="equipmentNeeded"
                                            placeholder="Describe any additional requirements or information you'd like us to know"
                                            value={formData.equipmentNeeded}
                                            onChange={handleInputChange}
                                            className="min-h-24 resize-none"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-6 border-t">
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={!isFormValid}
                                            className="w-full h-12 text-base font-semibold"
                                        >
                                            Send Inquiry
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
