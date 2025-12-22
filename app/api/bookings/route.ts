import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase, { Booking } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { db, bookings } = await connectToDatabase()

    const booking: Booking = {
      venueName: body.venueName,
      venueType: body.venueType,
      address: body.address,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      date: body.date,
      time: body.time,
      duration: parseInt(body.duration),
      guests: parseInt(body.guests),
      notes: body.notes,
      status: 'confirmed',
      amount: body.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await bookings.insertOne(booking)

    return NextResponse.json(
      {
        success: true,
        bookingId: result.insertedId,
        message: 'Booking created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { bookings } = await connectToDatabase()

    const allBookings = await bookings
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ success: true, bookings: allBookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, ...updates } = body

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const { bookings } = await connectToDatabase()

    // Convert string ID to ObjectId if needed
    const { ObjectId } = await import('mongodb')
    let id
    try {
      id = new ObjectId(bookingId)
    } catch {
      id = bookingId
    }

    const result = await bookings.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result.value) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      booking: result.value,
      message: 'Booking updated successfully'
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
