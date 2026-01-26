
import { InquirySpacePage } from "@/components/inquiry-space-page"
import venuedata from "@/venuedata.json"

export default function InquirySpaceRoute({ params }: { params: { spaceId: string } }) {
    const { spaceId } = params
    if (spaceId !== "house-of-strauss") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Space Not Found</h1>
                    <p className="text-muted-foreground">The inquiry space you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }
    const space = {
        venueName: venuedata.name,
        venueType: "recording",
        address: venuedata.location?.address || "",
        phone: "+43 (1) 555-0456",
        website: "houseofstrauss.at",
        description: venuedata.description,
        hostName: "Dominik Joelson",
    }
    return <InquirySpacePage {...space} />
}
