"use client"

import { HostSpacePage } from "@/components/host-space-page"

// Mock data - in a real app, this would come from a database
const mockSpaces: Record<string, any> = {
    "house-of-strauss": {
        spaceId: "house-of-strauss",
        hostName: "Dominik Joelson",
        spaceName: "House of Strauss - Strauss Piano Room",
        spaceType: "recording",
        address: "Gartenpalais Zögernitz",
        city: "Vienna",
        state: "AT",
        zipCode: "1010",
        phone: "+43 (1) 555-0456",
        email: "bookings@houseofstrauss.at",
        website: "houseofstrauss.at",
        description:
            "Historic Viennese palace with the renovated grand piano of J. Strauss himself. A premier event and performance venue with state-of-the-art technology integrated into a meticulously preserved historic space.",
        longDescription: `The Gartenpalais Zögernitz is a true jewel of Viennese architecture, captivating audiences since its opening on July 21, 1837, with its picturesque garden and impressive ballroom. It quickly became a central meeting point for Vienna's high society and has hosted many illustrious guests and events over the years.

Celebrities such as Carl Michael Ziehrer, Joseph Lanner, and even Johann Strauss Sr. and Jr. have held unforgettable balls within these historic walls, capturing the hearts of the people of Vienna.

After a careful and comprehensive renovation completed in 2022, the palace now stands in all its glory. With great attention to detail, the historical substance was preserved while state-of-the-art technology was seamlessly integrated to offer visitors a unique experience. The Strauss Piano Room features the beautifully restored grand piano of J. Strauss himself—a centerpiece that connects you directly to Vienna's musical heritage.

The palace has once again established itself as a premier event venue, regularly hosting cultural, musical, and social events.`,
        amenities: [
            "Windows",
            "WiFi",
            "Air Conditioning",
            "Historic Architecture",
            "Grand Piano",
            "Professional Sound System",
        ],
        equipment: [
            "Bösendorfer Grand Piano",
            "J. Strauss Original Grand Piano",
            "Professional Audio System",
            "Lighting System",
            "Video Equipment",
        ],
        rules: [
            "No smoking inside the facility",
            "Cancellations made 24 hours or more before booking receive full refund",
            "No refund for cancellations within 24 hours",
            "Respect the historic nature of the venue",
            "Maximum capacity: 10 persons",
            "Exact address available after booking approval",
        ],
        reviews: [
            {
                id: "1",
                author: "Clara Beethoven",
                rating: 5,
                text: "Absolutely magical. Playing on the original Strauss piano was a dream come true. The historic atmosphere is unmatched. Dominik is a wonderful host!",
                date: "3 weeks ago",
            },
            {
                id: "2",
                author: "Isabella Mozart",
                rating: 5,
                text: "A truly unique venue. The combination of modern facilities within such an iconic historic space is incredible. Perfect for classical and contemporary music alike.",
                date: "1 month ago",
            },
            {
                id: "3",
                author: "Friedrich Strauss",
                rating: 5,
                text: "The attention to detail in the restoration is remarkable. The piano sounds exquisite and the palace exudes elegance and history. An unforgettable experience.",
                date: "6 weeks ago",
            },
        ],
        rating: 4.9,
        reviewCount: 18,
        imageUrl: "https://d1r3culteut8k2.cloudfront.net/media/attachments/room_room/3461/thumbs/thumb_3e772a10e78ed92907ceb600cfb3bbabe637171c-1920x1281_de9b.jpeg.1920x1080_q85.jpg",
        hourlyRate: 250,
    },
}

export default async function HostSpaceRoute({ params }: { params: Promise<{ spaceId: string }> }) {
    const { spaceId } = await params
    const space = mockSpaces[spaceId]

    if (!space) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">Space Not Found</h1>
                    <p className="text-muted-foreground">The space you're looking for doesn't exist.</p>
                    <a href="/" className="text-primary hover:underline">
                        Back to home
                    </a>
                </div>
            </div>
        )
    }

    return <HostSpacePage {...space} />
}
