"use client"
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { api } from '@/convex/_generated/api'
import { useConvex } from 'convex/react'
import { Map, Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useUserDetail } from '../provider'
import { Contrail_One } from 'next/font/google'
import { TripInfo } from '../create-new-trip/_component/chatbox'
import MyTripCard from './_components/MyTripCard'

export type Trip={
    tripId:any;
    _id:string;
    tripDetail:TripInfo;
}

const MyTripsPage = () => {
    const [myTrips, setMyTrips] = useState<Trip[]>([]);
    const { userDetail, setUserDetail } = useUserDetail();
    const convex = useConvex();
    useEffect(() => {
        userDetail && GetUserTrips();
    }, [userDetail])
    const GetUserTrips = async () => {
        if (!userDetail) return;
        const result = await convex.query(api.tripDetail.getTripDetail, { uid: userDetail._id });
        setMyTrips(result);
    }

    return (
        <div className='min-h-screen w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans'>
            <div className='max-w-7xl mx-auto px-6 py-12 md:py-20 lg:px-12'>

                <div className='flex items-center justify-between mb-12'>
                    <div>
                        <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>My Trips</h1>
                    </div>
                    {myTrips.length > 0 && (
                        <Link href="/create-new-trip">
                            <ShimmerButton className='h-12 px-6 flex items-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all'>
                                <Plus className="w-5 h-5" />
                                <span className="font-semibold">New Trip</span>
                            </ShimmerButton>
                        </Link>
                    )}
                </div>

                {myTrips?.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 md:py-28 h-[60vh] text-center rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 animate-in fade-in zoom-in-95 duration-500'>
                        <div className='bg-white dark:bg-neutral-800 p-6 rounded-full shadow-lg mb-6'>
                            <Map className='w-16 h-16 text-primary' />
                        </div>
                        <h2 className='text-2xl md:text-3xl font-bold mb-3'>No trips planned yet</h2>
                        <p className='text-neutral-500 dark:text-neutral-400 max-w-md mb-8 leading-relaxed'>
                            It looks like you haven't created any trips yet. Start your journey by planning your next adventure with our AI assistant.
                        </p>
                        <Link href="/create-new-trip">
                            <ShimmerButton className='h-14 px-8 text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all'>
                                Start Planning Now
                            </ShimmerButton>
                        </Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {myTrips.map((trip: any, index) => (
                            <div key={index} className='cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl rounded-xl p-4'>
                                <MyTripCard trip={trip} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyTripsPage