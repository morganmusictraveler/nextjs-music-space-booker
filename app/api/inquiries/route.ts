import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase, { Inquiry } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { db, inquiries } = await connectToDatabase()

        const inquiry: Inquiry = {
            venueName: body.venueName,
            venueType: body.venueType,
            address: body.address,
            clientName: body.clientName,
            clientEmail: body.clientEmail,
            clientPhone: body.clientPhone,
            eventDescription: body.eventDescription,
            equipmentNeeded: body.equipmentNeeded,
            maxCapacity: body.maxCapacity,
            priceRange: body.priceRange,
            selectedDates: body.selectedDates.map((date: string) => new Date(date)),
            requirements: body.requirements,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const result = await inquiries.insertOne(inquiry)

        return NextResponse.json(
            {
                success: true,
                inquiryId: result.insertedId,
                message: 'Inquiry submitted successfully'
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating inquiry:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create inquiry' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const { inquiries } = await connectToDatabase()

        const allInquiries = await inquiries
            .find({})
            .sort({ createdAt: -1 })
            .toArray()

        return NextResponse.json({ success: true, inquiries: allInquiries })
    } catch (error) {
        console.error('Error fetching inquiries:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch inquiries' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        const { inquiryId, status, hostNotes, hostCounterOffer } = body

        if (!inquiryId || !status) {
            return NextResponse.json(
                { success: false, error: 'Missing inquiryId or status' },
                { status: 400 }
            )
        }

        const { inquiries } = await connectToDatabase()

        const updateData: any = {
            status,
            updatedAt: new Date(),
        }

        if (hostNotes) {
            updateData.hostNotes = hostNotes
        }

        if (hostCounterOffer) {
            updateData.hostCounterOffer = {
                ...hostCounterOffer,
                proposedDates: hostCounterOffer.proposedDates.map((date: string) => new Date(date)),
            }
        }

        const result = await inquiries.updateOne(
            { _id: new ObjectId(inquiryId) as any },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Inquiry not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: `Inquiry ${status} successfully`,
        })
    } catch (error) {
        console.error('Error updating inquiry:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update inquiry' },
            { status: 500 }
        )
    }
}
