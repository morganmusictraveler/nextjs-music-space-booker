"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Calendar, Star, TrendingUp, Mail } from "lucide-react"

interface Booking {
    _id: string
    venueName: string
    clientName: string
    date: string
    amount?: number
    status: string
    createdAt: string
}

interface Inquiry {
    _id: string
    venueName: string
    clientName: string
    clientEmail: string
    clientPhone?: string
    status: string
    priceRange: [number, number]
    selectedDates?: string | string[]
    eventDescription?: string
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
        label: "Pending Inquiries",
        value: "0",
        icon: Mail,
        color: "text-purple-600",
        key: "inquiries",
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
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [metrics_data, setMetricsData] = useState<Record<string, any>>({
        revenue: "$0",
        bookings: "0",
        inquiries: "0",
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [bookingsRes, inquiriesRes] = await Promise.all([
                fetch("/api/bookings"),
                fetch("/api/inquiries"),
            ])

            if (bookingsRes.ok) {
                const data = await bookingsRes.json()
                const bookingsList = data.bookings || []
                setBookings(bookingsList)

                const totalRevenue = bookingsList.reduce(
                    (sum: number, b: Booking) => sum + (b.amount || 0),
                    0
                )

                setMetricsData((prev) => ({
                    ...prev,
                    revenue: `$${totalRevenue.toLocaleString()}`,
                    bookings: bookingsList.length.toString(),
                }))
            }

            if (inquiriesRes.ok) {
                const data = await inquiriesRes.json()
                const inquiriesList = data.inquiries || []
                setInquiries(inquiriesList)

                const pendingInquiries = inquiriesList.filter(
                    (i: Inquiry) => i.status === "pending" || i.status === "negotiation"
                )

                setMetricsData((prev) => ({
                    ...prev,
                    inquiries: pendingInquiries.length.toString(),
                }))
            } else {
                const errorData = await inquiriesRes.json()
                console.error('Inquiries API error:', inquiriesRes.status, errorData)
            }
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's your hosting overview.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => fetchData()}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Refresh"}
                </Button>
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
                                : metric.key === "inquiries"
                                    ? metrics_data.inquiries
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <Card>
                    <div className="p-6 border-b flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                        <Link href="/dashboard/bookings">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
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

                {/* Pending Inquiries */}
                <Card>
                    <div className="p-6 border-b flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Pending Inquiries</h2>
                        <Link href="/dashboard/inquiries">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    </div>
                    <div className="divide-y">
                        {isLoading ? (
                            <div className="p-6 text-center text-gray-500">Loading inquiries...</div>
                        ) : inquiries.filter((i) => i.status === "pending" || i.status === "negotiation").length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                No pending inquiries. New inquiries will appear here.
                            </div>
                        ) : (
                            inquiries
                                .filter((i) => i.status === "pending" || i.status === "negotiation")
                                .slice(0, 3)
                                .map((inquiry) => (
                                    <div key={inquiry._id} className="p-6 hover:bg-gray-50 transition">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900">
                                                    {inquiry.clientName}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {inquiry.venueName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    €{inquiry.priceRange[0].toLocaleString()} - €{inquiry.priceRange[1].toLocaleString()}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="default"
                                                className={inquiry.status === "negotiation"
                                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                                    : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                                }
                                            >
                                                {inquiry.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}