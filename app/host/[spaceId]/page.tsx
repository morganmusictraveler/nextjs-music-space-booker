// "use client"


import { HostSpacePage } from "@/components/host-space-page"
import venuedata from "@/venuedata.json"

function mapVenueDataToHostSpacePage(venue: any) {
  return {
    spaceId: "house-of-strauss",
    hostName: "Dominik Joelson",
    spaceName: venue.name,
    spaceType: "recording",
    address: venue.location?.address || "",
    city: venue.location?.place?.name || "Vienna",
    state: "AT",
    zipCode: "1010",
    phone: "+43 (1) 555-0456",
    email: "bookings@houseofstrauss.at",
    website: "houseofstrauss.at",
    description: venue.description,
    longDescription: venue.location?.description?.root?.children?.[0]?.children?.[0]?.text || venue.description,
    amenities: ["Windows", "WiFi", "Air Conditioning"],
    equipment: ["Bösendorfer Grand Piano", "Professional Audio System", "Lighting System"],
    rules: [venue.rules || "No smoking"],
    reviews: [],
    rating: venue.venue_stats?.average_rating || 0,
    reviewCount: venue.venue_stats?.total_bookings || 0,
    imageUrl: venue.images?.[0]?.image?.url
      ? `https://d1r3culteut8k2.cloudfront.net/${venue.images[0].image.legacy_s3_key}`
      : undefined,
    hourlyRate: venue.pricing?.base_price || 0,
  }
}

export default function HostSpaceRoute({ params }: { params: { spaceId: string } }) {
    const { spaceId } = params
    // Only one venue for now, but could be extended for multiple
    if (spaceId !== "house-of-strauss") {
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
    const space = mapVenueDataToHostSpacePage(venuedata)
    return <HostSpacePage {...space} />
}
