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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface Booking {
    _id: string
    venueName: string
    clientName: string
    clientEmail: string
    date: string
    duration: number
    amount?: number
    status: string
    createdAt: string
    time?: string
    address?: string
    clientPhone?: string
    guests?: number
    notes?: string
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "confirmed":
            return "bg-green-100 text-green-800 hover:bg-green-100"
        case "pending":
            return "bg-amber-100 text-amber-800 hover:bg-amber-100"
        case "completed":
            return "bg-gray-800 text-white hover:bg-gray-800"
        case "cancelled":
            return "bg-red-100 text-red-800 hover:bg-red-100"
        default:
            return ""
    }
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("all")
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [editFormData, setEditFormData] = useState<Partial<Booking>>({})
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/bookings")
            if (response.ok) {
                const data = await response.json()
                setBookings(data.bookings || [])
            }
        } catch (error) {
            console.error("Error fetching bookings:", error)
            toast({ title: "Error", description: "Failed to fetch bookings" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleViewBooking = (booking: Booking) => {
        setSelectedBooking(booking)
        setViewDialogOpen(true)
    }

    const handleEditBooking = (booking: Booking) => {
        setSelectedBooking(booking)
        setEditFormData(booking)
        setEditDialogOpen(true)
    }

    const handleSaveBooking = async () => {
        if (!selectedBooking) return

        try {
            setIsSaving(true)
            const response = await fetch("/api/bookings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookingId: selectedBooking._id,
                    ...editFormData,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setBookings(bookings.map((b) => (b._id === data.booking._id ? data.booking : b)))
                setEditDialogOpen(false)
                toast({ title: "Success", description: "Booking updated successfully" })
            } else {
                const error = await response.json()
                toast({ title: "Error", description: error.error || "Failed to update booking" })
            }
        } catch (error) {
            console.error("Error updating booking:", error)
            toast({ title: "Error", description: "Failed to update booking" })
        } finally {
            setIsSaving(false)
        }
    }

    const filteredBookings =
        statusFilter === "all"
            ? bookings
            : bookings.filter((b) => b.status === statusFilter)

    const handleExport = () => {
        const csv = [
            ["Booking ID", "Venue", "Client", "Email", "Date", "Duration", "Amount", "Status"],
            ...filteredBookings.map((b) => [
                b._id,
                b.venueName,
                b.clientName,
                b.clientEmail,
                b.date,
                `${b.duration} hours`,
                b.amount ? `$${b.amount}` : "N/A",
                b.status,
            ]),
        ]
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n")

        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
    }

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleExport} className="gap-2">
                        <i className="fa-regular fa-download w-4 h-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Bookings Table */}
            <Card>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-6 text-center text-gray-500">Loading bookings...</div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No bookings found. Bookings from the widget will appear here.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Booking ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Venue
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Duration
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {booking._id.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {booking.venueName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {booking.clientName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {booking.date}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {booking.duration} hours
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {booking.amount ? `$${booking.amount}` : "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant="outline"
                                                className={getStatusColor(booking.status)}
                                            >
                                                {booking.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewBooking(booking)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleEditBooking(booking)}
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            {/* View Booking Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>
                            View complete booking information
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBooking && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Venue</p>
                                    <p className="font-semibold">{selectedBooking.venueName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Client Name</p>
                                    <p className="font-semibold">{selectedBooking.clientName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold">{selectedBooking.clientEmail}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-semibold">{selectedBooking.clientPhone || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-semibold">{selectedBooking.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Time</p>
                                    <p className="font-semibold">{selectedBooking.time || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Duration</p>
                                    <p className="font-semibold">{selectedBooking.duration} hours</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Guests</p>
                                    <p className="font-semibold">{selectedBooking.guests || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Amount</p>
                                    <p className="font-semibold">${selectedBooking.amount || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <Badge className={getStatusColor(selectedBooking.status)}>
                                        {selectedBooking.status}
                                    </Badge>
                                </div>
                            </div>

                            {selectedBooking.address && (
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-semibold">{selectedBooking.address}</p>
                                </div>
                            )}

                            {selectedBooking.notes && (
                                <div>
                                    <p className="text-sm text-gray-500">Notes</p>
                                    <p className="font-semibold">{selectedBooking.notes}</p>
                                </div>
                            )}

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                                    Close
                                </Button>
                                <Button onClick={() => {
                                    setViewDialogOpen(false)
                                    handleEditBooking(selectedBooking)
                                }}>
                                    Edit Booking
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Booking Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Booking</DialogTitle>
                        <DialogDescription>
                            Update booking details
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBooking && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="venueName" className="text-sm font-medium">
                                        Venue Name
                                    </Label>
                                    <Input
                                        id="venueName"
                                        value={editFormData.venueName || ""}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                venueName: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientName" className="text-sm font-medium">
                                        Client Name
                                    </Label>
                                    <Input
                                        id="clientName"
                                        value={editFormData.clientName || ""}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                clientName: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientEmail" className="text-sm font-medium">
                                        Email
                                    </Label>
                                    <Input
                                        id="clientEmail"
                                        type="email"
                                        value={editFormData.clientEmail || ""}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                clientEmail: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientPhone" className="text-sm font-medium">
                                        Phone
                                    </Label>
                                    <Input
                                        id="clientPhone"
                                        value={editFormData.clientPhone || ""}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                clientPhone: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-sm font-medium">
                                        Date
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={editFormData.date || ""}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                date: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time" className="text-sm font-medium">
                                        Time
                                    </Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={editFormData.time || ""}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                time: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration" className="text-sm font-medium">
                                        Duration (hours)
                                    </Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={editFormData.duration || ""}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                duration: parseInt(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guests" className="text-sm font-medium">
                                        Guests
                                    </Label>
                                    <Input
                                        id="guests"
                                        type="number"
                                        value={editFormData.guests || ""}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                guests: parseInt(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-sm font-medium">
                                        Amount ($)
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={editFormData.amount || ""}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                amount: parseInt(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-sm font-medium">
                                        Status
                                    </Label>
                                    <Select
                                        value={editFormData.status || ""}
                                        onValueChange={(value) =>
                                            setEditFormData({
                                                ...editFormData,
                                                status: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-sm font-medium">
                                    Address
                                </Label>
                                <Input
                                    id="address"
                                    value={editFormData.address || ""}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            address: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-medium">
                                    Notes
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={editFormData.notes || ""}
                                    onChange={(e) =>
                                        setEditFormData({
                                            ...editFormData,
                                            notes: e.target.value,
                                        })
                                    }
                                    className="min-h-24"
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setEditDialogOpen(false)}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveBooking}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
