"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
    CalendarIcon,
    Music2,
    MapPin,
    Phone,
    Globe,
    Star,
    Users,
    Clock,
    Award,
    Volume2,
    Zap,
    Shield,
    Heart,
    Share2,
    ChevronRight,
    MessageCircle,
    User,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HostSpacePageProps {
    spaceId: string
    hostName: string
    spaceName: string
    spaceType: "rehearsal" | "recording"
    address: string
    city: string
    state: string
    zipCode: string
    phone?: string
    email?: string
    website?: string
    description: string
    longDescription?: string
    amenities: string[]
    equipment?: string[]
    rules?: string[]
    reviews?: Array<{
        id: string
        author: string
        rating: number
        text: string
        date: string
    }>
    rating?: number
    reviewCount?: number
    imageUrl?: string
    hourlyRate: number
    canceled?: boolean
}

export function HostSpacePage({
    spaceId,
    hostName,
    spaceName,
    spaceType,
    address,
    city,
    state,
    zipCode,
    phone,
    email,
    website,
    description,
    longDescription,
    amenities,
    equipment,
    rules,
    reviews = [],
    rating = 4.8,
    reviewCount = 24,
    imageUrl,
    hourlyRate,
}: HostSpacePageProps) {
    const [date, setDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState<string>()
    const [guests, setGuests] = useState<string>("2")
    const [duration, setDuration] = useState<string>("2")
    const [isWishlisted, setIsWishlisted] = useState(false)

    const timeSlots = [
        { time: "9:00 AM", available: true },
        { time: "10:00 AM", available: true },
        { time: "11:00 AM", available: false },
        { time: "12:00 PM", available: true },
        { time: "1:00 PM", available: true },
        { time: "2:00 PM", available: true },
        { time: "3:00 PM", available: false },
        { time: "4:00 PM", available: true },
        { time: "5:00 PM", available: true },
        { time: "6:00 PM", available: true },
        { time: "7:00 PM", available: true },
        { time: "8:00 PM", available: false },
    ]

    const handleBooking = () => {
        console.log("[Host Space] Booking details:", { date, selectedTime, guests, duration })
        alert("Booking request submitted! (This is a demo)")
    }

    const hourlyPrice = hourlyRate
    const durationHours = parseInt(duration)
    const totalPrice = hourlyPrice * durationHours

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
                        backgroundImage: `url(${imageUrl})`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                </div>

                {/* Hero Overlay Content */}
                <div className="relative h-full flex flex-col justify-between p-6 md:p-10">
                    <div className="flex items-start justify-between">
                        <div className="space-y-3">
                            {/* stars and reviews */}
                            {/* <Badge variant="secondary" className="w-fit gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {rating} ({reviewCount} reviews)
                            </Badge> */}
                        </div>
                        <div className="flex gap-2">
                            {/* heart button from MT site */}
                            {/* <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full backdrop-blur-sm bg-white/20 hover:bg-white/30 border-white/20"
                                onClick={() => setIsWishlisted(!isWishlisted)}
                            >
                                <Heart className={cn("w-5 h-5", isWishlisted && "fill-red-500 text-red-500")} />
                            </Button> */}
                            {/* extra button from MT site */}
                            {/* <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full backdrop-blur-sm bg-white/20 hover:bg-white/30 border-white/20"
                            >
                                <Share2 className="w-5 h-5" />
                            </Button> */}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 text-balance leading-tight">
                                Book {spaceName}
                            </h1>
                            <p className="text-xl text-white/90 flex items-center gap-2">
                                <MapPin className="w-5 h-5 shrink-0" />
                                {city}, {state}
                            </p>
                        </div>
                        {/* <Badge variant="outline" className="w-fit text-white border-white/40 bg-white/10 capitalize">
                            {spaceType} Space • Hosted by {hostName}
                        </Badge> */}
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="p-6 text-center hover:shadow-md transition-shadow">
                            <div className="flex justify-center mb-3">
                                <Music2 className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl font-bold capitalize">{spaceType}</div>
                            <p className="text-sm text-muted-foreground mt-1">Space</p>
                        </Card>
                        <Card className="p-6 text-center hover:shadow-md transition-shadow">
                            <div className="flex justify-center mb-3">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl font-bold">{hostName}</div>
                            <p className="text-sm text-muted-foreground mt-1">Your host</p>
                        </Card>
                        <Card className="p-6 text-center hover:shadow-md transition-shadow">
                            <div className="flex justify-center mb-3">
                                <Award className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl font-bold">{reviewCount}+</div>
                            <p className="text-sm text-muted-foreground mt-1">Happy Guests</p>
                        </Card>
                    </div>

                    {/* About Section */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">About {spaceName}</h2>
                        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
                            <p className="text-lg leading-relaxed text-foreground">
                                {longDescription ||
                                    description ||
                                    `${spaceName} is a premium ${spaceType} space designed for serious musicians. With industry-standard equipment and acoustically treated rooms, we provide the perfect environment for your creative sessions.`}
                            </p>
                        </Card>
                    </div>

                    {/* Tabs Section */}
                    <Tabs defaultValue="amenities" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="amenities">Amenities</TabsTrigger>
                            <TabsTrigger value="equipment">Equipment</TabsTrigger>
                            <TabsTrigger value="rules">House Rules</TabsTrigger>
                        </TabsList>

                        {/* Amenities Tab */}
                        <TabsContent value="amenities" className="space-y-4 mt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {amenities.map((amenity, index) => (
                                    <Card key={index} className="p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
                                                <Zap className="h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{amenity}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Equipment Tab */}
                        <TabsContent value="equipment" className="space-y-4 mt-6">
                            {equipment && equipment.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {equipment.map((item, index) => (
                                        <Card key={index} className="p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10">
                                                    <Volume2 className="h-4 w-4 text-accent" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item}</p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="p-6 text-center text-muted-foreground">
                                    <p>Premium equipment details coming soon</p>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Rules Tab */}
                        <TabsContent value="rules" className="space-y-4 mt-6">
                            {rules && rules.length > 0 ? (
                                <div className="space-y-3">
                                    {rules.map((rule, index) => (
                                        <Card key={index} className="p-4 flex gap-3 hover:shadow-md transition-shadow">
                                            <p className="text-sm">{rule}</p>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="p-6 text-center text-muted-foreground">
                                    <p>House rules will be provided upon booking confirmation</p>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>

                    {/* Reviews Section */}
                    {reviews.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">Guest Reviews</h2>
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <Card key={review.id} className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="font-semibold">{review.author}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={cn(
                                                                    "w-4 h-4",
                                                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted/30",
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Location Section */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">Location</h2>
                        <Card className="p-6 space-y-4">
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                                <img
                                    src="/map.png"
                                    alt="Studio location"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium">{address}</p>
                                        <p className="text-muted-foreground">
                                            {city}, {state} {zipCode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Column - Booking Panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        {/* Price Card */}
                        <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">${hourlyPrice}</span>
                                        <span className="text-muted-foreground">/hour</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">for {durationHours} hours</p>
                                </div>

                                <div className="border-t border-primary/10 pt-6 space-y-4">
                                    {/* Date Picker */}
                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Select Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal h-11 hover:bg-secondary/50",
                                                        !date && "text-muted-foreground",
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "MMM dd, yyyy") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Duration</label>
                                        <Select value={duration} onValueChange={setDuration}>
                                            <SelectTrigger className="h-11">
                                                <div className="flex items-center">
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 hour</SelectItem>
                                                <SelectItem value="2">2 hours</SelectItem>
                                                <SelectItem value="3">3 hours</SelectItem>
                                                <SelectItem value="4">4 hours</SelectItem>
                                                <SelectItem value="8">Full day (8 hrs)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Guests */}
                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Musicians</label>
                                        <Select value={guests} onValueChange={setGuests}>
                                            <SelectTrigger className="h-11">
                                                <div className="flex items-center">
                                                    <Users className="mr-2 h-4 w-4" />
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 Musician</SelectItem>
                                                <SelectItem value="2">2 Musicians</SelectItem>
                                                <SelectItem value="3">3 Musicians</SelectItem>
                                                <SelectItem value="4">4 Musicians</SelectItem>
                                                <SelectItem value="5">5+ Musicians</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Time Selection */}
                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Select Time</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.map((slot) => (
                                                <Button
                                                    key={slot.time}
                                                    variant={selectedTime === slot.time ? "default" : "outline"}
                                                    disabled={!slot.available}
                                                    onClick={() => setSelectedTime(slot.time)}
                                                    size="sm"
                                                    className="text-xs font-medium"
                                                >
                                                    {slot.time}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="border-t border-primary/10 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>${hourlyPrice}/hr</span>
                                            <span>×{durationHours}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span>${totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Button */}
                            <Button
                                size="lg"
                                onClick={handleBooking}
                                disabled={!date || !selectedTime}
                                className="w-full mt-6 h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Reserve Now
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-3">
                                You won't be charged yet
                            </p>
                        </Card>

                        {/* Contact Card */}
                        <Card className="p-6 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" />
                                Contact {hostName}
                            </h3>
                            <div className="space-y-3">
                                {phone && (
                                    <a
                                        href={`tel:${phone}`}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors group"
                                    >
                                        <Phone className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium group-hover:underline">{phone}</span>
                                    </a>
                                )}
                                {email && (
                                    <a
                                        href={`mailto:${email}`}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors group"
                                    >
                                        <MessageCircle className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium group-hover:underline">Message</span>
                                    </a>
                                )}
                                {website && (
                                    <a
                                        href={website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors group"
                                    >
                                        <Globe className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium group-hover:underline">Visit Website</span>
                                    </a>
                                )}
                            </div>
                        </Card>

                        {/* Safety Card */}
                        <Card className="p-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <div className="space-y-2">
                                    <p className="font-semibold text-sm">Trust & Safety</p>
                                    <p className="text-xs text-muted-foreground">
                                        All bookings are protected. Your payment is secure and covered by our guarantee.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
