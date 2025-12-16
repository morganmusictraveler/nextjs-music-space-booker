"use client"

import { useState } from "react"
import { BookingWidget } from "@/components/booking-widget"
import { InquiryWidget } from "@/components/inquiry-widget"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [showWidget, setShowWidget] = useState(false)
  const [showInquiryWidget, setShowInquiryWidget] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Page Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Powered by</span>
            <a href="https://musictraveler.com" target="_blank">
              <img
                src="https://d1r3culteut8k2.cloudfront.net/static/images/mt_logo_jan_2018_blue_512.png"
                alt="Music Traveler"
                className="h-6"
              /></a>
          </div>
        </div>
      </div>

      {/* Hero Section - Demo Studio Website */}
      <div className="relative">
        <div
          className="h-[60vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://d1r3culteut8k2.cloudfront.net/media/attachments/room_room/3461/thumbs/thumb_3e772a10e78ed92907ceb600cfb3bbabe637171c-1920x1281_de9b.jpeg.1920x1080_q85.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-bold text-white mb-4 text-balance">House of Strauss - Strauss Piano Room</h2>
              <p className="text-xl text-white/90 mb-8 text-pretty">
                Historic Viennese palace with the renovated grand piano of J. Strauss himself
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* <h2 className="text-3xl font-bold mb-6">About This Space</h2>
          <div className="prose prose-lg">
            <p className="text-muted-foreground leading-relaxed">
              The House of Strauss offers a truly unique venue experience in Vienna's historic Gartenpalais Zögernitz. With state-of-the-art facilities integrated into a beautifully preserved palace, it combines historic grandeur with modern technology. Perfect for classical performances, recordings, and special events.
            </p>
          </div> */}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Widget Demo Card */}
            <div className="p-8 bg-primary/5 rounded-lg border border-primary/20 flex flex-col">
              <h3 className="text-xl font-semibold mb-4">Try the Booking Widget</h3>
              <p className="text-muted-foreground mb-6 text-sm flex-grow">
                Click the button below to see how the Music Traveler booking widget works. This widget can be easily
                embedded on any studio's website.
              </p>
              <Button onClick={() => setShowWidget(true)} className="w-full">
                Open Booking Widget
              </Button>
            </div>

            {/* Inquiry Widget Demo Card */}
            <div className="p-8 bg-primary/5 rounded-lg border border-primary/20 flex flex-col">
              <h3 className="text-xl font-semibold mb-4">Try the Inquiry Widget</h3>
              <p className="text-muted-foreground mb-6 text-sm flex-grow">
                See the inquiry widget for upon-request bookings. Perfect for venues that handle custom inquiries.
              </p>
              <Button onClick={() => setShowInquiryWidget(true)} className="w-full">
                Open Inquiry Widget
              </Button>
            </div>

            {/* Booking Page Mockup Card */}
            <div className="p-8 bg-primary/5 rounded-lg border border-primary/20 flex flex-col">
              <h3 className="text-xl font-semibold mb-4">View Booking Page Mockup</h3>
              <p className="text-muted-foreground mb-6 text-sm flex-grow">
                Check out the full-page booking design that's perfect for marketing and detailed listings.
              </p>
              <a href="/host/house-of-strauss">
                <Button className="w-full">
                  House of Strauss - Booking Page (Vienna)
                </Button>
              </a>
            </div>

            {/* Inquiry Page Mockup Card */}
            <div className="p-8 bg-primary/5 rounded-lg border border-primary/20 flex flex-col">
              <h3 className="text-xl font-semibold mb-4">View Inquiry Page Mockup</h3>
              <p className="text-muted-foreground mb-6 text-sm flex-grow">
                Check out the full-page inquiry design for upon-request booking experiences.
              </p>
              <a href="/inquiry/house-of-strauss">
                <Button className="w-full">
                  House of Strauss - Inquiry Page (Vienna)
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Widget Modal */}
      {showWidget && (
        <BookingWidget
          studioName="House of Strauss - Strauss Piano Room"
          studioType="recording"
          address="Gartenpalais Zögernitz, Vienna, AT 1010"
          phone="+43 (1) 555-0456"
          website="houseofstrauss.at"
          description="Historic Viennese palace with the renovated grand piano of J. Strauss himself. A premier event and performance venue with state-of-the-art technology integrated into a meticulously preserved historic space."
          amenities={[
            "Windows",
            "WiFi",
            "Air Conditioning",
            "Historic Architecture",
            "Grand Piano",
            "Professional Sound System",
          ]}
          mapUrl="https://d1r3culteut8k2.cloudfront.net/media/attachments/room_room/3461/thumbs/thumb_3e772a10e78ed92907ceb600cfb3bbabe637171c-1920x1281_de9b.jpeg.1920x1080_q85.jpg"
          showAsModal={true}
          onClose={() => setShowWidget(false)}
        />
      )}

      {/* Inquiry Widget Modal */}
      {showInquiryWidget && (
        <InquiryWidget
          venueName="House of Strauss - Strauss Piano Room"
          venueType="recording"
          address="Gartenpalais Zögernitz, Vienna, AT 1010"
          phone="+43 (1) 555-0456"
          website="houseofstrauss.at"
          description="Historic Viennese palace with the renovated grand piano of J. Strauss himself. A premier event and performance venue with state-of-the-art technology integrated into a meticulously preserved historic space."
          showAsModal={true}
          onClose={() => setShowInquiryWidget(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo implementation of Music Traveler booking widget</p>
            <p className="mt-2">This widget can be embedded on any studio website</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
