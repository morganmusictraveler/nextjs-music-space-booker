"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Home,
    Calendar,
    BarChart3,
    Ticket,
    HelpCircle,
    Settings,
    Menu,
    X,
} from "lucide-react"
import { useState } from "react"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/spaces", label: "My Spaces", icon: Home },
        { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
        { href: "#", label: "Analytics", icon: BarChart3, disabled: true },
        { href: "#", label: "Promo Codes", icon: Ticket, disabled: true },
        { href: "#", label: "Help & FAQ", icon: HelpCircle, disabled: true },
        { href: "#", label: "Settings", icon: Settings, disabled: true },
    ]

    return (
        <div className="flex h-screen bg-background">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 h-screen w-64 border-r bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between gap-2 border-b px-6 py-4">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                MT
                            </div>
                            <span className="font-semibold">Music Traveler</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            const isDisabled = item.disabled

                            return (
                                <div key={item.label}>
                                    {isDisabled ? (
                                        <div
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 cursor-not-allowed"
                                            title="Coming soon"
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            <span>{item.label}</span>
                                        </Link>
                                    )}
                                </div>
                            )
                        })}
                    </nav>

                    {/* User section */}
                    <div className="border-t px-3 py-4">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold">
                                N
                            </div>
                            <div>
                                <div className="text-sm font-medium">User</div>
                                <div className="text-xs text-gray-500">account@example.com</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b bg-white px-4 py-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        <Button variant="outline">Host Dashboard</Button>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    )
}
