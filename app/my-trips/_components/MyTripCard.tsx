"use client"
import { ArrowBigRightDash } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';
import Link from 'next/link';
const MyTripCard = ({trip}:any) => {

    const [photoUrl, setPhotoUrl] = useState<string>();

    useEffect(() => {
        trip && GetGooglePlaceDetail();
    }, [trip])

    const GetGooglePlaceDetail = async () => {
        try {
            const result = await axios.post('/api/google-place-detail', { placeName: trip.tripDetail?.destination });
            setPhotoUrl(result?.data);
        } catch (error: any) {
            toast.error("Failed to fetch trip details");
            console.error("Failed to fetch trip details:", error);
        }
    }


  return (
    <div>
      <Link href={`/view-trip/${trip.tripId}`}>
        <Image src={photoUrl ? photoUrl : '/trips.png'} alt="" width={550} height={400} className='rounded-xl w-full h-[250px] object-cover' />
        <div className='flex items-center gap-2 pt-4'>
            <h2 className='font-bold'>{trip.tripDetail.origin}</h2>
           <span className='text-primary'><ArrowBigRightDash/></span>
            <h2 className='font-bold'>{trip.tripDetail.destination}</h2>
        </div>
        <div className='flex items-center gap-2 pt-2'><span className='text-primary'><Clock/></span><h2 className='text-sm text-neutral-500'>{trip.tripDetail.duration} with the {trip.tripDetail.budget} Budget</h2></div>
        </Link>
    </div>

  )
}

export default MyTripCard