"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface Inquiry {
    _id: string
    venueName: string
    venueType: string
    address: string
    clientName: string
    clientEmail: string
    clientPhone?: string
    eventDescription: string
    equipmentNeeded: string
    maxCapacity: string
    priceRange: [number, number]
    selectedDates: string[]
    requirements: Record<string, boolean>
    status: string
    hostNotes?: string
    hostCounterOffer?: {
        proposedPrice: number
        proposedDates: string[]
        notes: string
    }
    createdAt: string
    updatedAt: string
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "approved":
            return "bg-green-100 text-green-800"
        case "denied":
            return "bg-red-100 text-red-800"
        case "negotiation":
            return "bg-blue-100 text-blue-800"
        case "pending":
            return "bg-amber-100 text-amber-800"
        default:
            return ""
    }
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [negotiationDialogOpen, setNegotiationDialogOpen] = useState(false)
    const [hostNotes, setHostNotes] = useState("")
    const [counterOffer, setCounterOffer] = useState({
        proposedPrice: 0,
        proposedDates: [] as string[],
        notes: "",
    })

    useEffect(() => {
        fetchInquiries()
    }, [])

    const fetchInquiries = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/inquiries")
            if (response.ok) {
                const data = await response.json()
                setInquiries(data.inquiries || [])
            }
        } catch (error) {
            console.error("Error fetching inquiries:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleApprove = async () => {
        if (!selectedInquiry) return

        try {
            const response = await fetch("/api/inquiries", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inquiryId: selectedInquiry._id,
                    status: "approved",
                    hostNotes,
                }),
            })

            if (response.ok) {
                alert("Inquiry approved!")
                setDialogOpen(false)
                setHostNotes("")
                fetchInquiries()
            }
        } catch (error) {
            console.error("Error approving inquiry:", error)
            alert("Failed to approve inquiry")
        }
    }

    const handleDeny = async () => {
        if (!selectedInquiry) return

        try {
            const response = await fetch("/api/inquiries", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inquiryId: selectedInquiry._id,
                    status: "denied",
                    hostNotes,
                }),
            })

            if (response.ok) {
                alert("Inquiry denied")
                setDialogOpen(false)
                setHostNotes("")
                fetchInquiries()
            }
        } catch (error) {
            console.error("Error denying inquiry:", error)
            alert("Failed to deny inquiry")
        }
    }

    const handleSendNegotiation = async () => {
        if (!selectedInquiry) return

        try {
            const response = await fetch("/api/inquiries", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inquiryId: selectedInquiry._id,
                    status: "negotiation",
                    hostCounterOffer: counterOffer,
                }),
            })

            if (response.ok) {
                alert("Negotiation sent to client!")
                setNegotiationDialogOpen(false)
                setCounterOffer({
                    proposedPrice: 0,
                    proposedDates: [],
                    notes: "",
                })
                fetchInquiries()
            }
        } catch (error) {
            console.error("Error sending negotiation:", error)
            alert("Failed to send negotiation")
        }
    }

    const filteredInquiries =
        statusFilter === "all"
            ? inquiries
            : inquiries.filter((i) => i.status === statusFilter)

    const openInquiryDetails = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry)
        setHostNotes(inquiry.hostNotes || "")
        setDialogOpen(true)
    }

    const openNegotiationDialog = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry)
        setCounterOffer({
            proposedPrice: inquiry.priceRange[1],
            proposedDates: [],
            notes: "",
        })
        setNegotiationDialogOpen(true)
    }

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
                    <p className="text-gray-600 text-sm mt-1">Manage incoming event inquiries</p>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="denied">Denied</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
                {isLoading ? (
                    <Card className="p-6 text-center text-gray-500">
                        Loading inquiries...
                    </Card>
                ) : filteredInquiries.length === 0 ? (
                    <Card className="p-6 text-center text-gray-500">
                        No inquiries found. New inquiries will appear here.
                    </Card>
                ) : (
                    filteredInquiries.map((inquiry) => (
                        <Card
                            key={inquiry._id}
                            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => openInquiryDetails(inquiry)}
                        >
                            <div className="space-y-4">
                                {/* Header Row */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <i className="fa-regular fa-music w-5 h-5 text-primary" />
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {inquiry.clientName}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600">{inquiry.venueName}</p>
                                    </div>
                                    <Badge className={getStatusColor(inquiry.status)}>
                                        {inquiry.status}
                                    </Badge>
                                </div>

                                {/* Event Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Dates */}
                                    <div className="flex items-start gap-3">
                                        <i className="fa-regular fa-calendar w-4 h-4 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase">Dates</p>
                                            <p className="text-sm text-gray-900">
                                                {inquiry.selectedDates.length} date{inquiry.selectedDates.length !== 1 ? "s" : ""} selected
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {inquiry.selectedDates.slice(0, 2).map(d => format(new Date(d), "MMM d")).join(", ")}
                                                {inquiry.selectedDates.length > 2 && ` + ${inquiry.selectedDates.length - 2} more`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Budget */}
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase">Budget Range</p>
                                        <p className="text-sm text-gray-900">
                                            €{inquiry.priceRange[0].toLocaleString()} - €{inquiry.priceRange[1].toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="flex flex-wrap gap-4 pt-2 border-t">
                                    <div className="flex items-center gap-2">
                                        <i className="fa-regular fa-envelope w-4 h-4 text-gray-400" />
                                        <a href={`mailto:${inquiry.clientEmail}`} className="text-sm text-blue-600 hover:underline">
                                            {inquiry.clientEmail}
                                        </a>
                                    </div>
                                    {inquiry.clientPhone && (
                                        <div className="flex items-center gap-2">
                                            <i className="fa-regular fa-phone w-4 h-4 text-gray-400" />
                                            <a href={`tel:${inquiry.clientPhone}`} className="text-sm text-blue-600 hover:underline">
                                                {inquiry.clientPhone}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Submitted Date */}
                                <p className="text-xs text-gray-500">
                                    Submitted {format(new Date(inquiry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Details Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedInquiry && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Inquiry Details</DialogTitle>
                                <DialogDescription>
                                    From {selectedInquiry.clientName} for {selectedInquiry.venueName}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Client Info */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-gray-900">Client Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Name:</span> {selectedInquiry.clientName}</p>
                                        <p><span className="font-medium">Email:</span> {selectedInquiry.clientEmail}</p>
                                        {selectedInquiry.clientPhone && (
                                            <p><span className="font-medium">Phone:</span> {selectedInquiry.clientPhone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-gray-900">Event Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Venue Type:</span> {selectedInquiry.venueType}</p>
                                        <p><span className="font-medium">Expected Attendees:</span> {selectedInquiry.maxCapacity || "Not specified"}</p>
                                        <p><span className="font-medium">Budget:</span> €{selectedInquiry.priceRange[0].toLocaleString()} - €{selectedInquiry.priceRange[1].toLocaleString()}</p>
                                        <p><span className="font-medium">Proposed Dates:</span> {selectedInquiry.selectedDates.length} dates</p>
                                        <ul className="list-disc list-inside text-gray-600">
                                            {selectedInquiry.selectedDates.map(d => (
                                                <li key={d}>{format(new Date(d), "EEEE, MMMM d, yyyy")}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Event Description */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-gray-900">Event Description</h4>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                        {selectedInquiry.eventDescription}
                                    </p>
                                </div>

                                {/* Equipment Needed */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-gray-900">Equipment Needed</h4>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                        {selectedInquiry.equipmentNeeded}
                                    </p>
                                </div>

                                {/* Requirements */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-gray-900">Special Requirements</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {Object.entries(selectedInquiry.requirements).map(([key, value]) => (
                                            <div key={key} className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Host Notes */}
                                {selectedInquiry.status !== "pending" && (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm text-gray-900">Your Notes</h4>
                                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                                            {selectedInquiry.hostNotes || "No notes added"}
                                        </p>
                                    </div>
                                )}

                                {/* Counter Offer */}
                                {selectedInquiry.hostCounterOffer && (
                                    <div className="space-y-2 bg-purple-50 p-4 rounded">
                                        <h4 className="font-semibold text-sm text-gray-900">Counter Offer</h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Proposed Price:</span> €{selectedInquiry.hostCounterOffer.proposedPrice.toLocaleString()}</p>
                                            <p><span className="font-medium">Proposed Dates:</span></p>
                                            <ul className="list-disc list-inside text-gray-600">
                                                {selectedInquiry.hostCounterOffer.proposedDates.map(d => (
                                                    <li key={d}>{format(new Date(d), "EEEE, MMMM d, yyyy")}</li>
                                                ))}
                                            </ul>
                                            <p><span className="font-medium">Notes:</span> {selectedInquiry.hostCounterOffer.notes}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons - Only show for pending inquiries */}
                                {selectedInquiry.status === "pending" && (
                                    <div className="space-y-3 pt-4">
                                        <Label className="text-sm font-medium">Your Notes (Optional)</Label>
                                        <Textarea
                                            placeholder="Add any notes for the client..."
                                            value={hostNotes}
                                            onChange={(e) => setHostNotes(e.target.value)}
                                            className="min-h-20"
                                        />

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleApprove}
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setDialogOpen(false)
                                                    openNegotiationDialog(selectedInquiry)
                                                }}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                Send Counter Offer
                                            </Button>
                                            <Button
                                                onClick={handleDeny}
                                                variant="destructive"
                                                className="flex-1"
                                            >
                                                Deny
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Negotiation Dialog */}
            <Dialog open={negotiationDialogOpen} onOpenChange={setNegotiationDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Send Counter Offer</DialogTitle>
                        <DialogDescription>
                            Make a counter offer to {selectedInquiry?.clientName}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedInquiry && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="proposedPrice" className="text-sm font-medium">
                                    Proposed Price (€)
                                </Label>
                                <Input
                                    id="proposedPrice"
                                    type="number"
                                    value={counterOffer.proposedPrice}
                                    onChange={(e) =>
                                        setCounterOffer({
                                            ...counterOffer,
                                            proposedPrice: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    min="0"
                                    step="100"
                                />
                                <p className="text-xs text-gray-500">
                                    Their budget: €{selectedInquiry.priceRange[0].toLocaleString()} - €{selectedInquiry.priceRange[1].toLocaleString()}
                                </p>
                            </div>

                            {/* Proposed Dates */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Proposed Dates (Optional)
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start">
                                            <i className="fa-regular fa-calendar mr-2 h-4 w-4" />
                                            Add Alternative Dates
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            disabled={(date) => {
                                                // Disable dates that are already selected
                                                return counterOffer.proposedDates.some(
                                                    (selectedDate) =>
                                                        format(new Date(selectedDate), "yyyy-MM-dd") ===
                                                        format(date, "yyyy-MM-dd")
                                                )
                                            }}
                                            onDayClick={(date) => {
                                                const dateStr = format(date, "yyyy-MM-dd")
                                                if (!counterOffer.proposedDates.includes(dateStr)) {
                                                    setCounterOffer({
                                                        ...counterOffer,
                                                        proposedDates: [...counterOffer.proposedDates, dateStr],
                                                    })
                                                }
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                {/* Display Selected Dates */}
                                {counterOffer.proposedDates.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-xs text-gray-600">
                                            {counterOffer.proposedDates.length} date{counterOffer.proposedDates.length !== 1 ? "s" : ""} selected
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {counterOffer.proposedDates.map((date, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-sm"
                                                >
                                                    <span>{format(new Date(date), "MMM dd, yyyy")}</span>
                                                    <button
                                                        onClick={() => {
                                                            setCounterOffer({
                                                                ...counterOffer,
                                                                proposedDates: counterOffer.proposedDates.filter(
                                                                    (_, i) => i !== index
                                                                ),
                                                            })
                                                        }}
                                                        className="ml-1 hover:text-blue-900"
                                                    >
                                                        <i className="fa-regular fa-trash h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-medium">
                                    Notes for Client
                                </Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Explain your counter offer..."
                                    value={counterOffer.notes}
                                    onChange={(e) =>
                                        setCounterOffer({
                                            ...counterOffer,
                                            notes: e.target.value,
                                        })
                                    }
                                    className="min-h-20"
                                />
                            </div>

                            <p className="text-xs text-gray-500">
                                The client can accept or make another counter offer
                            </p>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setNegotiationDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSendNegotiation}>
                                    Send Counter Offer
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
