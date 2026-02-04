"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
        organization: "",
        eventDescription: "",
        equipmentNeeded: "",
        maxCapacity: "",
        priceRange: [0, 10000] as [number, number],
        eventDates: [
            { date: null as Date | null, startTime: "09:00", endTime: "11:00", isPrimary: true }
        ],
        requirements: {
            publiclySellingTickets: false,
            revenueSharing: false,
            backlineNeeded: false,
            audioEngineerNeeded: false,
            lightingEngineerNeeded: false,
            insuranceNeeded: false,
            merchandiseToSell: false,
        },
        riderFile: null as File | null,
    })
    const [activeCalendarIndex, setActiveCalendarIndex] = useState<number | null>(null)
    const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null)
    const [tempTimeData, setTempTimeData] = useState<{startTime: string, endTime: string} | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [showVerification, setShowVerification] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState<{index: number, type: 'start' | 'end'} | null>(null)
    const timeSliderRef = useRef<HTMLDivElement>(null)

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

    const handleDateSelect = (date: Date | undefined, index: number) => {
        if (!date) return
        
        setFormData((prev) => {
            const newDates = [...prev.eventDates]
            newDates[index] = { ...newDates[index], date }
            return { ...prev, eventDates: newDates }
        })
        setActiveCalendarIndex(null)
        // Open time picker immediately after date selection
        setEditingTimeIndex(index)
        setTempTimeData({ startTime: formData.eventDates[index].startTime, endTime: formData.eventDates[index].endTime })
    }

    const addEventDate = () => {
        if (formData.eventDates.length < 3) {
            setFormData((prev) => ({
                ...prev,
                eventDates: [...prev.eventDates, { date: null, startTime: "09:00", endTime: "11:00", isPrimary: false }]
            }))
        }
    }

    const removeEventDate = (index: number) => {
        if (formData.eventDates.length > 1) {
            setFormData((prev) => ({
                ...prev,
                eventDates: prev.eventDates.filter((_, i) => i !== index)
            }))
        }
    }

    const calculateDuration = (start: string, end: string): string => {
        const [startHour, startMin] = start.split(':').map(Number)
        const [endHour, endMin] = end.split(':').map(Number)
        const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return `${hours}h ${minutes.toString().padStart(2, '0')}m`
    }

    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }

    const minutesToTime = (minutes: number): string => {
        // Round to nearest 30 minutes
        const roundedMinutes = Math.round(minutes / 30) * 30
        const hours = Math.floor(roundedMinutes / 60)
        const mins = roundedMinutes % 60
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    }

    const getDateLabel = (index: number): string => {
        if (index === 0) return "Primary Date"
        if (index === 1) return "Secondary Date"
        return "Tertiary Date"
    }

    const formatDateTimeDisplay = (date: Date | null, startTime: string, endTime: string, index: number): string => {
        if (!date) return getDateLabel(index)
        return `${format(date, "MMMM d, yyyy")} (${startTime} - ${endTime})`
    }

    const confirmTimeSelection = () => {
        if (editingTimeIndex !== null && tempTimeData) {
            setFormData((prev) => {
                const newDates = [...prev.eventDates]
                newDates[editingTimeIndex] = { 
                    ...newDates[editingTimeIndex], 
                    startTime: tempTimeData.startTime,
                    endTime: tempTimeData.endTime
                }
                return { ...prev, eventDates: newDates }
            })
        }
        setEditingTimeIndex(null)
        setTempTimeData(null)
    }

    const cancelTimeSelection = () => {
        setEditingTimeIndex(null)
        setTempTimeData(null)
    }

    const handleTimeSliderDrag = (e: React.MouseEvent<HTMLDivElement>, index: number, type: 'start' | 'end') => {
        setIsDragging({ index, type })
        updateTimeFromPosition(e.clientX, index, type)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && timeSliderRef.current) {
            updateTimeFromPosition(e.clientX, isDragging.index, isDragging.type)
        }
    }

    const handleMouseUp = () => {
        setIsDragging(null)
    }

    const updateTimeFromPosition = (clientX: number, index: number, type: 'start' | 'end') => {
        if (!timeSliderRef.current || !tempTimeData) return
        
        const rect = timeSliderRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
        const percentage = x / rect.width
        const minutes = Math.round(percentage * (24 * 60))
        const newTime = minutesToTime(Math.max(0, Math.min(minutes, 24 * 60 - 30)))
        
        if (type === 'start') {
            const endMinutes = timeToMinutes(tempTimeData.endTime)
            const startMinutes = timeToMinutes(newTime)
            if (startMinutes < endMinutes - 30) {
                setTempTimeData({ ...tempTimeData, startTime: newTime })
            }
        } else {
            const startMinutes = timeToMinutes(tempTimeData.startTime)
            const endMinutes = timeToMinutes(newTime)
            if (endMinutes > startMinutes + 30) {
                setTempTimeData({ ...tempTimeData, endTime: newTime })
            }
        }
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setFormData((prev) => ({
            ...prev,
            riderFile: file,
        }))
    }

    const handleContinue = () => {
        const hasValidDate = formData.eventDates.some(d => d.date !== null)
        if (!hasValidDate || !formData.maxCapacity) {
            alert("Please fill in all required fields on this page")
            return
        }
        setCurrentPage(2)
    }

    const handleBack = () => {
        setCurrentPage(1)
        setShowVerification(false)
    }

    const handleGuestInfoComplete = () => {
        if (!formData.name || !formData.email || !formData.phone) {
            alert("Please fill in all required fields")
            return
        }
        setShowVerification(true)
    }

    const handleSubmit = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            alert("Please enter the 6-digit verification code")
            return
        }

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
                    clientOrganization: formData.organization,
                    eventDescription: formData.eventDescription,
                    equipmentNeeded: formData.equipmentNeeded,
                    maxCapacity: formData.maxCapacity,
                    priceRange: formData.priceRange,
                    eventDates: formData.eventDates.filter(d => d.date).map(d => ({
                        date: d.date?.toISOString(),
                        startTime: d.startTime,
                        endTime: d.endTime,
                        isPrimary: d.isPrimary
                    })),
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
                    organization: "",
                    eventDescription: "",
                    equipmentNeeded: "",
                    maxCapacity: "",
                    priceRange: [0, 10000],
                    eventDates: [
                        { date: null, startTime: "09:00", endTime: "11:00", isPrimary: true }
                    ],
                    requirements: {
                        publiclySellingTickets: false,
                        revenueSharing: false,
                        backlineNeeded: false,
                        audioEngineerNeeded: false,
                        lightingEngineerNeeded: false,
                        insuranceNeeded: false,
                        merchandiseToSell: false,
                    },
                    riderFile: null,
                })
                setCurrentPage(1)
                setShowVerification(false)
                setVerificationCode("")
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

    const isPage1Valid =
        formData.eventDates.some(d => d.date !== null) &&
        formData.maxCapacity

    const isPage2Valid =
        formData.name &&
        formData.email &&
        formData.phone &&
        showVerification &&
        verificationCode.length === 6

    // Time options
    const timeOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0')
        return { value: `${hour}:00`, label: `${hour}:00` }
    })

    const content = (
        <div className="flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b backdrop-blur-sm bg-card/95 shrink-0">
                <div className="flex items-center gap-4">
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
                    {currentPage === 1 ? (
                        <>
                            {/* Inquiry Details with Event Dates and Expected Attendees */}
                            <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                                <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Inquiry Details</h3>
                                <div className="space-y-4">
                                    {/* Event Dates - Multiple with draggable times */}
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold text-[#707070] uppercase mb-2 block">Event Dates</Label>
                                        
                                        {formData.eventDates.map((eventDate, index) => (
                                            <div key={index} className="space-y-2">
                                                {/* Date Picker Button with integrated X button */}
                                                <Popover open={activeCalendarIndex === index} onOpenChange={(open) => setActiveCalendarIndex(open ? index : null)}>
                                                    <PopoverTrigger asChild>
                                                        <div className="relative group">
                                                            <button
                                                                className={cn(
                                                                    "flex items-center justify-start w-full h-10 px-4 text-base font-normal",
                                                                    "bg-white rounded-xl border border-[#d7d7d7]",
                                                                    "shadow-[0_2px_4px_0_rgba(0,0,0,0.08)]",
                                                                    "outline-none transition-all duration-300 cursor-pointer",
                                                                    "hover:bg-[#f0f4ff] hover:border-primary/50 hover:shadow-[0_2px_8px_0_rgba(24,122,237,0.2)]",
                                                                    "focus:border-primary focus:shadow-[0_0_0_1px_#187aed,0_2px_4px_0_rgba(24,122,237,0.15)]",
                                                                    eventDate.date ? "text-[#707070]" : "text-[#707070]/60",
                                                                    !eventDate.isPrimary && "pr-12"
                                                                )}
                                                            >
                                                                <i className="fa-solid fa-calendar mr-2 text-sm shrink-0 text-[#707070]"></i>
                                                                <span className="truncate">
                                                                    {formatDateTimeDisplay(eventDate.date, eventDate.startTime, eventDate.endTime, index)}
                                                                </span>
                                                            </button>
                                                            {/* X button for secondary/tertiary dates */}
                                                            {!eventDate.isPrimary && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        removeEventDate(index)
                                                                    }}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-200 hover:text-red-700 z-10 cursor-pointer"
                                                                >
                                                                    <i className="fa-solid fa-xmark text-lg text-red-500"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={eventDate.date || undefined}
                                                            onSelect={(date) => handleDateSelect(date, index)}
                                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        ))}

                                        {/* Time Picker Modal Overlay */}
                                        {editingTimeIndex !== null && tempTimeData && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                                                <div className="bg-white rounded-xl border border-[#d7d7d7] p-6 shadow-2xl max-w-2xl w-full">
                                                    {/* Time labels */}
                                                    <div className="flex justify-between items-center mb-6">
                                                        <div className="flex-1">
                                                            <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Start Time</span>
                                                            <p className="text-2xl font-bold text-foreground">{tempTimeData.startTime}</p>
                                                        </div>
                                                        <div className="flex-1 text-center px-4">
                                                            <i className="fa-solid fa-clock text-primary text-3xl mb-2 block"></i>
                                                            <p className="text-lg font-semibold text-primary">
                                                                {calculateDuration(tempTimeData.startTime, tempTimeData.endTime)}
                                                            </p>
                                                            <span className="text-xs text-muted-foreground uppercase">Duration</span>
                                                        </div>
                                                        <div className="flex-1 text-right">
                                                            <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">End Time</span>
                                                            <p className="text-2xl font-bold text-foreground">{tempTimeData.endTime}</p>
                                                        </div>
                                                    </div>

                                                    {/* Draggable time slider */}
                                                    <div className="mb-6">
                                                        <div 
                                                            ref={timeSliderRef}
                                                            className="relative h-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg cursor-pointer"
                                                        >
                                                            {/* Time range visualization */}
                                                            <div 
                                                                className="absolute top-0 h-full bg-primary/20 rounded-lg"
                                                                style={{
                                                                    left: `${(timeToMinutes(tempTimeData.startTime) / (24 * 60)) * 100}%`,
                                                                    width: `${((timeToMinutes(tempTimeData.endTime) - timeToMinutes(tempTimeData.startTime)) / (24 * 60)) * 100}%`
                                                                }}
                                                            >
                                                                {/* Gradient arc/curve visual */}
                                                                <div className="absolute inset-0 flex items-center">
                                                                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                                        <path
                                                                            d="M 0 50 Q 50 20, 100 50"
                                                                            fill="none"
                                                                            stroke="rgba(24, 122, 237, 0.4)"
                                                                            strokeWidth="3"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>

                                                            {/* Start time handle */}
                                                            <div
                                                                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
                                                                style={{ left: `calc(${(timeToMinutes(tempTimeData.startTime) / (24 * 60)) * 100}% - 16px)` }}
                                                                onMouseDown={(e) => handleTimeSliderDrag(e, editingTimeIndex, 'start')}
                                                            >
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                                                </div>
                                                            </div>

                                                            {/* End time handle */}
                                                            <div
                                                                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
                                                                style={{ left: `calc(${(timeToMinutes(tempTimeData.endTime) / (24 * 60)) * 100}% - 16px)` }}
                                                                onMouseDown={(e) => handleTimeSliderDrag(e, editingTimeIndex, 'end')}
                                                            >
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                                                </div>
                                                            </div>

                                                            {/* Hour markers */}
                                                            {[0, 6, 12, 18, 24].map(hour => (
                                                                <div
                                                                    key={hour}
                                                                    className="absolute top-0 h-full border-l border-gray-300/50"
                                                                    style={{ left: `${(hour / 24) * 100}%` }}
                                                                >
                                                                    <span className="absolute -bottom-6 -translate-x-1/2 text-xs text-muted-foreground font-medium">
                                                                        {hour}:00
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Confirm/Cancel Buttons */}
                                                    <div className="flex gap-3 mt-8">
                                                        <button
                                                            onClick={cancelTimeSelection}
                                                            className="flex-1 py-3 px-4 text-sm font-semibold rounded-xl border border-[#d7d7d7] text-[#707070] bg-white transition-all duration-300 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={confirmTimeSelection}
                                                            className="flex-1 py-3 px-4 text-sm font-semibold rounded-xl border border-primary text-white bg-primary transition-all duration-300 hover:bg-[#1367c7] cursor-pointer"
                                                        >
                                                            Confirm Date & Time
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Add Date Button - only show if previous date is filled */}
                                        {formData.eventDates.length < 3 && formData.eventDates[formData.eventDates.length - 1].date !== null && (
                                            <button
                                                onClick={addEventDate}
                                                className="w-full py-3 px-4 text-sm font-semibold rounded-xl border border-primary/30 text-primary bg-white transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary cursor-pointer flex items-center justify-center gap-2 group"
                                            >
                                                <i className="fa-solid fa-plus text-primary group-hover:text-white transition-colors duration-300"></i>
                                                <span>Add {formData.eventDates.length === 1 ? 'Secondary' : 'Tertiary'} Date</span>
                                            </button>
                                        )}
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
                                                    : "bg-white text-[rgba(0,0,0,0.54)] border-[#d7d7d7] hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer",
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
                                
                                {/* Additional Requirements (moved from below) */}
                                <div className="mt-4 pt-4 border-t border-border">
                                    <Label htmlFor="equipmentNeeded" className="text-xs font-bold text-[#707070] uppercase mb-2 block">
                                        Additional Requirements
                                    </Label>
                                    <Textarea
                                        id="equipmentNeeded"
                                        name="equipmentNeeded"
                                        placeholder="Describe any specific technical requirements you have for your event"
                                        value={formData.equipmentNeeded}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                                <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Additional Information</h3>
                                <div className="space-y-3">
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
                                    
                                    {/* Rider Upload */}
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold text-[#707070] uppercase mb-2 block">
                                            Upload Rider
                                        </Label>
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className={cn(
                                                "flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer",
                                                formData.riderFile 
                                                    ? "border-primary bg-primary/5" 
                                                    : "border-[#d7d7d7] bg-white hover:border-primary/50 hover:bg-primary/5"
                                            )}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            {formData.riderFile ? (
                                                <>
                                                    <i className="fa-solid fa-file-check text-2xl text-primary mb-2"></i>
                                                    <span className="text-sm font-medium text-primary">{formData.riderFile.name}</span>
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
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Page 2: Contact Information */}
                            
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

                            {/* Guest Inquiry Section */}
                            <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                                <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Book as a Guest</h3>
                                
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

                                    {/* Phone Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="phone" className="text-xs font-bold text-[#707070] uppercase mb-2 block">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                handleInputChange(e)
                                                if (showVerification) setShowVerification(false)
                                            }}
                                        />
                                    </div>

                                    {/* Organization Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="organization" className="text-xs font-bold text-[#707070] uppercase mb-2 block">
                                            Organization (Optional)
                                        </Label>
                                        <Input
                                            id="organization"
                                            name="organization"
                                            placeholder="Your organization or band name"
                                            value={formData.organization}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Show Verify button if not yet verifying */}
                                    {!showVerification && formData.name && formData.email && formData.phone && (
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
                                            We've sent a 6-digit code to <span className="font-semibold">{formData.phone}</span>
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

                            {/* Inquiry Summary */}
                            <div className="p-5 rounded-xl border border-border bg-[#f8f9fb] shadow-sm">
                                <h3 className="text-primary uppercase font-bold text-sm tracking-wide mb-3">Inquiry Summary</h3>
                                <div className="space-y-2 text-sm">
                                    {formData.eventDates.filter(d => d.date).map((eventDate, index) => (
                                        <div key={index} className="pb-2 mb-2 border-b border-border last:border-0 last:pb-0 last:mb-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-semibold text-primary uppercase">
                                                    {eventDate.isPrimary ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary'} Date
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Date:</span>
                                                <span className="font-medium">{eventDate.date ? format(eventDate.date, "MMM d, yyyy") : "-"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Time:</span>
                                                <span className="font-medium">{eventDate.startTime} - {eventDate.endTime}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Duration:</span>
                                                <span className="font-medium">{calculateDuration(eventDate.startTime, eventDate.endTime)}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-between pt-2">
                                        <span className="text-muted-foreground">Expected Attendees:</span>
                                        <span className="font-medium">{formData.maxCapacity || "-"}</span>
                                    </div>
                                    <div className="h-px bg-border my-2" />
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Budget Range:</span>
                                        <span className="font-medium text-primary">
                                            €{formData.priceRange[0].toLocaleString()} - €{formData.priceRange[1].toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Footer with Submit Button */}
            <div className="border-t backdrop-blur-sm bg-card/95 px-6 pt-4 shrink-0">
                {currentPage === 1 ? (
                    <button
                        onClick={handleContinue}
                        disabled={!isPage1Valid}
                        className="w-full h-[40px] px-7 text-lg font-normal bg-primary text-white rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#1367c7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <span>Continue</span>
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!isPage2Valid}
                        className="w-full h-[40px] px-7 text-lg font-normal bg-primary text-white rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#1367c7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <span>Send Inquiry</span>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40  animate-in fade-in duration-200">
                <Card className="w-full max-w-3xl shadow-2xl border-border/50 animate-in zoom-in-95 duration-200">
                    {content}
                </Card>
            </div>
        )
    }

    return <Card className="w-full max-w-3xl mx-auto shadow-xl border-border/50">{content}</Card>
}
