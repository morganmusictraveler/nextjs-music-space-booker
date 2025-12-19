import { MongoClient, Db, Collection } from 'mongodb'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export interface Booking {
    _id?: string
    venueName: string
    venueType: 'rehearsal' | 'recording'
    address: string
    clientName: string
    clientEmail: string
    clientPhone?: string
    date: string
    time: string
    duration: number
    guests: number
    notes?: string
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    amount?: number
    createdAt: Date
    updatedAt: Date
}

async function connectToDatabase(): Promise<{
    client: MongoClient
    db: Db
    bookings: Collection<Booking>
}> {
    const uri = process.env.MONGODB_URI
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set')
    }

    if (cachedClient && cachedDb) {
        return {
            client: cachedClient,
            db: cachedDb,
            bookings: cachedDb.collection('mockup_widget_bookings') as unknown as Collection<Booking>,
        }
    }

    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db(process.env.MONGODB_DB || 'test')
    const bookings = db.collection('mockup_widget_bookings')

    // Create index on date for sorting
    await bookings.createIndex({ createdAt: -1 })
    await bookings.createIndex({ venueName: 1 })

    cachedClient = client
    cachedDb = db

    return { client, db, bookings: bookings as unknown as Collection<Booking> }
}

export default connectToDatabase
