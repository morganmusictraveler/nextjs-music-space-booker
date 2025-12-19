# Full-Stack Booking Dashboard Setup

## Overview

This mockup now includes a full-stack booking system that connects the booking widgets to a MongoDB database. Bookings made through the widgets are saved to the database and displayed on the host dashboard.

## Setup Instructions

### 1. MongoDB Connection

Create a `.env.local` file in the project root with your MongoDB connection details:

```
***REMOVED***
MONGODB_DB=booking-widget
```

Replace `username`, `password`, and the cluster URL with your actual MongoDB credentials.

### 2. Features Implemented

**Booking Widget** (`/`)
- Collects client information: name, email, phone
- Saves bookings to MongoDB with pricing calculation ($45/hr)
- Shows confirmation after booking

**Host Page** (`/host/[spaceId]`)
- Similar to booking widget
- Collects client info before booking
- Saves to MongoDB with dynamic pricing based on venue hourly rate

**Dashboard** (`/dashboard`)
- Displays total revenue (calculated from all bookings)
- Shows total number of bookings
- Lists recent bookings from the database
- Auto-refreshes data from MongoDB

**Bookings Page** (`/dashboard/bookings`)
- Table view of all bookings
- Filter by status (confirmed, pending, completed, cancelled)
- Export to CSV functionality
- Shows booking details including client info and amounts

### 3. Database Schema

Each booking stores:
- `venueName`: Name of the venue/space
- `venueType`: 'rehearsal' or 'recording'
- `address`: Full address
- `clientName`: Client's full name
- `clientEmail`: Client's email
- `clientPhone`: Client's phone (optional)
- `date`: Booking date (YYYY-MM-DD format)
- `time`: Booking time
- `duration`: Duration in hours
- `guests`: Number of guests
- `amount`: Total price
- `status`: 'confirmed', 'pending', 'completed', or 'cancelled'
- `createdAt`: Timestamp of when booking was created
- `updatedAt`: Timestamp of last update

### 4. API Routes

**POST /api/bookings**
- Creates a new booking
- Expects JSON body with booking details
- Returns booking ID on success

**GET /api/bookings**
- Retrieves all bookings
- Returns array of bookings sorted by creation date (newest first)
- Used by dashboard and bookings page

### 5. How to Test

1. Make sure your `.env.local` file is set up with MongoDB credentials
2. Start the development server: `pnpm dev`
3. Go to the homepage: http://localhost:3000
4. Click "Try the Booking Widget" to make a test booking
5. Navigate to the Dashboard to see your booking appear in real-time
6. Go to Bookings page to see the full table view

### 6. Next Steps

- Add authentication to restrict dashboard access
- Implement payment processing
- Add booking status management (change status, cancel bookings)
- Send confirmation emails
- Add calendar/availability management
- Implement user profiles for hosts
