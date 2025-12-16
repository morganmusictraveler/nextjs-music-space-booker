import { InquirySpacePage } from "@/components/inquiry-space-page"

// Define possible space IDs
type SpaceId = "house-of-strauss"

// Mock data for inquiry spaces
const inquirySpaces: Record<SpaceId, Parameters<typeof InquirySpacePage>[0]> = {
    "house-of-strauss": {
        venueName: "House of Strauss - Strauss Piano Room",
        venueType: "recording",
        address: "Gartenpalais Zögernitz, Vienna, AT 1010",
        phone: "+43 (1) 555-0456",
        website: "houseofstrauss.at",
        description:
            "Historic Viennese palace with the renovated grand piano of J. Strauss himself. A premier event and performance venue with state-of-the-art technology integrated into a meticulously preserved historic space. Perfect for inquiries about custom events, performances, and special occasions.",
        hostName: "Dominik Joelson",
    },
}

export default async function InquirySpaceRoute({ params }: { params: Promise<{ spaceId: string }> }) {
    const { spaceId } = await params

    const space = inquirySpaces[spaceId as SpaceId]

    if (!space) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Space Not Found</h1>
                    <p className="text-muted-foreground">The inquiry space you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }

    return <InquirySpacePage {...space} />
}
