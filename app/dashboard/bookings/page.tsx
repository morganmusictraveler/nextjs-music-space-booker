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
import { Download } from "lucide-react"

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
        } finally {
            setIsLoading(false)
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
                        <Download className="w-4 h-4" />
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
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                                <Button size="sm">Edit</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    )
}
