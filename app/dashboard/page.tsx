"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Calendar, Star, TrendingUp } from "lucide-react"

interface Booking {
    _id: string
    venueName: string
    clientName: string
    date: string
    amount?: number
    status: string
    createdAt: string
}

const metrics = [
    {
        label: "Total Revenue",
        value: "$0",
        icon: DollarSign,
        color: "text-green-600",
        key: "revenue",
    },
    {
        label: "Total Bookings",
        value: "0",
        icon: Calendar,
        color: "text-blue-600",
        key: "bookings",
    },
    {
        label: "Average Rating",
        value: "4.6/5",
        icon: Star,
        color: "text-amber-600",
        key: "rating",
    },
    {
        label: "Occupancy Rate",
        value: "78%",
        icon: TrendingUp,
        color: "text-emerald-600",
        key: "occupancy",
    },
]

export default function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [metrics_data, setMetricsData] = useState<Record<string, any>>({
        revenue: "$0",
        bookings: "0",
    })

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/bookings")
            if (response.ok) {
                const data = await response.json()
                const bookingsList = data.bookings || []
                setBookings(bookingsList)

                // Calculate metrics
                const totalRevenue = bookingsList.reduce(
                    (sum: number, b: Booking) => sum + (b.amount || 0),
                    0
                )
                const totalBookings = bookingsList.length

                setMetricsData({
                    revenue: `$${totalRevenue.toLocaleString()}`,
                    bookings: totalBookings.toString(),
                })
            }
        } catch (error) {
            console.error("Error fetching bookings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your hosting overview.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((metric) => {
                    const Icon = metric.icon
                    const displayValue =
                        metric.key === "revenue"
                            ? metrics_data.revenue
                            : metric.key === "bookings"
                                ? metrics_data.bookings
                                : metric.value

                    return (
                        <Card key={metric.label} className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
                                </div>
                                <Icon className={`w-8 h-8 ${metric.color} opacity-20`} />
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Recent Bookings */}
            <Card>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                </div>
                <div className="divide-y">
                    {isLoading ? (
                        <div className="p-6 text-center text-gray-500">Loading bookings...</div>
                    ) : bookings.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No bookings yet. Bookings from the widget will appear here.
                        </div>
                    ) : (
                        bookings.slice(0, 3).map((booking) => (
                            <div key={booking._id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900">
                                            {booking.venueName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {booking.clientName} • {booking.date}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-semibold text-gray-900">
                                            {booking.amount ? `$${booking.amount}` : "N/A"}
                                        </span>
                                        <Badge
                                            variant="default"
                                            className="bg-green-100 text-green-800 hover:bg-green-100"
                                        >
                                            {booking.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    )
}

